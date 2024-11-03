import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "../scalar-types/uuid.js";
import { MemberTypeType } from "./member-type-type.js";
import { MemberType } from "@prisma/client";

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    memberType: {
      type: MemberTypeType,
      resolve: (
        profile: { memberTypeId: string },
        _: unknown, { memberTypeLoader }: {
          memberTypeLoader: {
            load: (id: string) => Promise<MemberType>
          }
        }) => memberTypeLoader.load(profile.memberTypeId),
    },
  }),
});