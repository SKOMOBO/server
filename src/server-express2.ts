import * as express from "express"

import {connection, config_db, has, extract, store} from "./lib"

var app = express()

function extract_raspi(data: String){
    
    // breaks up each value by a dash and removes / in the front
    let tokens: string[] = data.split('_')
    // console.log

    let values = {}

    // assume reqs hit router nodejs that will probably be programmed with express? first which then splits into raspi and arduino respectively

    let col_names1 = ['BOX_ID', 'Time_sent', 'Decibels', 'Distance1', 'Distance2', 'Distance3', 'Distance4', 'Distance5', 'Distance6', 'Distance7']

    // fix this monkey patch so that the time sent gets converted to hex properly
    // store the original time token before we accidentally convert it form hex
    let correct_time = tokens[1]
    tokens.map((value, index)=>{

        // converts from HEX to string integers
        values[col_names1[index]] = String(parseInt("0x" + value))
    })

    // let times: String[] = values['Time_sent'].split("-")
    let times: String[] = correct_time.split("-")
    let date = times.slice(0, 3).join("-")
    let time = times.slice(3, 6).join(":")
    values["Time_sent"] = date + " " + time

    return values
}

app.get("/raspi*", (req, resp) =>{
    console.log(req.url.slice(6))
    let values = extract_raspi(req.url.slice(6))
    console.log(values)
    store(resp, "raspi", values)
})

// async function get_data(db, id){
//     // return only this boxes data
//     return 
// }

let json2csv = require('json2csv')  

app.get("/get*", async (req, resp) =>{
    // resp.send("getting data!")
    let user_pass = req.query.pass
    let correct_pass = require("../../src/download_password.json")
    
    if(user_pass === correct_pass.password){
        resp.send("correct password")
         if(req.query.id != null){
            
            connection.query('SELECT * from arduino where Box_ID = ' + req.query.id, (err, results , fields)=>{
                console.log("arduino: ", results)
            })
            connection.query('SELECT * from raspi where Box_ID = ' + req.query.id, (err, results , fields)=>{
                console.log("raspi: ", results)
            })

            // console.log("arduino: ", arduino)
            // console.log("raspi: ", raspi)
            // add in express use it to clean all this shit
            // attach the file to the resp and send the resp
            // resp.attach()
        }
        else{
            // let arduino =  await connection.query('SELECT * from arduino' )
            // let raspi =  await connection.query('SELECT * from raspi' )

            connection.query('SELECT * from arduino', (err, results , fields)=>{
                console.log("arduino: ", results)
                resp.send(json2csv())
            })
            connection.query('SELECT * from raspi', (err, results , fields)=>{
                console.log("raspi: ", results)
            })

            // console.log("arduino: ", arduino.results)
            // console.log("raspi: ", raspi)
            // return all data
        }
    }
})

app.get("/favicon.ico", (req, resp) =>{
    resp.send("We really need to get a icon for this")
})

app.get("/*", (req, resp) =>{
    let url = req.url.slice(1)
    console.log(url)
    let values = extract(url)
    console.log(values)
    // store(resp, Number(data[1]), values)
    store(resp, "arduino", values)
})


app.listen(81, '0.0.0.0', function () {
    console.log("Server listening on: http://%s:%s", require("ip").address(), 81);
})