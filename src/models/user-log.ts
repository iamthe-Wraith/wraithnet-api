import mongoose, { Schema } from 'mongoose';

import { IBaseResource } from '../types';
import { IUser } from './user';

export interface IUserLogEntry extends IBaseResource {
  owner: IUser['id'];
  content: string;
  tags?: string[];
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
    default: new Date(),
  },
  lastModified: {
    type: Date,
  },
});

export const UserLogEntry = mongoose.model<IUserLogEntry>('user-log', UserLogEntrySchema);
