import * as mongoose from 'mongoose';

export default class Connection {
  static async connect() {
    const url = 'mongodb+srv://root:root@cluster0-cq4v2.mongodb.net/alwaysblue?retryWrites=true&w=majority';
    const options = {
      useCreateIndex: true,
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    try {
      await mongoose.connect(url, options);
      console.log('[Database] connected to mongodb');
    } catch (err) {
      console.log('[Database] failed to connect to mongodb');
      console.log(`[Database] error: ${err}`);
    }
  }

  static async disconnect() {
    try {
      await mongoose.connection.close();
      console.log('[Database] disconnected from mongodb');
    } catch (err) {
      console.log('[Database] failed to disconnect from mongodb');
      console.log(`[Database] error: ${err}`);
    }
  }
}
