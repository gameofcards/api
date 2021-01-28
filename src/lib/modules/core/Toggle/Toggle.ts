import { Field, ObjectType } from 'type-graphql';
import { modelOptions as ModelOptions, prop as Property, Ref, ReturnModelType } from '@typegoose/typegoose';

import { ConfidenceLevels } from '../../../types';
import { CreateToggleInput } from './Toggle.input';
import { Instance } from '..';
import { InstanceId } from '../../../types';
import { Utils } from '../../modules.utils';

/**
 * This class represents a Toggle.
 * @extends Instance
 * @public
 *
 */
@ModelOptions(Utils.getModelOptions())
@ObjectType({ implements: Instance })
export default class Toggle implements Instance {
  public _id!: InstanceId;
  public id!: string;

  @Property({ required: true })
  @Field()
  public name!: string;

  @Property({ required: true })
  @Field()
  public description!: string;

  @Property({ required: true })
  @Field()
  public confidenceLevel!: ConfidenceLevels.Internal | ConfidenceLevels.Production;

  get displayId() {
    return `${this.name}-${this.confidenceLevel}`;
  }

  /**
   * This method will create a Toggle instance.
   * @param input CreateToggleInput.
   * @returns Promise<Toggle>
   * @public
   * @static
   * @async
   * @automation Toggle.test.ts #createToggles
   */
  public static async createInstance(this: ReturnModelType<typeof Toggle>, input: CreateToggleInput) {
    return this.create(input);
  }
}
