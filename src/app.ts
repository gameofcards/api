import * as Koa from 'koa';
import * as Router from 'koa-router';
import graphqlHTTP from 'koa-graphiql';
import { createServer, Server } from 'http';
import { ApolloServer, PubSub } from 'apollo-server-koa';
import { buildSchema } from 'type-graphql';
import { ApolloLogExtension } from 'apollo-log';
import { GraphQLSchema } from 'graphql';
import db from './db';
import { ObjectIdScalar } from './types';
import * as path from "path";
import { ObjectId } from 'mongodb';
import resolvers from './modules/resolvers';

const port = process.env.PORT || 3000;

(async () => {
  
  try {
    console.log('[Application] starting up!');
    await db.connect();

    console.log('[Application] setting up Koa...');
    const app: Koa = new Koa();

    console.log('[Application] setting up Router...');
    const router: Router = new Router();

    console.log('[Application] setting up PubSub...');
    const pubsub: PubSub = new PubSub();

    console.log('[Application] building graphql schema...');
    const schema: GraphQLSchema = await buildSchema({ 
      resolvers,
      emitSchemaFile: path.resolve(__dirname, "schema.gql"),
      scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    });

    console.log('[Application] setting up Apollo Server...');
    const server: ApolloServer = new ApolloServer({
      schema,
      extensions: [() => new ApolloLogExtension({ level: 'debug', timestamp: true, prefix: 'apollo'})],
      engine: {   
        reportSchema: true
      },
      context: async ({ req, connection }) => ({ pubsub })
    })

    console.log('[Application] connecting Koa and Apollo Server...');
    server.applyMiddleware({ app });

    console.log('[Application] setting up graphiql...');
    router.all('/graphql', graphqlHTTP({
      schema,
      graphiql: true
    }));
    
    console.log('[Application] creating server...');
    const httpServer: Server = createServer(app.callback());
    server.installSubscriptionHandlers(httpServer);
    httpServer.timeout = 5000;

    httpServer.listen({ port }, () =>
      console.log(`[Application] 🚀 GraphQL Server running at http://localhost:${port}${server.graphqlPath}`)
    )
  }
  catch (err) {
    console.log('[Application] Startup failed.');
    console.log(err);   
    await db.disconnect();
  }
    
})();
