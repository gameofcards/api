import * as Config from './config.json';

const env = process.env.NODE_ENV || 'dev';
const envConfig = Config[env];

Object.keys(envConfig).forEach((key) => {
  process.env[key] = envConfig[key];
});
