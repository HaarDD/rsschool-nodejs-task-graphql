/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { 
  GraphQLObjectType, 
  GraphQLNonNull, 
  GraphQLString, 
  GraphQLInt, 
  GraphQLList, 
  GraphQLFloat, 
  GraphQLBoolean, 
  GraphQLScalarType, 
  Kind 
} from 'graphql';
import { UUIDType } from './types/uuid.js'; // Предполагается, что вы экспортируете MemberTypeType отдельно

export const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) }
  })
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

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    memberType: {
      type: MemberTypeType,
      resolve: (profile, _, { memberTypeLoader }) => memberTypeLoader.load(profile.memberTypeId),
    },
  }),
});

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
    author: {
      type: UserType, // Определите UserType ниже или импортируйте, если он определен в другом месте
      resolve: (post, _, { userLoader }) => userLoader.load(post.authorId), // Изменено на использование DataLoader
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
      resolve: (user, _, { profileLoader }) => profileLoader.load(user.id),
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (user, _, { postLoader }) => postLoader.load(user.id),
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: (user, _, { subscribedToLoader }) => subscribedToLoader.load(user.id),
    },
    subscribedToUser: {
      type: new GraphQLList(UserType), 
      resolve: (user, _, { subscribersLoader }) => subscribersLoader.load(user.id),
    }
  })
});