import { FastifyPluginAsync } from 'fastify';
import { execute, GraphQLSchema, parse, validate } from 'graphql';
import { createMemberTypeLoader, createPostLoader, createProfileLoader, createSubscribedToLoader, createSubscribersLoader, createUserLoader } from './dataloaders/dataloader.js';
import depthLimit from 'graphql-depth-limit';
import { QueryType } from './resolvers/queries.js';
import { MutationType } from './resolvers/mutations.js';

declare module 'fastify' {
  interface FastifyInstance {
    userLoader: ReturnType<typeof createUserLoader>;
  }
}

const schema =  new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
})

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('userLoader', createUserLoader(fastify.prisma));

  fastify.post('/', async (request, reply) => {
    const { query, variables } = request.body as 
    { 
      query: string; 
      variables?: Record<string, unknown> 
    };

    const document = parse(query);
    const validationErrors = validate(schema, document, [depthLimit(5)]);

    if (validationErrors.length > 0) {
      await reply.send({ errors: validationErrors });
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

    await reply.send(result);
  });
};

export default plugin;