
import {send_zip, send_csv} from './src/file_manager'
import {no_box, please_send_type} from './src/message_manager'

export function no_favicon(req, resp){
    resp.send("We really need to get an icon for this")
}

import {extract_raspi} from './src/raspi'


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

export function store_raspi(req,resp){

    let url = req.url.slice(1)
    validate_data(url, (data)=>{
        // console.log(data)
        let values = extract_raspi(url)
        // console.log(values)
        store(resp, "raspi", values)
    })
}


import {app} from './src/router'

app.listen(81, '0.0.0.0', function () {
    console.log("Server listening on: http://%s:%s", require("ip").address(), 81);
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
