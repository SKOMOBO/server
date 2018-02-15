
import {send_zip, send_csv} from './src/file_manager'
import {no_box, please_send_type} from './src/message_manager'

// should we make basic functions in here and just call them from router? i think so to make things
// more legible

import { has, extract, store} from "./src/lib"

export function validate_data(data, handler){
    // console.log(data)
    if (data != undefined && data !== '' && data !== ' ' && data !== 'raspi' && data !== 'raspi/'){
        handler(data)
    }
}

export function store_arduino(req, resp){

    let url = req.url.slice(1)
    validate_data(url, (data)=>{
        // console.log(data)
        let values = extract(url)
        // console.log(values)
        store(resp, "arduino", values)
    })
}


import {app} from './src/router'

app.listen(81, '0.0.0.0', function () {
    console.log("Server listening on: http://%s:%s", require("ip").address(), 81);
})
