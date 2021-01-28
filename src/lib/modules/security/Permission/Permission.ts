import { Field, ID, ObjectType } from 'type-graphql';
import { Instance, Status } from '../../core';
import { modelOptions as ModelOptions, prop as Property, Ref, ReturnModelType } from '@typegoose/typegoose';

import { CreatePermissionInput } from './Permission.input';
import { InstanceId } from '../../../types';
import { PermissionNamesEnum } from './../../../types';
import { SecurityGroup } from '../SecurityGroup';
import { UITask } from '../UITask';
import { Utils } from '../../modules.utils';

/**
 * This class represents a Security Domain for a user. We'll use it to evaluate if the user has
 * clearance to see data or run operations in the application.
 * @extends Instance
 * @public
 *
 */
@ModelOptions(Utils.getModelOptions())
@ObjectType({ implements: Instance })
export default class Permission implements Instance {
  public _id!: InstanceId;
  public id!: string;

  @Property({ required: true })
  @Field()
  public name!: string;

  @Property({ ref: 'SecurityGroup' })
  @Field((type) => ID)
  public securityGroup?: Ref<SecurityGroup>;

  @Property({ type: Status })
  @Field((type) => Status)
  public status!: Status;

  @Property({ ref: 'UITask' })
  @Field((type) => ID)
  public task: Ref<UITask>;

  get displayId() {
    return `${this.name}-${this.status.value}`;
  }

  /**
   * This method will create a GameStatus instance.
   * @param input The required parameters to create a GameStatus.
   * @returns Promise<GameStatus>
   * @public
   * @static
   * @async
   * @automation SecurityDomain.test.ts #createSecurityDomains
   */
  public static async createInstance(this: ReturnModelType<typeof Permission>, input: CreatePermissionInput) {
    return this.create(input);
  }

  /**
   * Utility method to return all Permissions
   * @returns Promise<Permission[]>
   * @public
   * @static
   * @async
   */
  public static async all(this: ReturnModelType<typeof Permission>) {
    return this.find({
      name: {
        $in: [
          PermissionNamesEnum.AdministratorsCreatePresidentsGame,
          PermissionNamesEnum.AdministratorsPlayPresidentsGame,
          PermissionNamesEnum.GamePlayersCreatePresidentsGame,
          PermissionNamesEnum.GamePlayersPlayPresidentsGame,
        ],
      },
    });
  }
}
