import { IController } from "./IController";
import { Controller, Route, RouteType } from "../bootstrapper/Route";

@Controller("/helloworld")
export class HelloController implements IController {

    @Route(RouteType.GET, "/")
    async helloWorld(): Promise<string> {
        return "Hello World!";
    };
}
