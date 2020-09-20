import User from './User';
import { getModelForClass } from '@typegoose/typegoose';
import UserResolver from './User.resolver';

const UserModel = getModelForClass(User);

export {
  User,
  UserModel,
  UserResolver
}