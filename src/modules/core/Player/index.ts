import Player from './Player';
import { getModelForClass } from '@typegoose/typegoose';
import PlayerResolver from './Player.resolver';

const PlayerModel = getModelForClass(Player);

export { 
  Player,
  PlayerModel,
  PlayerResolver
}