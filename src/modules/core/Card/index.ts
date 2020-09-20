import Card from './Card';
import { getModelForClass } from '@typegoose/typegoose';
import CardResolver from './Card.resolver';

const CardModel = getModelForClass(Card);

export {
  Card,
  CardModel,
  CardResolver
}