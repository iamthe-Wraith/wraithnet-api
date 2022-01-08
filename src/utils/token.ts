import jwt from 'jsonwebtoken';

import CustomError from './custom-error';
import {
    ERROR,
    TOKEN_ALGORITHM,
    TOKEN_EXPIRATION,
    TOKEN_THRESHOLD,
} from '../constants';
import { ITokenPayload } from '../types';
import { IUser } from '../models/user';

export default class Token {
    static generate(payload:ITokenPayload):string {
        if (payload) {
            try {
                const cert = process.env.PRIVATE_KEY.split('\\n').join('\n');

                return jwt.sign(
                    payload,
                    cert,
                    { algorithm: <jwt.Algorithm>TOKEN_ALGORITHM, expiresIn: TOKEN_EXPIRATION },
                );
            } catch (err: any) {
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

    static generatePayload = (user: IUser):ITokenPayload => ({
        username: user.username,
    });

    static getPayload = (token: string): ITokenPayload => {
        if (token) {
            const payload = <ITokenPayload>jwt.decode(token);

            if (payload) {
                return payload;
            }
            throw new CustomError('invalid token received', ERROR.TOKEN);
        } else {
            throw new CustomError('no token found', ERROR.TOKEN);
        }
    };

    static shouldBeRefreshed = (exp:number, manualThreshold?: number):boolean => {
        const tokenThreshold = (process.env.NODE_ENV === 'test' && manualThreshold)
            ? manualThreshold
            : TOKEN_THRESHOLD;

        const now = (Date.now() / 1000);
        const threshold = (exp - tokenThreshold);

        return (now >= threshold && now <= exp);
    };

    static verify(token?:string):Promise<ITokenPayload> {
        return new Promise((resolve, reject) => {
            if (token) {
                try {
                    const secret = process.env.PRIVATE_KEY.split('\\n').join('\n');

                    jwt.verify(token, secret, { algorithms: [<jwt.Algorithm>TOKEN_ALGORITHM] }, (err:Error|null, payload?:string|object):void => {
                        if (err) {
                            reject(new CustomError(err.message, ERROR.TOKEN));
                        } else {
                            resolve(<ITokenPayload>payload);
                        }
                    });
                } catch (err: any) {
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
