import { Context } from 'koa';
import { PubSubEngine } from 'graphql-subscriptions';

export interface UserContext {
  role: string;
  id: string;
}

export interface ApolloServerContext {
  koaCtx: Context;
  user: UserContext;
  pubsub: PubSubEngine;
}
