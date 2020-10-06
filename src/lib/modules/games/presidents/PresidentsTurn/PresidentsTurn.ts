import * as autopopulate from 'mongoose-autopopulate';

import { Field, ID, Int, ObjectType } from 'type-graphql';
import {
  modelOptions as ModelOptions,
  plugin as Plugin,
  prop as Property,
  Ref,
  ReturnModelType,
  defaultClasses,
} from '@typegoose/typegoose';

import Card from '../../../core/Card/Card';
import Instance from '../../../core/Instance';
import { InstanceId } from '../../../../types';
import PresidentsPlayer from '../PresidentsPlayer/PresidentsPlayer';
import { PresidentsTurnInput } from '../../../../types';
import { Utils } from '../../../modules.utils';

/**
 * This class represents a PresidentsTurn.
 * @extends Instance
 * @public
 * 
 */
@ModelOptions(Utils.getModelOptions())
@Plugin(autopopulate)
@ObjectType({ implements: Instance })
export default class PresidentsTurn {
  public _id: InstanceId;

  @Property({ ref: 'PresidentsPlayer' })
  @Field((type) => ID)
  public forPlayer!: Ref<PresidentsPlayer>;

  @Property({ required: true, default: Utils.getDate() })
  @Field()
  public takenAt!: Date;

  @Property({ autopopulate: true, ref: 'Card' })
  @Field((type) => [Card])
  public cardsPlayed!: Ref<Card>[];

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
   * 
   */
  public static async createInstance(this: ReturnModelType<typeof PresidentsTurn>, input: PresidentsTurnInput) {
    let { forPlayer, cardsPlayed, wasPassed } = input;

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
