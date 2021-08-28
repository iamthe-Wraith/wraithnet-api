import { Document } from 'mongoose';
import { ObjectID } from 'mongodb';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { ERROR } from "../constants";
import { IUserLogEntries, IUserLogEntry, IUserLogEntrySharable, UserLogEntry } from "../models/user-log";
import { IRequest } from "../types";
import { isValidDate } from "../utils";
import CustomError, { asCustomError } from "../utils/custom-error";
import { ITag, ITags, Tag } from '../models/tag';
import { TagsService } from './tags';
import express from 'express';
import { IUser } from '../models/user';

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
            const resolvedTags = await UserLogService.createTagsForEntry(tags, req.requestor);

            let entry = new UserLogEntry({
                content,
                tags: resolvedTags.map(t => (t as ITag)._id),
                owner: req.requestor.id,
            });

            await entry.save();
            entry.toObject();
            entry.tags = resolvedTags as ITag[];

            return entry;
        } catch (err) {
            throw asCustomError(err);      
        }
    }

    static async createTagsForEntry (tags: string[], requestor: IUser): Promise<ITag[]> {
        const _tags = tags.map(async (t) => {
            const request = <IRequest>{
                body: {},
                query: {},
                params: {},
                requestor: requestor,
            };

            request.query.text = t;
            request.body.text = t;

            const existingTag = await TagsService.get(request);

            if (existingTag) {
                if (Array.isArray((existingTag as ITags)?.tags) &&
                    (existingTag as ITags).tags.length &&
                    (existingTag as ITags).tags.filter(existingTag => existingTag.text === t).length) {
                    return (existingTag as ITags).tags[0];
                }
            }

            return await TagsService.create(request);
        });

        return await Promise.all(_tags);
    }

    static async get (req: IRequest, returnFullObject = false): Promise<IUserLogEntry | IUserLogEntries> {
        const {
            text,
            tags,
            noTags,
            anyTags,
            created,
            createdBefore,
            createdAfter,
            page,
            pageSize,
        } = (req.query as {
            text: string;
            tags: string;
            noTags: string;
            anyTags: string;
            created: string;
            createdAfter: string;
            createdBefore: string;
            page: string;
            pageSize: string;
        });  
        const { id } = req.params;

        const query: any = {
            $and: [{ owner: req.requestor.id }, { markedForDeletion: false }],
        };

        let _page = 0;
        if (page) {
            _page = parseInt(page);
            if (isNaN(_page)) throw new CustomError('invalid page found', ERROR.INVALID_ARG);
        }

        let _pageSize = 25;
        if (pageSize) {
            _pageSize = parseInt(pageSize);
            if (isNaN(_pageSize)) throw new CustomError('invalid pageSize found', ERROR.INVALID_ARG);
        }

        if (id) {
            if (!ObjectID.isValid(id)) throw new CustomError('invalid id found', ERROR.INVALID_ARG);

            query.$and.push({ _id: id });
        } else {
            if (text) {
                if (typeof text !== 'string') throw new CustomError('invalid text', ERROR.INVALID_ARG);
                query.$and.push({ content: { $regex: text }});
            }

            if (noTags === 'true') {
                query.$and.push({
                    $or: [
                        { tags: null },
                        { "tags.0": { $exists: false } },
                    ]
                });
            } else if (anyTags === 'true') {
                query.$and.push({
                    $and: [
                        { "tags.0": { $exists: true } },
                        { "tags.0": { $ne: null } },
                    ]
                })
            } else if (tags) {
                if (typeof tags !== 'string') {
                    throw new CustomError('invalid tags', ERROR.INVALID_ARG);
                }

                query.$and.push({ $or: tags.split(',').map(t => ({ tags: t })) });
            }

            if (created) {
                if (!isValidDate(created)) throw new CustomError('invalid created date', ERROR.INVALID_ARG);
                let start = dayjs(created).hour(0).minute(0).second(0)
                start = start.utc();
                let end = dayjs(created).hour(23).minute(59).second(59);
                end = end.utc();

                query.$and.push({ createdAt: { $gte: start.toDate() }});
                query.$and.push({ createdAt: { $lte: end.toDate() }});
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
            const results = await UserLogEntry
                .find(query, restrictedProperties)
                .skip(_page * _pageSize)
                .limit(_pageSize)
                .populate('tags')
                .sort({ _id: 'desc' })
                .exec();
        
            if (id) {
                if (results.length) {
                    return results[0];
                } else {
                    throw new CustomError(`entry with id: ${id} not found`, ERROR.NOT_FOUND);
                }
            } else {
                return {
                    entries: results,
                    count: await UserLogEntry.countDocuments(query)
                };
            }
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static getSharable = (entry: IUserLogEntry): IUserLogEntrySharable => {
        return {
            id: entry._id,
            content: entry.content,
            createdAt: entry.createdAt,
            owner: entry.owner,
            tags: entry?.tags.filter(t => !!t).map(t => (TagsService.getSharable(t))) ?? [],
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
            entry = await UserLogEntry.findOne(query)
                .populate('tags');
        } catch (err) {
            throw asCustomError(err);
        }

        if (entry) {
            if (content) entry.content = content;
            if (tags) entry.tags = await UserLogService.createTagsForEntry(tags, req.requestor);

            try {
                return await entry.save();
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
