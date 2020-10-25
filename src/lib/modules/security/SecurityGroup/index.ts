import SecurityGroup from './SecurityGroup';
import { getModelForClass } from '@typegoose/typegoose';

const SecurityGroupModel = getModelForClass(SecurityGroup);

export { SecurityGroup, SecurityGroupModel };
