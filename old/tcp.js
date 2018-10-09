// Please note that this is the TCP to HTTP conversion server for the AWS proxy

const net = require('net')

const request = require('request')

const massey = 'http://seat-skomobo.massey.ac.nz'
// massey url
// send json post request to massey server
// send back received packet to client / whatever HTTP response says ok

var app = net.createServer((socket)=>{
    // console.log("Connected")

    socket.on("data", (data)=>{

        // console.log("got data")
        let received = data.toString("UTF8")

        if(received.slice(0,4) == "POST"){
            let window = JSON.parse(received.slice(received.indexOf('{')))
            send_window(window)

            let cannedResponse = new Buffer(
                "HTTP1.1 200 OK\r\n" +
                "Content-Length: 12\r\n" +
                "Connection: Keep-Alive\r\n" +
                "\r\n" +
                "Data received\n"
              );
            socket.write(cannedResponse)
        }
        else{
            console.log(received)
            // to_massey(received)
            // is arduino data
        }
    })
})

function send_window(data, ca){
    // request.post(massey + '/window_moved', data, ()=>{
    let fake = "http://localhost:80"
    request.post(fake + '/window_moved', {json:data}, (err)=>{
        console.log("Forwarded data: ", data)
        
        if(err !== null){
            console.error(err)
        }
    })
}

/**
 * This function passes the data to massey for storage
 * 
 * @param {string} data 
 */
function to_massey(data){

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

    request(massey + route, function (error, response, body) {
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
