import { ObjectId } from 'mongodb';
import { Resolver, Query, Arg } from 'type-graphql';
import { Suit, SuitModel } from '.';
import { ObjectIdScalar } from '../../../types';

@Resolver((of) => Suit)
export default class SuitResolver {
  @Query((returns) => Suit)
  async suit(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
    return SuitModel.findById(id);
  }

  @Query((returns) => [Suit])
  async suits(): Promise<Suit[]> {
    return await SuitModel.find({});
  }
}
