import GameConfiguration from './GameConfiguration';
import { getModelForClass } from '@typegoose/typegoose';
import GameConfigurationResolver from './GameConfiguration.resolver';

const GameConfigurationModel = getModelForClass(GameConfiguration);

export { GameConfiguration, GameConfigurationModel, GameConfigurationResolver };
