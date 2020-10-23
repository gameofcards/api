import * as autopopulate from 'mongoose-autopopulate';

import { DocumentType, modelOptions as ModelOptions, plugin as Plugin, prop as Property, Ref, ReturnModelType } from '@typegoose/typegoose';
import { Field, ID, Int, InterfaceType, ObjectType } from 'type-graphql';

import Card from '../Card/Card';
import Game from '../Game/Game';
import Instance from '../Instance';
import { InstanceId } from '../../../types';
import { ObjectId } from 'mongodb';
import User from '../User/User';
import { Utils } from '../../modules.utils';

@ModelOptions(Utils.getDisciminatorModelOptions())
@Plugin(autopopulate)
@InterfaceType({ implements: [Instance] })
export default class Player implements Instance {
  public _id!: InstanceId;
  public id!: string;
  public get displayId() {
    return ''
  }

  @Property({ required: true, maxlength: 20 })
  @Field()
  public gameDisplayId!: string;

  @Property({ ref: 'User' })
  @Field((type) => ID)
  public user!: Ref<User>;

  @Property()
  @Field((type) => Int)
  public seatPosition!: number;

  @Property({ type: Card })
  @Field((type) => [Card])
  public cards!: Card[];

  @Property({ required: true })
  @Field((type) => ID)
  public game!: ObjectId;

  public async setCards(this: DocumentType<Player>, cards: Card[]) {
    this.cards = cards;
    await this.save();
    return this;
  }

  /**
   * Utility method to return a set of player documents using an array of document IDs
   * @param ids The IDs of cards to return.
   * @returns Promise<Card[]>
   * @public
   * @static
   * @async
   */
  public static async findManyByIds(this: ReturnModelType<typeof Player>, ids: InstanceId[]): Promise<Player[]> {
    return this.find({ _id: { $in: ids } });
  }
}
