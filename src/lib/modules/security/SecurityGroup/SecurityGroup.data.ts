import { RoleModel } from '../../core/Role'
import { SecurityGroupModel } from '.';
import { StatusModel } from '../../core';
import { logger } from '../../../logger';

const SecurityGroups = [
  {
    name: 'Game Players',
    role: null,
    domainSecurityPolicy: null,
    status: null
  },
  {
    name: 'Administrators',
    role: null,
    domainSecurityPolicy: null,
    status: null
  },
  {
    name: 'Developers',
    role: null,
    domainSecurityPolicy: null,
    status: null
  }
];

const GamePlayers = 0;
const Administrators = 1;
const Developers = 2;

export const createSecurityGroups = async () => {
  try {
    const userRole = await RoleModel.findOne({ name: 'User' });
    const administratorRole = await RoleModel.findOne({ name: 'Administrator' });
    const developerRole = await RoleModel.findOne({ name: 'Developer' });
    const active = await StatusModel.findByValue('ACTIVE');

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
