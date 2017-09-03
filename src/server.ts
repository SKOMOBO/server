
//? for tcp
//import * as net from "net"

// export var server = net.createServer((socket)=>{
//     let connection = config_db()

//     // socket.write("Connected")
//     console.log("Connected")

//     // let data = data.toString("UTF8")
//     socket.on("data", (data)=>{

//         console.log("got data")
//         let received = data.toString("UTF8")
//         console.log(received)
        


//  let values = JSON.parse(request.headers)

//? for decoding json would be better if it was cbor
// console.log(values)
// if(!has(values, null)){
//    await connection.query('INSERT INTO sensor_data set ?' , values)
//    // tell the client everything is ok
//    response.writeHead(200, {"Content-Type": "text/HTML"})
// }


// async function get_data(db, id){
//     // return only this boxes data
//     return 
// }



/**
 * This function will correct the timestamp issue found in the csv file
 * 
 * @param {any} data 
 */
function fix_timestamp(data){

}

// import * as archiver from "archiver"

import {send_zip, send_file} from './file_manager'
import {no_box, please_send_type} from './message_manager'

export function no_favicon(req, resp){
    resp.send("We really need to get an icon for this")
}

import {extract_raspi} from './raspi'

export function store_raspi(req,resp){
    let data = req.url.slice(7)
    console.log(data)
    let values = extract_raspi(data)
    console.log(values)
    store(resp, "raspi", values)
}


// should we make basic functions in here and just call them from router? i think so to make things
// more legible

import { has, extract, store} from "./lib"

export function store_arduino(req, resp){
    let url = req.url.slice(1)
    console.log(url)
    let values = extract(url)
    console.log(values)
    store(resp, "arduino", values)
}


// implement csv streaming without writing to file to fix performance issue


// make data acquisiiton a seperate node to fix isues with blocking?

// fix formattting issues delete csv files in repo and migrate all of this to kubernetes
// and deploy to google cloud for free 

//!continue finding way to break up maybe make routing file or something

// trial container on google cloud compute and assign static ip at least that ip is static
// unlike AWS and it should allow me to change ports at no cost double check using calculator
// and if networking incurs costs price seems stupidly small / free for what we want

// rkt vs docker
