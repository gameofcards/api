import { RoleNames } from './../../../types';
import { ObjectId } from 'mongodb';
import { Resolver, Query, Arg, Authorized } from 'type-graphql';
import { Suit, SuitModel } from '.';
import { ObjectIdScalar } from '../../../types';

@Resolver((of) => Suit)
export default class SuitResolver {
  @Authorized([RoleNames.Administrator])
  @Query((returns) => Suit)
  async suit(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
    return SuitModel.findById(id);
  }

  @Authorized([RoleNames.Administrator])
  @Query((returns) => [Suit])
  async suits(): Promise<Suit[]> {
    return await SuitModel.find({});
  }
}
