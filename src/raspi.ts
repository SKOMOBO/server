import * as http from "http"

import {has, repeat, store} from "./lib"

let mysql = require('mysql2')


//rewrite using seneca


var connection = mysql.createConnection({host:'localhost', user: 'root', database: 'skomobo', password: 'dev1234'});

// use this https://github.com/senecajs/seneca-mysql-store
async function handleRequest(request:http.IncomingMessage, response:http.ServerResponse){

    // for browser testing

    // this should be in iis too so that this request just sends back nice icon not throw error
    if(request.url != '/favicon.ico'){
       console.log(request.url)
       
       // move this to the iis server
       if(request.url.slice(0,5) == "/rapi"){
        console.log(request.rawTrailers)
         let values = JSON.parse(request.rawTrailers)
         
         store(connection, response, "raspi", values)
        //  if(!has(values, null)){
        //     await connection.query('INSERT INTO sensor_data set ?' , values)
        //     // tell the client everything is ok
        //     response.writeHead(200, {"Content-Type": "text/HTML"})
        //  }
        // else{
        //     console.log("Invalid request!")
        //     response.writeHead(400, {"Content-Type": "text/HTML"})
        // }
       }
    }

    //send the response
    response.end()

}

// put it on https somehow for this route? because the raspi can actually handle it 

//Lets start our server
http.createServer(handleRequest).listen(82, '0.0.0.0', function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://%s:%s", require("ip").address(), 82);
});
