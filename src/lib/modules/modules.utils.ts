import { Types } from 'mongoose';

export class Utils {

  static getModelOptions() {
    return {
      schemaOptions: {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
      }
    }
  }

  static getDisciminatorModelOptions() {
    return {
      schemaOptions: {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        discriminatorKey: 'type',
      },
    }
  }

  static getDate() {
    return new Date();
  }

  static getObjectId() {
    return Types.ObjectId();
  }

  private static create2DArray(rows: number): any[] {
    let A = [];
    for (let i = 0; i < rows; i++) A[i] = [];
    return A;
  }

  static shuffle(arr: any[]) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  static deal(numPlayers: number, shuffled: any[]) {
    let dealtCards = Utils.create2DArray(numPlayers);
    let i = 0;
    while (shuffled.length > 0) {
      dealtCards[i].push(shuffled.pop());
      i = (i + 1) % numPlayers;
    }
    return dealtCards;
  }

  static sortCards(cards) {
    return cards.sort((a, b) => (a.cardRank.value > b.cardRank.value ? 1 : -1));
  }

  static find3Clubs(allPlayerHands) {
    let p = 0,
      c = 0;
    for (let player of allPlayerHands) {
      for (let card of player) {
        if (card.shortHand === '3Clubs') return p;
        c++;
      }
      p += 1;
      c = 0;
    }

    // should never reach here
    throw new Error('3 of Clubs was not in the deck.');
  }
}