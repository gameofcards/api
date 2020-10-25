import { Field, ID, InterfaceType, ObjectType } from 'type-graphql';
import { modelOptions as ModelOptions, plugin as Plugin, prop as Property, Ref, ReturnModelType } from '@typegoose/typegoose';

import CardRank from '../CardRank/CardRank';
import { CreateCardInput } from './Card.input';
import {Instance} from '../Instance';
import { InstanceId } from '../../../types';
import {InstanceOperations} from '../InstanceOperations';
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
@ObjectType({ implements: Instance })
export default class Card extends InstanceOperations implements Instance  {
  public _id!: InstanceId;
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
}
