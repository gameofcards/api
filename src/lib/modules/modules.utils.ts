import { Types } from 'mongoose';

export class Utils {

  static getModelOptions() {
    return {
      schemaOptions: {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
      }
    }
  }

  static getDisciminatorModelOptions() {
    return {
      schemaOptions: {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        discriminatorKey: 'type',
      },
    }
  }

  static getDate() {
    return new Date();
  }

  static getObjectId() {
    return Types.ObjectId()
  }
}