import { CardRankTests } from './CardRank/CardRank.test';
import { CardTests } from './Card/Card.test';
import { DeckTests } from './Deck/Deck.test';
import { GameConfigurationTests } from './GameConfiguration/GameConfiguration.test';
import { GameStatusTests } from './GameStatus/GameStatus.test';
import { SecurityDomainTests } from './SecurityDomain/SecurityDomain.test';
import { SuitTests } from './Suit/Suit.test';
import { UserTests } from './User/User.test';

describe('Core Modules', () => {

  describe('[Card Rank]', CardRankTests)
  describe('[Suit]', SuitTests)
  describe('[Card]', CardTests)
  describe('[Deck]', DeckTests)
  describe('[Game Configuration]', GameConfigurationTests)
  describe('[Game Status]', GameStatusTests)
  describe('[Security Domain]', SecurityDomainTests)
  describe('[User]', UserTests)

})