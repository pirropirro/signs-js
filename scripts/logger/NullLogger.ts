import { ILogger } from "./ILogger";

export class NullLogger implements ILogger {
    debug(...messages: string[]) { }
    info(...messages: string[]) { }
    warning(...messages: string[]) { }
    error(...errors: (string | Error)[]) { }
    setLogLevel() { }
    setContext(context: string): ILogger {
        return this;
    }
}
