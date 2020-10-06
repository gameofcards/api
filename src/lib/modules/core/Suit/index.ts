import Suit from './Suit';
import { getModelForClass } from '@typegoose/typegoose';
import SuitResolver from './Suit.resolver';

const SuitModel = getModelForClass(Suit);

export { Suit, SuitModel, SuitResolver };
