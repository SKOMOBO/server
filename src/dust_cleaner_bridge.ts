import {clean_data} from "./database_manager"

import * as express from "express"

// const parser = require("body-parser")

const app = express()
//var csv is the CSV file with headers
function csvJSON(csv){
    
    var lines=csv.split("\n");

    var result = [];

    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){

        var obj = {};
        var currentline=lines[i].split(",");

        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }
    
    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}

// app.use(parser.urlencoded({ extended: true }))
// app.use(parser.urlencoded({ extended: false }))
// app.use(parser.json())
// app.use(parser.text())

import * as multer from "multer"
var helmet = require("helmet")
var compress = require("compression")
// export var app = express()

// Enable GZIP compression for improved performance
app.use(compress())

// Fix headers to make things more secure
app.use(helmet())

//! file donwload works just make python integration now

//! male tjat seperate function that gets called directly from the other server
const upload = multer()
app.post("/clean", upload.single("file"), (req, resp)=>{
    
    // adust the original file name to include _clean at the end
    const file_name = req.file.originalname.substr(0, req.file.originalname.length - 4) + "_clean.csv"
    
    //  send the final csv
    resp.set({'Content-Disposition': 'attachment; filename="' + file_name + '"'})
    resp.send(req.file.buffer.toString("utf8"));
})


app.listen(82, ()=>{
    console.log("Dust cleaner started")
})

