/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLBoolean,
} from 'graphql';
import { UserType, PostType, ProfileType, MemberTypeType, MemberTypeIdScalar } from './types.js';
import { UUIDType } from './types/uuid.js';

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    authorId: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    memberTypeId: { type: GraphQLString },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
  },
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (_, { dto }, { prisma, log }) => {
        log.info(`Creating User with data: ${JSON.stringify(dto)}`);
        return prisma.user.create({ data: dto });
      },
    },
    createProfile: {
      type: ProfileType,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (_, { dto }, { prisma, log }) => {
        log.info(`Creating Profile with data: ${JSON.stringify(dto)}`);

/*         const { memberTypeId } = dto;

        let memberType = await prisma.memberType.findUnique({ where: { id: memberTypeId } });
        if (!memberType && memberTypeId === 'BASIC') {
          memberType = await prisma.memberType.create({
            data: {
              id: 'BASIC',
              discount: 0.0,
              postsLimitPerMonth: 10,
            },
          });
          log.info("Created default MemberType 'BASIC'");
        } */

        return prisma.profile.create({ data: dto });
      },
    },
    createPost: {
      type: PostType,
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: async (_, { dto }, { prisma, log }) => {
        log.info(`Creating Post with data: ${JSON.stringify(dto)}`);
        return prisma.post.create({
          data: dto,
        });
      },
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (_, { id, dto }, { prisma, log }) => {
        log.info(`Updating Post with id: ${id} with data: ${JSON.stringify(dto)}`);
        return prisma.post.update({ where: { id }, data: dto });
      },
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (_, { id, dto }, { prisma, log }) => {
        log.info(`Updating Profile with id: ${id} with data: ${JSON.stringify(dto)}`);
        return prisma.profile.update({ where: { id }, data: dto });
      },
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (_, { id, dto }, { prisma, log }) => {
        log.info(`Updating User with id: ${id} with data: ${JSON.stringify(dto)}`);
        return prisma.user.update({ where: { id }, data: dto });
      },
    },
    deleteUser: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, { prisma, log }) => {
        log.info(`Deleting User with id: ${id}`);
        await prisma.user.delete({ where: { id } });
        return "User deleted";
      },
    },
    deletePost: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, { prisma, log }) => {
        log.info(`Deleting Post with id: ${id}`);
        await prisma.post.delete({ where: { id } });
        return "Post deleted";
      },
    },
    deleteProfile: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, { prisma, log }) => {
        log.info(`Deleting Profile with id: ${id}`);
        await prisma.profile.delete({ where: { id } });
        return "Profile deleted";
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { userId, authorId }, { prisma, log }) => {
        log.info(`User ${userId} subscribing to Author ${authorId}`);

        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId: authorId,
          },
        });

        return "Subscribed";
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { userId, authorId }, { prisma, log }) => {
        log.info(`User ${userId} unsubscribing from Author ${authorId}`);

        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            },
          },
        });
        
        return "Unsubscribed";
      },
    },
  },
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberType: {
      type: MemberTypeType,
      args: { id: { type: new GraphQLNonNull(MemberTypeIdScalar) } },
      resolve: (_, { id }, { prisma }) => prisma.memberType.findUnique({ where: { id } }),
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_, { id }, { prisma }) => prisma.post.findUnique({ where: { id } }),
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_, { id }, { prisma }) => prisma.user.findUnique({ where: { id } }),
    },
    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_, { id }, { prisma }) => prisma.profile.findUnique({ where: { id } }),
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: (_, __, { prisma }) => prisma.user.findMany(),
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (_, __, { prisma }) => prisma.post.findMany(),
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: (_, __, { prisma }) => prisma.profile.findMany(),
    },
    memberTypes: {
      type: new GraphQLList(MemberTypeType),
      resolve: async (_, __, { prisma }) => {
        const memberTypes = await prisma.memberType.findMany();
        return memberTypes || [];
      }
    },
  },
});

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});