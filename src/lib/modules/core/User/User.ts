import { CreateUserInput, CreateUserRequest } from './User.input';
import { DocumentType, modelOptions as ModelOptions, prop as Property, Ref, ReturnModelType } from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql';
import { Role, RoleModel } from '../Role';

import { Instance } from '../Instance';
import { ObjectId } from 'mongodb';
import Player from '../Player/Player';
import { RoleNames } from './../../../types';
import { Utils } from '../../modules.utils';
import { logger } from './../../../logger';
import {sign} from 'jsonwebtoken';

/**
 * This class represents a User.
 * @extends Instance
 * @public
 *
 */
@ModelOptions(Utils.getModelOptions())
@ObjectType({ implements: Instance })
export default class User implements Instance {
  public _id!: ObjectId;
  public id!: string;

  get displayId() {
    return this.displayName;
  }

  @Property({ required: true, unique: true })
  @Field()
  public username!: string;

  @Property({ required: true, unique: true })
  @Field()
  public email!: string;

  @Property({ required: true })
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
   * This public method for GraphQL.
   * @param input The required parameters to create a user.
   * @returns Promise<User>
   * @public
   * @static
   * @async
   * @automation User.test.ts #createInstance
   */
  public static async CreateUser(this: ReturnModelType<typeof User>, input: CreateUserRequest) {
    const role = await RoleModel.findOne({ name: RoleNames.User });
    const user = {
      ...input,
      role,
      token: sign({...input}, process.env.JWT_SECRET),
      playerRecords: [],
    };
    const instance = await this.createInstance(user);
    return instance;
  }

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
