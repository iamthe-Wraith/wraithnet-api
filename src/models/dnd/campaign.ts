import mongoose, { Document, Schema } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IBaseResource } from '../../types';
import { IUser } from '../user';

dayjs.extend(utc);

export interface ICampaignRequest {
    name: string;
    startDate: string;
    currentDate: string;
}

export interface IBaseCampaign extends ICampaignRequest, IBaseResource {
    owner: IUser['id'];
    markedForDeletion?: boolean;
}

export interface ICampaign extends IBaseCampaign, Document<string> {
    _id: string;
}

export interface ICampaignSharable extends IBaseCampaign {
    id: string;
}

const CampaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
    },
    currentDate: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
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

export const Campaign = mongoose.model<ICampaign>('campaign', CampaignSchema);
