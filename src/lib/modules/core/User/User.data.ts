import { UserModel } from '.';
import { logger } from '../../../logger';

const Users = [
  {
    username: 'tommypastrami',
    email: 'tommypastrami@gmail.com',
    displayName: 'tommyCHEESE',
    password: 'cheese',
  },
  {
    username: 'johnnyroastbeef',
    email: 'johnnyroastbeef@gmail.com',
    password: 'XxBeefCakexX',
    displayName: 'beefcake',
  },
  {
    username: 'bella',
    email: 'bella@gmail.com',
    password: 'mortadella',
    displayName: 'belladella',
  },
  {
    username: 'tony',
    email: 'tony@gmail.com',
    password: 'pepperoni',
    displayName: 'tonyP',
  },
  {
    username: 'tammy',
    email: 'tammy@gmail.com',
    password: 'salami',
    displayName: 'tammy.salami',
  },
  {
    username: 'malory',
    email: 'malory@gmail.com',
    password: 'cellory',
    displayName: 'mal.cell',
  },
  {
    username: 'bobby',
    email: 'bobby@gmail.com',
    password: 'apples',
    displayName: 'bobbyeatsapples',
  },
  {
    username: 'timmy',
    email: 'timmy@gmail.com',
    password: 'cheesecake',
    displayName: 'timmy.cheese',
  },
  {
    username: 'jethro',
    email: 'jethro@gmail.com',
    password: 'mud',
    displayName: 'jethro.mud',
  },
];

export const createUsers = async () => {
  try {
    const userPromises = Users.map((user) => UserModel.createInstance(user));
    await Promise.all(userPromises);
  } catch (err) {
    logger.error('[UPLOAD] Failed.');
    logger.error(err.message);
  }
};
