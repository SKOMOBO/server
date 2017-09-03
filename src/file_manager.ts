
import {no_zip} from './message_manager'

import * as fs from "fs"

let json2csv = require('json2csv')  

export function send_zip(resp, data){
    no_zip(resp)
}

export function send_file(file, data, resp){
    
    let csv = json2csv({data: data})
    
    fs.writeFile(file, csv, function(err) {
        if (err) throw err;
        resp.download(file)
    });
}