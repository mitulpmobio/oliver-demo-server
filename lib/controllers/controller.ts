import * as fs from 'fs';
import { Request, Response, NextFunction } from "express";
const _ = require("lodash")
const path = require("path")
const oliverText = path.join(__dirname, '../../Text/oliver-twist.txt');


export const getContact = (req: Request, res: Response) => {
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
        let sendObj = {
            name: "",
            count: 0
        }
        // Filter occurances to find same name
        let filteredNames = requestData.filter(e => constructArray.includes(e))
        let unMatchedNames = requestData.filter(e => !constructArray.includes(e))

        // Get Unique names from filterd names
        filteredNames = _.uniq(filteredNames)
        let occurances = []
        let unMatchedOccurances = []
        // Find count from document for filtered names
        _.forEach(filteredNames, function (value) {
            let count = removeSpacePhase.match(new RegExp(value, "g")).length
            sendObj.name = value;
            sendObj.count = count;
            occurances.push([value, count])
        });
        // unmatched names 
        _.forEach(unMatchedNames, function (value) {
            unMatchedOccurances.push([value, 0])
        });

        // Sort Occurances in descending order 
        occurances.sort(function (a, b) {
            return b[1] - a[1]
        });
        // concat both array matched and un matched names
        let concatArray = occurances.concat(unMatchedOccurances);
        let stringCon = ""
        // Concate all occurances and create string to send it for text
        concatArray.forEach(function (element) {
            stringCon = stringCon + element[0] + ":" + element[1] + "\n"
        })
        if (req.params.name) {
            if (filteredNames.length === 0)
                sendObj = {
                    name: "",
                    count: 0
                }
            res.send(sendObj)
        } else {
            if (filteredNames.length === 0)
                stringCon = "No Data matched"
            res.send(stringCon);
        }
    })
};