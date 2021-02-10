import { RoleNames } from './../../../types';
import { ObjectId } from 'mongodb';
import { Resolver, Query, Arg, Authorized } from 'type-graphql';
import { CardRank, CardRankModel } from '.';
import { ObjectIdScalar } from '../../../types';

@Resolver((of) => CardRank)
export default class CardRankResolver {
  @Authorized([RoleNames.Administrator])
  @Query((returns) => CardRank)
  async cardRank(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
    return CardRankModel.findById(id);
  }

  @Authorized([RoleNames.Administrator])
  @Query((returns) => [CardRank])
  async cardRanks(): Promise<CardRank[]> {
    return await CardRankModel.find({});
  }
}
