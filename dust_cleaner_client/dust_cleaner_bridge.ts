import {clean_data} from "../src/database_manager"

import * as express from "express"


// const parser = require("body-parser")

const app = express()

// bugsnag integration only enable if we are in production
import * as bugsnag from "bugsnag"
if (app.settings.env !== "development"){
    bugsnag.register(require("./global_keys.json").bugsnag_key)
    app.use(bugsnag.requestHandler);
    app.use(bugsnag.errorHandler);
}


//var csv is the CSV file with headers
function csvJSON(csv: String){
    var lines=csv.split("\n");

    var result = [];

    var headers=lines[0].split(",");
    headers = headers.map((header)=>{
        header = header.replace(/'/g, "")
        header = header.replace(/\r/g, "")
        return header.replace(/"/g, "")
    })
    for(var i=1;i<lines.length;i++){

        let obj: any = {};
        let currentline=lines[i].split(",");

        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
         // Convert to floats and ints
        obj.Temperature = Number(obj.Temperature)
        obj.Humidity = Number(obj.Humidity)
        obj.CO2 = Number(obj.CO2.slice(0, -1))
        obj.Dust1 = Number(obj.Dust1)
        obj.Dust2_5 = Number(obj.Dust2_5)
        obj.Dust10 = Number(obj.Dust10)
        result.push(obj);

    }
    
    return result; //JavaScript object
    // return JSON.stringify(result); //JSON
}

import * as multer from "multer"
var helmet = require("helmet")
var compress = require("compression")
// export var app = express()

// Enable GZIP compression for improved performance
app.use(compress())

// Fix headers to make things more secure
app.use(helmet())


var prev_PM10:number = 0.0;
var prev_PM2_5:number= 0.0;
var result: any;
var socket = require("net").Socket
// var socket = new Socket();

function prep_data(pm10:number, pm2_5:number){
    pm10 = pm10 / 1000;
    pm2_5 = pm2_5 / 1000;
            
    var result = {"PM10": pm10, "PM2_5": pm2_5, "PM10_diff": pm10 - prev_PM10, "PM2_5_diff": pm2_5 - prev_PM2_5};
    prev_PM10 = pm10;
    prev_PM2_5 = pm2_5;
    return result;
}

const net = require('net');

// const client = new net.Socket();
import * as http from "http"
import * as request from "request"

const upload = multer()
const json2csv = require('json2csv');

function data_valid(data){
    let i = 0

    while(data[i] === null){
        i++
    }
    if(i == data.length ){
        return false
    }else{
        return true
    }
}


app.post("/clean", upload.single("file"), (req, resp)=>{
    
    // adust the original file name to include _clean at the end
    const file_name = req.file.originalname.substr(0, req.file.originalname.length - 4) + "_clean.csv"
    let file_text = req.file.buffer.toString("utf8")

    let data = csvJSON(file_text)
    
    //! file donwload works just make python integration now
    //! male tjat seperate function that gets called directly from the other server

    let prepped = data.map((item)=>{
        return prep_data(item.Dust10,item.Dust2_5)
    })

    let prepped_wrapped = {"data": prepped}
 
    request.post({url:'http://localhost:9999/', body: JSON.stringify(prepped_wrapped), json:true}, (error, response, body)=>{
  
        if(error === null){
            if(data_valid(body)){
               
                resp.set({'Content-Disposition': 'attachment; filename="' + file_name + '"'})
                resp.send(json2csv(body));
            }
            else{
                resp.send("File contains no salvagable values, please contact the developer Ryan, Mikael or Yu Wang")
            }
        }else{
            resp.send("Server error, please contact the developer and try again later :)")
            bugsnag.notify(Error(JSON.stringify(error)))
        }
    })

})



app.listen(82, ()=>{
    console.log("Dust cleaner started")
})

