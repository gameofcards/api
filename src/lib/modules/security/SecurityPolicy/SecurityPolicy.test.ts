import 'reflect-metadata';
import 'regenerator-runtime/runtime';

import { DomainModel } from '../Domain';
import { PermissionModel } from '../Permission';
import { RoleModel } from '../../core/Role';
import { SecurityGroupModel } from '../SecurityGroup';
import { SecurityPolicyModel } from '.';
import { StatusModel } from '../../core';
import { UITaskModel } from '../UITask';
import { createGameDataDomain } from '../Domain/Domain.data';
import { createPermissions } from '../Permission/Permission.data';
import { createRoles } from '../../core/Role/Role.data';
import { createSecurityGroups } from '../SecurityGroup/SecurityGroup.data';
import { createSecurityPolicies } from './SecurityPolicy.data';
import { createStatuses } from '../../core/Status/Status.data';
import { createUITasks } from '../UITask/UITask.data';
import db from '../../../db';
import { logger } from './../../../logger';

describe('Security Policy', function () {
  beforeAll(async () => {
    logger.info('[BEGIN] Security Policy Tests');
    await db.connect();
    await createRoles();
    await createStatuses();
    await createUITasks();
    await createGameDataDomain();
    await createSecurityGroups();
    await createPermissions();
  });

  afterAll(async () => {
    await RoleModel.deleteMany({});
    await StatusModel.deleteMany({});
    await UITaskModel.deleteMany({});
    await DomainModel.deleteMany({});
    await SecurityGroupModel.deleteMany({});
    await PermissionModel.deleteMany({});
    await SecurityPolicyModel.deleteMany({});
    await db.disconnect();
    logger.info('[END] Security Policy Tests');
  });

  describe('@createGameDataDomain()', function () {
    it('should initialize 3 instances', async function () {
      await createSecurityPolicies();
      const instances = await SecurityPolicyModel.find({});
      expect(instances.length).toBe(3);
    });
  });
});
