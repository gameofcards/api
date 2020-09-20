import { PresidentsDeckModel } from './games/presidents';
import { SuitModel, CardRankModel, CardModel, DeckModel, SecurityDomainModel } from './core';
import Suits from './core/Suit/Suit.data';
import CardRanks from './core/CardRank/CardRank.data';
import SecurityDomains from './core/SecurityDomain/SecurityDomain.data';
import Connection from '../db';
import { createGameConfigurations } from '../modules/core/GameConfiguration/GameConfiguration.spec'
import { createStandardDeck } from '../modules/core/Deck/Deck.spec'
import { createPresidentsDeck } from '../modules/games/presidents/PresidentsDeck/PresidentsDeck.spec'
import { createUsers } from '../modules/core/User/User.spec'

(async () => {
  await Connection.connect();
  console.log('[TEST] starting test');

  try {
    await createUsers()
  }
  catch (err) {
    console.log('[TEST] test failed.');
  }

  console.log('[TEST] test complete.')
  await Connection.disconnect();
})();