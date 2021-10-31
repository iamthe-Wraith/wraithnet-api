import { Document } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { ERROR } from "../constants";
import { DailyChecklistItem, IDailyChecklistItem, IDailyChecklistItemRequest, IDailyChecklistItemSharable } from "../models/dnd/daily-checklist-item";
import { ICollectionResponse, IRequest } from "../types";
import CustomError, { asCustomError } from "../utils/custom-error";
import { ObjectID } from 'mongodb';
import { Campaign, ICampaign, ICampaignRequest, ICampaignSharable } from '../models/dnd/campaign';
import { DnDDate } from '../utils/dndDate';
import { IPC, IPCRef, IPCRequest, IPCSharable, IPCSharableRef, PC } from '../models/dnd/pc';
import { dndExp } from '../../static/dnd-exp';
import { DnDRace, IDnDRace, IDnDRaceSharable } from '../models/dnd/race';
import { DnDClass, IDnDClass, IDnDClassSharable } from '../models/dnd/class';
import { INote, INoteRef, Note } from '../models/note';
import { NotesService } from './notes';

dayjs.extend(utc);

type NoteType = 'location' | 'npc' | 'session';
type NoteIdList = 'locations' | 'npcs' | 'sessions';

interface IExpResult {
    exp: number;
    expForNextLevel: number;
    level: number;
    leveledUp: boolean;
}

const getExpForNextLevel = (exp: number) => {
    let xp = 0;

    for (let i = 0; i < dndExp.length; i++) {
        if (dndExp[i].threshold <= exp) {
            const nextLevel = dndExp[i + 1];
            if (nextLevel) {
                if (nextLevel.threshold > exp) xp = nextLevel.threshold;
            } else {
                // is already at the highest level
                xp = null;
            }
        }
    }

    return xp;
}

const getLevel = (exp: number) => {
    let level = 0;

    for (let i = 0; i < dndExp.length; i++) {
        if (dndExp[i].threshold <= exp) {
            const nextLevel = dndExp[i + 1];
            if (nextLevel) {
                if (nextLevel.threshold > exp) level = nextLevel.level;
            } else {
                // is already at the highest level
                level = dndExp[i].level;
            }
        }
    }

    return level;
}

