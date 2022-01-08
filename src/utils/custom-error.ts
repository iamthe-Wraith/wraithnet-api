import { ERROR } from '../constants';
import { ICustomErrorBody } from '../types';

class CustomError extends Error {
    data: ICustomErrorBody;
    isCustomError = true;

    constructor(msg:string, data?:ICustomErrorBody) {
        super(msg);

        this.data = data || ERROR.GEN;
    }
}

export const asCustomError = (err: any, code?: ICustomErrorBody) => {
    let error: CustomError;

    if (err.isCustomError) {
        error = err;
    } else if (err.errors) {
        error = new CustomError(err.errors[Object.keys(err.errors)[0]], ERROR.INVALID_ARG);
    } else if (typeof err === 'string') {
        error = new CustomError(err, code);
    } else {
        error = new CustomError(err.message, code);
    }

    return error;
};

export default CustomError;
