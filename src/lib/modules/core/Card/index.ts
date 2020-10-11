import Card from './Card';
import {CardInstance} from './Card';
import CardResolver from './Card.resolver';
import { getModelForClass } from '@typegoose/typegoose';

const CardModel = getModelForClass(Card);

export { Card, CardInstance, CardModel, CardResolver };
