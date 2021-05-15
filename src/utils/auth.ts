import bcrypt from 'bcrypt';

import CustomError from './custom-error';
import {
  ERROR,
  SALT_ROUNDS
} from '../constants';

export default class Auth {
  static generatePasswordHash (password:string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (password) {
        bcrypt.genSalt(SALT_ROUNDS, (err:Error, salt:string) => {
          if (err) {
            reject(err);
          } else {
            bcrypt.hash(password, salt, (err:Error, hash:string) => {
              if (err) {
                reject(err);
              } else {
                resolve(hash);
              }
            });
          }
        });
      } else {
        reject(new CustomError('password is required', ERROR.INVALID_ARG));
      }
    });
  }

  static isValidPassword (providedPassword:string, encryptedPassword:string):Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof providedPassword !== 'undefined' && typeof encryptedPassword !== 'undefined') {
        bcrypt.compare(providedPassword, encryptedPassword, (err:Error, authenticated:boolean) => {
          if (err) {
            reject(err);
          } else {
            if (authenticated) {
              resolve();
            } else {
              reject(new CustomError('invalid username or password', ERROR.AUTHENTICATION));
            }
          }
        });
      } else {
        const message = typeof providedPassword === 'undefined'
          ? 'no password found'
          : 'no encrypted password found';

        reject(new CustomError(message, ERROR.INVALID_ARG));
      }
    });
  }
}
