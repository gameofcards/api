import { ObjectId } from "mongodb";
import { InputType, Field, ID, Int } from 'type-graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class PresidentsGameInput {
  @Field()
  @MaxLength(30)
  name: string

  @Field(type => ID)
  config: ObjectId

  @Field(type => ID)
  createdByUser: ObjectId
}

@InputType()
export class JoinPresidentsGameInput {
  @Field(type => ID)
  id: ObjectId

  @Field(type => ID)
  userId: ObjectId
}

@InputType()
export class AddPresidentsTurnInput {
  @Field(type => ID)
  id: ObjectId

  @Field(type => ID)
  forPlayer: ObjectId

  @Field(type => [ID])
  cardsPlayed: ObjectId[]
  
  @Field()
  wasPassed: boolean
}

@InputType()
export class IdInput {
  @Field(type => ID)
  id: ObjectId
}