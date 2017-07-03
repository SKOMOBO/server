
///<reference path="../node_modules/@types/node/index.d.ts"/>
import * as http from "http"

import {has, repeat, extract, config_production, store} from "./lib"

var mysql = require('mysql2')

let config = require('config')

///// need two seperate routes for data, raspi and arduino

//// use arduino json to save memory space and remove the need for my extractor

// var connection = mysql.createConnection({host:'localhost', user: 'root', database: 'skomobo', password: 'dev1234'});

var connection

if(config.util.getEnv('NODE_ENV') === 'production'){
  
    let login_details = config_production()
    //set production password and user to production username and password stored locally on computer
    connection = mysql.createConnection(login_details)

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
       
       store(connection, response, "arduino", values)
      
    }

    //send the response
    response.end()

}

//Lets start our server
http.createServer(handleRequest).listen(81, '0.0.0.0', function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://%s:%s", require("ip").address(), 81);
});
