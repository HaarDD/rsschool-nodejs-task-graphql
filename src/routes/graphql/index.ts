/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { FastifyPluginAsync } from 'fastify';
import { execute, parse, validate } from 'graphql';
import { schema } from './schema.js';
import { createMemberTypeLoader, createPostLoader, createProfileLoader, createSubscribedToLoader, createSubscribersLoader, createUserLoader } from './dataloader.js';
import depthLimit from 'graphql-depth-limit';

declare module 'fastify' {
  interface FastifyInstance {
    userLoader: ReturnType<typeof createUserLoader>;
  }
}

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('userLoader', createUserLoader(fastify.prisma));

  fastify.post('/', async (request, reply) => {
    const { query, variables } = request.body as 
    { 
      query: string; 
      variables?: Record<string, any> 
    };

    const document = parse(query);
    const validationErrors = validate(schema, document, [depthLimit(5)]);

    if (validationErrors.length > 0) {
      reply.send({ errors: validationErrors });
      return;
    }

    const result = await execute({
      schema,
      document,
      variableValues: variables,
      contextValue: {
        prisma: fastify.prisma,
        userLoader: createUserLoader(fastify.prisma),
        postLoader: createPostLoader(fastify.prisma),
        profileLoader: createProfileLoader(fastify.prisma),
        memberTypeLoader: createMemberTypeLoader(fastify.prisma),
        subscribedToLoader: createSubscribedToLoader(fastify.prisma),
        subscribersLoader: createSubscribersLoader(fastify.prisma),
        log: fastify.log,
      },
    });

    reply.send(result);
  });
};

export default plugin;