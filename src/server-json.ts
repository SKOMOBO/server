
///<reference path="../node_modules/@types/node/index.d.ts"/>
import * as http from "http"

import { has, repeat} from "./lib"

let mysql = require('mysql2')


///// need two seperate routes for data, raspi and arduino

//// use arduino json to save memory space and remove the need for my extractor

// setup load testing at a later date

var connection = mysql.createConnection({host:'localhost', user: 'root', database: 'skomobo', password: 'dev1234'});

//// this is becoming crazy --- look at using seneca to make this a micro service architecture


async function handleRequest(request: http.IncomingMessage, response: http.ServerResponse){

    // for browser testing
    if(request.url != '/favicon.ico'){

       let values = JSON.parse(request.headers)
       console.log(values)
       if(!has(values, null)){
          await connection.query('INSERT INTO sensor_data set ?' , values)
          // tell the client everything is ok
          response.writeHead(200, {"Content-Type": "text/HTML"})
       }
       else{
           console.log("Invalid request!")
           response.writeHead(400, {"Content-Type": "text/HTML"})
       }
    }

    //send the response
    response.end()

}

//Create a server
var server = http.createServer(handleRequest);

let ip = require("ip")

//Lets start our server
server.listen(8080, '0.0.0.0', function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://%s:%s", ip.address(), 8080);
});
