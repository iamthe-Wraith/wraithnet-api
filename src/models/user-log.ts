import mongoose, { Schema } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IBaseResource, IRegexQuery } from '../types';
import { IUser } from './user';

dayjs.extend(utc);

export interface IUserLogEntry extends IBaseResource {
  _id: IUser['id'];
  owner: IUser['id'];
  content: string;
  tags?: string[];
  markedForDeletion?: boolean;
}

export interface IUserLogEntries {
  count: number;
  entries: IUserLogEntry[];
}

const UserLogEntrySchema = new mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  content: String,
  tags: [String],
  createdAt: {
    type: Date,
    default: dayjs.utc().toDate(),
  },
  lastModified: {
    type: Date,
  },
  markedForDeletion: {
    type: Boolean,
    default: false,
  }
});

export const UserLogEntry = mongoose.model<IUserLogEntry>('user-log', UserLogEntrySchema);
