import {
  prop as Property,
  Ref,
  DocumentType,
  ReturnModelType,
  modelOptions as ModelOptions,
  plugin as Plugin,
} from '@typegoose/typegoose';
import { ObjectType, Field, Int } from 'type-graphql';
import * as autopopulate from 'mongoose-autopopulate';
import DrinkRequest from '../DrinkRequest/DrinkRequest';
import Player from '../../../core/Player/Player';
import PoliticalRank from '../PoliticalRank/PoliticalRank';
import PresidentsGame from '../PresidentsGame/PresidentsGame';
import { PresidentsPlayerModel } from '../';
import { User, Card, Game } from '../../../core';
import { InstanceId } from '../../../../types';
import ClassBase from '../../../core/ClassBase';

@ModelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
@Plugin(autopopulate)
@ObjectType({ implements: [ClassBase, Player] })
export default class PresidentsPlayer extends Player {
  public _id!: InstanceId;

  @Property({ ref: 'PresidentsGame', required: true })
  @Field((type) => PresidentsGame)
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
  @Field((type) => DrinkRequest)
  public drinkRequestsSent!: Ref<DrinkRequest>[];

  @Property({ autopopulate: true, ref: 'DrinkRequest' })
  @Field((type) => DrinkRequest)
  public drinkRequestsReceived!: Ref<DrinkRequest>[];

  public async drinkDrink(this: DocumentType<typeof PresidentsPlayer>) {
    this.drinksDrunk += 1;
    return await this.save();
  }

  public async addDrinkRequestSent(this: DocumentType<typeof PresidentsPlayer>, request: ReturnModelType<typeof DrinkRequest>) {
    this.drinkRequestsSent.push(request);
    return await this.save();
  }

  public async addDrinkRequestReceived(
    this: DocumentType<typeof PresidentsPlayer>,
    request: ReturnModelType<typeof DrinkRequest>
  ) {
    this.drinkRequestsReceived.push(request);
    return await this.save();
  }

  public static async createInstance(this: ReturnModelType<typeof PresidentsPlayer>, user: ReturnModelType<typeof User>) {
    const displayId = '';
    const seatPosition = 0;
    const cards = [];
    const politicalRank = null;
    const nextGameRank = null;
    const drinkRequestsSent = [];
    const drinkRequestsReceived = [];
    const presidentsPlayer = {
      displayId,
      user,
      seatPosition,
      cards,
      politicalRank,
      nextGameRank,
      drinkRequestsSent,
      drinkRequestsReceived,
    };
    const instance = new PresidentsPlayerModel(presidentsPlayer);
    await user.addPlayerRecord(instance);
    return await instance.save();
  }
}
