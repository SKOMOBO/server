import * as net from "net"

import {extract, config_db} from "./lib"

 async function store(values, connection){

    await connection.query('INSERT INTO arduino set ?' , values)

}

var server = net.createServer((socket)=>{
    console.log("Server listening on: http://%s:%s", require("ip").address(), 80);
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


