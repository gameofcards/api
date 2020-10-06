import Status from './Status';
import { getModelForClass } from '@typegoose/typegoose';
import StatusResolver from './Status.resolver';

const StatusModel = getModelForClass(Status);

export { Status, StatusModel, StatusResolver };
