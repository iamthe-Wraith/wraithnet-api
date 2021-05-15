import { ERROR } from '../constants';
import { ICustomErrorBody } from '../types';

class CustomError extends Error {
  data: ICustomErrorBody;
  isCustomError = true;

  constructor (msg:string, data?:ICustomErrorBody) {
    super(msg);

    this.data = data || ERROR.GEN;
  }
}

export default CustomError;
