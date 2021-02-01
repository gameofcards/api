import { Field, ObjectType } from 'type-graphql';
import { modelOptions as ModelOptions, prop as Property, ReturnModelType } from '@typegoose/typegoose';

import { CardRank } from '../CardRank';
import { CreateCardInput } from './Card.input';
import { Instance } from '../Instance';
import { InstanceOperations } from '../InstanceOperations';
import { ObjectId } from 'mongodb';
import { Suit } from '../Suit';
import { Utils } from '../../modules.utils';

/**
 * This class represents a Card. The references to it's CardRank and Suit are
 * autopopulated, so we can set the GraphQL Field type to be the those classes
 * instead of IDs.
 * @extends Instance
 * @public
 */
@ModelOptions(Utils.getModelOptions())
@ObjectType({ implements: Instance })
export default class Card extends InstanceOperations implements Instance {
  public _id!: ObjectId;
  public id!: string;

  @Property({ required: true, maxlength: 20 })
  @Field()
  public shortHand!: string;

  @Property({ required: true, type: CardRank })
  @Field((type) => CardRank)
  public cardRank!: CardRank;

  @Property({ required: true, type: Suit })
  @Field((type) => Suit)
  public suit!: Suit;

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
   * @automation Card.test.ts #createCardRanks
   */
  public static async createInstance(this: ReturnModelType<typeof Card>, input: CreateCardInput): Promise<Card> {
    return this.create(input);
  }

  /**
   * This method will find a collection of cards by shortHands.
   * @param input Array of shortHands.
   * @returns Promise<Card>
   * @public
   * @static
   * @async
   * @automation Card.test.ts #findManyByShortHands
   */
  public static async findManyByShortHands(this: ReturnModelType<typeof Card>, input: string[]): Promise<Card[]> {
    return this.find({ shortHand: { $in: input } });
  }
}
