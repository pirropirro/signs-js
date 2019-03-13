import { Dictionary } from "lodash";
import { interfaces, decorate, injectable } from "inversify";

import { IRoute } from "../engine/IController";
export type RouteMetadata = { name: string, type: RouteType, location: string };

export enum RouteType {
    GET = "get",
    POST = "post",
    PUT = "put",
    DELETE = "delete"
}

export function Controller(base: string) {
    return function (target: interfaces.Newable<any>) {
        decorate(injectable(), target);
        Reflect.defineMetadata("controller:base", base, target);
        return target;
    };
}

export function Route(type: RouteType, location: string): any {
    return function (target: IRoute, name: string) {
        Reflect.defineMetadata(`controller:route:${name}`, { type: type, location: location, name: name }, target.constructor);
        let routes = (Reflect.getMetadata(`controller:routes`, target.constructor) || []);
        routes.push(name);
        Reflect.defineMetadata(`controller:routes`, routes, target.constructor);
        return target;
    };
}

export class ControllerUtil {
    static getMetadata(controller: Function): { base: string, routes: Dictionary<RouteMetadata> } {
        let routes = {};
        Reflect.getMetadata(`controller:routes`, controller).forEach((name: string) => {
            let route = Reflect.getMetadata(`controller:route:${name}`, controller);
            if (route) routes[name] = route;
        });

        return { base: Reflect.getMetadata("controller:base", controller), routes: routes };
    }
}
