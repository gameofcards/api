import { Field, InputType } from 'type-graphql';

import { Card } from '../';

@InputType()
export class CreateDeckInput {
  @Field()
  name: string;

  @Field((type) => [Card])
  cards: Card[];
}