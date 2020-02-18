import { Request, Response, NextFunction } from "express";

import * as contro from "../controllers/controller";

export class Routes {

    public routes(app): void {
        /**
        Purpose: Get name count from array file
        Parameter:
            {
                firstNames = [//Array of name]
            }
        Return: Text string  
         */
        app.route('/name-count')
            .post((req: Request, res: Response) => {
                try {
                    contro.getContact(req, res)
                } catch (error) {
                    res.status(500).send("Something went wrong")
                }
            })
        /**
        Purpose: Get name count from parmas
        Parameter:
            {
                name
            }
        Return: Text string  
         */
        app.route('/name-count/:name')
            .get((req: Request, res: Response) => {
                try {
                    req.body.firstNames = [req.params.name]
                    // Data will come in API request data
                    contro.getContact(req, res)
                } catch (error) {
                    res.status(500).send("Something went wrong")
                }
            })
    }
} 