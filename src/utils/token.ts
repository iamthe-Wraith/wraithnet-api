import jwt from 'jsonwebtoken';
import fs from 'fs';

import { config } from '../../config';
import CustomError from '../utils/custom-error';
import {
  ERROR,
  TOKEN_ALGORITHM,
  TOKEN_EXPIRATION,
  TOKEN_THRESHOLD
} from '../constants';
import { ITokenPayload, IUser } from '../types';

export default class Token {
  static generate (payload:ITokenPayload):string {
    if (payload) {
      try {
        const cert = fs.readFileSync(config.private_key);

        return jwt.sign(
          payload,
          cert,
          { algorithm: <jwt.Algorithm>TOKEN_ALGORITHM, expiresIn: TOKEN_EXPIRATION }
        );
      } catch (err) {
        let error:CustomError;

        if (err.isCustomError) {
          error = err;
        } else {
          error = new CustomError(err.message, ERROR.TOKEN);
        }

        throw error;
      }
    } else {
      throw new CustomError('no token payload recieved', ERROR.TOKEN);
    }
  }

  static generatePayload = (user:IUser):ITokenPayload => {
    return {
      username: user.username
    };
  };

  static getPayload = (token: string): ITokenPayload => {
    if (token) {
      const payload = <ITokenPayload>jwt.decode(token);

      if (payload) {
        return payload;
      } else {
        throw new CustomError('invalid token received', ERROR.TOKEN);
      }
    } else {
      throw new CustomError('no token found', ERROR.TOKEN);
    }
  }

  static shouldBeRefreshed = (exp:number, manualThreshold?: number):boolean => {
    const expiration = new Date((exp * 1000));
    const tokenThreshold = (process.env.NODE_ENV === 'test' && manualThreshold)
      ? manualThreshold
      : TOKEN_THRESHOLD;

    const now = (Date.now() / 1000);
    const threshold = (exp - tokenThreshold);

    return (now >= threshold && now <= exp);
  }

  static verify (token?:string):Promise<ITokenPayload> {
    return new Promise((resolve, reject) => {
      if (token) {
        try {
          const secret = fs.readFileSync(config.private_key);

          jwt.verify(token, secret, { algorithms: [<jwt.Algorithm>TOKEN_ALGORITHM] }, (err:Error|null, payload?:string|object):void => {
            if (err) {
              reject(new CustomError(err.message, ERROR.TOKEN));
            } else {
              resolve(<ITokenPayload>payload);
            }
          });
        } catch (err) {
          let error:CustomError;

          if (err.isCustomError) {
            error = err;
          } else {
            error = new CustomError(err.message, ERROR.TOKEN);
          }

          reject(error);
        }
      } else {
        reject(new CustomError('no token received', ERROR.TOKEN));
      }
    });
  }
}
