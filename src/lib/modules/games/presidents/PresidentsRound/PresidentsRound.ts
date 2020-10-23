import * as autopopulate from 'mongoose-autopopulate';

import {
  DocumentType,
  modelOptions as ModelOptions,
  plugin as Plugin,
  prop as Property,
  Ref,
  ReturnModelType,
  defaultClasses
} from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql';

import { CreatePresidentsRoundInput } from './../../../../types';
import Instance from '../../../core/Instance';
import { InstanceId } from '../../../../types';
import PresidentsGame from '../PresidentsGame/PresidentsGame';
import { PresidentsRoundModel } from '.';
import PresidentsTurn from '../PresidentsTurn/PresidentsTurn';
import { Utils } from '../../../modules.utils';

/**
 * This class represents a PresidentsRound.
 * @extends Instance
 * @public
 * 
 */
@ModelOptions(Utils.getModelOptions())
@Plugin(autopopulate)
@ObjectType({ implements: Instance })
export default class PresidentsRound implements Instance {
  public _id!: InstanceId;
  public id!: string;
  public get displayId() {
    return ''
  }

  @Property({ required: true })
  @Field()
  public number!: number;

  @Property({ required: true, default: Date.now })
  @Field()
  public startedAt!: Date;

  @Property({ ref: 'PresidentsGame' })
  @Field((type) => ID)
  public game!: InstanceId;

  @Property({ type: PresidentsTurn })
  @Field((type) => [PresidentsTurn])
  public turns!: PresidentsTurn[];

  /**
   * This method will increment PresidentsRound.
   * @param game The game the round is in.
   * @returns DocumentType<PresidentsRound>
   * @public
   * @async
   * @static
   * @automation PresidentsRound.test.ts #createInstance
   */
  public static async createInstance(this: ReturnModelType<typeof PresidentsRound>, input: CreatePresidentsRoundInput) {
    const round = {
      startedAt: Utils.getDate(),
      game: input.game,
      turns: [],
      number: input.number
    };
    return this.create(round);
  }
}
