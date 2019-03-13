import { isString } from "lodash";

export interface IException {
    body: string;
    statusCode: number;
}

export class Exception extends Error implements IException {
    public body: string;
    public statusCode: number;

    constructor(body: any, statusCode = 500) {
        super();
        this.statusCode = statusCode;
        this.body = JSON.stringify(isString(body) ? { message: `ERROR | ${body}` } : (!body.message ? { message: JSON.stringify(body) } : body));
    }
}

export class BadRequestException extends Exception {
    constructor(body: string | any) {
        super(isString(body) ? { message: `${body}` } : body, 400);
    }
}

export class UnauthorizedException extends Exception {
    constructor(body: string | any) {
        super(isString(body) ? { message: `${body}` } : body, 401);
    }
}

export class ForbiddenException extends Exception {
    constructor(body: string | any) {
        super(isString(body) ? { message: `${body}` } : body, 403);
    }
}

export class ServerErrorException extends Exception { }

export function isException(ex: Exception): boolean {
    return ex.statusCode !== 200;
}
