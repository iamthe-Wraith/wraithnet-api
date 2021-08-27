import { ITag, ITagSharable } from "../models/tag";

export class TagService {
    static getSharable = (tag: ITag): ITagSharable => {
        return {
            id: tag._id,
            text: tag.text,
            createdAt: tag.createdAt,
            owner: tag.owner,
        };
    }
}