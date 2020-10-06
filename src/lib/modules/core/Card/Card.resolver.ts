import { ObjectId } from 'mongodb';
import { Resolver, Query, Arg, FieldResolver, Root } from 'type-graphql';
import { Card, CardModel } from '.';
import { ObjectIdScalar } from '../../../types';
import { SuitModel, Suit } from '../Suit';
import { CardRankModel, CardRank } from '../CardRank';

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

  // @FieldResolver()
  // async suit(@Root() card: Card): Promise<Suit> {
  //   return SuitModel.findOne(card.suit);
  // }

  // @FieldResolver()
  // async cardRank(@Root() card: Card): Promise<CardRank> {
  //   return CardRankModel.findOne(card.cardRank);
  // }
}
