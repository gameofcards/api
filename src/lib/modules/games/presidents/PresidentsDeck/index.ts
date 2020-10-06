import PresidentsDeck from './PresidentsDeck';
import { DeckModel } from '../../../core/Deck';
import { getDiscriminatorModelForClass } from '@typegoose/typegoose';

const PresidentsDeckModel = getDiscriminatorModelForClass(DeckModel, PresidentsDeck);

export { PresidentsDeck, PresidentsDeckModel };
