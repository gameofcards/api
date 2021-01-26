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

import { Instance } from '../../../core';
import { InstanceId } from '../../../../types';
import PresidentsPlayer from '../PresidentsPlayer/PresidentsPlayer';
import { PresidentsTurnInput } from './PresidentsTurn.input';
import { Utils } from '../../../modules.utils';
import { logger } from './../../../../logger';

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
   * @param input PresidentsTurnInput
   * @returns DocumentType<PresidentsTurn>
   * @public
   * @async
   * @static
   * @automation
   */
  public static async createInstance(this: ReturnModelType<typeof PresidentsTurn>, input: PresidentsTurnInput) {
    let { forPlayer, cardsPlayed, wasPassed, wasSkipped, didCauseSkips, skipsRemaining, endedRound } = input;

    const turn = {
      forPlayer,
      takenAt: Utils.getDate(),
      cardsPlayed,
      wasPassed,
      wasSkipped,
      didCauseSkips,
      skipsRemaining,
      endedRound,
    };

    const instance = await this.create(turn);
    return instance;
  }

  /**
   * This method will validate the cards submitted in a turn.
   * @param cardsPlayed Card[]
   * @returns Promise<boolean>
   * @public
   * @static
   * @async
   * @automation PresidentsTurn.test.ts #areCardsValid
   */
  public static areCardsValid(cards: Card[]) {
    const currentHandCardRankValues = cards.map((card) => card.cardRank.value);
    const rankValue = currentHandCardRankValues[0];
    const areCardsValid = currentHandCardRankValues.every((cardRankValue) => cardRankValue === rankValue);
    return areCardsValid;
  }

  /**
   * This method will determine if one set of cards beats another in a presidents
   * turn.
   * @param cardsPlayed Card[]
   * @returns Promise<boolean>
   * @public
   * @static
   * @automation PresidentsTurn.test.ts #areCardsBetter
   */
  public static areCardsBetter(cardsToBeat: Card[], cardsPlayed: Card[]) {
    const handToBeatCardRankValues = cardsToBeat.map((card) => card.cardRank.value);
    const currentHandCardRankValues = cardsPlayed.map((card) => card.cardRank.value);

    const doesContainTwo = !!currentHandCardRankValues.find((value) => value === 2);
    if (doesContainTwo) {
      return true;
    }

    const doesCurrentHandHaveMoreCards = currentHandCardRankValues.length > handToBeatCardRankValues.length;
    if (doesCurrentHandHaveMoreCards) {
      return true;
    }

    const areNumberOfCardsEqual = currentHandCardRankValues.length === handToBeatCardRankValues.length;
    if (areNumberOfCardsEqual) {
      const areCardsSameRank = currentHandCardRankValues[0] === handToBeatCardRankValues[0];
      if (areCardsSameRank) {
        return true;
      }
      const doesCurrentHandRankBeatPrevious = currentHandCardRankValues[0] > handToBeatCardRankValues[0];
      if (doesCurrentHandRankBeatPrevious) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
