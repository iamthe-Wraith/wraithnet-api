import mongoose from 'mongoose';

import {
  EMAIL_FORMAT,
  USERNAME_FORMAT
} from '../constants';
import {
  PERMISSION,
  IUser
} from '../types';

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
  permissions: {
    type: Number,
    required: [true, 'a permission level is required'],
    default: PERMISSION.MEMBER,
    validate: {
      validator: (permission:PERMISSION):boolean => !!PERMISSION[permission],
      message: 'invalid permission level specified'
    }
  },
  createdAt: {
    type: Date,
    default: new Date(),
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
