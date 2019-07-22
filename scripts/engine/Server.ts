import * as express from "express";
import { inject, injectable } from "inversify";

import { IServer } from "./IServer";
import { ILogger } from '../logger/ILogger';
import { IServerConfig } from "./IServerConfig";

@injectable()
export class Server implements IServer {
    public app: express.Application = express();

    constructor(@inject("IServerConfig") private config: IServerConfig,
        @inject("ILogger") private logger: ILogger) {
        this.logger.setContext("Server")
        this.setupTerminationHandlers();
    }

    public start() {
        this.app.listen(this.config.port, this.config.ipaddress, () =>
            this.logger.info(`Listen on port ${this.config.port}...`));
    }

    private terminator(sig?: string): void {
        if (typeof sig === "string") {
            this.logger.info(`Received ${sig} - terminating sample app ...`);
            process.exit(1);
        }
        this.logger.info(`Node server stopped.`);
    }

    private setupTerminationHandlers() {
        process.on("exit", () => this.terminator());

        ["SIGHUP", "SIGINT", "SIGQUIT", "SIGILL", "SIGTRAP", "SIGABRT",
            "SIGBUS", "SIGFPE", "SIGUSR1", "SIGSEGV", "SIGUSR2", "SIGTERM"
        ].forEach((element: any) => process.on(element, () => this.terminator(element)));
    };
}
