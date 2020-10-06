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
@ObjectType({ implements: Instance })
export default class PresidentsRound {
  public _id!: InstanceId;

  @Property({ required: true, default: Date.now })
  @Field()
  public startedAt!: Date;

  @Property({ ref: 'PresidentsGame' })
  @Field((type) => ID)
  public game!: Ref<PresidentsGame>;

  @Property({ autopopulate: true, ref: 'PresidentsTurn' })
  @Field((type) => [PresidentsTurn])
  public turns!: Ref<PresidentsTurn>[];

  /**
   * This method will increment PresidentsRound.
   * @param game The game the round is in.
   * @returns DocumentType<PresidentsRound>
   * @public
   * @async
   * @static
   * 
   */
  public static async createInstance(this: ReturnModelType<typeof PresidentsRound>, game: DocumentType<PresidentsGame>) {
    const round = {
      startedAt: Utils.getDate(),
      game,
      turns: [],
    };
    return this.create(round);
  }
}
