import { App } from "./app";
import { UserRoute } from "./router/user.route";

const app = new App([
    new UserRoute()
]);

app.listen();

/*
    FOR DEV PURPOSES, NODEMON WILL BE USED TO RESTART THE SERVER
    YOU CAN ADD CODE TO RUN CODE BEFORE THE SERVER IS RESTARTED
*/
// process.on('SIGUSR2', async function () { 
//     console.log('SIGTERM received'); 
    
//     process.exit(0);
// })