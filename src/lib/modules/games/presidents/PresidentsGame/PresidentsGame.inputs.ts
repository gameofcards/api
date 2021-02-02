import { DocumentType, Ref } from '@typegoose/typegoose';
import { Field, ID, InputType, Int } from 'type-graphql';

import { ObjectId } from 'mongodb';
import { PresidentsGame } from '../PresidentsGame';
import { PresidentsTurn } from '../PresidentsTurn';
import { Role } from '../../../core/Role';
import { User } from '../../../core';

@InputType()
export class CreatePresidentsGameRequest {
  @Field()
  name: string;

  @Field()
  createdByUser: string;
}

@InputType()
export class CreatePresidentsGameInstance extends CreatePresidentsGameRequest {}

@InputType()
export class JoinPresidentsGameRequest {
  @Field()
  id: string;

  @Field()
  userId: string;
}

@InputType()
export class PresidentsGamePayload {
  @Field()
  game: PresidentsGame;
}

// For some reason an input with only one field is not an object in usage (no dot access)
@InputType()
export class IdRequest {
  @Field()
  id: string;
}

@InputType()
export class RoundEndTurnData {
  @Field()
  isRoundOver: boolean;

  @Field(type => PresidentsTurn)
  turn: PresidentsTurn;
}

@InputType()
export class StartPresidentsGameRequest extends IdRequest {}

@InputType()
export class RematchRequest extends IdRequest {}
