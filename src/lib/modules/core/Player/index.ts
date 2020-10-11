import Player from './Player';
import PlayerResolver from './Player.resolver';
import { getModelForClass } from '@typegoose/typegoose';

const PlayerModel = getModelForClass(Player);

export { Player, PlayerModel, PlayerResolver };
