import {
  DocumentType,
  modelOptions as ModelOptions,
  plugin as Plugin,
  prop as Property,
  Ref,
  ReturnModelType,
} from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql';
import { Role, RoleModel } from '../Role';

import { CreateUserInput } from './User.input';
import {Instance} from '../Instance';
import { InstanceId } from '../../../types';
import Player from '../Player/Player';
import { Utils } from '../../modules.utils';

/**
 * This class represents a User.
 * @extends Instance
 * @public
 *
 */
@ModelOptions(Utils.getModelOptions())
@ObjectType({ implements: Instance })
export default class User implements Instance {
  public _id!: InstanceId;
  public id!: string;

  get displayId() {
    return this.displayName;
  }

  @Property({ required: true, unique: true, maxlength: 30 })
  @Field()
  public username!: string;

  @Property({ required: true, unique: true, maxlength: 50 })
  @Field()
  public email!: string;

  @Property({ required: true, maxlength: 30 })
  @Field()
  public displayName!: string;

  @Property({ required: true })
  @Field()
  public password!: string;

  @Property()
  @Field()
  public token?: string;

  @Property({ required: true, type: Role })
  @Field((type) => Role)
  public role!: Role;

  @Property({ ref: 'Player' })
  @Field((type) => [ID])
  public playerRecords!: Ref<Player>[];

  /**
   * This method will create a User.
   * @param input The required parameters to create a user.
   * @returns Promise<User>
   * @public
   * @static
   * @async
   * @automation User.test.ts #createInstance
   */
  public static async createInstance(this: ReturnModelType<typeof User>, input: CreateUserInput) {
    const user = {
      ...input,
      token: '',
      playerRecords: [],
    };
    const instance = await this.create(user);
    return instance;
  }

  /**
   * This method will add a Player instance to the User's playerRecords collection.
   * @param playerRecord The Player instance to add.
   * @returns Promise<User>
   * @public
   * @async
   * @automation User.test.ts #addPlayerRecord
   */
  public async addPlayerRecord(this: DocumentType<User>, playerRecord: Ref<Player>) {
    this.playerRecords.push(playerRecord);
    await this.save();
    return this;
  }
}
