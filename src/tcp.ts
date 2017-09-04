import * as net from "net"

export var app = net.createServer((socket)=>{
    console.log("Connected")

    socket.on("data", (data)=>{

        console.log("got data")
        let received = data.toString("UTF8")
        console.log(received)
    })
})

const port = 80
app.listen(port, ()=>{
    console.log("Server listening on: %s:%s", require("ip").address(), port);
})
