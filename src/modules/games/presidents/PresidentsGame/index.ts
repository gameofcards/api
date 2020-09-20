import PresidentsGame from './PresidentsGame';
import { GameModel } from '../../../core';
import { getDiscriminatorModelForClass } from '@typegoose/typegoose';
import PresidentsGameResolver from './PresidentsGame.resolver';

const PresidentsGameModel = getDiscriminatorModelForClass(GameModel, PresidentsGame);

export {
  PresidentsGame,
  PresidentsGameModel,
  PresidentsGameResolver
}