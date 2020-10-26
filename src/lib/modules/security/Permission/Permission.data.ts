import { PermissionNamesEnum, SecurityGroupNames, StatusValues, UITaskNames } from './../../../types';

import { PermissionModel } from '.';
import { SecurityGroupModel } from '../SecurityGroup';
import { StatusModel } from '../../core';
import { UITaskModel } from '../UITask';
import { Utils } from './../../modules.utils';
import { assert } from 'console';
import { logger } from '../../../logger';

const Permissions = [
  {
    name: PermissionNamesEnum.GamePlayersCreatePresidentsGame,
    securityGroup: null,
    status: null,
    task: null,
  },
  {
    name: PermissionNamesEnum.GamePlayersPlayPresidentsGame,
    securityGroup: null,
    status: null,
    task: null,
  },
  {
    name: PermissionNamesEnum.AdministratorsCreatePresidentsGame,
    securityGroup: null,
    status: null,
    task: null,
  },
  {
    name: PermissionNamesEnum.AdministratorsPlayPresidentsGame,
    securityGroup: null,
    status: null,
    task: null,
  },
];


const GamePlayersCreatePresidentsGame = 0;
const GamePlayersPlayPresidentsGame = 1;
const AdministratorsCreatePresidentsGame = 2;
const AdministratorsPlayPresidentsGame = 3;

export const createPermissions = async () => {
  try {
    const gamePlayersSecurityGroup = await SecurityGroupModel.findOne({ name: SecurityGroupNames.GamePlayers });
    const administratorsSecurityGroup = await SecurityGroupModel.findOne({ name: SecurityGroupNames.Administrators });
    const active = await StatusModel.findByValue(StatusValues.Active);
    const taskInstances = await UITaskModel.findManyByNames([
      UITaskNames.CreatePresidentsGame, 
      UITaskNames.PlayPresidentsGame
    ]);

    assert(gamePlayersSecurityGroup && administratorsSecurityGroup, 'Security Groups not initialized.');
    assert(active, 'Statuses not initialized.');
    assert(taskInstances.length === 2, 'Tasks not initialized.');

    const tasks = Utils.convertArrayOfObjectsToOneObject(taskInstances);

    Permissions[GamePlayersCreatePresidentsGame].securityGroup = gamePlayersSecurityGroup._id;
    Permissions[GamePlayersCreatePresidentsGame].status = active;
    Permissions[GamePlayersCreatePresidentsGame].task = tasks[UITaskNames.CreatePresidentsGame]._id;

    Permissions[GamePlayersPlayPresidentsGame].securityGroup = gamePlayersSecurityGroup._id;
    Permissions[GamePlayersPlayPresidentsGame].status = active;
    Permissions[GamePlayersPlayPresidentsGame].task = tasks[UITaskNames.PlayPresidentsGame]._id;

    Permissions[AdministratorsCreatePresidentsGame].securityGroup = administratorsSecurityGroup._id;
    Permissions[AdministratorsCreatePresidentsGame].status = active;
    Permissions[AdministratorsCreatePresidentsGame].task = tasks[UITaskNames.CreatePresidentsGame]._id;

    Permissions[AdministratorsPlayPresidentsGame].securityGroup = administratorsSecurityGroup._id;
    Permissions[AdministratorsPlayPresidentsGame].status = active;
    Permissions[AdministratorsPlayPresidentsGame].task = tasks[UITaskNames.PlayPresidentsGame]._id;

    let instances = Permissions.map((permission) => PermissionModel.createInstance(permission));
    await Promise.all(instances);
  } catch (err) {
    logger.error('[UPLOAD] Failed to create Permissions.');
    logger.error(err.message);
  }
};
