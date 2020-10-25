import { DeckModel } from '../../../core/Deck';
import PresidentsDeck from './PresidentsDeck';
import { getDiscriminatorModelForClass } from '@typegoose/typegoose';

const PresidentsDeckModel = getDiscriminatorModelForClass(DeckModel, PresidentsDeck);

export { PresidentsDeck, PresidentsDeckModel };
