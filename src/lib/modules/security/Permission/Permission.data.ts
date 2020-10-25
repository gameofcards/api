import { PermissionModel } from '.';
import { SecurityGroupModel } from '../SecurityGroup';
import { StatusModel } from '../../core';
import { UITaskModel } from '../UITask';
import { Utils } from './../../modules.utils';
import { assert } from 'console';
import { logger } from '../../../logger';

export const PermissionNames = [
  'Game Players - Create Presidents Game',
  'Game Players - Play Presidents Game',
  'Administrators - Create Presidents Game',
  'Administrators - Play Presidents Game'
];

const Permissions = [
  {
    name: 'Game Players - Create Presidents Game',
    securityGroup: null,
    status: null,
    task: null
  },
  {
    name: 'Game Players - Play Presidents Game',
    securityGroup: null,
    status: null,
    task: null
  },
  {
    name: 'Administrators - Create Presidents Game',
    securityGroup: null,
    status: null,
    task: null
  },
  {
    name: 'Administrators - Play Presidents Game',
    securityGroup: null,
    status: null,
    task: null
  }
];

const CreatePresidentsGame = 'Create Presidents Game';
const PlayPresidentsGame = 'Play Presidents Game';

const GamePlayersCreatePresidentsGame = 0;
const GamePlayersPlayPresidentsGame = 1;
const AdministratorsCreatePresidentsGame = 2;
const AdministratorsPlayPresidentsGame = 3;


export const createPermissions = async () => {
  try {
    const gamePlayersSecurityGroup = await SecurityGroupModel.findOne({ name: 'Game Players' });
    const administratorsSecurityGroup = await SecurityGroupModel.findOne({ name: 'Administrators' });
    const active = await StatusModel.findByValue('ACTIVE');
    const taskInstances = await await UITaskModel.findManyByNames([
      CreatePresidentsGame,
      PlayPresidentsGame
    ]);

    const tasks = Utils.convertArrayOfObjectsToOneObject(taskInstances);
    
    Permissions[GamePlayersCreatePresidentsGame].securityGroup = gamePlayersSecurityGroup._id;   
    Permissions[GamePlayersCreatePresidentsGame].status = active;   
    Permissions[GamePlayersCreatePresidentsGame].task = tasks[CreatePresidentsGame]._id; 

    Permissions[GamePlayersPlayPresidentsGame].securityGroup = gamePlayersSecurityGroup._id;   
    Permissions[GamePlayersPlayPresidentsGame].status = active;   
    Permissions[GamePlayersPlayPresidentsGame].task = tasks[PlayPresidentsGame]._id;

    Permissions[AdministratorsCreatePresidentsGame].securityGroup = administratorsSecurityGroup._id;   
    Permissions[AdministratorsCreatePresidentsGame].status = active;   
    Permissions[AdministratorsCreatePresidentsGame].task = tasks[PlayPresidentsGame]._id;

    Permissions[AdministratorsPlayPresidentsGame].securityGroup = administratorsSecurityGroup._id;   
    Permissions[AdministratorsPlayPresidentsGame].status = active;   
    Permissions[AdministratorsPlayPresidentsGame].task = tasks[PlayPresidentsGame]._id; 

    let instances = Permissions.map((permission) => PermissionModel.createInstance(permission));
    await Promise.all(instances);
  } catch (err) {
    logger.error('[UPLOAD] Failed to create Permissions.');
    logger.error(err.message);
  }
};
