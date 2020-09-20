import { prop as Property, Ref, modelOptions as ModelOptions, plugin as Plugin } from '@typegoose/typegoose';
import { Field, InterfaceType } from 'type-graphql';
import * as autopopulate from 'mongoose-autopopulate';
import GameStatus from '../GameStatus/GameStatus';
import GameConfiguration from '../GameConfiguration/GameConfiguration';
import User from '../User/User';
import Player from '../Player/Player';
import { InstanceId } from '../../../types';
import ClassBase from '../ClassBase';

@ModelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    discriminatorKey: 'type'
  }
})
@InterfaceType({implements: ClassBase})
@Plugin(autopopulate)
export default class Game {
  
  public _id!: InstanceId
  
  @Property({ required: true, unique: true })
  @Field()
  public name!: String

  @Property({ required: true, default: Date.now })
  @Field()
  public createdAt!: Date

  @Property()
  @Field()
  public startedAt?: Date

  @Property()
  @Field()
  public finishedAt?: Date

  @Property({ autopopulate: true, ref: 'GameStatus' })
  @Field(type => GameStatus)
  public status!: Ref<GameStatus>

  @Property({ autopopulate: true, ref: 'GameConfiguration' })
  @Field(type => GameConfiguration)
  public config!: Ref<GameConfiguration>

  @Property({ required: true, ref: 'User' })
  @Field(type => User)
  public createdByUser!: Ref<User>

  @Property({ autopopulate: true, ref: 'Player' })
  @Field(type => Player)
  public currentPlayer?: Ref<Player>
}