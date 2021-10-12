import { Document } from 'mongoose';
import { request } from "express";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { ERROR } from "../constants";
import { DailyChecklistItem, IDailyChecklistItem, IDailyChecklistItemRequest, IDailyChecklistItemSharable } from "../models/dnd/daily-checklist-item";
import { IDnDCalendarDay, IRequest } from "../types";
import CustomError, { asCustomError } from "../utils/custom-error";
import { ObjectID } from 'mongodb';
import { Campaign, ICampaign, ICampaignRequest, ICampaignSharable } from '../models/dnd/campaign';
import { dndCalendar } from '../../static/dnd-calendar';
import { DnDDate } from '../utils/dndDate';

dayjs.extend(utc);

export class DnDService {
    static async addChecklistItem (req: IRequest): Promise<IDailyChecklistItem> {
        const { details, text } = (req.body as IDailyChecklistItemRequest);
        const { campaignId } = req.params;

        if (!campaignId) throw asCustomError(new CustomError('no campaign id found', ERROR.INVALID_ARG));
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
                campaignId,
                owner: req.requestor.id,
            });

            await item.save();

            return item;
        } catch (err) {
            throw asCustomError(err);      
        }
    }

    static async createCampaign (req: IRequest): Promise<ICampaign> {
        const { name, startDate } = req.body;

        if (!name) throw asCustomError(new CustomError('a name is required', ERROR.INVALID_ARG));
        
        let dndDate = new DnDDate();

        if (startDate) {
            try {
                const parsed = DnDDate.parse(startDate);
                dndDate.setDate(parsed.date);
                dndDate.setYear(parsed.year);
            } catch (err) {
                throw asCustomError(new CustomError('invalid start date', ERROR.INVALID_ARG));
            }
        }

        try {
            const campaign = new Campaign({
                name,
                startDate: dndDate.stringify(),
                currentDate: dndDate.stringify(),
                createdAt: dayjs.utc().format(),
                owner: req.requestor.id,
            });

            await campaign.save();

            return campaign;
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static async deleteCampaign (req: IRequest): Promise<void> {
        const { campaignId } = req.params;

        if (!campaignId) throw asCustomError(new CustomError('no campaign id found', ERROR.INVALID_ARG));

        const query = { owner: req.requestor.id, _id: campaignId };

        let campaign: ICampaign & Document<any, any>;

        try {
            campaign = await Campaign.findOne(query);
        } catch (err) {
            throw asCustomError(err);
        }

        if (!campaign) throw asCustomError(new CustomError('campaign not found', ERROR.NOT_FOUND));

        // delete all this campaign's checklist items
        try {
            const checklist = await DnDService.getChecklist(req);
            await Promise.all(checklist.map(item => {
                const simReq: IRequest = req;
                simReq.params = {
                    ...simReq.params,
                    id: item._id,
                };
                return DnDService.deleteChecklistItem(simReq);
            }));
        } catch (err) {
            throw asCustomError(err);
        }

        campaign.markedForDeletion = true;

        try {
            await campaign.save();
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static async deleteChecklistItem (req: IRequest): Promise<void> {
        const { id, campaignId } = req.params;

        if (!campaignId) throw asCustomError(new CustomError('no campaign id found', ERROR.INVALID_ARG));
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

    static getCalendar (): IDnDCalendarDay[] {
        return dndCalendar;
    }

    static async getCampaigns (req: IRequest): Promise<ICampaign[]> {
        try {
            const campaigns = await Campaign.find({
                owner: req.requestor.id,
                markedForDeletion: false,
            });
            return campaigns;
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static async getChecklist (req: IRequest): Promise<IDailyChecklistItem[]> {
        const { campaignId } = req.params;

        if (!campaignId) throw asCustomError(new CustomError('no campaign id found', ERROR.INVALID_ARG));

        try {
            const checklist = await DailyChecklistItem
                .find({
                    campaignId,
                    owner: req.requestor.id,
                    markedForDeletion: false,
                })
                .sort({ position: 1 });
            
            return checklist;
        } catch (err: any) {
            throw asCustomError(err);
        }
    }

    static getSharableCampaign = (campaign: ICampaign): ICampaignSharable => {
        const sharable = {
            id: campaign._id,
            createdAt: campaign.createdAt,
            owner: campaign.owner,
            name: campaign.name,
            startDate: campaign.startDate,
            currentDate: campaign.startDate,
        };

        return sharable;
    }

    static getSharableItem = (item: IDailyChecklistItem): IDailyChecklistItemSharable => {
        const sharable: IDailyChecklistItemSharable = {
            id: item._id,
            campaignId: item.campaignId,
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

    static async updateCampaign (req: IRequest): Promise<ICampaign> {
        const { name } = (req.body as ICampaignRequest);
        const { campaignId } = req.params;

        if (!campaignId) throw asCustomError(new CustomError('no campaign id found', ERROR.INVALID_ARG));
        if (!name) throw asCustomError(new CustomError('no updatable content found', ERROR.INVALID_ARG));
        if (!!name && typeof name !== 'string') throw asCustomError(new CustomError('invalid name', ERROR.INVALID_ARG));

        let campaign: ICampaign & Document<any, any>;

        try {
            campaign = await Campaign.findOne({
                owner: req.requestor.id,
                _id: campaignId,
                markedForDeletion: false, 
            });
        } catch (err: any) {
            throw asCustomError(err);
        }

        if (!campaign) throw asCustomError(new CustomError('campaign not found', ERROR.NOT_FOUND));
        campaign.name = name;

        try {
            await campaign.save();
            return campaign;
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static async updateChecklistItem (req: IRequest): Promise<IDailyChecklistItem> {
        const { details, text } = (req.body as IDailyChecklistItemRequest);
        const { id, campaignId } = req.params;

        if (!campaignId) throw asCustomError(new CustomError('no campaign id found', ERROR.INVALID_ARG));
        if (!id) throw asCustomError(new CustomError('no checklist item id found', ERROR.INVALID_ARG));
        if (!text && !details) throw asCustomError(new CustomError('no updatable content found', ERROR.UNPROCESSABLE));
        if (!!text && typeof text !== 'string') throw asCustomError(new CustomError('invalid text', ERROR.INVALID_ARG));
        if (details && typeof details !== 'string') throw asCustomError(new CustomError('invalid details', ERROR.INVALID_ARG));

        let item: IDailyChecklistItem & Document<any, any>;

        try {
            const query = {
                owner: req.requestor.id,
                campaignId,
                _id: id,
                markedForDeletion: false,
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
}