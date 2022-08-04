import mongoose, {
  Document, Model, ObjectId, Schema,
} from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IBaseResource } from '../../types';
import { IUser } from '../user';
import { INote } from '../note';
import { IModel, IRef } from '../../types/model';

dayjs.extend(utc);

export interface ICampaignRequest {
  name: string;
  startDate: string;
  currentDate: string;
  firstSessionDate: Date;
}

export interface IBaseCampaign extends ICampaignRequest, IBaseResource {
  owner: IRef<ObjectId, IUser>;
  markedForDeletion?: boolean;
}

export interface ICampaign extends IBaseCampaign {
  items: IRef<ObjectId, INote>;
  locations: IRef<ObjectId, INote>;
  misc: IRef<ObjectId, INote>;
  npcs: IRef<ObjectId, INote>;
  quests: IRef<ObjectId, INote>;
  sessions: IRef<ObjectId, INote>;
}

export interface ICampaignDocument extends ICampaign, Document {}
export interface ICampaignModel extends IModel<ICampaign> {}

export interface ICampaignSharable extends IBaseCampaign {
  id: string;
}

const CampaignSchema = new mongoose.Schema<ICampaign>({
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

export const Campaign = mongoose.model<ICampaignDocument, Model<ICampaign>>('campaign', CampaignSchema);
