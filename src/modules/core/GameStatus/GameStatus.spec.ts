import { GameStatusModel } from './';
import GameStatuses from './GameStatus.data';

export const createGameStatuses = async () => {
  console.log('[UPLOAD] Uploading GameStatus data...');
  try {
    const statusInstances = GameStatuses.map(status => GameStatusModel(status));
    let statusPromises = statusInstances.map(instance => instance.save());
    await Promise.all(statusPromises);
  }
  catch (err) {
    console.log('[UPLOAD] Failed to create GameStatuses.');
    console.log(err);
  }
  console.log('[UPLOAD] GameStatus upload completed.');
};