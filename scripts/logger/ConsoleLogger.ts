import * as moment from 'moment';
import { injectable, inject, optional } from "inversify";

import { ILogger, LogLevel, ILoggerConfig, DefaultLoggerConfig } from "./ILogger";

@injectable()
class ConsoleLogger implements ILogger {
    private context: string;
    constructor(@inject("ILoggerConfig") @optional() private config: ILoggerConfig = new DefaultLoggerConfig()) { }

    debug(...messages: (string | number)[]) {
        if (this.config.logLevel <= LogLevel.Debug) this.print("DEBUG", ...messages);
    }

    info(...messages: (string | number)[]) {
        if (this.config.logLevel <= LogLevel.Info) this.print("INFO", ...messages);
    }

    warning(...messages: (string | number)[]) {
        if (this.config.logLevel <= LogLevel.Warning) this.print("WARN", ...messages);
    }

    error(...errors: ((string | number) | Error)[]) {
        this.print("ERROR", ...errors);
    }

    private print(level: string, ...messages: any[]): void {
        console.log(`[${moment().format("HH:mm:ss")}]`, `[${level}]`, this.context, ...messages);
    }

    setContext(context: (string | number)): ILogger {
        this.context = `[${context}]`;
        return this;
    }
}

export default ConsoleLogger