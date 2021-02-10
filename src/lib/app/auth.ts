import { ApolloServerContext } from './ctx';
import { AuthChecker } from 'type-graphql';
import { logger } from '../logger';

export const auth: AuthChecker<ApolloServerContext> = ({ root, args, context, info }, roles) => {
  logger.info(`[AUTH] ctx: ${JSON.stringify(context.user)}`);
  logger.info(`[AUTH] roles: ${roles}`);
  if (roles.length === 0) {
    return context.user !== undefined;
  }
  const isAuthorized = roles.includes(context.user.role);
  return isAuthorized;
};
