import { ObjectId } from 'mongodb';
import { Resolver, Query, Arg } from 'type-graphql';
import { Card, CardModel } from '.';
import { ObjectIdScalar } from '../../../types';

@Resolver((of) => Card)
export default class CardResolver {
  @Query((returns) => Card)
  async card(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
    return CardModel.findById(id);
  }

  @Query((returns) => [Card])
  async cards(): Promise<Card[]> {
    return CardModel.find({});
  }
}
