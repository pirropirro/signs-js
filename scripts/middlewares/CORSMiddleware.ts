import { injectable } from "inversify";
import { Response, Request, NextFunction } from "express-serve-static-core";

import { IMiddleware } from "./IMiddleware";

@injectable()
export class CORSMiddleware implements IMiddleware {
    transform(req: Request, res: Response, next: NextFunction): void {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET,DELETE,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
        return next();
    }
}