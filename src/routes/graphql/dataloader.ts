
import DataLoader from 'dataloader';
import { PrismaClient, User } from '@prisma/client';

const batchUsers = async (ids: readonly string[], prisma: PrismaClient): Promise<(User | null)[]> => {
  const users = await prisma.user.findMany({
    where: { id: { in: [...ids] } },
  });
  const userMap = new Map(users.map((user) => [user.id, user]));
  return ids.map((id) => userMap.get(id) || null);
};

export const createUserLoader = (prisma: PrismaClient): DataLoader<string, User | null> => 
  new DataLoader((keys) => batchUsers(keys, prisma));