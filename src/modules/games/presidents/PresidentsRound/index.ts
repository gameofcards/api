import PresidentsRound from './PresidentsRound';
import { getModelForClass } from '@typegoose/typegoose';

const PresidentsRoundModel = getModelForClass(PresidentsRound);

export {
  PresidentsRound,
  PresidentsRoundModel
}