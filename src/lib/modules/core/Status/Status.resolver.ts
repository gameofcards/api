import { RoleNames } from './../../../types';
import { ObjectId } from 'mongodb';
import { Resolver, Query, Arg, Authorized } from 'type-graphql';
import { Status, StatusModel } from '.';
import { ObjectIdScalar } from '../../../types';

@Resolver((of) => Status)
export default class StatusResolver {
  @Authorized([RoleNames.Administrator])
  @Query((returns) => Status)
  async status(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
    return StatusModel.findById(id);
  }

  @Authorized([RoleNames.Administrator])
  @Query((returns) => [Status])
  async statuses(): Promise<Status[]> {
    return await StatusModel.find({});
  }
}
