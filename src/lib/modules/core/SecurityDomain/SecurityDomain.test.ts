import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { SecurityDomainModel } from '.';
import { createSecurityDomains } from './SecurityDomain.data';
import db from '../../../db';

describe('Security Domain Model Tests', function () {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await SecurityDomainModel.deleteMany({});
    await db.disconnect();
  });

  describe('@createSecurityDomains()', function () {
    it('should initialize 2 instances', async function () {
      await createSecurityDomains();
      const instances = await SecurityDomainModel.find({});
      expect(instances.length).toBe(2);
    });
  });

  describe('validations', function () {
    it('name is required', async function () {
      const securityDomain = {
        clearanceLevel: 1,
      };
      try {
        const instance = await SecurityDomainModel.createInstance(securityDomain as any);
      } catch (err) {
        expect(err.message).toEqual('SecurityDomain validation failed: name: Path `name` is required.');
      }
    });

    it('clearanceLevel is required', async function () {
      const securityDomain = {
        name: 'test',
      };
      try {
        const instance = await SecurityDomainModel.createInstance(securityDomain as any);
      } catch (err) {
        expect(err.message).toEqual('SecurityDomain validation failed: clearanceLevel: Path `clearanceLevel` is required.');
      }
    });
  });
});
