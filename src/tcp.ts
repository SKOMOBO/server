import * as net from "net"

export var app = net.createServer((socket)=>{
    console.log("Connected")

    socket.on("data", (data)=>{

        console.log("got data")
        let received = data.toString("UTF8")
        console.log(received)
    })
})

import * as http from "http"


/**
 * This function passes the data to massey for storage
 * 
 * @param {string} data 
 */
function to_massey(data: string){

    let options = {
        host: "seat-skomobo.massey.ac.nz",
        port: 80,
        path: 'dynamic',
        method: 'GET'
    }

    let route = ''
    if(data[0] == '0'){
        route = '/'
    }else if(data[0] == '1'){
        route = '/raspi_'
    }

    // remove first routing values
    options.path = route + data.slice(2)
    
    http.get(options, (response)=>{
        console.log(options.path)
    })
}

// aws exposes port 80 using ip tables to forward to 8000
const port = 8000
app.listen(port, ()=>{
    console.log("Server listening on: %s:%s", require("ip").address(), port);
})
