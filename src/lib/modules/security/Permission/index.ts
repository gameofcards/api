import Permission from './Permission';
import { getModelForClass } from '@typegoose/typegoose';

const PermissionModel = getModelForClass(Permission);

export { Permission, PermissionModel };
