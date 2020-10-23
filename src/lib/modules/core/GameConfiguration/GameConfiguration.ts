import * as autopopulate from 'mongoose-autopopulate';

import { CreateGameConfigurationInput, InstanceId } from '../../../types';
import { Field, Int, ObjectType } from 'type-graphql';
import {
  modelOptions as ModelOptions,
  plugin as Plugin,
  prop as Property,
  Ref,
  ReturnModelType,
  defaultClasses,
} from '@typegoose/typegoose';

import Deck from '../Deck/Deck';
import Instance from '../Instance';
import { Utils } from '../../modules.utils';

/**
 * This class represents a Game Configuration. Games can use these to set various rules and configuration
 * details for their game.
 * @extends Instance
 * @public
 * 
 */
@ModelOptions(Utils.getModelOptions())
@Plugin(autopopulate)
@ObjectType({ implements: Instance })
export default class GameConfiguration implements Instance {
  public _id!: InstanceId;
  public id!: string;

  @Property({ required: true, maxlength: 30 })
  @Field()
  public name!: string;

  @Property({ 
    required: true,
    validate: {
      validator: function(maxPlayers) {
        return maxPlayers >= this.minPlayers;
      },
      message: 'A value for maxPlayers must be greater than or equal to minPlayers.'
    }
   })
  @Field((type) => Int)
  public maxPlayers!: number;

  @Property({ 
    required: true,
    validate: {
      validator: function(minPlayers) {
        return minPlayers <= this.maxPlayers;
      },
      message: 'A value for minPlayers must be less than or equal to maxPlayers.'
    }
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

  /**
   * Utility method to return a GameConfiguration by name.
   * @param name The name of the GameConfiguration
   * @returns Promise<GameConfiguration>
   * @public
   * @static
   * @async
   */
  public static async findByName(this: ReturnModelType<typeof GameConfiguration>, name: string) {
    return this.findOne({ name });
  }
}
