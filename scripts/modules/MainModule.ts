import { interfaces } from "inversify";

import { ILogger } from '../logger/ILogger';
import { Server } from "../engine/Server";
import { IServer } from "../engine/IServer";
import { IModule } from "../bootstrapper/IModule";
import ConsoleLogger from '../logger/ConsoleLogger';
import { HelloController } from '../engine/HelloController';
import { IController, IHandlerFactory, HandlerFactory } from '../engine/IController';

export class MainModule implements IModule {
    modules(container: interfaces.Container): void {
        container.bind<IServer>("IServer").to(Server).inSingletonScope();
        container.bind<interfaces.Container>("Container").toConstantValue(container);

        container.bind<IHandlerFactory>("IHandlerFactory").to(HandlerFactory);

        container.bind<ILogger>("ILogger").to(ConsoleLogger);
        container.bind<IController>("IController").to(HelloController);
    }
}