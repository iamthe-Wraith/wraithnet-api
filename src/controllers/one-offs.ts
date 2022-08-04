import { RequestHandler } from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Response } from '../utils/response';
import { IRequest } from '../types/request';
import { Note } from '../models/note';
import { MagicItem } from '../models/dnd/store-item';
import CustomError from '../utils/custom-error';
import { ERROR } from '../constants';

dayjs.extend(utc);

export class OneOffsController {
  static undoMappingMagicItems:RequestHandler = async (req:IRequest, res) => {
    try {
      await Note.deleteMany({ category: 'dnd_store_magic_item' });
      await MagicItem.deleteMany({});

      Response.send(null, req, res);
    } catch (err: any) {
      if (err.isCustom) {
        Response.error(err, req, res);
      } else {
        Response.error(new CustomError(err.message, ERROR.GEN), req, res);
      }
    }
  };
}
