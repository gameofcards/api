import { RoleModel } from '.';
import { RoleNames } from './../../../types';
import { logger } from '../../../logger';

const Roles = [{ name: RoleNames.User }, { name: RoleNames.Administrator }, { name: RoleNames.Developer }];

export const createRoles = async () => {
  try {
    const rolePromises = Roles.map((role) => RoleModel.createInstance(role));
    await Promise.all(rolePromises);
  } catch (err) {
    logger.error('[UPLOAD] Failed to create Role.');
    logger.error(err.message);
  }
};
