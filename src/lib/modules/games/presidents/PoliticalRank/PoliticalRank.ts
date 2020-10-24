import { CreatePoliticalRankInput, InstanceId } from '../../../../types';
import { Field, Int, ObjectType } from 'type-graphql';
import {
  modelOptions as ModelOptions,
  plugin as Plugin,
  prop as Property,
  ReturnModelType,
  defaultClasses,
} from '@typegoose/typegoose';

import Instance from '../../../core/Instance';
import { Utils } from '../../../modules.utils';

/**
 * This class represents a PoliticalRank.
 * @extends Instance
 * @public
 *
 */
@ModelOptions(Utils.getModelOptions())
@ObjectType({ implements: Instance })
export default class PoliticalRank implements Instance {
  public _id!: InstanceId;
  public id!: string;
  public get displayId() {
    return this.name;
  }

  @Property({ required: true, maxlength: 50 })
  @Field()
  public name!: string;

  @Property({ required: true })
  @Field((type) => Int)
  public value!: number;

  /**
   * This method will create a PoliticalRank instance.
   * @param input Required parameters to create a PoliticalRank.
   * @returns Promise<PoliticalRank>
   * @public
   * @static
   * @async
   */
  public static async createInstance(this: ReturnModelType<typeof PoliticalRank>, input: CreatePoliticalRankInput) {
    return this.create(input);
  }

  /**
   * Utility method to get a set of ranks with value 0 -> howMany.
   * @param howMany How many ranks to get.
   * @returns Promise<PoliticalRank>
   * @public
   * @static
   * @async
   *
   */
  public static async getRanks(this: ReturnModelType<typeof PoliticalRank>, howMany: number) {
    return this.find({ value: { $gt: 0, $lt: howMany + 1 } });
  }
}
