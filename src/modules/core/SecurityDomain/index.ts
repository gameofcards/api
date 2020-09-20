import SecurityDomain from './SecurityDomain';
import { getModelForClass } from '@typegoose/typegoose';
import SecurityDomainResolver from './SecurityDomain.resolver';

const SecurityDomainModel = getModelForClass(SecurityDomain);

export {
  SecurityDomain,
  SecurityDomainModel,
  SecurityDomainResolver
}