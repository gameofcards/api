import * as autopopulate from 'mongoose-autopopulate';

import { Card, Game, User } from '../../../core';
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
import { InstanceId } from '../../../../types';
import Player from '../../../core/Player/Player';
import PoliticalRank from '../PoliticalRank/PoliticalRank';
import PresidentsGame from '../PresidentsGame/PresidentsGame';
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
export default class PresidentsPlayer extends Player {
  public _id!: InstanceId;

  @Property({ ref: 'PresidentsGame', required: true })
  @Field((type) => ID)
  public game!: Ref<PresidentsGame>;

  @Property()
  @Field()
  public wonTheGame?: boolean;

  @Property({ autopopulate: true, ref: 'PoliticalRank' })
  @Field((type) => PoliticalRank)
  public politicalRank!: Ref<PoliticalRank>;

  @Property({ autopopulate: true, ref: 'PoliticalRank' })
  @Field((type) => PoliticalRank)
  public nextGameRank!: Ref<PoliticalRank>;

  @Property({ required: true })
  @Field((type) => Int)
  public drinksDrunk!: number;

  @Property({ autopopulate: true, ref: 'DrinkRequest' })
  @Field((type) => [DrinkRequest])
  public drinkRequestsSent!: Ref<DrinkRequest>[];

  @Property({ autopopulate: true, ref: 'DrinkRequest' })
  @Field((type) => [DrinkRequest])
  public drinkRequestsReceived!: Ref<DrinkRequest>[];


  /**
   * This method will increment drinksDrink on the player instance.
   * @returns DocumentType<PresidentsPlayer>
   * @public
   * @async
   * 
   */
  public async drinkDrink(this: DocumentType<PresidentsPlayer>) {
    this.drinksDrunk += 1;
    await this.save();
    return this;
  }

  /**
   * This method will add a drinkRequest to the drinkRequestsSent collection on the player instance.
   * @param request The reqest to add.
   * @returns DocumentType<PresidentsPlayer>
   * @public
   * @async
   * 
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
   * 
   */
  public async addDrinkRequestReceived(
    this: DocumentType<PresidentsPlayer>,
    request: DocumentType<DrinkRequest>
  ) {
    this.drinkRequestsReceived.push(request);
    await this.save();
    return this;
  }

    /**
   * This method will add a drinkRequest to the drinkRequestsReceived collection on the player instance.
   * @param user The user who this player is for
   * @param game The game this player is in
   * @returns DocumentType<PresidentsPlayer>
   * @public
   * @async
   * @static
   * 
   */
  public static async createInstance(this: ReturnModelType<typeof PresidentsPlayer>, 
    user: DocumentType<User>, game: Ref<PresidentsGame>) {
    const displayId = '';
    const seatPosition = 0;
    const drinksDrunk = 0;
    const cards = [];
    const politicalRank = null;
    const nextGameRank = null;
    const drinkRequestsSent = [];
    const drinkRequestsReceived = [];
    const presidentsPlayer = {
      displayId,
      user,
      seatPosition,
      drinksDrunk,
      cards,
      game,
      politicalRank,
      nextGameRank,
      drinkRequestsSent,
      drinkRequestsReceived,
    };
    const instance = await this.create(presidentsPlayer);
    await user.addPlayerRecord(instance);
    await instance.save();
    return instance;
  }
}
