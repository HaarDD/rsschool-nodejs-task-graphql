import { GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { PostType } from "./post-type.js";
import { ProfileType } from "./profile-type.js";
import { UUIDType } from "../scalar-types/uuid.js";
import DataLoader from "dataloader";

interface GraphQLContext {
  profileLoader: DataLoader<string, typeof ProfileType>,
  postLoader: DataLoader<string, typeof PostType[]>,
  subscribedToLoader: DataLoader<string, typeof UserType[]>,
  subscribersLoader: DataLoader<string, typeof UserType[]>
}

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: (user: { id: string }, _, context: GraphQLContext) => context.profileLoader.load(user.id),
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (user, _, context: GraphQLContext) => context.postLoader.load(user.id),
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: (user, _, context: GraphQLContext) => context.subscribedToLoader.load(user.id),
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: (user, _, context: GraphQLContext) => context.subscribersLoader.load(user.id),
    }
  })
});