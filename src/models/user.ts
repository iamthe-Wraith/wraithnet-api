import mongoose, { Document } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import {
  EMAIL_FORMAT,
  USERNAME_FORMAT
} from '../constants';
import {
  IRegexQuery,
  IBaseResource
} from '../types';

dayjs.extend(utc);

export enum ROLE { GOD = 0, ADMIN, MEMBER };

export interface IUser extends IBaseResource, Document {
  username: string;
  email: string;
  lastModified?: Date;
  password: string;
  role: ROLE;
  statuses: IUserStatuses; 
}

export interface IUserQuery {
  username?: string | IRegexQuery;
  email?: IRegexQuery;
  'statuses.banned'?: { $in: boolean[] };
  'statuses.markedForDeletion'?: { $in: boolean[] };
  'statuses.modified'?: { $in: boolean[] };
  'statuses.online'?: { $in: boolean[] };
  'statuses.verified'?: { $in: boolean[] };
}

export interface IUserSharable extends IBaseResource {
  id: string;
  username: string;
  email: string;
  lastModified?: Date;
  role: string;
  statuses: IUserStatuses;
}

export interface IUserStatuses {
  verified: boolean;
  banned?: boolean;
  markedForDeletion?: boolean;
}

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username is required'],
    unique: true,
    validate: {
      validator: (username:string):boolean => USERNAME_FORMAT.test(username),
      message: 'username can only contain alphanumeric characters'
    }
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    validate: {
      validator: (email:string):boolean => EMAIL_FORMAT.test(email),
      message: 'invalid email format'
    }
  },
  password: {
    type: String,
    required: [true, 'password is required']
  },
  role: {
    type: Number,
    required: [true, 'a role is required'],
    default: ROLE.MEMBER,
    validate: {
      validator: (role: ROLE):boolean => !!ROLE[role],
      message: 'invalid role specified'
    }
  },
  createdAt: {
    type: Date,
    default: dayjs.utc().toDate(),
  },
  lastModified: {
    type: Date,
  },
  statuses: {
    banned: {
      type: Boolean,
      default: false
    },
    markedForDeletion: {
      type: Boolean,
      default: false
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
});

export const User = mongoose.model<IUser>('user', UserSchema);
