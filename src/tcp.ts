import * as net from "net"

export var app = net.createServer((socket)=>{
    console.log("Connected")

    socket.on("data", (data)=>{

        console.log("got data")
        let received = data.toString("UTF8")
        console.log(received)
    })
})

// aws exposes port 80 using ip tables to forward to 8000
const port = 8000
app.listen(port, ()=>{
    console.log("Server listening on: %s:%s", require("ip").address(), port);
})
