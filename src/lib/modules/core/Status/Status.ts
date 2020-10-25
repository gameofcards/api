import { Field, InterfaceType, ObjectType } from 'type-graphql';
import { modelOptions as ModelOptions, prop as Property, ReturnModelType, defaultClasses } from '@typegoose/typegoose';

import { CreateStatusInput } from './Status.input';
import {Instance} from '../Instance';
import { InstanceId } from '../../../types';
import {InstanceOperations} from '../InstanceOperations';
import { Utils } from '../../modules.utils';

/**
 * This class is an interface we can implement other Status types with
 * for GraphQL types.
 * @extends Instance
 * @public
 *
 */
@InterfaceType({ implements: [Instance] })
export class StatusInterface {
  public _id!: InstanceId;
  public id!: string;

  @Field()
  public value!: string;
}

/**
 * This class represents a Status.
 * @extends Instance
 * @public
 *
 */
@ModelOptions(Utils.getModelOptions())
@ObjectType({ implements: [Instance, StatusInterface] })
export default class Status extends InstanceOperations implements Instance {
  public _id!: InstanceId;
  public id!: string;

  @Property({ required: true, uppercase: true, maxlength: 30 })
  @Field()
  public value!: string;

  get displayId() {
    return this.value;
  }

  /**
   * This method will create a Role.
   * @param input CreateRoleInput
   * @returns Promise<RUle>
   * @public
   * @static
   * @async
   * @automation Role.test.ts #createInstance
   */
  public static async createInstance(this: ReturnModelType<typeof Status>, input: CreateStatusInput) {
    return this.create(input);
  }
}
