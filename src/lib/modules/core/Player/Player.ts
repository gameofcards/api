import * as autopopulate from 'mongoose-autopopulate';

import { Field, ID, Int, InterfaceType, ObjectType } from 'type-graphql';
import { modelOptions as ModelOptions, plugin as Plugin, prop as Property, Ref, defaultClasses } from '@typegoose/typegoose';

import Card from '../Card/Card';
import Game from '../Game/Game';
import Instance from '../Instance';
import { InstanceId } from '../../../types';
import User from '../User/User';
import { Utils } from '../../modules.utils';

@ModelOptions(Utils.getDisciminatorModelOptions())
@Plugin(autopopulate)
@InterfaceType({ implements: [Instance] })
export default class Player implements Instance {
  public _id!: InstanceId;

  @Property({ required: true, maxlength: 20 })
  @Field()
  public displayId!: string;

  @Property({ ref: 'User' })
  @Field((type) => ID)
  public user!: Ref<User>;

  @Property()
  @Field((type) => Int)
  public seatPosition?: number;

  @Property({ autopopulate: true, ref: 'Card' })
  @Field((type) => [Card])
  public cards?: Ref<Card>[];

  @Property({ ref: 'Game', required: true })
  @Field((type) => ID)
  public game!: Ref<Game>;
}
