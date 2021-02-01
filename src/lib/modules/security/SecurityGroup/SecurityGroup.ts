import { DocumentType, modelOptions as ModelOptions, prop as Property, Ref, ReturnModelType } from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql';
import { Instance, Role, Status } from '../../core';

import { CreateSecurityGroupInput } from './SecurityGroup.input';
import { ObjectId } from 'mongodb';
import { SecurityPolicy } from '../SecurityPolicy';
import { Utils } from '../../modules.utils';

/**
 * This class represents a Security Domain for a user. We'll use it to evaluate if the user has
 * clearance to see data or run operations in the application.
 * @extends Instance
 * @public
 *
 */
@ModelOptions(Utils.getModelOptions())
@ObjectType({ implements: Instance })
export default class SecurityGroup implements Instance {
  public _id!: ObjectId;
  public id!: string;

  @Property({ required: true, maxlength: 30 })
  @Field()
  public name!: string;

  @Property({ type: Status })
  @Field((type) => Status)
  public status!: Status;

  @Property({ type: Role })
  @Field((type) => Role)
  public role!: Role;

  @Property({ ref: 'SecurityPolicy' })
  @Field((type) => ID)
  public securityPolicy?: Ref<SecurityPolicy>;

  get displayId() {
    return `${this.name}-${this.status.value}`;
  }

  /**
   * This method will create a SecurityGroup instance.
   * @param input CreateSecurityGroupInput
   * @returns Promise<SecurityGroup>
   * @public
   * @static
   * @async
   * @automation SecurityDomain.test.ts #createSecurityDomains
   */
  public static async createInstance(this: ReturnModelType<typeof SecurityGroup>, input: CreateSecurityGroupInput) {
    return this.create(input);
  }

  /**
   * This method will set the Security Policy for the Security Group.
   * @param securityPolicy Ref<SecurityPolicy>
   * @returns Promise<SecurityGroup>
   * @public
   * @async
   * @automation
   */
  public async setSecurityPolicy(this: DocumentType<SecurityGroup>, securityPolicy: Ref<SecurityPolicy>) {
    this.securityPolicy = securityPolicy;
    this.save();
    return this;
  }
}
