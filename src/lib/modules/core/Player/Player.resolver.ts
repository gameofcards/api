import { ObjectId } from 'mongodb';
import { Resolver, Query, Arg } from 'type-graphql';
import { Player, PlayerModel } from '.';
import { ObjectIdScalar } from '../../../types';

@Resolver((of) => Player)
export default class PlayerResolver {
  @Query((returns) => Player)
  async player(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
    return PlayerModel.findById(id);
  }

  @Query((returns) => [Player])
  async players(): Promise<Player[]> {
    return await PlayerModel.find({});
  }
}
