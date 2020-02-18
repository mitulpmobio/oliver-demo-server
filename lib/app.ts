import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/Routes";
var cors = require('cors')
class App {
    public app: express.Application;
    public routePrv: Routes = new Routes();
    public mongoUrl: string = 'mongodb://dalenguyen:123123@localhost:27017/CRMdb';

    constructor() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
    }

    private config(): void {
        this.app.use(cors())
        this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(express.static('public'));
        this.app.options('*', (req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Add other headers here
            res.setHeader('Access-Control-Allow-Methods', 'POST'); // Add other methods here
            res.send();
        });
    }
}

export default new App().app;