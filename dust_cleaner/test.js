const express = require('express')
const app = express()
const multer = require('multer')
const helmet = require("helmet")
const compress = require("compression")
const request = require('request')
const upload = multer()
const json2csv = require('json2csv');
const parser = require("body-parser")
app.use(parser)

// for testing remove later
app.use(express.static('static'))

// Enable GZIP compression for improved performance
app.use(compress())

// Fix headers to make things more secure
app.use(helmet())

app.get('/ping', (req, resp)=>{
    resp.send('hello')
})

app.post("/clean", (req, resp)=>{
    console.log(req.body)
    let input = JSON.parse(req.body)

    let prepped = prep_data(input.Dust10, input.Dust2_5)

    request.post({url:'http://localhost:9999/', body: JSON.stringify(prepped), json:true}, (error, response, body)=>{
    
        if(error === null){
            if(data_valid(body)){
               
                // resp.set({'Content-Disposition': 'attachment; filename="' + file_name + '"'})
                // resp.send(json2csv(body));
                input["Dust10"] = body["PM10"]
                input["Dust2_5"] = body["PM2_5"]
                resp.send(JSON.stringify(input))
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

app.listen(82,'0.0.0.0', ()=>{
    console.log("Dust cleaner started")
    console.log("Server listening on: http://%s:%s", require("ip").address(), 82);
})

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

function prep_data(pm10, pm2_5){
    pm10 = pm10 / 1000;
    pm2_5 = pm2_5 / 1000;
            
    var result = {"PM10": pm10, "PM2_5": pm2_5, "PM10_diff": pm10 - prev_PM10, "PM2_5_diff": pm2_5 - prev_PM2_5};
    prev_PM10 = pm10;
    prev_PM2_5 = pm2_5;
    return result;
}

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
