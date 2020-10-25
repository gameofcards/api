import { Field, InputType, Int } from 'type-graphql';

import { Deck } from '..';

@InputType()
export class CreateGameConfigurationInput {
  @Field()
  name: string;

  @Field((type) => Int)
  maxPlayers: number;

  @Field((type) => Int)
  minPlayers: number;

  @Field((type) => Deck)
  deck: Deck;

  @Field((type) => Int)
  numDecks: number;
}