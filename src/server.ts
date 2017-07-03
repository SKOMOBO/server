import {IncomingMessage, ServerResponse} from "http"

import * as lib from "./lib"

let mysql = require("mysql2")

import * as config from "config"


///// need two seperate routes for data, raspi and arduino

//// use arduino json to save memory space and remove the need for my extractor

// var connection = mysql.createConnection({host:'localhost', user: 'root', database: 'skomobo', password: 'dev1234'});


// use concurrently to run all test tools in watch mode :)

var connection

if(config.util.getEnv('NODE_ENV') === 'production'){
  
    let login_details = lib.config_production()
    //set production password and user to production username and password stored locally on computer
    connection = mysql.createConnection(login_details)

}else{
    connection = mysql.createConnection(config.get('Dbconfig'))
}


//rewrite to use express instead and seneca

// use this https://github.com/senecajs/seneca-mysql-store
async function handleRequest(request:IncomingMessage, response:ServerResponse){

    // for browser testing
    if(request.url != '/favicon.ico'){
       console.log(request.url)
       let values = lib.extract(request.url)
       console.log(values)
       
       lib.store(connection, response, "arduino", values)
      
    }
}

export var server = lib.spawn(81, handleRequest)
