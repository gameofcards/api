import { Field, Int, ObjectType } from 'type-graphql';
import { modelOptions as ModelOptions, prop as Property, ReturnModelType } from '@typegoose/typegoose';

import { CreatePoliticalRankInput } from './PoliticalRank.input';
import { Instance } from '../../../core';
import { ObjectId } from 'mongodb';
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
  public _id!: ObjectId;
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
}
