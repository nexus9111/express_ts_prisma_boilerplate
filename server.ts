import { App } from "./app";
import { UserRoute } from "./router/user.route";

const app = new App([new UserRoute()]);

app.listen();