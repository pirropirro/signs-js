import { interfaces } from "inversify";

import { ILogger } from '../logger/ILogger';
import { Express } from "../engine/Express";
import { IExpress } from "../engine/IExpress";
import { IModule } from "../bootstrapper/IModule";
import ConsoleLogger from '../logger/ConsoleLogger';
import { IMiddleware } from '../engine/IMiddleware';
import { CORSMiddleware } from '../engine/CORSMiddleware';
import { BodyMiddleware } from '../engine/BodyMiddleware';
import { LoggerMiddleware } from '../logger/LogMiddleware';
import { HelloController } from '../engine/HelloController';
import { IController, IHandlerFactory, HandlerFactory } from '../engine/IController';

export class MainModule implements IModule {
    modules(container: interfaces.Container): void {
        container.bind<IExpress>("IExpress").to(Express).inSingletonScope();
        container.bind<interfaces.Container>("Container").toConstantValue(container);

        container.bind<IMiddleware>("IMiddleware").to(CORSMiddleware);
        container.bind<IMiddleware>("IMiddleware").to(BodyMiddleware);
        container.bind<IMiddleware>("IMiddleware").to(LoggerMiddleware);

        container.bind<IHandlerFactory>("IHandlerFactory").to(HandlerFactory);

        container.bind<ILogger>("ILogger").to(ConsoleLogger);
        container.bind<IController>("IController").to(HelloController);
    }
}