import { ObjectId } from "mongodb";
import { Resolver, Query, Arg } from 'type-graphql';
import { Status, StatusModel } from '.';
import { ObjectIdScalar } from "../../../types";

@Resolver(of => Status)
export default class StatusResolver {

  @Query(returns => Status)
  async status(@Arg('id', type => ObjectIdScalar) id: ObjectId) {
    return StatusModel.findById(id);
  }

  @Query(returns => [Status])
  async statuses(): Promise<Status[]> {
    return await StatusModel.find({});
  }

}