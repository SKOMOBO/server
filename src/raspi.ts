import * as http from "http"

import {has, repeat, store} from "./lib"

let mysql = require("mysql2")

//fix this
// import * as mysql from "../node_modules/mysql2/index"

//rewrite using seneca


var connection = mysql.createConnection({host:'localhost', user: 'root', database: 'skomobo', password: 'dev1234'});

// use this https://github.com/senecajs/seneca-mysql-store
async function handleRequest(request:http.IncomingMessage, response:http.ServerResponse){

    // for browser testing

    // this should be in iis too so that this request just sends back nice icon not throw error
    if(request.url != '/favicon.ico'){
        console.log(request.url)
       
       // move this to the iis server
    //    if(request.url.slice(0,5) == "/rapi"){
        if(request.rawTrailers.length !== 0){
            let values = JSON.parse(request.rawTrailers)
            store(connection, response, "raspi", values)
        }
        else{
            response.writeHead(400)
        }
        
    }

    //send the response
    response.end()

}

// put it on https somehow for this route? because the raspi can actually handle it 


import * as lib from "./lib"
export var raspi_server = lib.spawn(82, handleRequest)