const parseExp = (exp: string): number => {
    const regex = /\D+/; // get non-numerical characters
    let expClone = `${exp}`;

    let isInvalid = false;
    let minus = false;

    if (expClone[0] === '-') {
        minus = true;
        expClone = expClone.split('-').join('');
    }
    if (expClone[0] === '+') {
        expClone = expClone.split('+').join('');
    }

    if (!expClone) isInvalid = true;

    if (!isInvalid) {
        const nonDigits = expClone.match(regex);
        if (!!nonDigits) isInvalid = true;
    }

    let v = 0;
    if (!isInvalid) {
        v = parseInt(expClone);
        if (isNaN(v) || v <= 0) isInvalid = true;
    }

    if (isInvalid) throw asCustomError(new CustomError('invalid exp received', ERROR.INVALID_ARG));

    return minus ? (v * -1) : v;
}

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
                dndDate = new DnDDate(startDate);
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


    static async createClass (req: IRequest): Promise<IDnDClass> {
        const { name } = req.body;

        if (!name) throw asCustomError(new CustomError('a class name is required', ERROR.INVALID_ARG));

        const _class = new DnDClass({
            name,
            createdAt: dayjs.utc().format(),
        });

        try {
            await _class.save();
            return _class;
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static async createNote (req: IRequest, type: NoteType): Promise<INote> {
        const campaign = await DnDService.getCampaign(req);
        if (!campaign) return;

        const { name } = (req.body as { name: string });
        
        if (!name) throw new CustomError('a name is required', ERROR.INVALID_ARG);

        const _noteReq = { ...req };
        _noteReq.body = {
            name,
            category: `dnd_${type}`,
        }
        const note = await NotesService.createNote(_noteReq as IRequest);
        
        try {
            await Campaign.updateOne({
                _id: campaign.id,
                $push: { [`${type}s`]: note.id }
            });

            return note;
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static async createPC (req: IRequest): Promise<IPC> {
        const { age, name, race, classes = [], exp } = (req.body as IPCRequest);
        const { campaignId } = req.params;

        if (!campaignId) throw asCustomError(new CustomError('no campaign id found. a pc must be added to a campaign', ERROR.INVALID_ARG));
        if (!name) throw asCustomError(new CustomError('a name is required', ERROR.INVALID_ARG));
        if (!race) throw asCustomError(new CustomError('a race is required', ERROR.INVALID_ARG));
        if (classes.length === 0) throw asCustomError(new CustomError('at least one class is required', ERROR.INVALID_ARG));
        if (!Array.isArray(classes)) throw asCustomError(new CustomError('invalid classes format', ERROR.INVALID_ARG));
        if (!age) throw asCustomError(new CustomError('an age is required', ERROR.INVALID_ARG));

        let _race: IDnDRace;
        let _classes: IDnDClass[];
        
        try {
            const campaigns = await DnDService.getCampaigns(req);
            const campaign = campaigns.find(c => `${c.id}` === campaignId);
            if (!campaign) throw new CustomError('invalid campaign', ERROR.INVALID_ARG);
        } catch (err) {            
            throw asCustomError(err);
        }

        try {
            const races = await DnDService.getRaces(req);
            _race = races.find(r => `${r._id}` === race);
            if (!_race) throw new CustomError('invalid race', ERROR.INVALID_ARG);
        } catch (err) {
            throw asCustomError(err);
        }

        try {
            const validClasses: IDnDClass[] = [];
            const invalidClasses: IDnDClass[] = [];
            const allClasses = await DnDService.getClasses(req);
            allClasses.forEach(c => {
                const found = classes.find(cc => `${c._id}` === cc);
                if (found) {
                    validClasses.push(c);
                } else {
                    invalidClasses.push(c);
                }
            });
            if (invalidClasses.length !== 0) throw new CustomError('only valid class ids allowed', ERROR.INVALID_ARG);
            _classes = validClasses;
        } catch (err) {
            throw asCustomError(err);
        }

        if (!!_race && !!_classes) {
            const pc = new PC({
                owner: req.requestor.id,
                campaignId,
                name,
                race: _race,
                classes,
                age,
                exp: 0,
            });

            if (typeof exp === 'number') pc.exp = exp;
    
            try {
                await pc.save();
                return pc;
            } catch (err) {
                throw asCustomError(err);
            }
        }
    }

    static async createRace (req: IRequest): Promise<IDnDRace> {
        const { name } = req.body;

        if (!name) throw asCustomError(new CustomError('a name is required', ERROR.INVALID_ARG));

        const race = new DnDRace({
            name,
            createdAt: dayjs.utc().format(),
        });

        try {
            await race.save();
            return race;
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

    static async deleteClass (req: IRequest): Promise<void> {
        const { classId } = req.params;

        if (!classId) throw asCustomError(new CustomError('no class id found', ERROR.INVALID_ARG));

        try {
            const _class = await DnDClass.findOneAndDelete({ _id: classId });

            if (!_class) throw new CustomError(`class with id: ${classId} not found`, ERROR.NOT_FOUND);
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static async deletePC (req: IRequest): Promise<void> {
        const { campaignId, id } = req.params;

        if (!campaignId) throw asCustomError(new CustomError('no campaign id found', ERROR.INVALID_ARG));
        if (!id) throw asCustomError(new CustomError('no checklist item id found', ERROR.INVALID_ARG));

        const query = {
            campaignId,
            owner: req.requestor.id,
            markedForDeletion: false,
            _id: id,
        }

        let pc: IPC & Document<any, any>;

        try {
            pc = await PC.findOne(query);

            if (!pc) throw new CustomError('pc not found', ERROR.NOT_FOUND);
        } catch (err) {
            throw asCustomError(err);
        }

        if (pc) {
            pc.markedForDeletion = true;

            try {
                await pc.save();
            } catch (err) {
                throw asCustomError(err);
            }
        }
    }

    static async deleteRace (req: IRequest): Promise<void> {
        const { raceId } = req.params;

        if (!raceId) throw asCustomError(new CustomError('no race id found', ERROR.INVALID_ARG));

        try {
            const race = await DnDRace.findOneAndDelete({ _id: raceId });

            if (!race) throw new CustomError(`race with id: ${raceId} not found`, ERROR.NOT_FOUND);
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static async getCampaign (req: IRequest): Promise<ICampaign & Document<any, any, IPC>> {
        const { campaignId } = req.params;

        if (!campaignId) throw new CustomError('no campaignId found', ERROR.INVALID_ARG);

        try {
            const campaign = await Campaign.findOne({
                owner: req.requestor.id,
                markedForDeletion: false,
                _id: campaignId,
            });
            return campaign;
        } catch (err) {
            throw asCustomError(err);
        }
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

    static getClasses = async (req: IRequest): Promise<IDnDClass[]> => {
        try {
            const classes = await DnDClass
                .find({})
                .sort({ name: 1 });

            return classes;
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static getNotes = async (req: IRequest, type: NoteType ): Promise<ICollectionResponse<INoteRef>> => {
        const {
            page,
            pageSize,
        } = (req.query as {
            page: string;
            pageSize: string;
        });
        
        const campaign = await DnDService.getCampaign(req);
        if (!campaign) return;

        const query = {
            $and: [
                { owner: req.requestor.id },
                { _id: { $in: campaign[`${type}s` as NoteIdList] } },
                { category: `dnd_${type}` },
                { markedForDeletion: false },
            ]
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

        try {
            const results = await Note
                .find(query)
                .skip(_page * _pageSize)
                .limit(_pageSize)
                .sort({ _id: 'desc' })
                .exec();

            return {
                results,
                count: await Note.countDocuments(query)
            };
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static async getPC (req: IRequest): Promise<IPC & Document<any, any, IPC>> {
        const { campaignId, id } = req.params;

        const query = {
            _id: id,
            campaignId,
            owner: req.requestor.id,
            markedForDeletion: false,
        }

        try {
            const pc = await PC
                .findOne(query)
                .populate('classes')
                .populate('race');

            if (!pc) throw new CustomError('pc not found', ERROR.NOT_FOUND);

            return pc;
        } catch (err) {
            throw asCustomError(err);
        }
    }    

    static async getPCs (req: IRequest): Promise<(IPC & Document<any, any, IPC>)[]> {
        const { campaignId } = req.params;

        const query = {
            campaignId,
            owner: req.requestor.id,
            markedForDeletion: false,
        }

        try {
            return await PC
                .find(query)
                .populate('classes')
                .populate('race')
                .sort({ name: 1 });
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static getRaces = async (req: IRequest): Promise<IDnDRace[]> => {
        try {
            const races = await DnDRace
                .find({})
                .sort({ name: 1 });
            return races;
        } catch (err) {
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

    static getSharableClass = (c: IDnDClass): IDnDClassSharable => {
        return {
            name: c.name,
            id: c._id,
        };
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

    static getSharablePC = (pc: IPC): IPCSharable => {
        return {
            ...DnDService.getSharablePCRef(pc),
            note: pc.note,
        };
    }

    static getSharablePCRef = (pc: IPCRef): IPCSharableRef => {
        return {
            id: pc._id,
            owner: pc.owner,
            campaignId: pc.campaignId,
            name: pc.name,
            race: DnDService.getSharableRace(pc.race),
            classes: pc.classes.map(c => DnDService.getSharableClass(c)),
            age: pc.age,
            exp: pc.exp,
            expForNextLevel: getExpForNextLevel(pc.exp),
            level: getLevel(pc.exp),
        }
    }

    static getSharableRace = (race: IDnDRace): IDnDRaceSharable => {
        return {
            name: race.name,
            id: race._id,
        };
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


    static async updateClass (req: IRequest): Promise<IDnDRace> {
        const { name } = req.body;
        const { classId } = req.params;

        if (!classId) throw new CustomError('resource not found', ERROR.INVALID_ARG);
        if (!name) throw new CustomError('no updatable content found', ERROR.INVALID_ARG);

        let _class: IDnDClass & Document<any, any, IDnDClass>;

        try {
            _class = await DnDClass.findOne({ _id: classId });
            if (!_class) throw new CustomError(`class with id: ${classId} not found`, ERROR.NOT_FOUND);
        } catch (err) {
            throw asCustomError(err);
        }

        if (_class) {
            if (name) _class.name = name;

            try {
                await _class.save();
                return _class;
            } catch (err: any) {
                throw asCustomError(err);
            } 
        }
    }

    static async updatePartyXP (req: IRequest): Promise<{ exp: IExpResult, pc: IPCRef }[]> {
        const { exp } = req.body;
        const { campaignId } = req.params;

        if (!campaignId) throw asCustomError(new CustomError('no campaign id found', ERROR.INVALID_ARG));
        if (!exp) throw asCustomError(new CustomError('no updatable exp found', ERROR.INVALID_ARG));

        const xp = parseExp(exp);

        let pcs: (IPC & Document<any, any, IPC>)[];
        try {
            pcs = await DnDService.getPCs(req);
        } catch (err) {
            throw asCustomError(err);
        }

        const xpEach = Math.floor(xp / pcs.length);

        const response: { exp: IExpResult, pc: IPCRef }[] = [];

        for (const pc of pcs) {
            const newExp = pc.exp + xpEach;
            const currentLevel = getLevel(pc.exp);
            const newLevel = getLevel(newExp);
            const leveledUp = currentLevel < newLevel;
            pc.exp = newExp;

            try {
                await pc.save();

                response.push({
                    pc,
                    exp: {
                        exp: pc.exp,
                        expForNextLevel: getExpForNextLevel(pc.exp),
                        level: newLevel,
                        leveledUp
                    }
                })
            } catch (err) {
                throw asCustomError(err);
            }
        }

        return response;
    }

    static async updatePC (req: IRequest): Promise<IPC> {
        const { age, name, race, classes } = req.body;
        const { campaignId, id } = req.params;

        if (!age && !name && !race && !classes) throw asCustomError(new CustomError('no updatable content found', ERROR.INVALID_ARG));

        if (classes) {
            if (classes.length === 0) throw asCustomError(new CustomError('at least one class is required', ERROR.INVALID_ARG));
            if (!Array.isArray(classes)) throw asCustomError(new CustomError('invalid classes format', ERROR.INVALID_ARG));
        }

        const query = {
            owner: req.requestor.id,
            campaignId,
            _id: id,
            markedForDeletion: false,
        };

        let pc: IPC & Document<any, any, IPC>;

        try {
            pc = await PC.findOne(query);

            if (!pc) throw new CustomError('pc not found', ERROR.NOT_FOUND);
        } catch (err) {
            throw asCustomError(err);
        }

        if (pc) {
            if (age) pc.age = age;
            if (name) pc.name = name;
            if (race) pc.race = race;
            if (classes) pc.classes = classes;

            try {
                await pc.save();
                return pc;
            } catch (err) {
                throw asCustomError(err);
            }
        }
    }

    static async updatePCExp (req: IRequest): Promise<IExpResult> {
        const { exp } = req.body;
        const { campaignId, id } = req.params;

        if (!campaignId) new CustomError('no campaign id found', ERROR.INVALID_ARG);
        if (!id) new CustomError('no pc id found', ERROR.INVALID_ARG);
        if (!exp) new CustomError('no updatable exp found', ERROR.INVALID_ARG);

        const xp = parseExp(exp);

        let pc: IPC & Document<any, any, IPC>;
        try {
            pc = await DnDService.getPC(req);
            if (!pc) throw new CustomError('pc not found', ERROR.NOT_FOUND);
        } catch (err) {
            throw asCustomError(err);
        }

        const newExp = pc.exp + xp;
        const currentLevel = getLevel(pc.exp);
        const newLevel = getLevel(newExp);
        const leveledUp = currentLevel < newLevel;

        pc.exp = newExp;

        try {
            await pc.save();
            return {
                exp: pc.exp,
                expForNextLevel: getExpForNextLevel(pc.exp),
                level: newLevel,
                leveledUp
            };
        } catch (err) {
            throw asCustomError(err);
        }
    }

    static async updateRace (req: IRequest): Promise<IDnDRace> {
        const { name } = req.body;
        const { raceId } = req.params;

        if (!raceId) throw new CustomError('resource not found', ERROR.INVALID_ARG);
        if (!name) throw new CustomError('no updatable content found', ERROR.INVALID_ARG);

        let race: IDnDRace & Document<any, any, IDnDRace>;

        try {
            race = await DnDRace.findOne({ _id: raceId });
            if (!race) throw new CustomError(`race with id: ${raceId} not found`, ERROR.NOT_FOUND);
        } catch (err) {
            throw asCustomError(err);
        }

        if (race) {
            if (name) race.name = name;

            try {
                await race.save();
                return race;
            } catch (err: any) {
                throw asCustomError(err);
            } 
        }
    }
}