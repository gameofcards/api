import {
  prop as Property,
  defaultClasses,
  Ref,
  ReturnModelType,
  modelOptions as ModelOptions,
  plugin as Plugin,
} from '@typegoose/typegoose';
import { ObjectType, Field, Int } from 'type-graphql';
import * as autopopulate from 'mongoose-autopopulate';
import Deck from '../Deck/Deck';
import { InstanceId } from '../../../types';
import ClassBase from '../ClassBase';

@ModelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
@Plugin(autopopulate)
@ObjectType({ implements: ClassBase })
export default class GameConfiguration {
  public _id!: InstanceId;

  @Property({ required: true, unique: true })
  @Field()
  public name!: String;

  @Property({ required: true })
  @Field((type) => Int)
  public maxPlayers!: Number;

  @Property({ required: true })
  @Field((type) => Int)
  public minPlayers!: Number;

  @Property({ autopopulate: true, ref: 'Deck' })
  @Field((type) => Deck)
  public deck!: Ref<Deck>;

  @Property({ required: true })
  @Field((type) => Int)
  public numDecks!: Number;

  public get displayId() {
    return `${this.name} - decks (${this.numDecks}) - maxPlayers (${this.maxPlayers}) - minPlayers (${this.minPlayers})`;
  }

  public static async findByName(this: ReturnModelType<typeof GameConfiguration>, name: string) {
    return this.findOne({ name });
  }
}
