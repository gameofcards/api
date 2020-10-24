import * as autopopulate from 'mongoose-autopopulate';

import { CreateDrinkRequestInput, InstanceId } from '../../../../types';
import {
  DocumentType,
  modelOptions as ModelOptions,
  plugin as Plugin,
  prop as Property,
  Ref,
  ReturnModelType,
} from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql';

import { DrinkRequestModel } from '.';
import Instance from '../../../core/Instance';
import { ObjectId } from 'mongodb';
import PresidentsGame from '../PresidentsGame/PresidentsGame';
import PresidentsPlayer from '../PresidentsPlayer/PresidentsPlayer';
import { Utils } from '../../../modules.utils';

/**
 * This class represents a DrinkRequest. Players in Presidents can send a drink from
 * one player to another. This records who sent it and to whom.
 * @extends Instance
 * @public
 *
 */
@ModelOptions(Utils.getModelOptions())
@Plugin(autopopulate)
@ObjectType({ implements: Instance })
export default class DrinkRequest implements Instance {
  public _id!: InstanceId;
  public id!: string;
  public get displayId() {
    return '';
  }

  @Property({ required: true, ref: 'PresidentsPlayer' })
  @Field((type) => ID)
  public fromPlayer!: Ref<PresidentsPlayer>;

  @Property({ required: true, ref: 'PresidentsPlayer' })
  @Field((type) => ID)
  public toPlayer!: Ref<PresidentsPlayer>;

  @Property({})
  @Field((type) => ID)
  public game!: ObjectId;

  @Property({ required: true, default: Utils.getDate() })
  @Field()
  public sentAt!: Date;

  @Property({ required: true })
  @Field()
  public fulfilled!: boolean;

  @Property()
  @Field()
  public fulfilledAt?: Date;

  /**
   * This method will create a DrinkRequest instance.
   * @param input Required parameters to create a DrinkRequest.
   * @returns Promise<DrinkRequest>
   * @public
   * @static
   * @async
   */
  public static async createInstance(this: ReturnModelType<typeof DrinkRequest>, input: CreateDrinkRequestInput) {
    const drinkRequestInput = {
      fromPlayer: input.fromPlayer,
      toPlayer: input.toPlayer,
      game: input.game,
      sentAt: new Date(),
      fulfilled: false,
    };
    return this.create(drinkRequestInput);
  }

  /**
   * This method will create a card instance.
   * @param input Required parameters to create a card
   * @returns Promise<Card>
   * @public
   * @static
   * @async
   * @automation
   */
  public async fulfill(this: DocumentType<DrinkRequest>) {
    this.fulfilled = true;
    this.fulfilledAt = Utils.getDate();
    await this.save();
    return this;
  }
}
