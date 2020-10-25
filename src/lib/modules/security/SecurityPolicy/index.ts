import SecurityPolicy from './SecurityPolicy';
import { getModelForClass } from '@typegoose/typegoose';

const SecurityPolicyModel = getModelForClass(SecurityPolicy);

export { SecurityPolicy, SecurityPolicyModel };
