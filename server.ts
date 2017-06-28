
///<reference path="node_modules/@types/node/index.d.ts"/>
import * as http from "http"

import {has, repeat, extract} from "./lib"

var mysql = require('mysql2')

var config = require('config')

///// need two seperate routes for data, raspi and arduino

//// use arduino json to save memory space and remove the need for my extractor

// var connection = mysql.createConnection({host:'localhost', user: 'root', database: 'skomobo', password: 'dev1234'});

var connection

console.log(config.util.getEnv('NODE_ENV'))
if(config.util.getEnv('NODE_ENV') === 'production'){
    //get all the publicly available config values
    let my_config = config.get('Dbconfig')
    let login_details = require('./prod-password')

    //set production password and user to production username and password stored locally on computer
    my_config.password = login_details.password
    my_config.user = login_details.user

    connection = mysql.createConnection(my_config)
}else{
    connection = mysql.createConnection(config.get('Dbconfig'))
}


//rewrite to use express instead and seneca

// use this https://github.com/senecajs/seneca-mysql-store
async function handleRequest(request:http.IncomingMessage, response:http.ServerResponse){

    // for browser testing
    if(request.url != '/favicon.ico'){
       console.log(request.url)
       let values = extract(request.url)
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
