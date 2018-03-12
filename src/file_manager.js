
const {no_zip} = require('./messages')
const fs = require("fs")

//! this desperately needs to be cleaned up to make dependency tree simpler

function send_zip(resp, data){
    resp.send(no_zip)
}

function send_file(file, resp){

    // telling the browser to treat the text as a file with a specific name
    resp.set({'Content-Disposition': 'attachment; filename="' + file + '"'})

    fs.readFile(file, (err, text)=>{
        resp.send(text)
    })
}

// const Readable = require('stream').Readable

// const csv = require('csv-express')
const csv = require('./express-csv-stream')

function send_csv(file_name, data, resp){
    // Excel stupidly assumes that a CSV starting with ID as the first column is a SYLK file
    data = JSON.parse(JSON.stringify(data).replace(/ID/g, 'Id'))
    // telling the browser to treat the text as a attachment
    resp.set({'Content-Disposition': 'attachment; filename="' + file_name + '"'})
    resp.csv(data, true, stream=true)
}

// abstract formatting to format manager
const {fix_formatting} = require('./database_manager')

function send_json(data, resp){
    resp.send(fix_formatting(data))
}

const {export_functs} = require('./lib')
module.exports = export_functs(send_zip, send_csv, send_file, send_json)