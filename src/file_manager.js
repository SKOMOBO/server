const fs = require("fs")

function fix_timestamp(data){
    
    return data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate() + " " + data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();

}

/**
 * Converts the presence nodejs buffer to a single bit 1 or 0 to represent booleans
 * 
 * @param {any} data 
 * @returns 
 */
function fix_format(data){

    if(data[0].Presence != undefined){
        // for each text row
        for(let row=0; row<data.length; row++){
            data[row].Presence = String(data[row].Presence[0])
            data[row].Time_received = fix_timestamp(data[row].Time_received)
            data[row].Time_sent = fix_timestamp(data[row].Time_sent)
            
            // let clean_dust = clean_data(data[row].pm10, data[row].pm2_5)
            // data[row].pm10 = clean_dust.PM10
            // data[row].pm2_5 = clean_dust.PM2_5
        }
    }
   
   return data
}

//! this desperately needs to be cleaned up to make dependency tree simpler

function send_zip(resp, data){
    resp.render('no_zip.pug')
}

function send_file(file, resp){

    // telling the browser to treat the text as a file with a specific name
    resp.set({'Content-Disposition': 'attachment; filename="' + file + '"'})

    fs.readFile(file, (err, text)=>{
        resp.send(text)
    })
}

// const Readable = require('stream').Readable

const csv = require('csv-express')
// const csv = require('./express-csv-stream')

function send_csv(file_name, data, resp){
    // Excel stupidly assumes that a CSV starting with ID as the first column is a SYLK file
    data = JSON.parse(JSON.stringify(data).replace(/ID/g, 'Id'))
    // telling the browser to treat the text as a attachment
    resp.set({'Content-Disposition': 'attachment; filename="' + file_name + '"'})
    resp.csv(data, true, stream=true)
}

function send_json(data, resp){
    resp.send(fix_format(data))
}

const {export_functs} = require('./lib')
module.exports = export_functs(send_zip, send_csv, send_file, send_json)