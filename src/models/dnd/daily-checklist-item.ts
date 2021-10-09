import mongoose, { Schema } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IBaseResource } from '../../types';
import { IUser } from '../user';
import { ICampaign } from './campaign';

dayjs.extend(utc);

export interface IDailyChecklistItemRequest {
    text: string;
    details?: string;
    position?: number;
}

export interface IBaseDailyChecklistItem extends IDailyChecklistItemRequest, IBaseResource {
    owner: IUser['id'];
    campaignId: ICampaign['id'];
    markedForDeletion?: boolean;
}

export interface IDailyChecklistItem extends IBaseDailyChecklistItem {
    _id: string;
}

export interface IDailyChecklistItemSharable extends IBaseDailyChecklistItem {
    id: string;
}

const DailyChecklistItemSchema = new mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    campaignId: {
        type: Schema.Types.ObjectId,
        ref: 'campaign',
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
