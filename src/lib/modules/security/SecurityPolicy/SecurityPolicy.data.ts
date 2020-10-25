import { PermissionModel, PermissionNames } from '../Permission';

import { DomainModel } from '../Domain';
import { SecurityGroupModel } from '../SecurityGroup';
import { SecurityPolicyModel } from '.';
import { StatusModel } from '../../core';
import { Utils } from '../../modules.utils';
import { assert } from 'console';
import { logger } from '../../../logger';

const GamePlayersGameTasksAllPermissions = 'Game Players - Game Tasks - All Permissions';
const AdministratorsGameTasksAllPermissions = 'Administrators - Game Tasks - All Permissions';
const DevelopersGameTasksAllPermissions = 'Developers - Game Tasks - All Permissions';

const SecurityPolicies = [
  {
    name: 'Game Players - Game Tasks - All Permissions',
    securityGroup: null,
    domain: null,
    status: null,
    permissions: []
  },
  {
    name: 'Administrators - Game Tasks - All Permissions',
    securityGroup: null,
    domain: null,
    status: null,
    permissions: []
  },
  {
    name: 'Developers - Game Tasks - All Permissions',
    securityGroup: null,
    domain: null,
    status: null,
    permissions: []
  }
];

const GamePlayers = 0;
const Administrators = 1;
const Developers = 2;

export const createSecurityPolicies = async () => {
  try {
    const gamePlayersSecurityGroup = await SecurityGroupModel.findOne({ name: 'Game Players' });
    const administratorsSecurityGroup = await SecurityGroupModel.findOne({ name: 'Administrators' });
    const developersSecurityGroup = await SecurityGroupModel.findOne({ name: 'Developers' });
    const gameDataDomain = await DomainModel.findOne({ name: 'Game Data' });
    const active = await StatusModel.findByValue('ACTIVE');
    const permissions = await PermissionModel.all();

    assert(gamePlayersSecurityGroup, 'No Game Players Group');
    assert(administratorsSecurityGroup, 'No Administrators  Group');
    assert(developersSecurityGroup, 'No Developers Group');
    assert(gameDataDomain, 'No Game Data Domain');
    assert(active, 'No Active Status');
    assert(permissions, 'No Permissions');

    SecurityPolicies[GamePlayers].securityGroup = gamePlayersSecurityGroup._id;
    SecurityPolicies[GamePlayers].domain = gameDataDomain._id;
    SecurityPolicies[GamePlayers].status = active;
    SecurityPolicies[GamePlayers].permissions = permissions.map(p => p._id);

    SecurityPolicies[Administrators].securityGroup = administratorsSecurityGroup._id;
    SecurityPolicies[Administrators].domain = gameDataDomain._id;
    SecurityPolicies[Administrators].status = active;
    SecurityPolicies[Administrators].permissions = permissions.map(p => p._id);

    SecurityPolicies[Developers].securityGroup = developersSecurityGroup._id;
    SecurityPolicies[Developers].domain = gameDataDomain._id;
    SecurityPolicies[Developers].status = active;
    SecurityPolicies[Developers].permissions = permissions.map(p => p._id);

    const promises = SecurityPolicies.map((policy) => SecurityPolicyModel.createInstance(policy));
    const instances = await Promise.all(promises);
    
    const policies = Utils.convertArrayOfObjectsToOneObject(instances);
    await gamePlayersSecurityGroup.setSecurityPolicy(policies[GamePlayersGameTasksAllPermissions]);
    await administratorsSecurityGroup.setSecurityPolicy(policies[AdministratorsGameTasksAllPermissions]);
    await developersSecurityGroup.setSecurityPolicy(policies[DevelopersGameTasksAllPermissions]);

  } catch (err) {
    logger.error('[UPLOAD] Failed to create Domain Security Policy.');
    logger.error(err.message);
  }
};
