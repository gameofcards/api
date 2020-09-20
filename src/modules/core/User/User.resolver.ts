import { ObjectId } from 'mongodb';
import { Resolver, Query, Arg } from 'type-graphql';
import { User, UserModel } from '.';
import { ObjectIdScalar } from '../../../types';

@Resolver((of) => User)
export default class UserModelResolver {
  @Query((returns) => User)
  async user(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
    return UserModel.findById(id);
  }

  @Query((returns) => [User])
  async users(): Promise<User[]> {
    return await UserModel.find({});
  }
}
