/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLList, GraphQLFloat, GraphQLBoolean, GraphQLScalarType, Kind } from 'graphql';
import { UUIDType } from './types/uuid.js';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    memberType: {
      type: MemberTypeType,
      resolve: (profile, _, { prisma }) => prisma.memberType.findUnique({ where: { id: profile.memberTypeId } }),
    },
  }),
});

export const MemberTypeIdScalar = new GraphQLScalarType({
  name: 'MemberTypeId',
  description: 'A string scalar for MemberTypeId',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    return null;
  },
});

export const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) }
  })
});

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
    author: {
      type: UserType,
      resolve: (post, _, { prisma }) => prisma.user.findUnique({ where: { id: post.authorId } })
    }
  })
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: (user, _, { prisma }) => prisma.profile.findUnique({ where: { userId: user.id } })
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (user, _, { prisma }) => prisma.post.findMany({ where: { authorId: user.id } })
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (user, _, { prisma }) => {
        const subscriptions = await prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: user.id },
          include: {
            author: {
              include: {
                subscribedToUser: true
              }
            }
          }
        });
        return subscriptions.map(sub => sub.author);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (user, _, { prisma }) => {
        const subscribers = await prisma.subscribersOnAuthors.findMany({
          where: { authorId: user.id },
          include: {
            subscriber: {
              include: {
                userSubscribedTo: true
              }
            }
          }
        });
        return subscribers.map(sub => sub.subscriber);
      },
    }
  })
});