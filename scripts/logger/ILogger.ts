export enum LogLevel { Debug, Info, Warning, Error }

export interface ILogger {
    debug(...messages: (string | number)[]): void;
    info(...messages: (string | number)[]): void;
    warning(...messages: (string | number)[]): void;
    error(...errors: ((string | number) | Error)[]): void;
    setContext(context: (string | number)): ILogger;
}

export interface ILoggerConfig {
    logLevel: LogLevel;
}

export class DefaultLoggerConfig implements ILoggerConfig {
    logLevel = LogLevel.Debug
}