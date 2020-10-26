import User from './User';
import UserResolver from './User.resolver';
import { getModelForClass } from '@typegoose/typegoose';

const UserModel = getModelForClass(User);

export { User, UserModel, UserResolver };
