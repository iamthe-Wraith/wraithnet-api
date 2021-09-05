import { Document } from 'mongoose';
import { ObjectID } from "mongodb";
import { ERROR } from "../constants";
import { ITag, ITags, ITagSharable, Tag } from "../models/tag";
import { IRequest } from "../types";
import CustomError, { asCustomError } from "../utils/custom-error";

export class TagsService {
    static async create (req: IRequest): Promise<ITag> {
        const { text } = (req.body as { text: string });

        if (!text) throw asCustomError(new CustomError('content is required', ERROR.INVALID_ARG));
        if (typeof text !== 'string') throw asCustomError(new CustomError('invalid content', ERROR.INVALID_ARG));

        try {
            const tag = new Tag({
                text,
                owner: req.requestor.id,
            });

            await tag.save();

            return tag;
        } catch (err) {
            throw asCustomError(err);      
        }
    }

    static async delete (req: IRequest): Promise<void> {
        const { id } = req.params;

        if (!id) throw new CustomError('no entry id found', ERROR.NOT_FOUND);
        if (!ObjectID.isValid(id)) throw new CustomError('invalid id found', ERROR.INVALID_ARG);

        const query = { owner: req.requestor.id, _id: id };

        let tag: ITag & Document<any, any>;

        try {
            tag = await Tag.findOne(query);
        } catch (err) {
            throw asCustomError(err);
        }

        if (tag) {
            tag.markedForDeletion = true;

            try {
                await tag.save();
            } catch (err) {
                throw asCustomError(err);
            }
        }
    }

    static async get (req: IRequest): Promise<ITag | ITags> {
        const {
            text,
            page,
            pageSize,
        } = (req.query as {
            text: string;
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
                query.$and.push({ text: { $regex: text }});
            }
        }

        try {
            const results = await Tag
                .find(query)
                .skip(_page * _pageSize)
                .limit(_pageSize)
                .sort({ text: 'asc' })
                .exec();
        
            if (id) {
                if (results.length) {
                    return results[0];
                } else {
                    throw new CustomError(`tag with id: ${id} not found`, ERROR.NOT_FOUND);
                }
            } else {
                return {
                    tags: results,
                    count: await Tag.countDocuments(query)
                };
            }
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static getSharable = (tag: ITag): ITagSharable => {
        return {
            id: tag._id,
            text: tag.text,
            createdAt: tag.createdAt,
            owner: tag.owner,
        };
    }

    static update = async (req: IRequest): Promise<ITag> => {
        const { text } = req.body;
        const { id } = req.params;

        if (!id) throw new CustomError('no entry id found', ERROR.NOT_FOUND);
        if (!ObjectID.isValid(id)) throw new CustomError('invalid id found', ERROR.INVALID_ARG);
        if (!text) throw new CustomError('no updatable content found', ERROR.NOT_FOUND);
        if (text && typeof text !== 'string') throw asCustomError(new CustomError('invalid content', ERROR.INVALID_ARG));

        const query = { owner: req.requestor.id, _id: id };
        let tag: ITag & Document<any, any>;

        try {
            tag = await Tag.findOne(query);
        } catch (err) {
            throw asCustomError(err);
        }

        if (tag) {
            tag.text = text;

            try {
                await tag.save();
                return tag;
            } catch (err) {
                throw asCustomError(err);
            }
        }
    }
}