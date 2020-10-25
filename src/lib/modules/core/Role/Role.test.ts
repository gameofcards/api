import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { RoleModel } from '.';
import { createRoles } from './Role.data';
import db from '../../../db';

describe('Role', function () {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await RoleModel.deleteMany({});
    await db.disconnect();
  });

  describe('@createRoles()', function () {
    it('should initialize 3 instances', async function () {
      await createRoles();
      const instances = await RoleModel.find({});
      expect(instances.length).toBe(3);
    });
  });
});
