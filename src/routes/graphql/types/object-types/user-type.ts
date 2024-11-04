import { GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { PostType } from "./post-type.js";
import { ProfileType } from "./profile-type.js";
import { UUIDType } from "../scalar-types/uuid.js";
import DataLoader from "dataloader";
import { Post, Profile, User } from "@prisma/client";

interface GraphQLContext {
  profileLoader: DataLoader<string, Profile | null>;
  postLoader: DataLoader<string, Post[]>;
  subscribedToLoader: DataLoader<string, User[]>;
  subscribersLoader: DataLoader<string, User[]>;
}

type UserWithRelations = User & {
  userSubscribedTo?: User[];
  subscribedToUser?: User[];
};

export const UserType = new GraphQLObjectType<UserWithRelations, GraphQLContext>({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: (user, _, context) => context.profileLoader.load(user.id),
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (user, _, context) => {
        const posts = await context.postLoader.load(user.id);
        return posts;
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (user, _, context) => {
        if (user.userSubscribedTo !== undefined) {
          return user.userSubscribedTo;
        }
        const users = await context.subscribedToLoader.load(user.id);
        return users;
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (user, _, context) => {
        if (user.subscribedToUser !== undefined) {
          return user.subscribedToUser;
        }
        const users = await context.subscribersLoader.load(user.id);
        return users;
      },
    },
  }),
});