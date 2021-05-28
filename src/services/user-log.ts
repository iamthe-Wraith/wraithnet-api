import { IRequest, IUserLogEntry } from "../types";

export class UserLogService {
  static async create (req: IRequest): Promise<IUserLogEntry> {
    console.log('creating new userlog entry');
    return {
      owner: req.requestor.id,
      content: 'new user log entry',
    }
  }
}
