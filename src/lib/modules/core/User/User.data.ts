import { RoleModel } from '../Role';
import { RoleNames } from '../../../types';
import { UserModel } from '.';
import { assert } from 'console';
import { createRoles } from './../Role/Role.data';
import { logger } from '../../../logger';

const Users = [
  {
    username: 'tommypastrami',
    email: 'tommypastrami@gmail.com',
    displayName: 'tommyCHEESE',
    password: 'cheese',
    role: null,
  },
  {
    username: 'johnnyroastbeef',
    email: 'johnnyroastbeef@gmail.com',
    password: 'XxBeefCakexX',
    displayName: 'beefcake',
    role: null,
  },
  {
    username: 'bella',
    email: 'bella@gmail.com',
    password: 'mortadella',
    displayName: 'belladella',
    role: null,
  },
  {
    username: 'tony',
    email: 'tony@gmail.com',
    password: 'pepperoni',
    displayName: 'tonyP',
    role: null,
  },
  {
    username: 'tammy',
    email: 'tammy@gmail.com',
    password: 'salami',
    displayName: 'tammy.salami',
    role: null,
  },
  {
    username: 'malory',
    email: 'malory@gmail.com',
    password: 'cellory',
    displayName: 'mal.cell',
    role: null,
  },
  {
    username: 'bobby',
    email: 'bobby@gmail.com',
    password: 'apples',
    displayName: 'bobbyeatsapples',
    role: null,
  },
  {
    username: 'timmy',
    email: 'timmy@gmail.com',
    password: 'cheesecake',
    displayName: 'timmy.cheese',
    role: null,
  },
  {
    username: 'jethro',
    email: 'jethro@gmail.com',
    password: 'mud',
    displayName: 'jethro.mud',
    role: null,
  },
];

export const createUsers = async () => {
  try {
    const role = await RoleModel.findOne({ name: RoleNames.User });
    assert(role, 'Roles are not initialized.');
    const usersWithRoles = Users.map((user) => ({ ...user, role }));
    const userPromises = usersWithRoles.map((user) => UserModel.createInstance(user));
    await Promise.all(userPromises);
  } catch (err) {
    logger.error('[UPLOAD] Failed to create User.');
    logger.error(err.message);
  }
};

export const initializeUsers = async () => {
  await createRoles();
  await createUsers();
};
