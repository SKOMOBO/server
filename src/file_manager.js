
const {no_zip} = require('./messages')
const fs = require("fs")

//! this desperately needs to be cleaned up to make dependency tree simpler

const json2csv = require('json2csv')  

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

function send_csv(file, data, resp){
    
    let csv = json2csv({data: data})
    
    // telling the browser to treat the text as a attachment
    resp.set({'Content-Disposition': 'attachment; filename="' + file + '"'})
    resp.send(csv);
}

// abstract formatting to format manager
const fix_formatting = require('./database_manager').fix_formatting

function send_json(data, resp){
    resp.send(fix_formatting(data))
}

const {export_functs} = require('./lib')
module.exports = export_functs(send_zip, send_csv, send_file, send_json)