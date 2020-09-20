import { ObjectId } from 'mongodb';
import { Resolver, Query, Arg } from 'type-graphql';
import { CardRank, CardRankModel } from '.';
import { ObjectIdScalar } from '../../../types';

@Resolver((of) => CardRank)
export default class CardRankResolver {
  @Query((returns) => CardRank)
  async cardRank(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
    return CardRankModel.findById(id);
  }

  @Query((returns) => [CardRank])
  async cardRanks(): Promise<CardRank[]> {
    return await CardRankModel.find({});
  }
}
