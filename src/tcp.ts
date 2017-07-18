import * as net from "net"

var server = net.createServer((socket)=>{
    socket.write("Connected\n")
    console.log("Connected");

    socket.on("data", (data)=>{
        console.log(data.toString("UTF8"))
    })

    socket.pipe(socket)
})

server.listen(1337, '0.0.0.0');


