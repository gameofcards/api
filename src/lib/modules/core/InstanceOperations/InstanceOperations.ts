import { ApplicationError } from '../../../app/errors';
import { InstanceId } from '../../../types';
import { ReturnModelType } from '@typegoose/typegoose';

/**
 * This abstract class defines some base methods, and all classes representing
 * documents should extend it. It extends InstanceData. So now we have a class with the 
 * base instance properties, and it's not abstract so we can define methods which
 * @extends InstanceData
 * @abstract
 * @public
 *
 */
export default class InstanceOperations {
  
  public static async createInstance(this: ReturnModelType<any>, input: any): Promise<any> {
    throw new ApplicationError(`Class Definition Error [${this.modelName}]: #createInstance() must be implemented`);
  }

  
  public static async findByChar(this: ReturnModelType<any>, character: string): Promise<any> {
    return this.findOne({ character });
  }

  /**
   * Utility method to return a set of instances by an array of InstanceIds.
   * @param ids The IDs of instances to return.
   * @returns Promise<any[]>
   * @public
   * @static
   * @async
   */
  public static async findManyByIds(this: ReturnModelType<any>, ids: InstanceId[]): Promise<any[]> {
    return this.find({ _id: { $in: ids } });
  }

  /**
   * Utility method to return an Instance by name.
   * @param name The name of the Instance
   * @returns Promise<Instance>
   * @public
   * @static
   * @async
   */
  public static async findByName(this: ReturnModelType<any>, name: string): Promise<any> {
    return this.findOne({ name });
  }

  /**
   * This method will find an Instance instance by value.
   * @param value The value of the Instance.
   * @returns Promise<Instance>
   * @public
   * @static
   * @async
   */
  public static async findByValue(this: ReturnModelType<any>, value: string): Promise<any> {
    return this.findOne({ value });
  }

  /**
   * Utility method to return a set of Instances by name, using an array of names.
   * @param names The names of the Instances to return.
   * @returns Promise<Instance[]>
   * @public
   * @static
   * @async
   */
  public static async findManyByNames(this: ReturnModelType<any>, names: string[]): Promise<any[]> {
    return this.find({ name: { $in: names } });
  }
}
