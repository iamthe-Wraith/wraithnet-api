import { Document } from 'mongoose';
import { ObjectID } from 'mongodb';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { ERROR } from "../constants";
import { IUserLogEntry, UserLogEntry } from "../models/user-log";
import { IRequest } from "../types";
import { isValidDate } from "../utils";
import CustomError, { asCustomError } from "../utils/custom-error";

dayjs.extend(utc);

export class UserLogService {
  static async create (req: IRequest): Promise<IUserLogEntry> {
    const { content, tags = [] } = (req.body as { content: string, tags: string[] });

    if (!content) throw asCustomError(new CustomError('content is required', ERROR.INVALID_ARG));
    if (typeof content !== 'string') throw asCustomError(new CustomError('invalid content', ERROR.INVALID_ARG));
    if (tags && (!Array.isArray(tags) || tags.filter(t => typeof t !== 'string').length)) {
      throw asCustomError(new CustomError('invalid tags. must be an array of strings', ERROR.INVALID_ARG));
    }

    try {
      const entry = new UserLogEntry({
        content,
        tags,
        owner: req.requestor.id,
      });

      return UserLogService.getSharable(await entry.save());
    } catch (err) {
      throw asCustomError(err);      
    }
  }

  static async get (req: IRequest, returnFullObject = false): Promise<IUserLogEntry[]> {
    const {
      text,
      tags,
      created,
      createdBefore,
      createdAfter,
    } = (req.query as {
      text: string;
      tags: string;
      created: string;
      createdAfter: string;
      createdBefore: string;
    });  
    const { id } = req.params;

    const query: any = {
      $and: [{ owner: req.requestor.id }, { markedForDeletion: false }],
    };

    if (id) {
      if (!ObjectID.isValid(id)) throw new CustomError('invalid id found', ERROR.INVALID_ARG);

      query.$and.push({ _id: id });
    } else {
      if (text) {
        if (typeof text !== 'string') throw new CustomError('invalid text', ERROR.INVALID_ARG);
        query.$and.push({ content: { $regex: text }});
      }

      if (tags) {
        if (!Array.isArray(tags) || tags.filter(t => typeof t !== 'string').length) {
          throw new CustomError('invalid tags', ERROR.INVALID_ARG);
        }

        query.$and.push({ $or: tags.map(t => ({ tags: t })) });
      }

      if (created) {
        if (!isValidDate(created)) throw new CustomError('invalid created date', ERROR.INVALID_ARG);
        const date = dayjs.utc(created);
        query.$and.push({ createdAt: { $gte: dayjs.utc(date).hour(0).minute(0).second(0).toDate() }});
        query.$and.push({ createdAt: { $lte: dayjs.utc(date).hour(23).minute(59).second(59).toDate() }});
      } else if (createdBefore || createdAfter) {
        let _createdBefore: dayjs.Dayjs;
        let _createdAfter: dayjs.Dayjs;
        if (createdBefore) {
          _createdBefore = dayjs.utc(createdBefore).hour(23).minute(59).second(59);
          if (!_createdBefore.isValid()) throw new CustomError('invalid createdBefore date', ERROR.INVALID_ARG);
          
        }

        if (createdAfter) {
          _createdAfter = dayjs.utc(createdAfter).hour(0).minute(0).second(0);
          if (!_createdAfter.isValid()) throw new CustomError('invalid createdAfter date', ERROR.INVALID_ARG);
        }

        if (_createdBefore && _createdAfter && _createdBefore.isBefore(_createdAfter)) {
          throw  new CustomError('createdBefore date must be after createdAfter date');
        }

        if (_createdAfter) query.$and.push({ createdAt: { $gte: _createdAfter.toDate() } });
        if (_createdBefore) query.$and.push({ createdAt: { $lte: _createdBefore.toDate() } });
      }
    }

    let restrictedProperties = {};
    if (!returnFullObject) {
      restrictedProperties = {
        owner: 1,
        content: 1,
        tags: 1,
        createdAt: 1,
        _id: 1,
      };
    }

    try {
      const results = await UserLogEntry.find(query, restrictedProperties);

      console.log(results);

      return results;
    } catch (err) {
      console.log({...err});
      if (err.kind) {

      } else {

      }
      throw asCustomError(err);
    }
  }

  static getSharable = async (entry: IUserLogEntry) => {
    return {
      _id: entry._id,
      content: entry.content,
      createdAt: entry.createdAt,
      owner: entry.owner,
      tags: entry.tags,
    };
  }

  static update = async (req: IRequest): Promise<IUserLogEntry> => {
    const { content, tags } = req.body;
    const { id } = req.params;

    if (!id) throw new CustomError('no entry id found', ERROR.NOT_FOUND);
    if (!ObjectID.isValid(id)) throw new CustomError('invalid id found', ERROR.INVALID_ARG);
    if (!content && !tags) throw new CustomError('no updatable content found', ERROR.NOT_FOUND);
    if (content && typeof content !== 'string') throw asCustomError(new CustomError('invalid content', ERROR.INVALID_ARG));
    if (tags && (!Array.isArray(tags) || tags.filter(t => typeof t !== 'string').length)) {
      throw asCustomError(new CustomError('invalid tags. must be an array of strings', ERROR.INVALID_ARG));
    }

    const query = { owner: req.requestor.id, _id: id };
    let entry: IUserLogEntry & Document<any, any>;

    try {
      entry = await UserLogEntry.findOne(query);
    } catch (err) {
      throw asCustomError(err);
    }

    if (entry) {
      if (content) entry.content = content;
      if (tags) entry.tags = tags;

      try {
        return UserLogService.getSharable(await entry.save());
      } catch (err) {
        throw asCustomError(err);
      }
    }
  }

  static delete = async (req: IRequest): Promise<void> => {
    const { id } = req.params;

    if (!id) throw new CustomError('no entry id found', ERROR.NOT_FOUND);
    if (!ObjectID.isValid(id)) throw new CustomError('invalid id found', ERROR.INVALID_ARG);

    const query = { owner: req.requestor.id, _id: id };

    let entry: IUserLogEntry & Document<any, any>;

    try {
      entry = await UserLogEntry.findOne(query);
    } catch (err) {
      throw asCustomError(err);
    }

    if (entry) {
      entry.markedForDeletion = true;

      try {
        await entry.save();
      } catch (err) {
        throw asCustomError(err);
      }
    }
  }
}
