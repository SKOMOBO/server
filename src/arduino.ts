import {IncomingMessage, ServerResponse} from "http"

import {handler_generator, extract, spawn} from "./lib"


///// need two seperate routes for data, raspi and arduino

//// use arduino json to save memory space and remove the need for my extractor

// var connection = mysql.createConnection({host:'localhost', user: 'root', database: 'skomobo', password: 'dev1234'});


// use concurrently to run all test tools in watch mode :)

// var connection = lib.config_db()

// use this https://github.com/senecajs/seneca-mysql-store
// async function handleRequest(request:IncomingMessage, response:ServerResponse){

//     // for browser testing
//     no_favicon(request.url, ()=>{
//         console.log(request.url)
//         let values = extract(request.url)
//         console.log(values)
//         store(response, "arduino", values)
//     })

// }

// exporting variable for testing
export var server = spawn(81, handler_generator("request.url", extract, "arduino"))
