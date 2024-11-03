/* eslint-disable @typescript-eslint/no-unsafe-return */

import DataLoader from 'dataloader';
import { PrismaClient, User, Post, Profile, MemberType } from '@prisma/client';

const batchUsers = async (ids: readonly string[], prisma: PrismaClient): Promise<(User | null)[]> => {
  const users = await prisma.user.findMany({
    where: { id: { in: [...ids] } },
  });
  const userMap = new Map(users.map((user) => [user.id, user]));
  return ids.map((id) => userMap.get(id) || null);
};

const batchPosts = async (authorIds: readonly string[], prisma: PrismaClient): Promise<Post[][]> => {
  const posts = await prisma.post.findMany({
    where: { authorId: { in: [...authorIds] } },
  });
  const postsMap = new Map<string, Post[]>();
  authorIds.forEach(id => postsMap.set(id, []));
  posts.forEach(post => {
    postsMap.get(post.authorId)?.push(post);
  });
  return authorIds.map(id => postsMap.get(id) || []);
};

const batchProfiles = async (userIds: readonly string[], prisma: PrismaClient): Promise<(Profile | null)[]> => {
  const profiles = await prisma.profile.findMany({
    where: { userId: { in: [...userIds] } },
  });
  const profileMap = new Map(profiles.map(profile => [profile.userId, profile]));
  return userIds.map(id => profileMap.get(id) || null);
};

const batchMemberTypes = async (ids: readonly string[], prisma: PrismaClient): Promise<(MemberType | null)[]> => {
  const memberTypes = await prisma.memberType.findMany({
    where: { id: { in: [...ids] } },
  });
  const memberTypeMap = new Map(memberTypes.map(type => [type.id, type]));
  return ids.map(id => memberTypeMap.get(id) || null);
};

const batchSubscribedTo = async (subscriberIds: readonly string[], prisma: PrismaClient): Promise<User[][]> => {
  const subscriptions = await prisma.subscribersOnAuthors.findMany({
    where: { subscriberId: { in: [...subscriberIds] } },
    include: { author: true }, // Включаем данные автора сразу
  });
  
  const subscriptionMap = new Map<string, User[]>();
  subscriberIds.forEach(id => subscriptionMap.set(id, []));
  subscriptions.forEach(sub => {
    subscriptionMap.get(sub.subscriberId)?.push(sub.author);
  });
  return subscriberIds.map(id => subscriptionMap.get(id) || []);
};

const batchSubscribers = async (authorIds: readonly string[], prisma: PrismaClient): Promise<User[][]> => {
  const subscriptions = await prisma.subscribersOnAuthors.findMany({
    where: { authorId: { in: [...authorIds] } },
    include: { subscriber: true }, // Включаем данные подписчика сразу
  });
  
  const subscriptionMap = new Map<string, User[]>();
  authorIds.forEach(id => subscriptionMap.set(id, []));
  subscriptions.forEach(sub => {
    subscriptionMap.get(sub.authorId)?.push(sub.subscriber);
  });
  return authorIds.map(id => subscriptionMap.get(id) || []);
};

export const createUserLoader = (prisma: PrismaClient) => 
  new DataLoader((keys: readonly string[]) => batchUsers(keys, prisma));

export const createPostLoader = (prisma: PrismaClient) => 
  new DataLoader((keys: readonly string[]) => batchPosts(keys, prisma));

export const createProfileLoader = (prisma: PrismaClient) => 
  new DataLoader((keys: readonly string[]) => batchProfiles(keys, prisma));

export const createMemberTypeLoader = (prisma: PrismaClient) => 
  new DataLoader((keys: readonly string[]) => batchMemberTypes(keys, prisma));

export const createSubscribedToLoader = (prisma: PrismaClient) => 
  new DataLoader((keys: readonly string[]) => batchSubscribedTo(keys, prisma));

export const createSubscribersLoader = (prisma: PrismaClient) => 
  new DataLoader((keys: readonly string[]) => batchSubscribers(keys, prisma));