import Domain from './Domain';
import { getModelForClass } from '@typegoose/typegoose';

const DomainModel = getModelForClass(Domain);

export { Domain, DomainModel };
