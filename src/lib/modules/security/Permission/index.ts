import Permission from './Permission';
import { PermissionNames } from './Permission.data';
import { getModelForClass } from '@typegoose/typegoose';

const PermissionModel = getModelForClass(Permission);

export { Permission, PermissionModel, PermissionNames };
