import { Card, CardModel } from '../../../core';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import {
  modelOptions as ModelOptions,
  plugin as Plugin,
  prop as Property,
  Ref,
  ReturnModelType,
  defaultClasses,
} from '@typegoose/typegoose';

import {Instance} from '../../../core';
import { InstanceId } from '../../../../types';
import PresidentsPlayer from '../PresidentsPlayer/PresidentsPlayer';
import { PresidentsTurnInput } from './PresidentsTurn.input';
import { Utils } from '../../../modules.utils';

/**
 * This class represents a PresidentsTurn.
 * @extends Instance
 * @public
 *
 */
@ModelOptions(Utils.getModelOptions())
@ObjectType({ implements: [Instance] })
export default class PresidentsTurn implements Instance {
  public _id: InstanceId;
  public id!: string;
  public get displayId() {
    return `${this.id}-${this.forPlayer}`;
  }

  @Property({ ref: 'PresidentsPlayer' })
  @Field((type) => ID)
  public forPlayer!: Ref<PresidentsPlayer>;

  @Property({ required: true, default: Utils.getDate() })
  @Field()
  public takenAt!: Date;

  @Property({ type: Card })
  @Field((type) => [Card])
  public cardsPlayed!: Card[];

  @Property({ required: true })
  @Field()
  public wasPassed!: boolean;

  @Property({ required: true })
  @Field()
  public wasSkipped!: boolean;

  @Property({ required: true })
  @Field()
  public didCauseSkips!: boolean;

  @Property({ required: true })
  @Field((type) => Int)
  public skipsRemaining!: number;

  @Property({ required: true })
  @Field()
  public endedRound!: boolean;

  /**
   * This method will create a PresidentsTurn instance.
   * @param input The required parameters to create a PresidentsTurn instance.
   * @returns DocumentType<PresidentsTurn>
   * @public
   * @async
   * @static
   * @automation
   */
  public static async createInstance(this: ReturnModelType<typeof PresidentsTurn>, input: PresidentsTurnInput) {
    let { forPlayer, wasPassed } = input;

    const cardsPlayed = await CardModel.findManyByIds(input.cardsPlayed);

    const turn = {
      forPlayer,
      takenAt: Utils.getDate(),
      cardsPlayed,
      wasPassed,
      wasSkipped: false,
      didCauseSkips: false,
      skipsRemaining: 0,
      endedRound: false,
    };

    const instance = await this.create(turn);
    return instance;
  }
}
