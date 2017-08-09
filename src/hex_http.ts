import * as http from "http"

import {config_db,  has} from "./lib"

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

async function query(connection, query: String, values: any){
    if(!has(values, null)){
            let query
            try{
                query = await connection.query('INSERT INTO raspi set ?' , values)
                console.log("SQL: ", query.sql)
            }
            catch(err){
                console.log("error: ", err) // log the error that occured but don't crash server
            } 
    }
    else{
        console.log("Invalid request!")
    }
}

async function store(values, connection){

    query(connection, 'INSERT INTO raspi set ?' , values)
     
}

function isNotHTTP(received, callback: Function){
    if(received.includes("GET") || received.includes("POST") || received.includes("http")){
        callback()
    }
}

export var server = http.createServer((request:http.IncomingMessage, response:http.ServerResponse)=>{
    let connection = config_db()

    console.log(request.url)
    let data = request.url.slice(1)
    // evil but it works for now
 
    if(data.length !== 0 && data !== "/" && data != "/favicon.ico"){
        let values = extract(data)
        console.log(values)
        store(values, connection)
    }
    else{
        response.writeHead(400)
        console.log("No data")
    }

    
})

server.listen(81, '0.0.0.0', ()=>{
    console.log("Server listening on: %s:%s", require("ip").address(), 81);
})