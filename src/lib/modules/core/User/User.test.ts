import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { RoleModel } from '../Role';
import { RoleNames } from '../../../types';
import { UserModel } from '.';
import { Utils } from '../../modules.utils';
import db from '../../../db';
import { initializeUsers } from './User.data';
import { logger } from '../../../logger';

describe('User', function () {
  beforeAll(async () => {
    logger.info('[BEGIN] User Tests');
    await db.connect();
    await initializeUsers();
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await RoleModel.deleteMany({});
    await db.disconnect();
    logger.info('[END] User Tests');
  });

  describe('@createUsers()', function () {
    it('should initialize 9 instances', async function () {
      const instances = await UserModel.find({});
      expect(instances.length).toBe(9);
    });
  });

  describe('@addPlayerRecord()', function () {
    it('should add a player ref', async function () {
      const user = await UserModel.findOne({ username: 'tommypastrami' });
      const playerRecord = Utils.getObjectId();
      const result = await user.addPlayerRecord(playerRecord);
      expect(result.playerRecords.length).toEqual(1);
      expect(result.playerRecords[0]).toEqual(playerRecord);
    });
  });

  describe('validations', function () {
    it('username is required', async function () {
      const userRole = await RoleModel.findOne({ name: RoleNames.User });
      const user = {
        email: 'email',
        displayName: 'displayName',
        password: 'password',
        role: userRole,
      };
      try {
        const instance = await UserModel.createInstance(user as any);
      } catch (err) {
        expect(err.message).toEqual('User validation failed: username: Path `username` is required.');
      }
    });

    it('username must be unique', async function () {
      const userRole = await RoleModel.findOne({ name: RoleNames.User });
      const user = {
        username: 'jethro',
        email: 'email',
        displayName: 'displayName',
        password: 'password',
        role: userRole,
        token: '',
      };
      try {
        const instance = await UserModel.createInstance(user);
      } catch (err) {
        expect(err.message).toContain('duplicate key error');
      }
    });

    it('email is required', async function () {
      const userRole = await RoleModel.findOne({ name: RoleNames.User });
      const user = {
        username: 'tester',
        displayName: 'displayName',
        password: 'password',
        role: userRole,
      };
      try {
        const instance = await UserModel.createInstance(user as any);
      } catch (err) {
        expect(err.message).toEqual('User validation failed: email: Path `email` is required.');
      }
    });

    it('email must be unique', async function () {
      const userRole = await RoleModel.findOne({ name: RoleNames.User });
      const user = {
        username: 'tester',
        email: 'jethro@gmail.com',
        displayName: 'displayName',
        password: 'password',
        role: userRole,
        token: '',
      };
      try {
        const instance = await UserModel.createInstance(user);
      } catch (err) {
        expect(err.message).toContain('duplicate key error');
      }
    });

    it('password is required', async function () {
      const userRole = await RoleModel.findOne({ name: RoleNames.User });
      const user = {
        username: 'tester',
        email: 'email',
        displayName: 'displayName',
        role: userRole,
      };
      try {
        const instance = await UserModel.createInstance(user as any);
      } catch (err) {
        expect(err.message).toEqual('User validation failed: password: Path `password` is required.');
      }
    });

    it('role is required', async function () {
      const userRole = await RoleModel.findOne({ name: RoleNames.User });
      const user = {
        username: 'tester',
        email: 'email',
        displayName: 'displayName',
        password: 'past',
      };
      try {
        const instance = await UserModel.createInstance(user as any);
      } catch (err) {
        expect(err.message).toEqual('User validation failed: role: Path `role` is required.');
      }
    });
  });

  describe('@CreateUser()', function () {
    it('should create a user', async function () {
      const user = await UserModel.CreateUser({
        username: 'bill',
        password: 'bob',
        email: 'bill@bob.com',
        displayName: 'billybob',
      });
      expect(user).toBeDefined();
      expect(user.token).toBeDefined();
    });
  });

  describe('@LoginUser()', function () {
    it('should login a user', async function () {
      const user = await UserModel.LoginUser({
        username: 'bill',
        password: 'bob'
      });
      expect(user).toBeDefined();
      expect(user.token).toBeDefined();
    });
  });

  describe('@findByToken()', function () {
    it('should find a user by token', async function () {
      const user = await UserModel.CreateUser({
        username: 'joe',
        password: 'blow',
        email: 'joe@blow.com',
        displayName: 'joeblow',
      });
      const user2 = await UserModel.findByToken(user.token);
      expect(user.id).toEqual(user2.id)
    });
  });
});
