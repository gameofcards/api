import 'reflect-metadata';
import 'regenerator-runtime/runtime';

import { RoleModel } from '../../core/Role';
import { SecurityGroupModel } from '.';
import { StatusModel } from '../../core';
import { createRoles } from './../../core/Role/Role.data';
import { createSecurityGroups } from './SecurityGroup.data';
import { createStatuses } from '../../core/Status/Status.data';
import db from '../../../db';
import { logger } from './../../../logger';

describe('Security Group Tests', function () {
  beforeAll(async () => {
    logger.info('[BEGIN] Security Group Tests');
    await db.connect();
    await createRoles();
    await createStatuses();
  });

  afterAll(async () => {
    await SecurityGroupModel.deleteMany({});
    await StatusModel.deleteMany({});
    await RoleModel.deleteMany({});
    await db.disconnect();
    logger.info('[END] Security Group Tests');
  });

  describe('@createSecurityGroups()', function () {
    it('should initialize 3 instances', async function () {
      await createSecurityGroups();
      const instances = await SecurityGroupModel.find({});
      expect(instances.length).toBe(3);
    });
  });
});
