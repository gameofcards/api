import * as autopopulate from 'mongoose-autopopulate';

import { Field, ID, InterfaceType } from 'type-graphql';
import { modelOptions as ModelOptions, plugin as Plugin, prop as Property, Ref } from '@typegoose/typegoose';

import GameConfiguration from '../GameConfiguration/GameConfiguration';
import GameStatus from '../GameStatus/GameStatus';
import Instance from '../Instance';
import { InstanceId } from '../../../types';
import Player from '../Player/Player';
import User from '../User/User';
import { Utils } from '../../modules.utils';

/**
 * This class represents a Game.
 * @extends Instance
 * @public
 *
 */
@ModelOptions(Utils.getDisciminatorModelOptions())
@InterfaceType({ implements: Instance })
@Plugin(autopopulate)
export default class Game implements Instance {
  public _id!: InstanceId;
  public id!: string;

  get displayId() {
    return this.name;
  }

  @Property({ required: true, unique: true, maxlength: 30 })
  @Field()
  public name!: string;

  @Property({ required: true, default: Date.now })
  @Field()
  public createdAt!: Date;

  @Property()
  @Field()
  public startedAt?: Date;

  @Property()
  @Field()
  public finishedAt?: Date;

  @Property({ required: true, type: GameStatus })
  @Field((type) => GameStatus)
  public status!: GameStatus;

  @Property({ required: true, type: GameConfiguration })
  @Field((type) => GameConfiguration)
  public config!: GameConfiguration;

  @Property({ required: true, ref: 'User' })
  @Field((type) => ID)
  public createdByUser!: Ref<User>;

  @Property({ ref: 'Player' })
  @Field((type) => ID)
  public currentPlayer?: Ref<Player>;
}
