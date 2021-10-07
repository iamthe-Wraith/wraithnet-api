import mongoose, { Schema } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IBaseResource } from '../../types';
import { IUser } from '../user';

dayjs.extend(utc);

export interface IDailyChecklistItemRequest {
    text: string;
    details?: string;
    position?: number;
}

export interface IBaseDailyChecklistItem extends IDailyChecklistItemRequest, IBaseResource {
    owner: IUser['id'];
    markedForDeletion?: boolean;
}

export interface IDailyChecklistItem extends IBaseDailyChecklistItem {
    _id: string;
}

export interface IDailyChecklistItemSharable extends IBaseDailyChecklistItem {
    id: string;
}

export interface ITags {
    count: number;
    items: IDailyChecklistItem[];
}

const DailyChecklistItemSchema = new mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    text: {
        required: true,
        type: String,
    },
    details: {
        type: String,
    },
    position: {
        type: Number,
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

export const DailyChecklistItem = mongoose.model<IDailyChecklistItem>('dailyChecklistItem', DailyChecklistItemSchema);
