import { Field, ObjectType } from 'type-graphql';
import { modelOptions as ModelOptions, prop as Property, ReturnModelType } from '@typegoose/typegoose';

import { CreateRoleInput } from './Role.input';
import { Instance } from '../Instance';
import { InstanceId } from '../../../types';
import { Utils } from '../../modules.utils';

/**
 * This class represents a Role that a user can have.
 * @extends Instance
 * @public
 */
@ModelOptions(Utils.getModelOptions())
@ObjectType({ implements: Instance })
export default class Role implements Instance {
  public _id!: InstanceId;
  public id!: string;

  get displayId() {
    return this.name;
  }

  @Property({ required: true, maxlength: 50 })
  @Field()
  public name!: string;

  /**
   * This method will create a Role.
   * @param input CreateRoleInput
   * @returns Promise<Role>
   * @public
   * @static
   * @async
   * @automation Role.test.ts #createInstance
   */
  public static async createInstance(this: ReturnModelType<typeof Role>, input: CreateRoleInput) {
    return this.create(input);
  }
}
