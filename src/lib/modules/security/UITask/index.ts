import UITask from './UITask';
import { getModelForClass } from '@typegoose/typegoose';

const UITaskModel = getModelForClass(UITask);

export { UITask, UITaskModel };
