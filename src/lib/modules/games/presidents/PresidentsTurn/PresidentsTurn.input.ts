import { Field, ID, InputType, Int } from 'type-graphql';

import { Card } from '../../../core'
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
export class BuildPresidentsTurnInput {
  @Field((type) => ID)
  forPlayer!: Ref<PresidentsPlayer>;

  @Field()
  cardsPlayed!: string[];

  @Field()
  wasPassed!: boolean;
}

