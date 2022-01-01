import mongoose, { Document, Schema } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IBaseResource } from '../types';
import { IUser } from './user';

dayjs.extend(utc);

export interface IBaseTag extends IBaseResource {
    owner: IUser['id'];
    text: string;
    markedForDeletion?: boolean;
}

export interface ITag extends IBaseTag, Document<string> {}

export interface ITagSharable extends IBaseTag {
    id: string;
}

export interface ITags {
    count: number;
    results: ITag[];
}

const TagSchema = new mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    text: {
        required: true,
        type: String,
        unique: true,
    },
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
    },
});

export const Tag = mongoose.model<ITag>('tag', TagSchema);
