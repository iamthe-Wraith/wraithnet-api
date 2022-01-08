import mongoose, { Document, Schema } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IBaseResource } from '../../types';
import { IUser } from '../user';
import { ICampaign } from './campaign';

dayjs.extend(utc);

export interface IBaseDnDEvent extends IBaseResource {
    date: string;
    description: string;
    owner: IUser['id'];
    campaignId: ICampaign['id'];
    markedForDeletion?: boolean;
}

export interface IDnDEvent extends IBaseDnDEvent, Document<string> {
    _id: string;
}

export interface IEventSharable extends IBaseDnDEvent {
    id: string;
}

const DnDEventSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    campaignId: {
        type: Schema.Types.ObjectId,
        ref: 'campaign',
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

export const DnDEvent = mongoose.model<IDnDEvent>('dnd-event', DnDEventSchema);
