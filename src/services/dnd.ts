import { ERROR } from "../constants";
import { DailyChecklistItem, IDailyChecklistItem, IDailyChecklistItemRequest, IDailyChecklistItemSharable } from "../models/dnd/daily-checklist-item";
import { IRequest } from "../types";
import CustomError, { asCustomError } from "../utils/custom-error";

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
                .find({ owner: req.requestor.id })
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
}