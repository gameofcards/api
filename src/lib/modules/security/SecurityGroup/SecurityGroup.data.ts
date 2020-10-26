import { RoleNames, SecurityGroupNames, StatusValues } from './../../../types';

import { RoleModel } from '../../core/Role';
import { SecurityGroupModel } from '.';
import { StatusModel } from '../../core';
import { assert } from 'console';
import { logger } from '../../../logger';

const SecurityGroups = [
  {
    name: SecurityGroupNames.GamePlayers,
    role: null,
    domainSecurityPolicy: null,
    status: null,
  },
  {
    name: SecurityGroupNames.Administrators,
    role: null,
    domainSecurityPolicy: null,
    status: null,
  },
  {
    name: SecurityGroupNames.Developers,
    role: null,
    domainSecurityPolicy: null,
    status: null,
  },
];

const GamePlayers = 0;
const Administrators = 1;
const Developers = 2;

export const createSecurityGroups = async () => {
  try {
    const userRole = await RoleModel.findOne({ name: RoleNames.User });
    const administratorRole = await RoleModel.findOne({ name: RoleNames.Administrator});
    const developerRole = await RoleModel.findOne({ name: RoleNames.Developer });
    const active = await StatusModel.findByValue(StatusValues.Active);

    assert(userRole && administratorRole && developerRole, 'Roles not initialized');
    assert(active, 'Statuses not initialized');

    SecurityGroups[GamePlayers].role = userRole;
    SecurityGroups[GamePlayers].status = active;

    SecurityGroups[Administrators].role = administratorRole;
    SecurityGroups[Administrators].status = active;

    SecurityGroups[Developers].role = developerRole;
    SecurityGroups[Developers].status = active;

    let instances = SecurityGroups.map((group) => SecurityGroupModel.createInstance(group));
    await Promise.all(instances);
  } catch (err) {
    logger.error('[UPLOAD] Failed to create Security Group.');
    logger.error(err);
  }
};
