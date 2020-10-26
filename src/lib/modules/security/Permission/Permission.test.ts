import 'reflect-metadata';
import 'regenerator-runtime/runtime';

import { PermissionModel } from '.';
import { RoleModel } from '../../core/Role';
import { SecurityGroupModel } from '../SecurityGroup';
import { StatusModel } from '../../core';
import { UITaskModel } from '../UITask';
import { createPermissions } from './Permission.data';
import { createRoles } from './../../core/Role/Role.data';
import { createSecurityGroups } from './../SecurityGroup/SecurityGroup.data';
import { createStatuses } from '../../core/Status/Status.data';
import { createUITasks } from '../UITask/UITask.data';
import db from '../../../db';
import { logger } from './../../../logger';

describe('Permission Tests', function () {
  beforeAll(async () => {
    logger.info('[BEGIN] Permission Tests');
    await db.connect();
    await createRoles();
    await createStatuses();
    await createSecurityGroups();
    await createUITasks();
  });

  afterAll(async () => {
    await RoleModel.deleteMany({});
    await UITaskModel.deleteMany({});
    await StatusModel.deleteMany({});
    await SecurityGroupModel.deleteMany({});
    await PermissionModel.deleteMany({});
    await db.disconnect();
    logger.info('[END] Permission Tests');
  });

  describe('@createPermissions()', function () {
    it('should initialize 4 instances', async function () {
      await createPermissions();
      const instances = await PermissionModel.find({});
      expect(instances.length).toBe(4);
    });
  });
});
