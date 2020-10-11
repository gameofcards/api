import { Field, InterfaceType } from 'type-graphql';
import { modelOptions as ModelOptions, prop as Property, ReturnModelType, defaultClasses } from '@typegoose/typegoose';

import Instance from '../Instance';
import { InstanceId } from '../../../types';
import { Utils } from '../../modules.utils';

/**
 * This class represents a Status.
 * @extends Instance
 * @public
 * 
 */
@ModelOptions(Utils.getDisciminatorModelOptions())
@InterfaceType({ implements: Instance })
export default class Status implements Instance {
  public _id!: InstanceId;
  public id!: string;

  @Property({ required: true, uppercase: true, maxlength: 30 })
  @Field()
  public value!: string;

  get displayId() {
    return this.value;
  }

   /**
   * This method will find a Status instance by value.
   * @param value The value of the Status.
   * @returns Promise<Status>
   * @public
   * @static
   * @async
   * 
   */
  public static async findByValue(this: ReturnModelType<typeof Status>, value: string) {
    return this.findOne({ value });
  }
}
