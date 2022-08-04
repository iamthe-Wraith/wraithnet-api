import mongoose, { Document } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IBaseResource } from '../../types';

dayjs.extend(utc);

export interface IBaseDnDClass extends IBaseResource {
  name: string;
}

export interface IDnDClass extends IBaseDnDClass, Document<string> {
  _id: string;
}

export interface IDnDClassSharable extends IBaseDnDClass {
  id: string;
}

const DnDClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: dayjs.utc().toDate(),
  },
  lastModified: {
    type: Date,
  },
});

export const DnDClass = mongoose.model<IDnDClass>('class', DnDClassSchema);
