import { CreateCardRankInput, InstanceId } from '../../../types';
import { Field, Int, ObjectType } from 'type-graphql';
import { modelOptions as ModelOptions, prop as Property, ReturnModelType } from '@typegoose/typegoose';

import Instance from '../Instance';
import { Utils } from '../../modules.utils';

/**
 * This class represents the rank of a card.
 * Ranks: [2, 3, 4, 5, 6, 7, 8, 9, J, Q, K, A]
 * @extends Instance
 * @public
 * 
 */
@ModelOptions(Utils.getModelOptions())
@ObjectType({ implements: Instance })
export default class CardRank implements Instance {
  public _id!: InstanceId;

  @Property({ required: true, unique: true, maxlength: 10 })
  @Field()
  public name!: string;

  @Property({ required: true, unique: true, maxlength: 10 })
  @Field()
  public character!: string;

  @Property({ required: true, unique: true })
  @Field((type) => Int)
  public value!: number;

  get displayId() {
    return `${this.name}-${this.character}-${this.value}`;
  }

  /**
   * This method will create a CardRank instance.
   * @param input The required parameters to create a CardRank.
   * @returns Promise<CardRank>
   * @public
   * @static
   * @async
   * 
   */
  public static async createInstance(this: ReturnModelType<typeof CardRank>, input: CreateCardRankInput): Promise<CardRank> {
    return this.create(input);
  }

  /**
   * Utility method to return a CardRank instance by it's character.
   * @param character The character of the CardRank
   * @returns Promise<CardRank>
   * @public
   * @static
   * @async
   * 
   */
  public static async findByChar(this: ReturnModelType<typeof CardRank>, character: string): Promise<CardRank> {
    return this.findOne({ character });
  }
}
