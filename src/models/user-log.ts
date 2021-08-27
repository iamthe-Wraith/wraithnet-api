import mongoose, { Schema, SchemaType } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Tag, ITag } from './tag';
import { IBaseResource } from '../types';
import { IUser } from './user';

dayjs.extend(utc);

export interface IUserLogEntry extends IBaseResource {
    _id: string;
    owner: IUser['id'];
    content: string;
    tags?: ITag[];
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
    tags: {
        type: Schema.Types.ObjectId,
        ref: 'tag',
    },
    createdAt: {
        type: Date,
        default: dayjs.utc().format(),
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
