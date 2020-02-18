import * as fs from 'fs';
import { Request, Response, NextFunction } from "express";
const _ = require("lodash")
const path = require("path")
const oliverText = path.join(__dirname, '../../Text/oliver-twist.txt');
export class Routes {


    public routes(app): void {
        /**
        Purpose: schedule plingo api 
        Parameter:
            {
                firstNames = [//Array of name]
            }
        Return: Text string  
         */
        app.route('/name-count')
            .post((req: Request, res: Response) => {
                try {
                    // Data will come in API request data
                    let requestData = req.body.firstNames;
                    fs.readFile(oliverText, async function (err, data) {
                        if (err) {
                            throw "Can't read file";
                        }
                        // Read document from file
                        let documentParseToStringPhase = data.toString()
                        // Remove new \r \n \ufeff(new lines or any other key words that added because of parse to string)
                        let removeLinePhase = await documentParseToStringPhase.replace(/(?:\\[rn]|[\r\n\ufeff,.?!]+)+/g, " ")
                        // Remove un necessary spaces from document
                        let removeSpacePhase = await removeLinePhase.replace(/\s\s+/g, " ")
                        // Construct array for each key word to find occurances
                        let constructArray = removeSpacePhase.split(" ")
                        let sendObj = {}
                        // Filter occurances to find same name
                        let filteredNames = requestData.filter(e => constructArray.includes(e))
                        // Get Unique names from filterd names
                        filteredNames = _.uniq(filteredNames)
                        let occurances = []
                        // Find count from document for filtered names
                        _.forEach(filteredNames, function (value) {
                            let count = removeSpacePhase.match(new RegExp(value, "g")).length
                            sendObj[value] = count;
                            occurances.push([value, count])
                        });
                        // Sort Occurances in descending order 
                        occurances.sort(function (a, b) {
                            return b[1] - a[1]
                        });
                        let stringCon = ""
                        // Concate all occurances and create string to send it for text
                        occurances.forEach(function (element) {
                            stringCon = stringCon + element[0] + ":" + element[1] + "\n"
                        })
                        res.send(stringCon);
                    })
                } catch (error) {
                    res.status(500).send("Something went wrong")
                }

            })
    }
} 