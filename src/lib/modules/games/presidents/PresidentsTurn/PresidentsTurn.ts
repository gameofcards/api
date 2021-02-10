import { AddPresidentsTurnInput, GameDataForTurnValidation, PresidentsTurnInput } from './PresidentsTurn.input';
import { Card, CardModel } from '../../../core';
import {
  DocumentType,
  modelOptions as ModelOptions,
  plugin as Plugin,
  prop as Property,
  Ref,
  ReturnModelType,
  defaultClasses,
} from '@typegoose/typegoose';
import { Field, ID, Int, ObjectType } from 'type-graphql';

import { Instance } from '../../../core';
import { ObjectId } from 'mongodb';
import { PresidentsGame } from '../PresidentsGame';
import PresidentsPlayer from '../PresidentsPlayer/PresidentsPlayer';
import { PresidentsTurnError } from './errors';
import { PresidentsTurnValidations } from './../../../../types';
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
  public _id: ObjectId;
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

  /**
   * This method will calculate how many skips the cards would cause if they were played.
   * We can assume cardsPlayed are valid.
   * @param cardsPlayed Card[]
   * @returns number 0-4
   * @public
   * @async
   * @automation PresidentsTurn.test.ts #calculateSkips
   */
  public static calculateSkips(cardsToBeat: Card[] = [], cards: Card[]) {
    // first hand of the game there will be no handToBeat
    if (cardsToBeat.length === 0) {
      return 0;
    }
    // assume cards are valid and cards are better
    const handToBeatCardRankValue = cardsToBeat[0].cardRank.value;
    const cardRankValue = cards[0].cardRank.value;
    const areCardsOfSameRank = handToBeatCardRankValue === cardRankValue;
    if (areCardsOfSameRank) {
      if (cardsToBeat.length === cards.length) {
        return 1;
      } else {
        return 1 + cards.length - cardsToBeat.length;
      }
    }
    return 0;
  }

  /**
   * This method will validate the turn submitted.
   * @param turn PresidentsTurnInput
   * @returns Promise<boolean>
   * @public
   * @async
   * @automation PresidentsTurn.test.ts #isValidTurn
   */
  public static isValidTurn(
    this: ReturnModelType<typeof PresidentsTurn>,
    game: GameDataForTurnValidation,
    turn: AddPresidentsTurnInput
  ) {
    const isPlayersTurn = Utils.areIDsEqual(game.currentPlayer, turn.forPlayer);
    if (!isPlayersTurn) {
      throw new PresidentsTurnError(Utils.operationFailed(PresidentsTurnValidations.NotYourTurn));
    }
    if (turn.wasPassed) {
      return true;
    }
    const isPlayingCards = turn.cardsPlayed.length > 0;
    if (!isPlayingCards && !turn.wasPassed) {
      return false;
    }
    const areCardsValid = this.areCardsValid(turn.cardsPlayed);
    if (!areCardsValid) {
      throw new PresidentsTurnError(Utils.operationFailed(PresidentsTurnValidations.InvalidCards));
    }
    if (areCardsValid) {
      if (game.isFirstTurnOfTheGame) {
        const contains3Clubs = turn.cardsPlayed.find((card) => card.shortHand === '3Clubs');
        if (contains3Clubs) {
          return true;
        }
        throw new PresidentsTurnError(Utils.operationFailed(PresidentsTurnValidations.FirstTurn3Clubs));
      } 
      else if (game.isFirstTurnOfCurrentRound) {
        return true;
      }
      else if (game.cardsToBeat.length === 0) {
        return true;
      } else {
        const areCardsBetter = this.areCardsBetter(game.cardsToBeat, turn.cardsPlayed);
        if (areCardsBetter) {
          return true;
        } else {
          throw new PresidentsTurnError(Utils.operationFailed(PresidentsTurnValidations.CardsNotBetter));
        }
      }
    }
  }
}
