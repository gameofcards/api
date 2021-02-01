import { Card, Game, User } from '../../../core';
import { DocumentType, modelOptions as ModelOptions, prop as Property, Ref, ReturnModelType } from '@typegoose/typegoose';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import { Instance, UserModel } from '../../../core';

import { CreatePresidentsPlayerInput } from './PresidentsPlayer.input';
import DrinkRequest from '../DrinkRequest/DrinkRequest';
import { ObjectId } from 'mongodb';
import Player from '../../../core/Player/Player';
import PoliticalRank from '../PoliticalRank/PoliticalRank';
import { Utils } from '../../../modules.utils';

/**
 * This class represents a PresidentsPlayer.
 * @extends Player
 * @public
 *
 */
@ModelOptions(Utils.getDisciminatorModelOptions())
@ObjectType({ implements: [Instance, Player] })
export default class PresidentsPlayer extends Player implements Instance {
  public _id!: ObjectId;
  public id!: string;
  public gameDisplayId!: string;
  public user!: Ref<User>;
  public seatPosition!: number;
  public cards!: Card[];
  public get displayId() {
    return this.gameDisplayId;
  }
  
  // sus
  @Property({ required: true })
  @Field((type) => ID)
  public game!: ObjectId;

  @Property({ type: PoliticalRank })
  @Field((type) => PoliticalRank)
  public politicalRank?: PoliticalRank;

  @Property({ type: PoliticalRank })
  @Field((type) => PoliticalRank)
  public nextGameRank?: PoliticalRank;

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
    const { user, game, seatPosition, politicalRank } = input;
    const cards = [];
    const drinkRequestsSent = [];
    const drinkRequestsReceived = [];
    const userInstance = await UserModel.findById(user);
    const gameDisplayId = userInstance.username;
    const presidentsPlayer = {
      gameDisplayId,
      user,
      seatPosition,
      cards,
      game,
      drinkRequestsSent,
      drinkRequestsReceived,
      politicalRank
    };
    const instance = await this.create(presidentsPlayer);
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
  public async setPoliticalRank(this: DocumentType<PresidentsPlayer>, rank: PoliticalRank) {
    this.politicalRank = rank;
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
  public async getBetterCard(this: DocumentType<PresidentsPlayer>, otherCard: DocumentType<Card>) {
    return this.cards.find((card) => card.cardRank.value >= otherCard.cardRank.value);
  }
}
