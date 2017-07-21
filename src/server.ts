import * as net from "net"

import {config_db} from "./lib"

function extract(data: String){

    // breaks up each value by a dash and removes / in the front
    let tokens: string[] = data.slice(3).split('_')
    
    let values = {}
    // route 1
    if(data[0] == '1'){
        
        //! server needs to create a new record not insert
        let col_names1 = ['BOX_ID', 'Time_sent', 'Dust1', 'Dust2_5', 'Dust10']
        if(tokens.includes('')){
            return null
        }
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

async function store(values, connection){

    await connection.query('INSERT INTO arduino set ?' , values)

}

export var server = net.createServer((socket)=>{
    console.log("Server listening on: %s:%s", require("ip").address(), 80);
    let connection = config_db()

    socket.write("Connected")
    console.log("Connected");

    // let data = data.toString("UTF8")
    socket.on("data", (data)=>{
        console.log(data.toString("UTF8"))
        let values = extract(data.toString("UTF8"))
        console.log(values)
        store(values, connection)
    })

    socket.pipe(socket)

    // socket.end()
})

server.listen(80, '0.0.0.0');
