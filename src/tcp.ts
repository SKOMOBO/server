import * as net from "net"

export var app = net.createServer((socket)=>{
    // console.log("Connected")

    socket.on("data", (data)=>{

        // console.log("got data")
        let received = data.toString("UTF8")

        // console.log(received)

        to_massey(received)
    })
})

// import * as http from "http"
import * as request from "request"

/**
 * This function passes the data to massey for storage
 * 
 * @param {string} data 
 */
function to_massey(data: string){

    // let options = {
    //     host: "seat-skomobo.massey.ac.nz",
    //     port: 80,
    //     path: 'dynamic',
    //     method: 'GET'
    // }

    // convert the routes the HTTP ones
    let route = ''
    if(data[0] == '0'){
        route = '/' + data.slice(2)
    }else if(data[0] == '1'){
        route = '/raspi_' + data.slice(2)
    }

    request('http://seat-skomobo.massey.ac.nz' + route, function (error, response, body) {
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.
    });
    // remove first routing values
    // options.path = route + data.slice(2)
    
    // send a HTTP get request to massey
    // console.log(options.path)
    // http.get(options, (response)=>{
    //     console.log(String(response.statusCode) + response.statusMessage)
    //     // console.log(options.path)
    // })
}

// aws exposes port 80 using ip tables to forward to 8000
const port = 8000
app.listen(port, ()=>{
    console.log("Server listening on: %s:%s", require("ip").address(), port);
})
