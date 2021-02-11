import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as jwt from 'koa-jwt';
import * as path from 'path';

import { ApolloServer, PubSub } from 'apollo-server-koa';
import { Server, createServer } from 'http';

import { ApolloLogExtension } from 'apollo-log';
import { ApplicationError } from './errors';
import { GraphQLSchema } from 'graphql';
import { ObjectId } from 'mongodb';
import { ObjectIdScalar } from '../types';
import { RoleNames } from './../types';
import { UserModel } from '../modules/core';
import { auth } from './auth';
import { buildSchema } from 'type-graphql';
import graphqlHTTP from 'koa-graphiql';
import { logger } from '../logger';
import { middleware } from './middleware';
import resolvers from '../modules/modules.resolvers';

const port = process.env.PORT || 3000;

export class Application {
  private static instance: Application;
  private app: Koa;
  private router: Router;
  private pubsub: PubSub;
  private schema: GraphQLSchema;
  private apollo: ApolloServer;
  private server: Server;

  public static GetInstance() {
    if (!Application.instance) {
      Application.instance = new Application();
    } else {
      throw new ApplicationError('Application already initialized');
    }
    return Application.instance;
  }

  private constructor() {
    this.app = new Koa();
    this.router = new Router();
    this.pubsub = new PubSub();
    this.schema = null;
    this.apollo = null;
    this.server = null;
  }

  public async start() {
    await this.initializeApolloServer();
    this.initializeKoa();
    this.initializeGraphiql();
    this.initializeHttpServer();
  }

  private initializeKoa() {
    this.app.use(middleware);
  }

  private async initializeApolloServer() {
    const { app, pubsub } = this;
    this.schema = await buildSchema({
      resolvers,
      emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
      scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
      authChecker: auth,
      validate: false,
    });
    this.apollo = new ApolloServer({
      schema: this.schema,
      // extensions: [() => new ApolloLogExtension({ level: 'debug', timestamp: true, prefix: 'apollo' })],
      engine: {
        reportSchema: true,
      },
      context: async ({ ctx }) => {
        const token = ctx.cookies.get('token');
        logger.info(`apollo:context:token -- ${token}`);
        // const userInstance = await UserModel.findByToken(token);
        // const user = {
        //   role: userInstance.role.name,
        //   id: userInstance.id,
        // };
        // logger.info(`apollo:context:user -- ${userInstance.displayId}`);
        const user = {
          role: RoleNames.Administrator,
          id: '6018c463a65201803da6b465',
        };
        return { koaCtx: ctx, user, pubsub };
      },
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
      logger.info(`[Application] apollo running at http://localhost:${port}${this.apollo.graphqlPath}`)
    );
  }
}
