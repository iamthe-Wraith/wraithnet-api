import { ICustomError } from './types';

/* ENCRYPTION */
export const SALT_ROUNDS = 10;

/* ERRORS */
export const ERROR: ICustomError = {
  AUTHENTICATION: { name: 'Authentication', code: 401 },
  CONFLICT: { name: 'Conflict', code: 409 },
  GEN: { name: 'Error', code: 400 },
  FORBIDDEN: { name: 'Forbidden', code: 403 }, // user is known, but lacks the necessary permissions
  INVALID_ARG: { name: 'InvalidArgument', code: 422 },
  NOT_ALLOWED: { name: 'NotAllowed', code: 405 },
  NOT_FOUND: { name: 'NotFound', code: 404 },
  SERVER: { name: 'ServerError', code: 500 },
  SERVICE: { name: 'ServiceError', code: 422 },
  TOKEN: { name: 'JsonWebTokenError', code: 400 },
  UNAUTHORIZED: { name: 'Unauthorized', code: 401 }, // invalid credentials have been provided
  UNPROCESSABLE: { name: 'UnprocessableEntity', code: 422 }
};

/* HEADERS */
export const AUTHORIZATION_HEADER = 'Authorization';
export const SERVICES_HEADER = 'Service-Name';

/* REGEX */
export const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const USERNAME_FORMAT = /^[a-zA-Z0-9]*$/;

/* ROUTES */
export const ADMIN_ROUTE = '/admin';
export const API_ROUTE = '/api';
export const AUTH_ROUTE = '/auth';
export const DND_ROUTE = '/dnd';
export const IMAGE_ROUTE = '/image';
export const NOTES_ROUTE = '/notes';
export const PROFILE_ROUTE = '/profile';
export const STATUS_ROUTE = '/status';
export const TAGS_ROUTE = '/tags';
export const TEST_ROUTE = '/test';
export const UPLOAD_ROUTE = '/upload';
export const USER_LOG_ROUTE = '/user-log';
export const USERS_ROUTE = '/users';
export const V1_ROUTE = '/v1';

/* SERVICES */
export const SERVICES = new Set(['wraithnet']);

/* TOKEN */
export const TOKEN_REMOVE = 'none';
export const TOKEN_ALGORITHM = 'RS256';
export const TOKEN_EXPIRATION = (60 * 60 * 24 * 7); // is in seconds, not milliseconds
export const TOKEN_THRESHOLD = (30 * 60); // is in seconds, not milliseconds

/* USERS */
export const DEFAULT_USERS_TO_RETURN = 10;
export const MAX_USERS_TO_RETURN = 100;
export const MIN_PASSWORD_LENGTH = 8;