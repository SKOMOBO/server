import * as express from "express"

import {connection, config_db, has, extract, store} from "./lib"

var app = express()

function extract_raspi(data: String){
    
    // breaks up each value by a dash and removes / in the front
    let tokens: string[] = data.split('_')
    // console.log

    let values = {}

    // assume reqs hit router nodejs that will probably be programmed with express? first which then splits into raspi and arduino respectively

    let col_names1 = ['BOX_ID', 'Time_sent', 'Decibels', 'Distance1', 'Distance2', 'Distance3', 'Distance4', 'Distance5', 'Distance6', 'Distance7']

    // fix this monkey patch so that the time sent gets converted to hex properly
    // store the original time token before we accidentally convert it form hex
    let correct_time = tokens[1]
    tokens.map((value, index)=>{

        // converts from HEX to string integers
        values[col_names1[index]] = String(parseInt("0x" + value))
    })

    // let times: String[] = values['Time_sent'].split("-")
    let times: String[] = correct_time.split("-")
    let date = times.slice(0, 3).join("-")
    let time = times.slice(3, 6).join(":")
    values["Time_sent"] = date + " " + time

    return values
}

app.get("/raspi*", (req, resp) =>{

    let data = req.url.slice(7)
    console.log(data)
    let values = extract_raspi(data)
    console.log(values)
    store(resp, "raspi", values)
})

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

function send_file(file, data, resp){
    
    let csv = json2csv({data: data})
    
    fs.writeFile(file, csv, function(err) {
        if (err) throw err;
        resp.download(file)
    });
}

import * as archiver from "archiver"

app.get("/get*", async (req, resp) =>{
    // resp.send("getting data!")

    let user_pass = req.query.pass
    let correct_pass = require("../../src/download_password.json")
    // let arduino_cols = ['ID', 'Time_received', 'Box_ID', 'Time_sent', 'Dust1', 'Dust2_5', 'Dust10', 'Presence', 'Temperature', 'Humidity', 'CO2']
    
    if(user_pass === correct_pass.password){
        // resp.send("correct password")
         if(req.query.id != null){
            
            if(req.query.type == 'arduino'){
                console.log(req.query.id)
                connection.query('SELECT * from arduino where Box_ID = ' + String(req.query.id), (err, results , fields)=>{
                    console.log(results)

                    if(results.length !== 0){
                        send_file('arduino.csv', buff_to_bit(results), resp)
                    }
                    else{
                        resp.send("No box with ID " + req.query.id)
                    }
                })
            }
            
            else if(req.query.type == 'raspi'){
                connection.query('SELECT * from raspi where Box_ID = ' + String(req.query.id), (err, results , fields)=>{
                    if(results.length !== 0){
                        send_file('raspi.csv', results, resp)
                    }
                    else{
                        resp.send("No box with ID " + req.query.id)
                    }
                })
            }

            else if(req.query.type == 'all'){

                resp.send("This will send a zip file with both raspberry pi and arduino data in the near future")
                // connection.query('SELECT * from arduino where Box_ID = ' + req.query.id, (err, results , fields)=>{
                //     console.log("arduino: ", results)
                //     send_file('arduino.csv', json2csv({data: buff_to_bit(results)}), resp)
                // })
                // connection.query('SELECT * from raspi where Box_ID = ' + req.query.id, (err, results , fields)=>{
                //     console.log("raspi: ", results)
                //     send_file('raspi.csv', json2csv({data: results}), resp)
                // })
            }
            else{
                resp.send("Please set board type by adding &type= to your URL. \n eg: http://seat-skomobo.massey.ac.nz/get?pass=8888888888&type=arduino")
            }

            // console.log("arduino: ", arduino)
            // console.log("raspi: ", raspi)
            // add in express use it to clean all this shit
            // attach the file to the resp and send the resp
            // resp.attach()
        }
        else{

            if(req.query.type == 'arduino'){
                connection.query('SELECT * from arduino', (err, results , fields)=>{
                    if(results.length !== 0){
                        send_file('arduino.csv', buff_to_bit(results), resp)
                    }
                    else{
                        resp.send("No box with ID " + req.query.id)
                    }
                })
            }
            
            else if(req.query.type == 'raspi'){
                connection.query('SELECT * from raspi', (err, results , fields)=>{
                    if(results.length !== 0){
                        send_file('raspi.csv', results, resp)
                    }
                    else{
                        resp.send("No box with ID " + req.query.id)
                    }
                })
            }

            else if(req.query.type == 'all'){

                resp.send("This will send a zip file with both raspberry pi and arduino data in the near future")
                // connection.query('SELECT * from arduino where Box_ID = ' + req.query.id, (err, results , fields)=>{
                //     console.log("arduino: ", results)
                //     send_file('arduino.csv', json2csv({data: buff_to_bit(results)}), resp)
                // })
                // connection.query('SELECT * from raspi where Box_ID = ' + req.query.id, (err, results , fields)=>{
                //     console.log("raspi: ", results)
                //     send_file('raspi.csv', json2csv({data: results}), resp)
                // })
            }
            else{
                resp.send("Please set board type by adding &type= to your URL. \n eg: http://seat-skomobo.massey.ac.nz/get?pass=8888888888&type=arduino")
            }


            // let archive = archiver('zip',  {
            //     zlib: { level: 9 } // Sets the compression level.
            // })
            
            // let out = fs.createWriteStream('data.zip')
            // archive.pipe(out)

            // // good practice to catch warnings (ie stat failures and other non-blocking errors) 
            // archive.on('warning', function(err) {
            //     if (err.code === 'ENOENT') {
            //         // log warning 
            //     } else {
            //         // throw error 
            //         throw err;
            //     }
            // });

            // // good practice to catch this error explicitly 
            // archive.on('error', function(err) {
            //     throw err;
            // });

            // out.on('close', function() {
            //     console.log('done with the zip');
            // });
            // // let arduino =  await connection.query('SELECT * from arduino' )
            // // let raspi =  await connection.query('SELECT * from raspi' )
            
            // // rewrite all this using await syntax
            // // fix this so that it just appends data to buffer then creates file at end instead of 
            // // writing to file system with all data seperately and then zipping 

            // connection.query('SELECT * from arduino', (err, results , fields)=>{
            //     if (err) throw err;
            //     // archive.append(json2csv({data: buff_to_bit(results)}), {name: "arduino.csv"} )
            //     fs.writeFile('arduino.csv', json2csv({data: buff_to_bit(results)}), function(err) {
            //         if (err) throw err;
            //     })
            //     // send_file('arduino.csv', buff_to_bit(results), resp)
            // })
            // connection.query('SELECT * from raspi', (err, results , fields)=>{
            //     if (err) throw err;
            //     fs.writeFile('raspi.csv', json2csv({data: results}), function(err) {
            //         if (err) throw err;
            //     })
            //     // archive.append(json2csv({data: results}), {name: "raspi.csv"})
            //     // send_file('raspi.csv', results, resp)
            // })

            // let buffer = archive.finalize();
            
            // archive.file('arduino.csv', {name: 'arduino.csv'})
            // archive.file('raspi.csv', {name: 'raspi.csv'})
            // archive.finalize();
            // fs.writeFile("data.zip", buffer, function () {
                // console.log("Finished");
            // });
            // resp.download("data.zip")

            // console.log("arduino: ", arduino.results)
            // console.log("raspi: ", raspi)
            // return all data
        }
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
    // store(resp, Number(data[1]), values)
    store(resp, "arduino", values)
})


app.listen(81, '0.0.0.0', function () {
    console.log("Server listening on: http://%s:%s", require("ip").address(), 81);
})