import { DomainNames, SecurityGroupNames, SecurityPolicyNames, StatusValues } from './../../../types';

import { DomainModel } from '../Domain';
import { PermissionModel } from '../Permission';
import { SecurityGroupModel } from '../SecurityGroup';
import { SecurityPolicyModel } from '.';
import { StatusModel } from '../../core';
import { Utils } from '../../modules.utils';
import { assert } from 'console';
import { logger } from '../../../logger';

const SecurityPolicies = [
  {
    name: SecurityPolicyNames.GamePlayersGameTasksAllPermissions,
    securityGroup: null,
    domain: null,
    status: null,
    permissions: [],
  },
  {
    name: SecurityPolicyNames.AdministratorsGameTasksAllPermissions,
    securityGroup: null,
    domain: null,
    status: null,
    permissions: [],
  },
  {
    name: SecurityPolicyNames.DevelopersGameTasksAllPermissions,
    securityGroup: null,
    domain: null,
    status: null,
    permissions: [],
  },
];

const GamePlayers = 0;
const Administrators = 1;
const Developers = 2;

export const createSecurityPolicies = async () => {
  try {
    const gamePlayersSecurityGroup = await SecurityGroupModel.findOne({ name: SecurityGroupNames.GamePlayers });
    const administratorsSecurityGroup = await SecurityGroupModel.findOne({ name: SecurityGroupNames.Administrators });
    const developersSecurityGroup = await SecurityGroupModel.findOne({ name: SecurityGroupNames.Developers });
    const gameDataDomain = await DomainModel.findOne({ name: DomainNames.GameData });
    const active = await StatusModel.findByValue(StatusValues.Active);
    const permissions = await PermissionModel.all();

    assert(
      gamePlayersSecurityGroup && administratorsSecurityGroup && developersSecurityGroup,
      'Security Groups not initialized.'
    );
    assert(gameDataDomain, 'Domains not initialized.');
    assert(active, 'Statuses not initialized.');
    assert(permissions.length > 0, 'Permissions not initialized.');

    SecurityPolicies[GamePlayers].securityGroup = gamePlayersSecurityGroup._id;
    SecurityPolicies[GamePlayers].domain = gameDataDomain._id;
    SecurityPolicies[GamePlayers].status = active;
    SecurityPolicies[GamePlayers].permissions = permissions.map((p) => p._id);

    SecurityPolicies[Administrators].securityGroup = administratorsSecurityGroup._id;
    SecurityPolicies[Administrators].domain = gameDataDomain._id;
    SecurityPolicies[Administrators].status = active;
    SecurityPolicies[Administrators].permissions = permissions.map((p) => p._id);

    SecurityPolicies[Developers].securityGroup = developersSecurityGroup._id;
    SecurityPolicies[Developers].domain = gameDataDomain._id;
    SecurityPolicies[Developers].status = active;
    SecurityPolicies[Developers].permissions = permissions.map((p) => p._id);

    const promises = SecurityPolicies.map((policy) => SecurityPolicyModel.createInstance(policy));
    const instances = await Promise.all(promises);

    const policies = Utils.convertArrayOfObjectsToOneObject(instances);
    await gamePlayersSecurityGroup.setSecurityPolicy(policies[SecurityPolicyNames.GamePlayersGameTasksAllPermissions]);
    await administratorsSecurityGroup.setSecurityPolicy(policies[SecurityPolicyNames.AdministratorsGameTasksAllPermissions]);
    await developersSecurityGroup.setSecurityPolicy(policies[SecurityPolicyNames.DevelopersGameTasksAllPermissions]);
  } catch (err) {
    logger.error('[UPLOAD] Failed to create Domain Security Policy.');
    logger.error(err.message);
  }
};
