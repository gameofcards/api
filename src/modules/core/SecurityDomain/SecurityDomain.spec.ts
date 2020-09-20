import SecurityDomains from './SecurityDomain.data';
import { SecurityDomainModel } from './';

export const createSecurityDomains = async () => {
  console.log('[UPLOAD] Uploading Security Domain data...');
  try {
    let securityDomainInstances = SecurityDomains.map((domain) => new SecurityDomainModel(domain));
    let securityDomainPromises = securityDomainInstances.map((instance) => instance.save());
    await Promise.all(securityDomainPromises);
  } catch (err) {
    console.log('[UPLOAD] Failed to create Security Domains.');
    console.log(err);
  }
  console.log('[UPLOAD] Security Domain upload completed.');
};
