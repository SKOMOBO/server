import * as net from "net"

import {config_db,  has} from "./lib"

function extract(data: String){

    // breaks up each value by a dash and removes / in the front
    let tokens: string[] = data.slice(2).split('_')
    // console.log

    let values = {}
    // route 1
    if(data[0] == '1'){
        
        //! server needs to create a new record not insert
        let col_names1 = ['BOX_ID', 'Time_sent', 'Dust1', 'Dust2_5', 'Dust10']
        // if(tokens.includes('')){
        //     return null
        // }
        tokens.map((value, index)=>{
            values[col_names1[index]] = value
        })

        let times: String[] = values['Time_sent'].split("-")
        let date = times.slice(0, 3).join("-")
        let time = times.slice(3, 6).join(":")
        values["Time_sent"] = date + " " + time

        // boxID 
        // day month year second minute hour
        // dust 1 2.5 10



    } // route 2
    else if(data[0] == '2'){

        //! server needs to insert new record not create
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
        // insert into the latest record that has the same box ID
        
        // boxID
        //
        // Temp * 100
        // humidity * 100
        // CO2
        // PIR
    }
    else{
        console.log('no values')
    }

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

async function store(route, values, connection){
    console.log("route: ", route)
    
    if(route === "1"){
        query(connection, 'INSERT INTO arduino set ?' , values)
       // Create new record
        // if(!has(values, null)){
        //     // let query = 
        //     let query
        //     try{
        //         query = await connection.query('INSERT INTO arduino set ?' , values)
        //         console.log("SQL: ", query.sql)
        //     }
        //     catch(err){
        //         console.log("error: ", err) // tell the client everything is ok
        //     } 
        // }
        // else{
        //     console.log("Invalid request!")
        // }
    }
    if(route === "2"){
         // insert data into existing most recent record
        // if(!has(values, null)){
            
            //! need to fix bug where it does not append if there is no record yet abd where it overwrites previous record if first one not sent
            // use received because it means that if the time sent wasnt received we still have a time to use
            query(connection, 'UPDATE arduino SET ? WHERE BOX_ID = ? ORDER BY Time_received DESC LIMIT 1', [ values, values['BOX_ID']])
        //    let query 
        //     try{
        //         query = await connection.query( 'UPDATE arduino SET ? WHERE BOX_ID = ? ORDER BY Time_received DESC LIMIT 1' , [ values, values['BOX_ID']])
        //     }
        //     catch(err){
        //         console.log("Error ", err)
        //     }            // query.catch()
        // }
        // else{
        //     console.log("Invalid request!")
        // }
    }
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
            store(received[0], values, connection)
        })
            
        // }
    })

    socket.pipe(socket)

    // socket.end()
})

server.listen(80, '0.0.0.0', ()=>{
    console.log("Server listening on: %s:%s", require("ip").address(), 80);
})
