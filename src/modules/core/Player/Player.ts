import { prop as Property , Ref, defaultClasses, modelOptions as ModelOptions, plugin as Plugin } from '@typegoose/typegoose';
import { ObjectType, Field, Int, InterfaceType } from 'type-graphql';
import * as autopopulate from 'mongoose-autopopulate';
import Card from '../Card/Card';
import User from '../User/User';
import Game from '../Game/Game';
import ClassBase from '../ClassBase';
import { InstanceId } from '../../../types';

@ModelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    discriminatorKey: 'type'
  }
})
@Plugin(autopopulate)
@InterfaceType({implements: ClassBase})
export default class Player {
  
  public _id!: InstanceId
  
  @Property({ required: true })
  @Field()
  public displayId!: string

  @Property({ ref: 'User' })
  @Field(type => User)
  public user!: Ref<User>

  @Property()
  @Field(type => Int)
  public seatPosition?: Number

  @Property({ autopopulate: true, ref: 'Card' })
  @Field(type => [Card])
  public cards?: Ref<Card>[]

  @Property({ ref: 'Game', required: true })
  @Field(type => Game)
  public game!: Ref<Game>
}