import { Field, Int, ObjectType } from 'type-graphql';
import { modelOptions as ModelOptions, prop as Property, ReturnModelType } from '@typegoose/typegoose';

import { CreateSuitInput } from './Suit.input';
import { Instance } from '../Instance';
import { ObjectId } from 'mongodb';
import { Utils } from '../../modules.utils';

/**
 * This class represents a Suit.
 * @extends Instance
 * @public
 *
 */
@ModelOptions(Utils.getModelOptions())
@ObjectType({ implements: Instance })
export default class Suit implements Instance {
  public _id!: ObjectId;
  public id!: string;

  @Property({ required: true, maxlength: 10 })
  @Field()
  public name!: string;

  @Property({ required: true, maxlength: 10 })
  @Field()
  public character!: string;

  @Property({ required: true })
  @Field((type) => Int)
  public value!: number;

  @Property({ required: true, maxlength: 20 })
  @Field()
  public color!: string;

  get displayId() {
    return `${this.name}-${this.character}-${this.value}-${this.color}`;
  }

  /**
   * Utility method to create a Suit.
   * @param input The required parameters to create a Suit.
   * @returns Promise<Suit>
   * @public
   * @static
   * @async
   * @automation Suit.test.ts #createInstance
   */
  public static async createInstance(this: ReturnModelType<typeof Suit>, input: CreateSuitInput) {
    return this.create(input);
  }

  /**
   * Utility method to find a Suit by name.
   * @param name The name of the Suit.
   * @returns Promise<Suit>
   * @public
   * @static
   * @async
   */
  public static async findByName(this: ReturnModelType<typeof Suit>, name: string) {
    return this.findOne({ name });
  }
}
