import PoliticalRank from './PoliticalRank';
import { getModelForClass } from '@typegoose/typegoose';

const PoliticalRankModel = getModelForClass(PoliticalRank);

export { PoliticalRank, PoliticalRankModel };
