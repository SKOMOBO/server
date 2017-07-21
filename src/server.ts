import * as net from "net"

import {extract, config_db} from "./lib"

 async function store(values, connection){

    await connection.query('INSERT INTO arduino set ?' , values)

}

var server = net.createServer((socket)=>{
    let connection = config_db()

    // socket.write("Connected\n")
    console.log("Connected");
    // let data = data.toString("UTF8")
    socket.on("data", (data)=>{
        console.log(data.toString("UTF8"))
        let values = extract(data.toString("UTF8"))
        console.log(values)
        store(values, connection)
        
    })

    socket.pipe(socket)
})

server.listen(80, '0.0.0.0');


