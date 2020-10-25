import Role from './Role';
import { getModelForClass } from '@typegoose/typegoose';

const RoleModel = getModelForClass(Role);

export { Role, RoleModel }