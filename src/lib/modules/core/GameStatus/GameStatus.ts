import { CreateGameStatusInput, InstanceId } from '../../../types';
import { ReturnModelType, modelOptions } from '@typegoose/typegoose';

import Instance from '../Instance';
import { ObjectType } from 'type-graphql';
import Status from '../Status/Status';
import { Utils } from '../../modules.utils';

/**
 * This class represents a GameStatus.
 * @extends Instance
 * @public
 * 
 */
@modelOptions(Utils.getDisciminatorModelOptions())
@ObjectType({ implements: [Instance, Status] })
export default class GameStatus extends Status implements Instance {
  public _id!: InstanceId;
  public id!: string;
  public value!: string;
  public get displayId() {
    return this.value;
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
  public static async createInstance(this: ReturnModelType<typeof GameStatus>, input: CreateGameStatusInput) {
    return this.create(input);
  }

  
}
