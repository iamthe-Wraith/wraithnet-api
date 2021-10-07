import { Document } from 'mongoose';
import { request } from "express";
import { ERROR } from "../constants";
import { DailyChecklistItem, IDailyChecklistItem, IDailyChecklistItemRequest, IDailyChecklistItemSharable } from "../models/dnd/daily-checklist-item";
import { IRequest } from "../types";
import CustomError, { asCustomError } from "../utils/custom-error";
import { ObjectID } from 'mongodb';

export class DnDService {
    static async addChecklistItem (req: IRequest): Promise<IDailyChecklistItem> {
        const { details, text } = (req.body as IDailyChecklistItemRequest);

        if (!text) throw asCustomError(new CustomError('content is required', ERROR.INVALID_ARG));
        if (typeof text !== 'string') throw asCustomError(new CustomError('invalid content', ERROR.INVALID_ARG));
        if (!!details && typeof details !== 'string') throw asCustomError(new CustomError('invalid content', ERROR.INVALID_ARG));
        
        try {
            const itemConfig: IDailyChecklistItemRequest = {
                position: await DailyChecklistItem.countDocuments({ owner: req.requestor.id }),
                text,
            };
            if (!!details) {
                itemConfig.details = details;
            }

            const item = new DailyChecklistItem({
                ...itemConfig,
                owner: req.requestor.id,
            });

            await item.save();

            return item;
        } catch (err) {
            throw asCustomError(err);      
        }
    }

    static async getChecklist (req: IRequest): Promise<IDailyChecklistItem[]> {
        try {
            const checklist = await DailyChecklistItem
                .find({ owner: req.requestor.id, markedForDeletion: false })
                .sort({ position: 1 });
            
            return checklist;
        } catch (err: any) {
            throw asCustomError(err);
        }
    }

    static getSharableItem = (item: IDailyChecklistItem): IDailyChecklistItemSharable => {
        const sharable: IDailyChecklistItemSharable = {
            id: item._id,
            text: item.text,
            position: item.position,
            createdAt: item.createdAt,
            owner: item.owner,
        };

        if (item.details) sharable.details = item.details;

        return sharable;
    }

    static getSharableList = (checklist: IDailyChecklistItem[]): IDailyChecklistItemSharable[] => {
        return checklist.map(item => DnDService.getSharableItem(item));
    }

    static async updateChecklistItem (req: IRequest): Promise<IDailyChecklistItem> {
        const { details, text } = (req.body as IDailyChecklistItemRequest);
        const { id } = req.params;

        if (!id) throw asCustomError(new CustomError('no checklist item id found', ERROR.INVALID_ARG));
        if (!text && !details) throw asCustomError(new CustomError('no updatable content found', ERROR.UNPROCESSABLE));
        if (!!text && typeof text !== 'string') throw asCustomError(new CustomError('invalid content', ERROR.INVALID_ARG));
        if (details && typeof details !== 'string') throw asCustomError(new CustomError('invalid content', ERROR.INVALID_ARG));

        let item: IDailyChecklistItem & Document<any, any>;

        try {
            const query = {
                owner: req.requestor.id,
                _id: id,
                markedForDeltion: false,
            };

            item = await DailyChecklistItem.findOne(query);
        } catch (err: any) {
            throw asCustomError(err);
        }

        if (!item) throw asCustomError(new CustomError('checklist item not found', ERROR.NOT_FOUND));
        if (text) item.text = text;
        if (details) item.details = details;

        try {
            await item.save();
            return item;
        } catch (err: any) {
            throw asCustomError(err);
        }
    }

    static async deleteChecklistItem (req: IRequest): Promise<void> {
        const { id } = req.params;

        if (!id) throw asCustomError(new CustomError('no checklist item id found', ERROR.INVALID_ARG));
        if (!ObjectID.isValid(id)) throw new CustomError('invalid id found', ERROR.INVALID_ARG);

        const query = { owner: req.requestor.id, _id: id };

        let item: IDailyChecklistItem & Document<any, any>;

        try {
            item = await DailyChecklistItem.findOne(query);
        } catch (err) {
            throw asCustomError(err);
        }

        if (!item) {
            throw asCustomError(new CustomError('checklist item not found', ERROR.NOT_FOUND));
        }

        item.markedForDeletion = true;

        try {
            await item.save();
        } catch (err) {
            throw asCustomError(err);
        }
    }
}