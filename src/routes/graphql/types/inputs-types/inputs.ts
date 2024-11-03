import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLFloat, GraphQLBoolean, GraphQLInt } from "graphql";
import { UUIDType } from "../scalar-types/uuid.js";

export const CreateUserInput = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
    },
});

export const CreateProfileInput = new GraphQLInputObjectType({
    name: 'CreateProfileInput',
    fields: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    },
});

export const CreatePostInput = new GraphQLInputObjectType({
    name: 'CreatePostInput',
    fields: {
        authorId: { type: new GraphQLNonNull(UUIDType) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
    },
});

export const ChangePostInput = new GraphQLInputObjectType({
    name: 'ChangePostInput',
    fields: {
        title: { type: GraphQLString },
        content: { type: GraphQLString },
    },
});

export const ChangeProfileInput = new GraphQLInputObjectType({
    name: 'ChangeProfileInput',
    fields: {
        memberTypeId: { type: GraphQLString },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
    },
});

export const ChangeUserInput = new GraphQLInputObjectType({
    name: 'ChangeUserInput',
    fields: {
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    },
});