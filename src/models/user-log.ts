import mongoose, { Schema, SchemaType } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Tag, ITag, ITagSharable } from './tag';
import { IBaseResource } from '../types';
import { IUser } from './user';

dayjs.extend(utc);

export interface IUserLogEntryBase extends IBaseResource {
    owner: IUser['id'];
    content: string;
    markedForDeletion?: boolean;
}

export interface IUserLogEntry extends IUserLogEntryBase {
    _id: string;
    tags?: ITag[];
}

export interface IUserLogEntrySharable extends IUserLogEntryBase {
    id: string;
    tags?: ITagSharable[];
}

export interface IUserLogEntries {
    count: number;
    entries: (IUserLogEntry | IUserLogEntrySharable)[];
}

const UserLogEntrySchema = new mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    content: String,
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'tag',
    }],
    createdAt: {
        type: Date,
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
