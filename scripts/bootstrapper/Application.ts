import { forEach } from "lodash";
import { Container } from "inversify";

import { IModule } from "./IModule";
import { ControllerUtil } from "./Route";
import { IExpress } from "../engine/IExpress";
import { MainModule } from "../modules/MainModule";
import { IMiddleware } from '../middlewares/IMiddleware';
import { IExpressConfig } from "../engine/IExpressConfig";
import { IController, IHandlerFactory } from '../engine/IController';

let container = new Container();

export class Application {
    protected container = container;
    constructor() {
        this.register(new MainModule());
    }

    register(module: IModule): boolean {
        module.modules(this.container);
        return true;
    }

    run() {
        let exp = this.container.get<IExpress>("IExpress");
        let factory = this.container.get<IHandlerFactory>("IHandlerFactory");
        let { suffix = "api" } = this.container.get<IExpressConfig>("IExpressConfig");

        this.container.getAll<IMiddleware>("IMiddleware").forEach(m => exp.app.use(m.transform.bind(m)));
        this.container.getAll<IController>("IController").forEach(c => {
            let { base, routes } = ControllerUtil.getMetadata(c.constructor);
            forEach(routes, (metadata => exp.app[metadata.type](`/${suffix}${base}${metadata.location}`, factory.create(c, metadata))));
        });

        exp.start();
    }
}