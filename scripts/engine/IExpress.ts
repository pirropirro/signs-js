import { Application } from "express";

export interface IExpress {
    app: Application;
    start(): void;
}
