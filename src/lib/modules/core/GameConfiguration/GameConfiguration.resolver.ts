import { RoleNames } from './../../../types';
import { ObjectId } from 'mongodb';
import { Resolver, Query, Arg, Authorized } from 'type-graphql';
import { GameConfiguration, GameConfigurationModel } from '.';
import { ObjectIdScalar } from '../../../types';

@Resolver((of) => GameConfiguration)
export default class GameConfigurationResolver {
  @Authorized([RoleNames.Administrator])
  @Query((returns) => GameConfiguration)
  async gameConfiguration(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
    return GameConfigurationModel.findById(id);
  }

  @Authorized([RoleNames.Administrator])
  @Query((returns) => [GameConfiguration])
  async gameConfigurations(): Promise<GameConfiguration[]> {
    return GameConfigurationModel.find({});
  }
}
