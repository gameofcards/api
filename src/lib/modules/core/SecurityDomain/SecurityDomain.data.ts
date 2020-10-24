import { SecurityDomainModel } from '.';
import { logger } from '../../../logger';

const SecurityDomains = [
  {
    name: 'root',
    clearanceLevel: 1,
  },
  {
    name: 'user',
    clearanceLevel: 2,
  },
];

export const createSecurityDomains = async () => {
  try {
    let instances = SecurityDomains.map((domain) => SecurityDomainModel.createInstance(domain));
    await Promise.all(instances);
  } catch (err) {
    logger.error('[UPLOAD] Failed to create Security Domain.');
    logger.error(err);
  }
};
