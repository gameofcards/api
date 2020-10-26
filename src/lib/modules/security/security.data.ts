import { DomainModel, PermissionModel, SecurityGroupModel, SecurityPolicyModel, UITaskModel } from '.';

import { RoleModel } from '../core';
import { createGameDataDomain } from './Domain/Domain.data';
import { createPermissions } from './Permission/Permission.data';
import { createRoles } from './../core/Role/Role.data';
import { createSecurityGroups } from './SecurityGroup/SecurityGroup.data';
import { createSecurityPolicies } from './SecurityPolicy/SecurityPolicy.data';
import { createUITasks } from './UITask/UITask.data';

export { createGameDataDomain } from './Domain/Domain.data';
export { createPermissions } from './Permission/Permission.data';
export { createSecurityGroups } from './SecurityGroup/SecurityGroup.data';
export { createSecurityPolicies } from './SecurityPolicy/SecurityPolicy.data';
export { createUITasks } from './UITask/UITask.data';

export const initializeSecurityModule = async () => {
  const roleCount = await RoleModel.countDocuments();
  if (roleCount === 0) {
    await createRoles();
  }
  await createUITasks();
  await createGameDataDomain();
  await createSecurityGroups();
  await createPermissions();
  await createSecurityPolicies();
};

export const dropSecurityModule = async () => {
  await DomainModel.deleteMany({});
  await PermissionModel.deleteMany({});
  await SecurityGroupModel.deleteMany({});
  await SecurityPolicyModel.deleteMany({});
  await UITaskModel.deleteMany({});
};
