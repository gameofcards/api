import { RoleNames } from './../../../types';
import { ObjectId } from 'mongodb';
import { Resolver, Query, Arg, Authorized } from 'type-graphql';
import { GameStatus, GameStatusModel } from '.';
import { ObjectIdScalar } from '../../../types';

@Resolver((of) => GameStatus)
export default class GameStatusResolver {
  @Authorized([RoleNames.Administrator])
  @Query((returns) => GameStatus)
  async gameStatus(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
    return GameStatusModel.findById(id);
  }

  @Authorized([RoleNames.Administrator])
  @Query((returns) => [GameStatus])
  async gameStatuses(): Promise<GameStatus[]> {
    return await GameStatusModel.find({});
  }
}
