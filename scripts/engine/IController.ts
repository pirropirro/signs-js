import { Request, RequestHandler } from "express";
import { injectable, inject, multiInject, optional } from "inversify";

import { ILogger } from "../logger/ILogger";
import { RouteMetadata, ControllerUtil } from '../bootstrapper/Route';

export interface IController { }

export type IRoute = (request: Request) => Promise<any>;

export interface IRouteDecorator {
    decorate(route: IRoute, controller: IController, metadata: RouteMetadata): IRoute;
}

export interface IHandlerFactory {
    create(controller: IController, metadata: RouteMetadata): RequestHandler;
}

@injectable()
export class HandlerFactory implements IHandlerFactory {
    constructor(@multiInject("IRouteDecorator") @optional() private extenders: IRouteDecorator[] = [],
        @inject("ILogger") private logger: ILogger) {
        logger.setContext("HandlerFactory");
    }

    create(controller: IController, metadata: RouteMetadata): RequestHandler {
        let route: IRoute = controller[metadata.name];
        let { base } = ControllerUtil.getMetadata(controller.constructor);
        this.logger.info(`/api${base}${metadata.location} [${metadata.type.toUpperCase()}] Registered!`);

        return (req, res) => this.extenders.reduce((r, dec) =>
            dec.decorate(r, controller, metadata), route.bind(controller))(req)
            .then(data => res.send(data))
            .catch(err => {
                this.logger.error(`[${req.method} - ${req.url}]`, err);
                res.status((err ? err.statusCode : null) || 500).send(err.body ? err.body : err);
            });

    }
}