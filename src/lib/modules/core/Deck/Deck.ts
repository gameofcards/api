import * as autopopulate from 'mongoose-autopopulate';

import { CreateDeckInput, InstanceId } from '../../../types';
import { Field, InterfaceType, ObjectType } from 'type-graphql';
import { modelOptions as ModelOptions, plugin as Plugin, prop as Property, Ref, ReturnModelType } from '@typegoose/typegoose';

import Card from '../Card/Card';
import Instance from '../Instance';
import { Utils } from '../../modules.utils';

@InterfaceType({ implements: [Instance] })
export class DeckInterface {
  public _id!: InstanceId;

  @Field()
  public name!: string;

  @Field((type) => [Card])
  public cards!: Ref<Card>[];
}

/**
 * This class represents a standard deck of 52 cards.
 * @extends Instance
 * @public
 * 
 */
@ModelOptions(Utils.getDisciminatorModelOptions())
@Plugin(autopopulate)
@ObjectType({ implements: [Instance, DeckInterface] })
export default class Deck implements Instance {

  public _id!: InstanceId;

  @Property({ required: true, unique: true, maxlength: 30 })
  @Field()
  public name!: string;

  @Property({ autopopulate: true, ref: 'Card' })
  @Field((type) => [Card])
  public cards!: Ref<Card>[];

  public get displayId() {
    return `${this.name}`;
  }

  /**
   * Utility method to return a Deck by name.
   * @param character The name of the Deck
   * @returns Promise<Deck>
   * @public
   * @static
   * @async
   * 
   */
  public static async createInstance(this: ReturnModelType<typeof Deck>, input: CreateDeckInput) {
    return this.create(input);
  }

  /**
   * Utility method to return a Deck by name.
   * @param character The name of the Deck
   * @returns Promise<Deck>
   * @public
   * @static
   * @async
   * 
   */
  public static async getByName(this: ReturnModelType<typeof Deck>, name: string) {
    return this.find({ name });
  }
}
