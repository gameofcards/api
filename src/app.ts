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
import * as path from 'path';
import { ObjectId } from 'mongodb';
import resolvers from './modules/resolvers';

const port = process.env.PORT || 3000;

class Application {
  private app: Koa;
  private router: Router;
  private pubsub: PubSub;
  private schema: GraphQLSchema;
  private apollo: ApolloServer;
  private server: Server;

  constructor() {
    this.app = new Koa();
    this.router = new Router();
    this.pubsub = new PubSub();
    this.schema = null;
    this.apollo = null;
    this.server = null;
  };

  public async start() {
   await this.initializeApolloServer();
   this.initializeGraphiql();
   this.initializeHttpServer();
  }

  private async initializeApolloServer() {
    const { app, pubsub } = this;
    const schema: GraphQLSchema = await buildSchema({
      resolvers,
      emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
      scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    });
    this.apollo = new ApolloServer({
      schema,
      extensions: [() => new ApolloLogExtension({ level: 'debug', timestamp: true, prefix: 'apollo' })],
      engine: {
        reportSchema: true,
      },
      context: async ({ req, connection }) => ({ pubsub })
    });
    this.apollo.applyMiddleware({ app });
  }

  private initializeGraphiql() {
    const { schema } = this;
    this.router.all(
      '/graphql',
      graphqlHTTP({
        schema,
        graphiql: true,
      })
    );
  }

  private initializeHttpServer() {
    this.server = createServer(this.app.callback());
    this.apollo.installSubscriptionHandlers(this.server);
    this.server.timeout = 5000;

    this.server.listen({ port }, () =>
      console.log(`[Application] apollo running at http://localhost:${port}${this.apollo.graphqlPath}`)
    );
  }
}

(async () => {
  try {
    console.log('[Application] starting up!');
    await db.connect();
    const app = new Application();
    await app.start();

  } catch (err) {
    console.log('[Application] startup failed.');
    console.log(err);
    await db.disconnect();
  }
})();
