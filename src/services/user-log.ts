import { ERROR } from "../constants";
import { IUserLogEntry, UserLogEntry } from "../models/user-log";
import { IRequest } from "../types";
import CustomError, { asCustomError } from "../utils/custom-error";

export class UserLogService {
  static async create (req: IRequest): Promise<IUserLogEntry> {
    const { content, tags = [] } = req.body;

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
  
      await entry.save();
      return entry;
    } catch (err) {
      throw asCustomError(err);      
    }
  }
}
