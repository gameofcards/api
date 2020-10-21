import Card from './Card';
import CardResolver from './Card.resolver';
import { getModelForClass } from '@typegoose/typegoose';

const CardModel = getModelForClass(Card);

export { Card, CardModel, CardResolver };
