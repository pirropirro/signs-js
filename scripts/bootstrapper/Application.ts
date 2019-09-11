import { forEach } from "lodash";
import { Container } from "inversify";

import { IModule } from "./IModule";
import { ControllerUtil } from "./Route";
import { IServer } from "../engine/IServer";
import { MainModule } from "../modules/MainModule";
import { IMiddleware } from '../middlewares/IMiddleware';
import { IServerConfig } from "../engine/IServerConfig";
import { IController, IHandlerFactory } from '../engine/IController';

let container = new Container();

export interface IApplication {
    run(): void;
    readonly container: Container;
    register(module: IModule): IApplication;
}

export class Application implements IApplication {
    constructor() {
        this.register(new MainModule());
    }

    get container() {
        return container;
    }

    register(module: IModule): IApplication {
        module.modules(this.container);
        return this;
    }

    run(): void {
        let exp = this.container.get<IServer>("IServer");
        let factory = this.container.get<IHandlerFactory>("IHandlerFactory");
        let { prefix = "api" } = this.container.get<IServerConfig>("IServerConfig");

        this.container.getAll<IMiddleware>("IMiddleware").forEach(m => exp.app.use(m.transform.bind(m)));
        this.container.getAll<IController>("IController").forEach(c => {
            let { base, routes } = ControllerUtil.getMetadata(c.constructor);
            forEach(routes, (metadata => exp.app[metadata.type](`/${prefix}${base}${metadata.location}`, factory.create(c, metadata))));
        });

        exp.start();
    }
}