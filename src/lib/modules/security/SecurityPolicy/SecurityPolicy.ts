import { Field, ID, ObjectType } from 'type-graphql';
import { Instance, Status } from '../../core';
import { modelOptions as ModelOptions, prop as Property, Ref, ReturnModelType } from '@typegoose/typegoose';

import { CreateSecurityPolicyInput } from './SecurityPolicy.input';
import { Domain } from '../Domain';
import { InstanceId } from '../../../types';
import { Permission } from '../Permission';
import { SecurityGroup } from '../SecurityGroup';
import { Utils } from '../../modules.utils';

/**
 * This class represents a Security Policy.
 * @extends Instance
 * @public
 *
 */
@ModelOptions(Utils.getModelOptions())
@ObjectType({ implements: Instance })
export default class SecurityPolicy implements Instance {
  public _id!: InstanceId;
  public id!: string;

  @Property({ required: true })
  @Field()
  public name!: string;
  
  @Property({ ref: 'SecurityGroup' })
  @Field((type) => ID)
  public securityGroup!: Ref<SecurityGroup>;

  @Property({ ref: 'Domain' })
  @Field((type) => ID)
  public domain!: Ref<Domain>;

  @Property({ type: Status })
  @Field((type) => Status)
  public status!: Status;

  @Property({ ref: 'Permission' })
  @Field((type) => [ID])
  public permissions!: Ref<Permission>[];

  get displayId() {
    return `${this.name}-${this.status.value}`;
  }

  /**
   * This method will create a SecurityPolicy instance.
   * @param input CreateSecurityPolicyInput
   * @returns Promise<SecurityPolicy>
   * @public
   * @static
   * @async
   * @automation 
   */
  public static async createInstance(this: ReturnModelType<typeof SecurityPolicy>, input: CreateSecurityPolicyInput) {
    return this.create(input);
  }
}
