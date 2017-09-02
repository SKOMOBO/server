import * as express from "express"

import {connection, config_db, has, extract, store} from "./lib"

export var app = express()


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

import * as fs from "fs"
let json2csv = require('json2csv')  


/**
 * Converts the presence nodejs buffer to a single bit 1 or 0 to represent booleans
 * 
 * @param {any} data 
 * @returns 
 */
function buff_to_bit(data){
     // for each text row
    for(let row=0; row<data.length; row++){
        data[row].Presence = String(data[row].Presence[0])
    }

    return data
}

/**
 * This function will correct the timestamp issue found in the csv file
 * 
 * @param {any} data 
 */
function fix_timestamp(data){

}

function send_file(file, data, resp){
    
    let csv = json2csv({data: data})
    
    fs.writeFile(file, csv, function(err) {
        if (err) throw err;
        resp.download(file)
    });
}

// import * as archiver from "archiver"

function no_box(resp, id){
    resp.send("No box with ID " + id)
}

function send_zip(resp){
    resp.send("This will send a zip file with both raspberry pi and arduino data in the near future")
}

function please_send_type(resp){
    resp.send("Please set board type by adding &type= to your URL. \n eg: http://seat-skomobo.massey.ac.nz/get?pass=8888888888&type=arduino")
}


app.get("/get*", async (req, resp) =>{

    let user_pass = req.query.pass
    let correct_pass = require("../../src/download_password.json")
    
    if(user_pass === correct_pass.password){
         if(req.query.id != null){
            
            if(req.query.type == 'arduino'){
                connection.query('SELECT * from arduino where Box_ID = ' + String(req.query.id), (err, results , fields)=>{

                    if(results !== null && results.length !== 0){
                        send_file('arduino.csv', buff_to_bit(results), resp)
                    }
                    else{
                        // resp.send("No box with ID " + req.query.id)
                        no_box(resp, req.query.id)
                    }
                })
            }
            
            else if(req.query.type == 'raspi'){
                connection.query('SELECT * from raspi where Box_ID = ' + String(req.query.id), (err, results , fields)=>{
                    if(results !== null && results.length !== 0){
                        send_file('raspi.csv', results, resp)
                    }
                    else{
                        // resp.send("No box with ID " + req.query.id)
                        no_box(resp, req.query.id)
                    }
                })
            }

            else if(req.query.type == 'all'){

                // resp.send("This will send a zip file with both raspberry pi and arduino data in the near future")
                send_zip(resp)
            }
            else{
                please_send_type(resp)
                // resp.send("Please set board type by adding &type= to your URL. \n eg: http://seat-skomobo.massey.ac.nz/get?pass=8888888888&type=arduino")
            }

        }
        else{

            if(req.query.type == 'arduino'){
                connection.query('SELECT * from arduino', (err, results , fields)=>{
                    if( results !== null && results.length !== 0){
                        send_file('arduino.csv', buff_to_bit(results), resp)
                    }
                    else{
                        resp.send("No arduino data stored in database")
                    }
                })
            }
            
            else if(req.query.type == 'raspi'){
                connection.query('SELECT * from raspi', (err, results , fields)=>{
                    if(results !== null && results.length !== 0){
                        send_file('raspi.csv', results, resp)
                    }
                    else{
                        resp.send("No Raspberry pi data stored in database")
                    }
                })
            }

            else if(req.query.type == 'all'){
                send_zip(resp)
                // resp.send("This will send a zip file with both raspberry pi and arduino data in the near future")
            }
            else{
                please_send_type(resp)
                // resp.send("Please set board type by adding &type= to your URL. \n eg: http://seat-skomobo.massey.ac.nz/get?pass=8888888888&type=arduino")
            }
        }
    }
    else{
        resp.send("invalid password")
    }
})

app.get("/favicon.ico", (req, resp) =>{
    resp.send("We really need to get an icon for this")
})

app.get("/*", (req, resp) =>{
    let url = req.url.slice(1)
    console.log(url)
    let values = extract(url)
    console.log(values)
    store(resp, "arduino", values)
})

// implement csv streaming without writing to file to fix performance issue


// make data acquisiiton a seperate node to fix isues with blocking?

// fix formattting issues delete csv files in repo and migrate all of this to kubernetes
// and deploy to google cloud for free 

//!continue finding way to break up maybe make routing file or something

// trial container on google cloud compute and assign static ip at least that ip is static
// unlike AWS and it should allow me to change ports at no cost double check using calculator
// and if networking incurs costs price seems stupidly small / free for what we want

// rkt vs docker

app.listen(81, '0.0.0.0', function () {
    console.log("Server listening on: http://%s:%s", require("ip").address(), 81);
})
