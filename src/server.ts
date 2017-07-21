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
        let col_names2 = ['Temperature', 'Humidity', 'CO2', 'Presence']
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
        console.log('invalid route')
    }

    return values
}

async function store(route, values, connection){

    // if(values !== {}){
        
    //     let query = await connection.query('INSERT INTO arduino set ?' , values)
    // }

    
    if(!has(values, null)){
        await connection.query('INSERT INTO ' + database_name + ' set ?' , values)
        // tell the client everything is ok
        response.writeHead(200, {"Content-Type": "text/HTML"})
    }
    else{
        console.log("Invalid request!")
        response.writeHead(400, {"Content-Type": "text/HTML"})
    }
       
    // console.log(query.sql);
}

export var server = net.createServer((socket)=>{
    let connection = config_db()

    socket.write("Connected")
    console.log("Connected");

    // let data = data.toString("UTF8")
    socket.on("data", (data)=>{

        let received = data.toString("UTF8")
        console.log(received)
        
        let isHTTP : boolean = received.includes("GET") || received.includes("POST") || received.includes("http")
        
        if(!isHTTP){
            let values = extract(received)
            console.log(values)
            store(data[0], values, connection)
        }
    })

    socket.pipe(socket)

    // socket.end()
})

server.listen(80, '0.0.0.0', ()=>{
    console.log("Server listening on: %s:%s", require("ip").address(), 80);
});
