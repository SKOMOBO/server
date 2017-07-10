import {IncomingMessage, ServerResponse} from "http"

import {handler_generator, spawn} from "./lib"


//fix this
// import * as mysql from "../node_modules/mysql2/index"

// var connection = mysql.createConnection({host:'localhost', user: 'root', database: 'skomobo', password: 'dev1234'});

// var connection = lib.config_db()

// use this https://github.com/senecajs/seneca-mysql-store
// async function handleRequest(request: IncomingMessage, response: ServerResponse){

//     // for browser testing

//     // this should be in iis too so that this request just sends back nice icon not throw error

//     no_favicon(request.url, ()=>{
//         console.log(request.url)
    
//         // move this to the iis server
//             //if(request.url.slice(0,5) == "/rapi"){
//         if(request.rawTrailers.length !== 0){
//             let values = JSON.parse(request.rawTrailers)
//             store(response, "raspi", values)
//         }
//         else{
//             response.writeHead(400)
//         }
//     })

// }

// put it on https somehow for this route? because the raspi can actually handle it 

export var raspi_server = spawn(82, handler_generator("request.rawTrailers", JSON.parse, "raspi"))