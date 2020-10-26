import { DocumentType, modelOptions as ModelOptions, prop as Property, Ref, ReturnModelType } from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql';
import { Instance, InstanceOperations } from '../../core';

import { CreateUITaskInput } from './UITask.input';
import { Domain } from '../Domain';
import { InstanceId } from '../../../types';
import { Utils } from '../../modules.utils';

/**
 * This class represents a UI Task.
 * @extends Instance
 * @public
 *
 */
@ModelOptions(Utils.getModelOptions())
@ObjectType({ implements: Instance })
export default class UITask extends InstanceOperations implements Instance {
  public _id!: InstanceId;
  public id!: string;

  @Property({ required: true })
  @Field()
  public name!: string;

  @Property({ required: true })
  @Field()
  public description!: string;

  @Property({ ref: 'Domain' })
  @Field((type) => ID)
  public domain?: Ref<Domain>;

  get displayId() {
    return `${this.name}`;
  }

  /**
   * This method will create a UITask instance.
   * @param input CreateUITaskInput.
   * @returns Promise<UITask>
   * @public
   * @static
   * @async
   * @automation UITask.test.ts #createSecurityDomains
   */
  public static async createInstance(this: ReturnModelType<typeof UITask>, input: CreateUITaskInput) {
    return this.create(input);
  }

  /**
   * Set the domain
   * @param domain DocumentType<UITask>
   * @returns
   * @public
   * @async
   */
  public async setDomain(this: DocumentType<UITask>, domain: Ref<Domain>) {
    this.domain = domain;
    await this.save();
    return this;
  }
}
