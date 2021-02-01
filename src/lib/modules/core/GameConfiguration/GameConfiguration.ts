import { Field, Int, ObjectType } from 'type-graphql';
import { modelOptions as ModelOptions, prop as Property, ReturnModelType } from '@typegoose/typegoose';

import { CreateGameConfigurationInput } from './GameConfiguration.input';
import Deck from '../Deck/Deck';
import { Instance } from '../Instance';
import { ObjectId } from 'mongodb';
import { Utils } from '../../modules.utils';

/**
 * This class represents a Game Configuration. Games can use these to set various rules and configuration
 * details for their game.
 * @extends Instance
 * @public
 *
 */
@ModelOptions(Utils.getModelOptions())
@ObjectType({ implements: Instance })
export default class GameConfiguration implements Instance {
  public _id!: ObjectId;
  public id!: string;

  @Property({ required: true, maxlength: 30 })
  @Field()
  public name!: string;

  @Property({
    required: true,
    validate: {
      validator: function (maxPlayers) {
        return maxPlayers >= this.minPlayers;
      },
      message: 'A value for maxPlayers must be greater than or equal to minPlayers.',
    },
  })
  @Field((type) => Int)
  public maxPlayers!: number;

  @Property({
    required: true,
    validate: {
      validator: function (minPlayers) {
        return minPlayers <= this.maxPlayers;
      },
      message: 'A value for minPlayers must be less than or equal to maxPlayers.',
    },
  })
  @Field((type) => Int)
  public minPlayers!: number;

  @Property({ required: true, type: Deck })
  @Field((type) => Deck)
  public deck!: Deck;

  @Property({ required: true })
  @Field((type) => Int)
  public numDecks!: number;

  public get displayId() {
    return `${this.name} - decks (${this.numDecks}) - maxPlayers (${this.maxPlayers}) - minPlayers (${this.minPlayers})`;
  }

  /**
   * This method will create a GameConfiguration instance.
   * @param input The required parameters to create a GameConfiguration.
   * @returns Promise<GameConfiguration>
   * @public
   * @static
   * @async
   * @automation Desk.test.ts #createInstance
   */
  public static async createInstance(this: ReturnModelType<typeof GameConfiguration>, input: CreateGameConfigurationInput) {
    return this.create(input);
  }
}
