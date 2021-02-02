import { dropPresidentsModule, initializePresidentsModule } from './presidents/presidents.data';

export const initializeGamesModule = async () => {
  await initializePresidentsModule();
};

export const dropGamesModule = async () => {
  await dropPresidentsModule();
};
