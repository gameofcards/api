import PresidentsTurn from './PresidentsTurn';
import { getModelForClass } from '@typegoose/typegoose';

const PresidentsTurnModel = getModelForClass(PresidentsTurn);

export {
  PresidentsTurn,
  PresidentsTurnModel
}