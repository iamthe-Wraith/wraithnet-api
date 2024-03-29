import express from "express";
import { AUTH_ROUTE, ERROR } from "../constants";
import { IUser } from "../models/user";
import Auth from "../utils/auth";
import CustomError from "../utils/custom-error";
import Token from "../utils/token";
import { UsersService } from "./user";

export class AuthService {
  static async authenticate (req:express.Request):Promise<string> {
    const { username, password } = <{
      username:string;
      password:string;
    }>req.body;
  
    let user: IUser;
  
    if (username && password) {
      const userRequest = <express.Request>{
        url: AUTH_ROUTE,
        query: {},
        params: {}
      };
      userRequest.params.username = username;
  
      try {
        const results = await UsersService.get(userRequest);
        user = results.users[0];
  
        if (!user.statuses.banned && !user.statuses.markedForDeletion) {
          // authenticate user
          await Auth.isValidPassword(password, user.password);
  
          // user authenticated...create and return token
          return Token.generate(Token.generatePayload(user));
        } else {
          const msg = user.statuses.banned
            ? 'banned'
            : 'marked for deletion';
  
          throw new CustomError(`this account has been ${msg}`, ERROR.FORBIDDEN);
        }
      } catch (err) {
        let error:CustomError;
  
        if (err.isCustomError) {
          error = err;
        } else if (err.errors) {
          error = new CustomError(err.errors[Object.keys(err.errors)[0]], ERROR.INVALID_ARG);
        } else {
          error = new CustomError(err.message);
        }
  
        throw error;
      }
    } else {
      throw new CustomError(`no ${!username ? 'username' : 'password'} found`, ERROR.UNAUTHORIZED);
    }
  }
}