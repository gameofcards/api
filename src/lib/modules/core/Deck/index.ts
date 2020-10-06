import Deck from './Deck';
import { getModelForClass } from '@typegoose/typegoose';
import DeckResolver from './Deck.resolver';

const DeckModel = getModelForClass(Deck);

export { Deck, DeckModel, DeckResolver };
