import { PrismaClient } from "@prisma/client";
import { GraphQLObjectType, GraphQLNonNull, GraphQLList } from "graphql";
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
        resolve: (_, { id }: { id: string }, { prisma }: { prisma: PrismaClient }) => prisma.memberType.findUnique({ where: { id } }),
      },
      post: {
        type: PostType as GraphQLObjectType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: (_: unknown, { id }: { id: string }, { prisma }: { prisma: PrismaClient }) => prisma.post.findUnique({ where: { id } }),
      },
      user: {
        type: UserType as GraphQLObjectType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: (_: unknown, { id }: { id: string }, { prisma }: { prisma: PrismaClient }) => prisma.user.findUnique({ where: { id } }),
      },
      profile: {
        type: ProfileType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: (_: unknown, { id }: { id: string }, { prisma }: { prisma: PrismaClient }) => prisma.profile.findUnique({ where: { id } }),
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