import { ReturnModelType, modelOptions } from '@typegoose/typegoose';

import { CreateGameStatusInput } from './GameStatus.input';
import { Instance } from '../Instance';
import { ObjectId } from 'mongodb';
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
@ObjectType({ implements: [Instance] })
export default class GameStatus extends Status implements Instance {
  public _id!: ObjectId;
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
   * @automation GameStatus.test.ts #createInstance
   */
  public static async createInstance(this: ReturnModelType<typeof GameStatus>, input: CreateGameStatusInput) {
    return this.create(input);
  }
}
