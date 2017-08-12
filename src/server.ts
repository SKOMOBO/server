import {createServer, Server,IncomingMessage, ServerResponse} from "http"

import {connection, config_db, has, extract, store} from "./lib"

import *  as URL from "url"

import * as express from "express"

function extract_raspi(data: String){

    // breaks up each value by a dash and removes / in the front
    let tokens: string[] = data.split('_')
    // console.log

    let values = {}

    // assume requests hit router nodejs that will probably be programmed with express? first which then splits into raspi and arduino respectively

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

async function handler(request:IncomingMessage, response:ServerResponse)
{
    
    console.log(request.url)

    // remove leading /
    let url = request.url
    let data = url.slice(1)

    // evil but it works for now
 
    if(data.length !== 0 && data !== "/" && data != "/favicon.ico"){

        if(data.slice(0, 5) == "raspi"){
            let values = extract_raspi(data.slice(6))
            console.log(values)
            store(response, "raspi", values)
        }
        // else if(data.slice(0, 2) == "get"){
            
        //     let pass = require('../../download_password.json')
        //     let values: URL.Url = URL.parse(url)

        //     if(values.query !== null){
        //         if(values.query.pass == pass){
                    
        //             if(values.query.ID !== null){
        //                 // return only this boxes data
        //                 let arduino = await connection.query('SELECT * from arduino where Box_ID = ?', values.query.ID )
        //                 let raspi = await connection.query('SELECT * from raspi where Box_ID = ?', values.query.ID )
                        
        //                 // add in express use it to clean all this shit
        //                 // attach the file to the response and send the response
        //                 response.attach()
        //             }
        //             else{
        //                 // return all data
        //             }
        //         }
        //     }
        
        // }
        else{
            let values = extract(data)
            console.log(values)
            // store(response, Number(data[1]), values)
            store(response, "arduino", values)
        }
    
    }
    else{
        response.writeHead(400)
        console.log("No data")
    }
    
}

export var server = createServer(handler)

server.listen(81, '0.0.0.0', function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://%s:%s", require("ip").address(), 81);
});
