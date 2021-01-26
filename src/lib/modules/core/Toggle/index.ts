import Toggle from './Toggle';
import { getModelForClass } from '@typegoose/typegoose';

const ToggleModel = getModelForClass(Toggle);

export { Toggle, ToggleModel };
