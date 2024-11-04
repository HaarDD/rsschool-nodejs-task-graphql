import { PrismaClient } from "@prisma/client";
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLResolveInfo } from "graphql";
import { MemberTypeIdScalar } from "../types/scalar-types/member-type-id-scalar.js";
import { MemberTypeType } from "../types/object-types/member-type-type.js";
import { PostType } from "../types/object-types/post-type.js";
import { ProfileType } from "../types/object-types/profile-type.js";
import { UserType } from "../types/object-types/user-type.js";
import { UUIDType } from "../types/scalar-types/uuid.js";

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberType: {
      type: MemberTypeType,
      args: { id: { type: new GraphQLNonNull(MemberTypeIdScalar) } },
      resolve: async (_, { id }: { id: string }, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.memberType.findUnique({ where: { id } });
      },
    },
    post: {
      type: PostType as GraphQLObjectType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_: unknown, { id }: { id: string }, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.post.findUnique({ where: { id } });
      },
    },
    user: {
      type: UserType as GraphQLObjectType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_: unknown, { id }: { id: string }, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.user.findUnique({ where: { id } });
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_: unknown, { id }: { id: string }, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.profile.findUnique({ where: { id } });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_, __, { prisma }, info: GraphQLResolveInfo) => {
        const requestedFields = info.fieldNodes[0].selectionSet?.selections.map(
          (field) => ('name' in field ? field.name.value : '')
        ).filter(Boolean);

        const include: { userSubscribedTo?: boolean; subscribedToUser?: boolean } = {};

        if (requestedFields && requestedFields.includes('userSubscribedTo')) {
          include.userSubscribedTo = true;
        }
        if (requestedFields && requestedFields.includes('subscribedToUser')) {
          include.subscribedToUser = true;
        }

        return prisma.user.findMany({
          include: Object.keys(include).length ? include : undefined,
        });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_, __, { prisma }) => {
        return await prisma.post.findMany();
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_, __, { prisma }) => {
        return await prisma.profile.findMany();
      },
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