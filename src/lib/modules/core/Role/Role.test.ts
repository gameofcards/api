import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { RoleModel } from '.';
import { createRoles } from './Role.data';
import db from '../../../db';
import { logger } from './../../../logger';

describe('Role', function () {
  beforeAll(async () => {
    logger.info('[BEGIN] Game Configuration Tests');
    await db.connect();
  });

  afterAll(async () => {
    await RoleModel.deleteMany({});
    await db.disconnect();
    logger.info('[END] Game Configuration Tests');
  });

  describe('@createRoles()', function () {
    it('should initialize 3 instances', async function () {
      await createRoles();
      const instances = await RoleModel.find({});
      expect(instances.length).toBe(3);
    });
  });
});
