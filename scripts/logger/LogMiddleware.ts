import { injectable, inject } from "inversify";
import { Response, Request, NextFunction } from "express-serve-static-core";

import { IMiddleware } from "../engine/IMiddleware";
import { ILogger } from "./ILogger";
import { ControllerUtil } from '../bootstrapper/Route';

@injectable()
export class LoggerMiddleware implements IMiddleware {
    constructor(@inject("ILogger") private logger: ILogger) {
        logger.setContext("LoggerMiddleware")
    }

    transform(req: Request, res: Response, next: NextFunction): void {
        this.logger.debug(req.method, req.originalUrl, req.url);
        return next();
    }
}