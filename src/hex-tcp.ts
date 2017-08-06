import * as net from "net"

import {config_db,  has} from "./lib"

function extract(data: String){

    // breaks up each value by a dash and removes / in the front
    let tokens: string[] = data.slice(2).split('_')
    // console.log

    let values = {}

    // assume requests hit router first which then splits into raspi and arduino respectively

    let col_names1 = ['BOX_ID', 'Time_sent', 'Dust1', 'Dust2_5', 'Dust10']

    tokens.map((value, index)=>{

        // converts from octal HEX or whatever is thrown at it to string integers
        values[col_names1[index]] = String(parseInt(value))
    })

    let times: String[] = values['Time_sent'].split("-")
    let date = times.slice(0, 3).join("-")
    let time = times.slice(3, 6).join(":")
    values["Time_sent"] = date + " " + time

    // boxID 
    // day month year second minute hour
    // dust 1 2.5 10

    let col_names2 = ['BOX_ID', 'Temperature', 'Humidity', 'CO2', 'Presence']
    if(tokens.includes('')){
        return null
    }
    tokens.map((value, index)=>{
        values[col_names2[index]] = value
    })

    values['Presence'] = values['Presence'] == '1'
    values['Temperature'] = Number(values['Temperature']) / 100
    values['Humidity'] = Number(values['Temperature']) / 100

    return values
}

async function query(connection, query: String, values: any){
    if(!has(values, null)){
            // let query = 
            let query
            try{
                query = await connection.query('INSERT INTO arduino set ?' , values)
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

export var server = net.createServer((socket)=>{
    let connection = config_db()

    socket.write("Connected")
    console.log("Connected");

    // let data = data.toString("UTF8")
    socket.on("data", (data)=>{

        let received = data.toString("UTF8")
        console.log(received)
        
        // let isHTTP : boolean = received.includes("GET") || received.includes("POST") || received.includes("http")
        
        // if(!isHTTP){
        isNotHTTP(received, ()=>{
            let values = extract(received)
            console.log(values)
            store(values, connection)
        })
            
        // }
    })

    socket.pipe(socket)

    // socket.end()
})

server.listen(80, '0.0.0.0', ()=>{
    console.log("Server listening on: %s:%s", require("ip").address(), 80);
})
