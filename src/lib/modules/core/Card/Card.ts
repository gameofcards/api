import * as autopopulate from 'mongoose-autopopulate';

import { CreateCardInput, InstanceId } from '../../../types';
import { Field, ID, ObjectType } from 'type-graphql';
import { modelOptions as ModelOptions, plugin as Plugin, prop as Property, Ref, ReturnModelType } from '@typegoose/typegoose';

import CardRank from '../CardRank/CardRank';
import Instance from '../Instance';
import Suit from '../Suit/Suit';
import { Utils } from '../../modules.utils';

/**
 * This class represents a Card. The references to it's CardRank and Suit are
 * autopopulated, so we can set the GraphQL Field type to be the those classes
 * instead of IDs.
 * @extends Instance
 * @public
 * 
 */
@ModelOptions(Utils.getModelOptions())
@Plugin(autopopulate)
@ObjectType({ implements: Instance })
export default class Card implements Instance {
  public _id!: InstanceId;

  @Property({ required: true, unique: true, maxlength: 10 })
  @Field()
  public shortHand!: string;

  @Property({ autopopulate: true, ref: 'CardRank', required: true })
  @Field((type) => CardRank)
  public cardRank!: Ref<CardRank>;

  @Property({ autopopulate: true, ref: 'Suit', required: true })
  @Field((type) => Suit)
  public suit!: Ref<Suit>;

  public get displayId() {
    return this.shortHand;
  }

  /**
   * This method will create a card instance.
   * @param input Required parameters to create a card
   * @returns Promise<Card>
   * @public
   * @static
   * @async
   * 
   */
  public static async createInstance(this: ReturnModelType<typeof Card>, input: CreateCardInput): Promise<Card> {
    return this.create(input);
  }

  /**
   * Utility method to return a set of card documents using an array of document IDs
   * @param ids The IDs of cards to return.
   * @returns Promise<Card[]>
   * @public
   * @static
   * @async
   * 
   */
  public static async findManyByIds(this: ReturnModelType<typeof Card>, ids: InstanceId[]): Promise<Card[]> {
    return this.find({ _id: { $in: ids } });
  }
}
