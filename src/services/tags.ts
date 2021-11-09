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

        const request = <IRequest>{
            body: {},
            query: {},
            params: {},
            requestor: req.requestor,
        };

        request.query.text = text;
        request.body.text = text;

        const existingTags = await TagsService.getTags(request);

        // tag already exists
        if (existingTags.count > 0) return existingTags.results[0];

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

    static async getTags (req: IRequest): Promise<ITags> {
        const {
            ids,
            text,
            page,
            pageSize,
        } = (req.query as {
            ids: string | string[];
            text: string;
            page: string;
            pageSize: string;
        });

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

        if (text) {
            if (typeof text !== 'string') throw new CustomError('invalid text', ERROR.INVALID_ARG);
            query.$and.push({ text: { $eq: text }});
        }

        if (ids) {
            let _ids: string | string[] = ids;
            if (typeof _ids === 'string') _ids = _ids.split(',').map(i => i.trim());
            query.$and.push({ _id: { $in: _ids } });
        }

        try {
            const results = await Tag
                .find(query)
                .skip(_page * _pageSize)
                .limit(_pageSize)
                .sort({ text: 'asc' })
                .exec();
        
            return {
                results,
                count: await Tag.countDocuments(query)
            };
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static getTagById = async (req: IRequest) => {
        const { id } = req.params;
        if (!id) throw new CustomError('no id found', ERROR.INVALID_ARG);

        const query = {
            $and: [{ owner: req.requestor.id }, { markedForDeletion: false }, { _id: id }],
        };

        try {
            const tag = await Tag.findOne(query);
            if (tag) {
                return tag;
            } else {
                throw new CustomError(`tag with id: ${id} not found`, ERROR.NOT_FOUND);
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