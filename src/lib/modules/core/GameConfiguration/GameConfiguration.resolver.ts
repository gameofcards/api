import { ObjectId } from 'mongodb';
import { Resolver, Query, Arg } from 'type-graphql';
import { GameConfiguration, GameConfigurationModel } from '.';
import { ObjectIdScalar } from '../../../types';

@Resolver((of) => GameConfiguration)
export default class GameConfigurationResolver {
  @Query((returns) => GameConfiguration)
  async gameConfiguration(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
    return GameConfigurationModel.findById(id);
  }

  @Query((returns) => [GameConfiguration])
  async gameConfigurations(): Promise<GameConfiguration[]> {
    return GameConfigurationModel.find({});
  }
}
