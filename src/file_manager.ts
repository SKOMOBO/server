
import {no_zip} from './message_manager'

import * as fs from "fs"

let json2csv = require('json2csv')  

export function send_zip(resp, data){
    no_zip(resp)
}

export function send_file(file, resp){

    // telling the browser to treat the text as a file with a specific name
    resp.set({'Content-Disposition': 'attachment; filename="' + file + '"'})

    fs.readFile(file, (err, text)=>{
        resp.send(text)
    })
}

export function send_firmware(file, version, resp){
    
    // update the file to match version in config
    // let text = String(fs.readFileSync(file)[0]).replace("version = \d", "version = " + String(version))
    // fs.writeFileSync(file, text)
    send_file(file, resp)

}

export function send_csv(file, data, resp){
    
    let csv = json2csv({data: data})
    
    // telling the browser to treat the text as a attachment
    resp.set({'Content-Disposition': 'attachment; filename="' + file + '"'})
    resp.send(csv);

    // fs.writeFile(file, csv, function(err) {
    //     if (err) throw err;
    //     resp.download(file)
    // });
}

import {fix_formatting} from './database_manager'

export function send_json(data, resp){
    resp.send(fix_formatting(data))
}