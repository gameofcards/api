import * as autopopulate from 'mongoose-autopopulate';

import { Card, Game, User } from '../../../core';
import { CreatePresidentsPlayerInput, InstanceId } from '../../../../types';
import {
  DocumentType,
  modelOptions as ModelOptions,
  plugin as Plugin,
  prop as Property,
  Ref,
  ReturnModelType,
} from '@typegoose/typegoose';
import { Field, ID, Int, ObjectType } from 'type-graphql';

import DrinkRequest from '../DrinkRequest/DrinkRequest';
import Instance from '../../../core/Instance';
import { ObjectId } from 'mongodb';
import Player from '../../../core/Player/Player';
import PoliticalRank from '../PoliticalRank/PoliticalRank';
import PresidentsGame from '../PresidentsGame/PresidentsGame';
import { UserModel } from '../../../core';
import { Utils } from '../../../modules.utils';

/**
 * This class represents a PresidentsPlayer.
 * @extends Player
 * @public
 *
 */
@ModelOptions(Utils.getDisciminatorModelOptions())
@Plugin(autopopulate)
@ObjectType({ implements: [Instance, Player] })
export default class PresidentsPlayer extends Player implements Instance {
  public _id!: InstanceId;
  public id!: string;
  public gameDisplayId!: string;
  public user!: Ref<User>;
  public seatPosition!: number;
  public cards!: Card[];
  public get displayId() {
    return '';
  }
  @Property({ required: true })
  @Field((type) => ID)
  public game!: ObjectId;

  @Property()
  @Field()
  public wonTheGame?: boolean;

  @Property({ type: PoliticalRank })
  @Field((type) => PoliticalRank)
  public politicalRank?: PoliticalRank;

  @Property({ type: PoliticalRank })
  @Field((type) => PoliticalRank)
  public nextGameRank?: PoliticalRank;

  @Property({ required: true })
  @Field((type) => Int)
  public drinksDrunk!: number;

  @Property({ type: DrinkRequest })
  @Field((type) => [DrinkRequest])
  public drinkRequestsSent!: DrinkRequest[];

  @Property({ type: DrinkRequest })
  @Field((type) => [DrinkRequest])
  public drinkRequestsReceived!: DrinkRequest[];

  /**
   * This method will add a drinkRequest to the drinkRequestsReceived collection on the player instance.
   * @param user The user who this player is for
   * @param game The game this player is in
   * @returns DocumentType<PresidentsPlayer>
   * @public
   * @async
   * @static
   * @automation PresidentsPlayer.test.ts #createInstance
   */
  public static async createInstance(this: ReturnModelType<typeof PresidentsPlayer>, input: CreatePresidentsPlayerInput) {
    const { user, game, seatPosition } = input;
    const gameDisplayId = 'id';
    const drinksDrunk = 0;
    const cards = [];
    const drinkRequestsSent = [];
    const drinkRequestsReceived = [];
    const presidentsPlayer = {
      gameDisplayId,
      user,
      seatPosition,
      drinksDrunk,
      cards,
      game,
      drinkRequestsSent,
      drinkRequestsReceived,
    };
    const instance = await this.create(presidentsPlayer);
    const userInstance = await UserModel.findById(user);
    await userInstance.addPlayerRecord(instance);
    return instance;
  }

  /**
   * This method will increment drinksDrink on the player instance.
   * @returns DocumentType<PresidentsPlayer>
   * @public
   * @async
   * @automation PresidentsPlayer.test.ts #drinkDrink
   */
  public async drinkDrink(this: DocumentType<PresidentsPlayer>) {
    this.drinksDrunk += 1;
    await this.save();
    return this;
  }

  /**
   * This method will set the cards on the player instance.
   * @returns DocumentType<PresidentsPlayer>
   * @public
   * @async
   * @automation PresidentsPlayer.test.ts #setCards
   */
  public async setCards(this: DocumentType<PresidentsPlayer>, cards: Card[]) {
    this.cards = cards;
    await this.save();
    return this;
  }

  /**
   * This method will add a drinkRequest to the drinkRequestsSent collection on the player instance.
   * @param request The reqest to add.
   * @returns DocumentType<PresidentsPlayer>
   * @public
   * @async
   * @automation PresidentsPlayer.test.ts #addDrinkRequestSent
   */
  public async addDrinkRequestSent(this: DocumentType<PresidentsPlayer>, request: DocumentType<DrinkRequest>) {
    this.drinkRequestsSent.push(request);
    await this.save();
    return this;
  }

  /**
   * This method will add a drinkRequest to the drinkRequestsReceived collection on the player instance.
   * @param request The request to add.
   * @returns DocumentType<PresidentsPlayer>
   * @public
   * @async
   * @automation PresidentsPlayer.test.ts #addDrinkRequestReceived
   */
  public async addDrinkRequestReceived(this: DocumentType<PresidentsPlayer>, request: DocumentType<DrinkRequest>) {
    this.drinkRequestsReceived.push(request);
    await this.save();
    return this;
  }
}
