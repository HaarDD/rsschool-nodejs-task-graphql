/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { FastifyPluginAsync } from 'fastify';
import { graphql } from 'graphql';
import { schema } from './schema.js';
import { createUserLoader } from './dataloader.js';

declare module 'fastify' {
  interface FastifyInstance {
    userLoader: ReturnType<typeof createUserLoader>;
  }
}

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('userLoader', createUserLoader(fastify.prisma));

  fastify.post('/', async (request, reply) => {
    fastify.log.info('GraphQL endpoint hit');
    const { query, variables } = request.body as { query: string; variables?: Record<string, any> };

    const result = await graphql({
      schema,
      source: query,
      variableValues: variables,
      contextValue: { prisma: fastify.prisma, userLoader: fastify.userLoader },
    });

    reply.send(result);
  });
};

export default plugin;