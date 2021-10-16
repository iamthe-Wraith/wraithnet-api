import mongoose, { Schema } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IBaseResource } from '../../types';
import { IUser } from '../user';
import { ICampaign } from './campaign';

dayjs.extend(utc);

/*
- name
- race
- class
- exp
- level
- events (like birthday)
- inventory
- contacts(npcs) (will need to be able to add notes for how they know them...these will need to be stored separately from the npc's info)
- notes/content (used in editor)
*/

export interface IPCRequest {
    name: string;
    race: string;
    classes: string[];
    age: number;
}

export interface IBasePCRef extends IPCRequest, IBaseResource {
    owner: IUser['id'];
    campaignId: ICampaign['id'];
    markedForDeletion?: boolean;
    exp: number;
    expForNextLevel: number;
    level: number;
}

export interface IBasePC extends IBasePCRef {
    note: string;
    // events
    // inventory
    // contacts
}

export interface IPC extends IBasePC {
    _id: string;
}

export interface IPCRef extends IBasePCRef {
    _id: string;
}

export interface IPCSharable extends IBasePC {
    id: string;
}

export interface IPCSharableRef extends IBasePCRef {
    id: string;
}

const PCSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    race: {
        type: String,
        required: true,
    },
    classes: [{
        type: String,
        required: true,
    }],
    age: {
        type: Number,
        required: true,
    },
    exp: {
        type: Number,
        required: true,
        default: 0,
    },
    level: {
        type: Number,
        required: true,
        default: 1,
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: 'note'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
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
    }
});

export const PC = mongoose.model<IPC>('pc', PCSchema);
