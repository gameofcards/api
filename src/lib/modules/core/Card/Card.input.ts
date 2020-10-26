import { CardRank, Suit } from '../';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateCardInput {
  @Field()
  shortHand: string;

  @Field()
  character: string;

  @Field((type) => CardRank)
  cardRank: CardRank;

  @Field((type) => Suit)
  suit: Suit;
}
