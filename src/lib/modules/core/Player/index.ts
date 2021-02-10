import Player from './Player';
import { getModelForClass } from '@typegoose/typegoose';

const PlayerModel = getModelForClass(Player);

export { Player, PlayerModel };
