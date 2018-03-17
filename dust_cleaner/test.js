const express = require('express')
const app = express()
const multer = require('multer')
const helmet = require("helmet")
const compress = require("compression")
const request = require('request')
const upload = multer()
const json2csv = require('json2csv');

// for testing remove later
app.use(express.static('static'))

// Enable GZIP compression for improved performance
app.use(compress())

// Fix headers to make things more secure
app.use(helmet())

app.get('/ping', (req, resp)=>{
    resp.send('hello')
})

app.listen(82,'0.0.0.0', ()=>{
    console.log("Dust cleaner started")
    console.log("Server listening on: http://%s:%s", require("ip").address(), 82);
})


//var csv is the CSV file with headers
function csvJSON(csv){
    var lines=csv.split("\n");

    var result = [];

    var headers=lines[0].split(",");
    headers = headers.map((header)=>{
        header = header.replace(/'/g, "")
        header = header.replace(/\r/g, "")
        return header.replace(/"/g, "")
    })
    for(var i=1;i<lines.length;i++){

        let obj = {};
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
