import *  as bcrypt from 'bcrypt';

import { CreateUserInput, CreateUserRequest, LoginRequest } from './User.input';
import { DocumentType, modelOptions as ModelOptions, prop as Property, Ref, ReturnModelType } from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql';
import { Role, RoleModel } from '../Role';
import { RoleNames, UserValidations } from './../../../types';
import { sign, verify } from 'jsonwebtoken';

import { Instance } from '../Instance';
import { ObjectId } from 'mongodb';
import Player from '../Player/Player';
import { UserError } from './errors';
import { Utils } from '../../modules.utils';
import { logger } from './../../../logger';

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
    let { password, ...rest } = input;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    password = password;
    const user = {
      password: hash,
      ...rest,
      role,

      token: sign({ ...input }, process.env.JWT_SECRET),

      playerRecords: [],
    };
    const instance = await this.createInstance(user);
    return instance;
  }


  /**
   * This public method for GraphQL.
   * @param input The required parameters to login a user (username, password).
   * @returns Promise<User>
   * @public
   * @static
   * @async
   * @automation User.test.ts #LoginUser
   */
  public static async LoginUser(this: ReturnModelType<typeof User>, input: LoginRequest) {
    const user = await this.findOne({ username: input.username });

    if (! user) {
      throw new UserError(UserValidations.UserDoesNotExist);
    }
    
    const isCorrect = await bcrypt.compare(input.password, user.password);
    if (!isCorrect) {
      throw new UserError(UserValidations.IncorrectPassword);
    }

    return user;
  }

  /**
   * This public method for GraphQL.
   * @param input The required parameters to login a user (username, password).
   * @returns Promise<User>
   * @public
   * @static
   * @async
   * @automation User.test.ts #LoginUser
   */
  public static async findByToken(this: ReturnModelType<typeof User>, token: string) {
    let decoded;

    try {
      decoded = verify(token, process.env.JWT_SECRET);
    }
    catch (err) {
      return Promise.reject(UserValidations.InvalidToken);
    }
    return this.findOne({token});
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
