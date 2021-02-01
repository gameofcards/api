import { Card, Player } from '../../../core';
import { Field, ID, InputType, Int } from 'type-graphql';

import { PresidentsPlayer } from '../PresidentsPlayer';
import { Ref } from '@typegoose/typegoose';

@InputType()
export class AddPresidentsTurnRequest {
  @Field()
  id!: string;

  @Field()
  forPlayer!: string;

  @Field()
  cardsPlayed!: string[];

  @Field()
  wasPassed!: boolean;
}

@InputType()
export class AddPresidentsTurnInput {
  @Field((type) => ID)
  forPlayer!: Ref<PresidentsPlayer>;

  @Field((type) => [Card])
  cardsPlayed!: Card[];

  @Field()
  wasPassed!: boolean;
}

@InputType()
export class PresidentsTurnInput {
  @Field((type) => ID)
  forPlayer!: Ref<PresidentsPlayer>;

  @Field((type) => [Card])
  cardsPlayed!: Card[];

  @Field()
  wasPassed!: boolean;

  @Field()
  wasSkipped!: boolean;

  @Field()
  didCauseSkips!: boolean;

  @Field((type) => Int)
  skipsRemaining!: number;

  @Field()
  endedRound!: boolean;
}

@InputType()
export class GameDataForTurnValidation {
  @Field((type) => ID)
  currentPlayer!: Ref<PresidentsPlayer>;

  @Field()
  isFirstTurnOfTheGame!: boolean;

  @Field((type) => Int)
  isFirstTurnOfCurrentRound!: boolean;

  @Field((type) => [Card])
  cardsToBeat?: Card[];
}

@InputType()
export class BuildPresidentsTurnInput {
  @Field((type) => ID)
  forPlayer!: Ref<PresidentsPlayer>;

  @Field()
  cardsPlayed!: string[];

  @Field()
  wasPassed!: boolean;
}
