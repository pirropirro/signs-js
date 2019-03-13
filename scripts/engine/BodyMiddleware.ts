import { injectable } from "inversify";
import * as bodyParser from "body-parser";
import { IMiddleware } from "./IMiddleware";

@injectable()
export class BodyMiddleware implements IMiddleware {
    transform = bodyParser.json();
}