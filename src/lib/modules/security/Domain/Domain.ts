import { Field, ID, ObjectType } from 'type-graphql';
import { Instance, Status } from '../../core';
import { modelOptions as ModelOptions, prop as Property, Ref, ReturnModelType } from '@typegoose/typegoose';

import { CreateDomainInput } from './Domain.input';
import { InstanceId } from '../../../types';
import { UITask } from '../UITask';
import { Utils } from '../../modules.utils';

/**
 * This class represents a Domain.
 * @extends Instance
 * @public
 *
 */
@ModelOptions(Utils.getModelOptions())
@ObjectType({ implements: Instance })
export default class Domain implements Instance {
  public _id!: InstanceId;
  public id!: string;

  @Property({ required: true })
  @Field()
  public name!: string;

  @Property({ required: true, type: Status })
  @Field((type) => Status)
  public status!: Status;

  @Property({ ref: 'UITask' })
  @Field((type) => ID)
  public tasks?: Ref<UITask>[];

  get displayId() {
    return `${this.name}-${this.status.value}`;
  }

  /**
   * This method will create a Domain instance.
   * @param input CreateDomainInput.
   * @returns Promise<Domain>
   * @public
   * @static
   * @async
   * @automation Domain.test.ts #createDomains
   */
  public static async createInstance(this: ReturnModelType<typeof Domain>, input: CreateDomainInput) {
    return this.create(input);
  }
}
