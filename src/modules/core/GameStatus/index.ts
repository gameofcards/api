import GameStatus from './GameStatus';
import { StatusModel } from '../Status';
import { getDiscriminatorModelForClass } from '@typegoose/typegoose';
import GameStatusResolver from './GameStatus.resolver';

const GameStatusModel = getDiscriminatorModelForClass(StatusModel, GameStatus);

export {
  GameStatus,
  GameStatusModel,
  GameStatusResolver
}