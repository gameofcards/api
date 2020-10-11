import { CreateSecurityDomainInput, InstanceId } from '../../../types';
import { Field, Int, ObjectType } from 'type-graphql';
import { modelOptions as ModelOptions, prop as Property, ReturnModelType } from '@typegoose/typegoose';

import Instance from '../Instance';
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
export default class SecurityDomain implements Instance {
  public _id!: InstanceId;
  public id!: string;

  @Property({ required: true, maxlength: 30 })
  @Field()
  public name!: string;

  @Property({ required: true })
  @Field((type) => Int)
  public clearanceLevel!: number;

  get displayId() {
    return `${this.name}-${this.clearanceLevel}`;
  }

  /**
   * This method will create a GameStatus instance.
   * @param input The required parameters to create a GameStatus.
   * @returns Promise<GameStatus>
   * @public
   * @static
   * @async
   * 
   */
  public static async createInstance(this: ReturnModelType<typeof SecurityDomain>, input: CreateSecurityDomainInput) {
    return this.create(input);
  }
}
