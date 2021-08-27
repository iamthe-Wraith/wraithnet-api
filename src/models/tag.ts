import mongoose, { Schema } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IBaseResource } from '../types';
import { IUser } from './user';

dayjs.extend(utc);

export interface ITag extends IBaseResource {
    _id: string;
    owner: IUser['id'];
    text: string;
    markedForDeletion?: boolean;
}

export interface ITags {
    count: number;
    tags: ITag[];
}

const TagSchema = new mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    text: {
        required: true,
        type: String,
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
    }
});

export const Tag = mongoose.model<ITag>('tag', TagSchema);
