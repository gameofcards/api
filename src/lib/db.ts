import './config';

import * as mongoose from 'mongoose';

import { logger } from './logger';

export default class Connection {
  static async connect() {
    const url = process.env.MONGODB_URL;
    const options = {
      useCreateIndex: true,
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    try {
      await mongoose.connect(url, options);
      logger.info('[Database] connected to mongodb');
    } catch (err) {
      logger.error('[Database] failed to connect to mongodb');
      logger.error(`[Database] error: ${err}`);
    }
  }

  static async disconnect() {
    try {
      await mongoose.connection.close();
      logger.info('[Database] disconnected from mongodb');
    } catch (err) {
      logger.error('[Database] failed to disconnect from mongodb');
      logger.error(`[Database] error: ${err}`);
    }
  }
}
