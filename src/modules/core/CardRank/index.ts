import CardRank from './CardRank';
import { getModelForClass } from '@typegoose/typegoose';
import CardRankResolver from './CardRank.resolver';

const CardRankModel = getModelForClass(CardRank);

export {
  CardRank,
  CardRankModel,
  CardRankResolver
}