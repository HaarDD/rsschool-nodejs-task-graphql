import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { UserType } from "./user-type.js";
import { UUIDType } from "../scalar-types/uuid.js";
import DataLoader from "dataloader";

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
    author: {
      type: UserType as GraphQLObjectType,
      resolve: (post: { authorId: string }, _, { userLoader }: { userLoader: DataLoader<string, typeof UserType> }) => userLoader.load(post.authorId),
    }
  })
});