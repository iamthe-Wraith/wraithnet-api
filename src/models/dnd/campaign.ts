import mongoose, { Document, Schema } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IBaseResource } from '../../types';
import { IUser } from '../user';
import { INote } from '../note';

dayjs.extend(utc);

export interface ICampaignRequest {
    name: string;
    startDate: string;
    currentDate: string;
    firstSessionDate: Date;
}

export interface IBaseCampaign extends ICampaignRequest, IBaseResource {
    owner: IUser['id'];
    markedForDeletion?: boolean;
}

export interface ICampaign extends IBaseCampaign, Document<string> {
    _id: string;
    items: INote['id'];
    locations: INote['id'];
    misc: INote['id'];
    npcs: INote['id'];
    quests: INote['id'];
    sessions: INote['id'];
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
    firstSessionDate: {
        type: Date,
    },
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'note',
    }],
    locations: [{
        type: Schema.Types.ObjectId,
        ref: 'note',
    }],
    misc: [{
        type: Schema.Types.ObjectId,
        ref: 'note',
    }],
    npcs: [{
        type: Schema.Types.ObjectId,
        ref: 'note',
    }],
    quests: [{
        type: Schema.Types.ObjectId,
        ref: 'note',
    }],
    sessions: [{
        type: Schema.Types.ObjectId,
        ref: 'note',
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
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

export const Campaign = mongoose.model<ICampaign>('campaign', CampaignSchema);
