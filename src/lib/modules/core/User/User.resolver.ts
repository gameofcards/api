import { ApolloServerContext } from '../../../app/ctx';
import { logger } from './../../../logger';
import { CreateUserRequest, LoginRequest } from './User.input';
import { RoleNames } from './../../../types';
import { ObjectId } from 'mongodb';
import { Resolver, Query, Arg, Authorized, Ctx, Mutation } from 'type-graphql';
import { User, UserModel } from '.';
import { ObjectIdScalar } from '../../../types';

@Resolver((of) => User)
export default class UserResolver {
  @Authorized([RoleNames.Administrator])
  @Query((returns) => User)
  async user(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
    return UserModel.findById(id);
  }

  @Authorized([RoleNames.Administrator])
  @Query((returns) => [User])
  async users(): Promise<User[]> {
    return UserModel.find({});
  }

  @Mutation((returns) => User)
  async createUser(@Arg('input') input: CreateUserRequest, @Ctx() ctx: ApolloServerContext): Promise<User> {
    const user = await UserModel.CreateUser(input);
    ctx.koaCtx.cookies.set('token', user.token);
    return user;
  }

  @Query((returns) => User)
  async login(@Arg('input') input: LoginRequest, @Ctx() ctx: ApolloServerContext): Promise<User> {
    const user = await UserModel.LoginUser(input);
    ctx.koaCtx.cookies.set('token', user.token);
    return user;
  }
}
