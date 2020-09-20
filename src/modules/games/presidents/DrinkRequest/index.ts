import DrinkRequest from './DrinkRequest';
import { getModelForClass } from '@typegoose/typegoose';

const DrinkRequestModel = getModelForClass(DrinkRequest);

export {
  DrinkRequest,
  DrinkRequestModel
}