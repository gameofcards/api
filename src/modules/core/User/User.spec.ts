import { UserModel } from './';
import Users from './User.data';

export const createUsers = async () => {
  console.log('[UPLOAD] User');
  try {
    const userPromises = Users.map((user) => UserModel.createInstance(user));
    await Promise.all(userPromises);
  } catch (err) {
    console.log('[UPLOAD] Failed.');
    console.log(err);
  }
  console.log('[UPLOAD] Completed.');
};
