import { Request, Response, NextFunction } from "express-serve-static-core";

export interface IMiddleware {
    transform(req: Request, res: Response, next: NextFunction): void;
} 