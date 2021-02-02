import { Field, ID, InterfaceType } from 'type-graphql';
import { modelOptions as ModelOptions, prop as Property, Ref } from '@typegoose/typegoose';

import GameConfiguration from '../GameConfiguration/GameConfiguration';
import GameStatus from '../GameStatus/GameStatus';
import { Instance } from '../Instance';
import { ObjectId } from 'mongodb';
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
export default class Game implements Instance {
  public _id!: ObjectId;
  public id!: string;

  get displayId() {
    return this.name;
  }

  @Property({ required: true, unique: true })
  @Field()
  public name!: string;

  @Property({ required: true, default: Date.now })
  @Field()
  public createdAt!: Date;

  @Property()
  @Field({ nullable: true })
  public startedAt?: Date;

  @Property()
  @Field({ nullable: true })
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
}
