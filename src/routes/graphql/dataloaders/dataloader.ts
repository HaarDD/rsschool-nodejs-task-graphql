import DataLoader from 'dataloader';
import { PrismaClient, User, Post, Profile, MemberType } from '@prisma/client';

const batchLoadUsers = async (
  ids: readonly string[],
  prisma: PrismaClient
): Promise<(User | null)[]> => {
  const users = await prisma.user.findMany({
    where: { id: { in: ids as string[] } },
  });
  const userMap = new Map(users.map((user) => [user.id, user]));
  return ids.map((id) => userMap.get(id) || null);
};

const batchLoadPosts = async (
  authorIds: readonly string[],
  prisma: PrismaClient
): Promise<Post[][]> => {
  const posts = await prisma.post.findMany({
    where: { authorId: { in: authorIds as string[] } },
  });
  const postsMap = new Map<string, Post[]>();
  authorIds.forEach((id) => postsMap.set(id, []));
  posts.forEach((post) => {
    postsMap.get(post.authorId)?.push(post);
  });
  return authorIds.map((id) => postsMap.get(id) || []);
};

const batchProfiles = async (
  userIds: readonly string[],
  prisma: PrismaClient
): Promise<(Profile | null)[]> => {
  const profiles = await prisma.profile.findMany({
    where: { userId: { in: userIds as string[] } },
  });
  const profileMap = new Map(profiles.map((profile) => [profile.userId, profile]));
  return userIds.map((id) => profileMap.get(id) || null);
};

const batchMemberTypes = async (
  ids: readonly string[],
  prisma: PrismaClient
): Promise<(MemberType | null)[]> => {
  const memberTypes = await prisma.memberType.findMany({
    where: { id: { in: ids as string[] } },
  });
  const memberTypeMap = new Map(memberTypes.map((type) => [type.id, type]));
  return ids.map((id) => memberTypeMap.get(id) || null);
};

const batchSubscribedTo = async (
  subscriberIds: readonly string[],
  prisma: PrismaClient
): Promise<User[][]> => {
  const subscriptions = await prisma.subscribersOnAuthors.findMany({
    where: { subscriberId: { in: subscriberIds as string[] } },
    include: { author: true },
  });

  const subscriptionMap = new Map<string, User[]>();
  subscriberIds.forEach((id) => subscriptionMap.set(id, []));
  subscriptions.forEach((sub) => {
    subscriptionMap.get(sub.subscriberId)?.push(sub.author);
  });
  return subscriberIds.map((id) => subscriptionMap.get(id) || []);
};

const batchSubscribers = async (
  authorIds: readonly string[],
  prisma: PrismaClient
): Promise<User[][]> => {
  const subscriptions = await prisma.subscribersOnAuthors.findMany({
    where: { authorId: { in: authorIds as string[] } },
    include: { subscriber: true },
  });

  const subscriptionMap = new Map<string, User[]>();
  authorIds.forEach((id) => subscriptionMap.set(id, []));
  subscriptions.forEach((sub) => {
    subscriptionMap.get(sub.authorId)?.push(sub.subscriber);
  });
  return authorIds.map((id) => subscriptionMap.get(id) || []);
};

export const createUserLoader = (prisma: PrismaClient) =>
  new DataLoader<string, User | null>((keys) => batchLoadUsers(keys, prisma));

export const createPostLoader = (prisma: PrismaClient) =>
  new DataLoader<string, Post[]>((keys) => batchLoadPosts(keys, prisma));

export const createProfileLoader = (prisma: PrismaClient) =>
  new DataLoader<string, Profile | null>((keys) => batchProfiles(keys, prisma));

export const createMemberTypeLoader = (prisma: PrismaClient) =>
  new DataLoader<string, MemberType | null>((keys) => batchMemberTypes(keys, prisma));

export const createSubscribedToLoader = (prisma: PrismaClient) =>
  new DataLoader<string, User[]>((keys) => batchSubscribedTo(keys, prisma));

export const createSubscribersLoader = (prisma: PrismaClient) =>
  new DataLoader<string, User[]>((keys) => batchSubscribers(keys, prisma));