import { CardModel, UserModel } from '../../../core';

import { BuildPresidentsTurnInput } from '../PresidentsTurn/PresidentsTurn.input';
import { PresidentsGameModel } from '..';
import { Utils } from '../../../modules.utils';

type Username = string;

interface TestGameConfig {
  createdByUser: Username;
  usersToAdd: Username[];
  takeFirstTurn?: boolean;
  skipFirstRound?: boolean;
}

export class PresidentsGameBuilder {
  /** This method will return two decks of cards that are balanced.
   *
   *  @returns Promise<DocumentType<Card>[]>
   *  @public
   *  @static
   *  @async
   */
  public static async getTestCardHands() {
    const A = await CardModel.findManyByShortHands([
      '2Clubs',
      '3Clubs',
      '4Clubs',
      '5Clubs',
      '6Clubs',
      '7Clubs',
      '8Clubs',
      '9Clubs',
      '10Clubs',
      'JClubs',
      'QClubs',
      'KClubs',
      'AClubs',
      '2Hearts',
      '3Hearts',
      '4Hearts',
      '5Hearts',
      '6Hearts',
      '7Hearts',
      '8Hearts',
      '9Hearts',
      '10Hearts',
      'JHearts',
      'QHearts',
      'KHearts',
      'AHearts',
    ]);
    const B = await CardModel.findManyByShortHands([
      '2Diamonds',
      '3Diamonds',
      '4Diamonds',
      '5Diamonds',
      '6Diamonds',
      '7Diamonds',
      '8Diamonds',
      '9Diamonds',
      '10Diamonds',
      'JDiamonds',
      'QDiamonds',
      'KDiamonds',
      'ADiamonds',
      '2Spades',
      '3Spades',
      '4Spades',
      '5Spades',
      '6Spades',
      '7Spades',
      '8Spades',
      '9Spades',
      '10Spades',
      'JSpades',
      'QSpades',
      'KSpades',
      'ASpades',
    ]);
    return [A, B];
  }

  private static async initializeTheGame(config: TestGameConfig) {
    const createdByUser = await UserModel.findOne({ username: config.createdByUser });

    let game = await PresidentsGameModel.CreateGameAndAddPlayer({
      name: `${Utils.getObjectId()}`,
      createdByUser: createdByUser.id,
    });

    for (let username of config.usersToAdd) {
      const user = await UserModel.findOne({ username });
      game = await PresidentsGameModel.JoinGame({
        id: game.id,
        userId: user.id,
      });
    }

    game = await PresidentsGameModel.StartGame(game.id);

    return game;
  }

  /** This method will build a Presidents Game instance.
   *  1. Create the game
   *  2. Add the user as a player
   *  3. Add any other usernames as players
   *  4. Start the game
   *  5. Optionally take the first turn
   *  5. Optionally skip the first round
   *
   *  @param config: TestGameConfig
   *  @returns Promise<DocumentType<PresidentsGame>>
   *  @public
   *  @static
   *  @async
   */
  public static async build(config: TestGameConfig) {
    let game = await PresidentsGameBuilder.initializeTheGame(config);

    if (config.usersToAdd.length === 1) {
      // override the cards to be evenly balanced
      const [A, B] = await PresidentsGameBuilder.getTestCardHands();
      // The stack of cards A has the 3 of clubs
      if (game.players[0]._id === game.currentPlayer) {
        game.players[0].cards = A;
        game.players[1].cards = B;
      } else {
        game.players[0].cards = B;
        game.players[1].cards = A;
      }
    }

    if (config.takeFirstTurn) {
      const turnId = Utils.getObjectId();
      const cardsPlayed = await CardModel.findManyByShortHands(['3Clubs']);
      const turnToBeat = {
        _id: turnId,
        id: `${turnId}`,
        forPlayer: game.players.find((player) => player._id === game.currentPlayer)._id,
        takenAt: Utils.getDate(),
        cardsPlayed,
        wasPassed: false,
        wasSkipped: false,
        didCauseSkips: false,
        skipsRemaining: 0,
        endedRound: false,
        displayId: '',
      };
      game.turnToBeat = turnToBeat;
      game.rounds[0].turns.push(turnToBeat);
      game.currentPlayer = game.getNextPlayerId();
    }

    if (config.skipFirstRound) {
      game = await game.initializeNextRound();
    }

    return game;
  }
}
