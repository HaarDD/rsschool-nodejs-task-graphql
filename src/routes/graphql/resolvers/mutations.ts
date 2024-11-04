import { PrismaClient } from "@prisma/client";
import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { CreateUserInput, CreateProfileInput, CreatePostInput, ChangePostInput, ChangeProfileInput, ChangeUserInput } from "../types/inputs-types/inputs.js";
import { PostType } from "../types/object-types/post-type.js";
import { ProfileType } from "../types/object-types/profile-type.js";
import { UserType } from "../types/object-types/user-type.js";
import { UUIDType } from "../types/scalar-types/uuid.js";

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType as GraphQLObjectType,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (_, { dto }: { dto: { name: string, balance: number } }, { prisma, log }: { prisma: PrismaClient, log: { info: (msg: string) => void } }) => {
        log.info(`Creating User with data: ${JSON.stringify(dto)}`);
        return prisma.user.create({ data: dto });
      },
    },
    createProfile: {
      type: ProfileType,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (_, { dto }: { dto: { userId: string, memberTypeId: string, isMale: boolean, yearOfBirth: number } }, { prisma, log }) => {
        log.info(`Creating Profile with data: ${JSON.stringify(dto)}`);
        return prisma.profile.create({ data: dto });
      },
    },
    createPost: {
      type: PostType as GraphQLObjectType,
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: async (_, { dto }: { dto: { authorId: string, title: string, content: string } }, { prisma, log }) => {
        log.info(`Creating Post with data: ${JSON.stringify(dto)}`);
        return prisma.post.create({
          data: dto,
        });
      },
    },
    changePost: {
      type: PostType as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (_, { id, dto }: { id: string, dto: { title?: string, content?: string } }, { prisma, log }) => {
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
      resolve: async (_, { id, dto }: { id: string, dto: { memberTypeId?: string, isMale?: boolean, yearOfBirth?: number } }, { prisma, log }) => {
        log.info(`Updating Profile with id: ${id} with data: ${JSON.stringify(dto)}`);
        return prisma.profile.update({ where: { id }, data: dto });
      },
    },
    changeUser: {
      type: UserType as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (_, { id, dto }: { id: string, dto: { name?: string, balance?: number } }, { prisma, log }) => {
        log.info(`Updating User with id: ${id} with data: ${JSON.stringify(dto)}`);
        return prisma.user.update({ where: { id }, data: dto });
      },
    },
    deleteUser: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, { prisma, log }) => {
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
      resolve: async (_, { id }: { id: string }, { prisma, log }) => {
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
      resolve: async (_, { id }: { id: string }, { prisma, log }) => {
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
      resolve: async (_, { userId, authorId }: { userId: string, authorId: string }, { prisma, log }) => {
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
      resolve: async (_, { userId, authorId }: { userId: string, authorId: string }, { prisma, log }) => {
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