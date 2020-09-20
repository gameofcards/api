import Game from './Game';
import { getModelForClass } from '@typegoose/typegoose';

const GameModel = getModelForClass(Game);

export { 
  Game,
  GameModel,
}