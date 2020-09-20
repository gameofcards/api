import PresidentsPlayer from './PresidentsPlayer';
import { getDiscriminatorModelForClass } from '@typegoose/typegoose';
import { PlayerModel } from '../../../core';

const PresidentsPlayerModel = getDiscriminatorModelForClass(PlayerModel, PresidentsPlayer);

export {
  PresidentsPlayer,
  PresidentsPlayerModel
}