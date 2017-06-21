
///<reference path="node_modules/@types/node/index.d.ts"/>
import * as http from "http"

import {has_null, repeat, extract} from "./lib"

let mysql = require('mysql2')

var connection = mysql.createConnection({host:'localhost', user: 'root', database: 'skomobo', password: 'dev1234'});


async function handleRequest(request, response){

    // for browser testing
    if(request.url != '/favicon.ico'){

       let values = extract(request.url)

       console.log(values)

       if(!has_null(values)){
          await connection.query('INSERT INTO sensor_data set ?' , values)
       }
       else{
           console.log("Invalid request!")
       }
    }

}

//Create a server
var server = http.createServer(handleRequest);

let ip = require("ip")

//Lets start our server
server.listen(8080, '0.0.0.0', function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://%s:%s", ip.address(), 8080);
});
