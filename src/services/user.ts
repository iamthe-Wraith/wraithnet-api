import express from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IUser, IUserQuery, IUserSharable, IUserStatuses, ROLE, User } from '../models/user';
import CustomError, { asCustomError } from '../utils/custom-error';
import Auth from '../utils/auth';
import {
  AUTH_ROUTE,
  DEFAULT_USERS_TO_RETURN,
  ERROR,
  MAX_USERS_TO_RETURN,
  MIN_PASSWORD_LENGTH
} from '../constants';
import {
  IRequest,
  IUserGetResponse,
} from '../types';
import { AuthService } from './auth';
// import { getPaginationPage } from '../utils/pagination';

dayjs.extend(utc);

/**
 * verifies if a submitted role value is
 * a valid, registered role.
 *
 * @param {string} submittedRole - the role
 * value received in call.
 *
 * @return {[string, number]} - return tuple if is
 * valid role value, else will return undefined.
 */
export const isValidRole = (submittedRole: string):[string, number]|void => {
  const newRole = Object.entries(ROLE).filter(p => {
    return (p[0] === submittedRole && isNaN(parseInt(p[0])));
  });

  if (newRole.length) {
    return <[string, number]>newRole[0];
  } else {
    return undefined;
  }
};

export class UsersService {
  static async create (req:IRequest):Promise<IUser> {
    const {
      username,
      email,
      password,
      role
    } = req.body;

    if (!username || !email || !password) {
      const msg = `${!username ? 'username' : !email ? 'email' : 'password'} not found`;

      throw new CustomError(msg, ERROR.NOT_FOUND);
    }

    let _role: ROLE;

    // only users with ROLE.ADMIN or greater role are allowed to create other users
    if (req.requestor && req.requestor.role >= ROLE.MEMBER) {
      throw new CustomError('you are not authorized to create other users', ERROR.FORBIDDEN);
    }

    if (role !== undefined) {
      const results = isValidRole(role);

      if (results) {
        _role = results[1];

        if (req.requestor) {
          /*
           * another user is attempting to create a new user
           *
           * RULES
           * - requestor must be an admin or greater
           * - requestor cannot grant role that is greater than or equal to their own
           */

          if (
            req.requestor.role >= ROLE.MEMBER ||
            req.requestor.role >= _role
          ) {
            throw new CustomError('you are not authorized to grant this role', ERROR.FORBIDDEN);
          }
        } else {
          /*
           * no requestor found, means request is for a new user creating their own account
           *
           * if is not a test, role cannot be greater than ROLE.MEMBER
           */
          if (process.env.NODE_ENV !== 'test' && _role < ROLE.MEMBER) {
            throw new CustomError('invalid request to create a new user - invalid role', ERROR.FORBIDDEN);
          }
        }
      } else {
        throw new CustomError('invalid role', ERROR.INVALID_ARG);
      }
    } else {
      _role = ROLE.MEMBER;
    }

    try {
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        throw new CustomError(`username unavailable`, ERROR.NOT_ALLOWED);
      }

      if (!Auth.isStrongPassword(password)) {
        throw new CustomError(`password must be greater than ${MIN_PASSWORD_LENGTH} characters long`, ERROR.INVALID_ARG);
      }

      const hash = await Auth.generatePasswordHash(password);

      const user = new User({
        password: hash,
        modifed: false,
        username,
        email,
        role: _role
      });

      await user.save();
      return user;
    } catch (err) {
      let error:CustomError;

      if (err.errors) {
        error = new CustomError(err.errors[Object.keys(err.errors)[0]], ERROR.INVALID_ARG);
      } else {
        error = asCustomError(err);
      }

      throw error;
    }
  }

  static getCount = (query: IUserQuery):Promise<number> => new Promise((resolve, reject) => {
    User.countDocuments(query, (err, count) => {
      if (err) {
        reject(new CustomError(err.message));
      } else {
        resolve(count);
      }
    });
  });

  static getSharable (user:IUser, requestor?:IUser): IUserSharable {
    const statuses = <IUserStatuses>{
      verified: user.statuses.verified
    };

    if (
      requestor &&
      requestor.role <= ROLE.ADMIN
    ) {
      statuses.banned = user.statuses.banned;
      statuses.markedForDeletion = user.statuses.markedForDeletion;
    }

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: ROLE[user.role],
      createdAt: user.createdAt,
      lastModified: user.lastModified,
      statuses
    };
  }

  static async get (req: IRequest): Promise<IUserGetResponse> {
    const query = <IUserQuery>{};

    const { username } = req.params;
    const {
      username: _username,
      email,
      banned,
      markedForDeletion,
      modified,
      online,
      verified,
      page,
      numUsers
    } = (req.query as {
      username?: string;
      email?: string;
      banned?: string;
      markedForDeletion?: string;
      modified?: string;
      online?: string;
      verified?: string;
      page?: string;
      numUsers?: string;
    });

    let _page = 1;
    let _skipLimit = DEFAULT_USERS_TO_RETURN;

    if (username) {
      query.username = username;
    } else {
      if (numUsers) {
        const _numUsers = parseInt(numUsers);

        if (!isNaN(_numUsers)) {
          _skipLimit = _numUsers < MAX_USERS_TO_RETURN ? _numUsers : MAX_USERS_TO_RETURN;
        }
      }

      if (_username) query.username = { $regex: _username };
      if (email) query.email = { $regex: email };
    }

    if (req.requestor) {
      if (req.requestor.role >= ROLE.MEMBER) {
        query['statuses.banned'] = { $in: [false] };
        query['statuses.markedForDeletion'] = { $in: [false] };
      } else {
        if (banned) query['statuses.banned'] = { $in: [banned === 'true'] };
        if (markedForDeletion) query['statuses.markedForDeletion'] = { $in: [markedForDeletion === 'true'] };
        if (modified) query['statuses.modified'] = { $in: [modified === 'true'] };
        if (verified) query['statuses.verified'] = { $in: [verified === 'true'] };
      }
    } else if (req.url === AUTH_ROUTE) {
      /*
       * the auth endpoint needs to identify if user is banned or
       * markedForDeletion to determine if is allowed to sign in
       * so not setting query filter for banned and markedForDeletion
       * statuses if request is from AUTH_ROUTE
       */
    } else {
      query['statuses.banned'] = { $in: [false] };
      query['statuses.markedForDeletion'] = { $in: [false] };
    }

    if (online) query['statuses.online'] = { $in: [true] };

    const _skipCount = (_page - 1) * _skipLimit;
    const results = <IUserGetResponse>{ users: [] };

    try {
      results.users = await User.find(query)
        .skip(_skipCount)
        .limit(_skipLimit)
        .sort({ username: 'ascending' });

      if (results.users.length) {
        if (!username) results.count = await UsersService.getCount(query);

        return results;
      } else {
        let msg = 'no users found';

        if (username) {
          msg = `${username} not found`;
        } else if (_username || email) {
          msg = 'no users found matching query';
        }

        throw new CustomError(msg, ERROR.NOT_FOUND);
      }
    } catch (err) {
      throw asCustomError(err);
    }
  }

  static async update (req:IRequest):Promise<IUserGetResponse> {
    const { username } = req.params;

    const {
      username: _username,
      email,
      password,
      role,
      statuses
    } = <{
      username?: string;
      email?: string;
      password?: string;
      role?: string;
      statuses?: IUserStatuses;
    }>req.body;

    if (
      username &&
      req.requestor &&
      (
        req.requestor.username === username ||
        req.requestor.role <= ROLE.ADMIN
      )
    ) {
      /*
       * make custom request object to reuse User.get and
       * retrieve user to be updated
       */
      const query = <express.Request>{
        params: {},
        query: {}
      };
      query.params.username = username;

      let response:IUserGetResponse;
      let user:IUser;
      let somethingIsBeingUpdated = false;

      try {
        // get user to be updated
        response = await UsersService.get(query);
        user = response.users[0];
      } catch (err) {
        let error:CustomError;

        if (err.isCustomError) {
          error = err;
        } else if (err.errors) {
          error = new CustomError(err.errors[Object.keys(err.errors)[0]], ERROR.INVALID_ARG);
        } else {
          error = new CustomError(err.message);
        }

        throw error;
      }

      if (user) {
        if (_username) {
          // new username found, assign new username
          user.username = _username;
          somethingIsBeingUpdated = true;
        }

        if (email) {
          // new email found, assigning new email
          user.email = email;
          somethingIsBeingUpdated = true;
        }

        if (password) {
          // new password found

          // test if password is valid format
          if (password.length < MIN_PASSWORD_LENGTH) {
            throw new CustomError(`password must be greater than ${MIN_PASSWORD_LENGTH} characters long`, ERROR.INVALID_ARG);
          }

          // password is valid format, getting password hash
          const hash = await Auth.generatePasswordHash(password);

          user.password = hash;
          somethingIsBeingUpdated = true;
        }

        if (role) {
          // new role found...checking if valid role received
          const newRole = isValidRole(role);

          if (newRole) {
            // is valid role...updated role value

            /*
             * requestor must have admin permssions (or greater) and can
             * only grant role equal to or less than their own
             */
            if (
              req.requestor.username !== username &&
              req.requestor.role <= ROLE.ADMIN &&
              req.requestor.role <= newRole[1]
            ) {
              user.role = <ROLE>newRole[1];
              somethingIsBeingUpdated = true;
            } else {
              throw new CustomError('you are not authorized to grant this role to this user', ERROR.FORBIDDEN);
            }
          } else {
            throw new CustomError('invalid role received', ERROR.INVALID_ARG);
          }
        }

        if (statuses) {
          // statuse object found...verifying if a valid status was provided.
          const {
            verified,
            banned,
            markedForDeletion
          } = statuses;

          if (verified !== undefined) {
            // new verified status found
            user.statuses.verified = !!verified;
            somethingIsBeingUpdated = true;
          }

          if (banned !== undefined) {
            // new banned status found

            /*
             * requestor cannot ban themselves, must have admin role
             * (or greater), and cannot ban a user that has greater role
             * than themselves.
             */
            if (
              req.requestor.username !== username &&
              req.requestor.role <= ROLE.ADMIN &&
              req.requestor.role <= user.role
            ) {
              user.statuses.banned = !!banned;
              somethingIsBeingUpdated = true;
            } else {
              const msg = req.requestor.username === username
                ? 'yourself'
                : 'this user';

              throw new CustomError(`you are not authorized to ban ${msg}`, ERROR.FORBIDDEN);
            }
          }

          if (markedForDeletion !== undefined) {
            // new markedForDeletion status found

            /*
             * requestor must have admin role (or greater), and cannot
             * mark a user for deletion that has greater role than
             * themselves
             */
            if (
              req.requestor.username !== username &&
              req.requestor.role <= ROLE.ADMIN &&
              req.requestor.role <= user.role
            ) {
              user.statuses.markedForDeletion = !!markedForDeletion;
              somethingIsBeingUpdated = true;
            } else {
              const msg = req.requestor.username === username
                ? 'your account'
                : 'this user';

              throw new CustomError(`you are not authorized to mark ${msg} for deletion`, ERROR.FORBIDDEN);
            }
          }
        }

        if (somethingIsBeingUpdated) {
          try {
            user.lastModified = dayjs.utc().toDate();

            // calling save to run validators
            await user.save();

            return { users: [user] };
          } catch (err) {
            throw new CustomError(`failed to update user - ${err.message}`, ERROR.GEN);
          }
        } else {
          throw new CustomError('failed to update user - no updatable values found', ERROR.NOT_FOUND);
        }
      } else {
        throw new CustomError(`failed to retrieve user: ${username}`, ERROR.NOT_FOUND);
      }
    } else if (!username) {
      throw new CustomError('no username found', ERROR.NOT_FOUND);
    } else {
      throw new CustomError('you are not authorized to update this user\'s data', ERROR.FORBIDDEN);
    }
  }

  static async delete (req:IRequest):Promise<string> {
    const { username } = req.params;
    const { permanent = false } = req.body;

    let user:IUser;

    if (username) {
      /*
       * make custom request object to reuse User.get and
       * retrieve user to be updated
       */
      const query = {
        params: {},
        query: {},
        requestor: req.requestor,
      } as IRequest;
      query.params.username = username;

      try {
        const results = await UsersService.get(query);
        user = results.users[0];
      } catch (err) {
        throw new CustomError(`failed to retrieve user: ${username}`, ERROR.NOT_FOUND);
      }

      if (user) {
        if (req.requestor) {
          try {
            if (req.requestor.role === ROLE.GOD) {
              if (permanent) {
                await user.remove();
              } else {
                user.lastModified = dayjs.utc().toDate();
                user.statuses.markedForDeletion = true;
  
                await user.save();
              }
              return 'other';
            } else if (req.requestor._id.toString() === user._id.toString() || (req.requestor.role < user.role && req.requestor.role === ROLE.ADMIN)) {
              user.lastModified = dayjs.utc().toDate();
              user.statuses.markedForDeletion = true;

              await user.save();
              return 'self';
            } else {
              throw new CustomError('you are not authorized to make this request', ERROR.FORBIDDEN);
            }
          } catch (err) {
            let error:CustomError;

            if (err.isCustomError) {
              error = err;
            } else {
              error = new CustomError(err.message);
            }

            throw error;
          }
        } else {
          throw new CustomError('you are not authorized to make this request', ERROR.FORBIDDEN);
        }
      } else {
        throw new CustomError(`${username} not found`, ERROR.NOT_FOUND);
      }
    } else {
      throw new CustomError('no username found', ERROR.NOT_FOUND);
    }
  }

  static async changePassword (req: IRequest): Promise<IUser> {
    const { currentPassword, newPassword } = req.body;
    let hash: string;

    try {
      await Auth.isValidPassword(currentPassword, req.requestor.password);

      if (!Auth.isStrongPassword(newPassword)) {
        throw new CustomError(`password must be greater than ${MIN_PASSWORD_LENGTH} characters long`, ERROR.INVALID_ARG);
      }

      hash = await Auth.generatePasswordHash(newPassword);
    } catch (err) {
      throw new CustomError('invalid password', ERROR.AUTHENTICATION);
    }

    if (hash) {
      try {
        req.requestor.password = hash;
        await req.requestor.save();
        return req.requestor;
      } catch (err) {
        throw asCustomError(err);
      }
    }
  }
}
