// move app and all the routes here they call functions in server
import * as express from "express"

import {no_favicon, store_arduino, store_raspi} from "./server"
import {get_type} from "./database_manager"

var compress = require("compression")
export var app = express()

// Enable GZIP compression
app.use(compress())


//! look through here for abstraction oppurtunities
//! create unit tests for all the things!!!


// to make my own router for tcp just need to match first number to a route and send the rest
// to the function

// need a way to make my functions protocol agnostic too?? how to do that I think it might be already

app.get("/favicon.ico", no_favicon)
app.get("/raspi*", store_raspi)

//! make a route called /web* to forward data to the keystonejs website
//!
//! 

import {authenticate} from './authentication_manger'
import {send_zip, send_file} from './file_manager'
import {please_send_type} from './message_manager'

var supported_types = ['arduino', 'raspi']

app.get("/web*", (req, resp) =>{
    resp.send("A awesome website is coming here soon stay tuned.")

    // make a request using http to the website node process and then just send the response
})

import {send_firmware} from "./file_manager"
app.get("/update*", (req, resp) =>{

    // doing some cheeky dependency resolution by storing the version in a text file we can update whilst its running    
    let current_version = require("../../raspi_version.json").version   

    if(Number(req.query.v) <  current_version){
        send_firmware("firmware/test.py", current_version, resp)
        
    }else{
        resp.send("No update available")
    }
})


app.get("/get*", async (req, resp) =>{
    
    authenticate(req.query.pass, resp, ()=>{
        if(req.query.type == 'all'){
            send_zip(resp, {})
        }
        else if(supported_types.includes(req.query.type)){
            get_type(req.query.type, req, resp, req.query.format)
        }
        else{
            please_send_type(resp)
        }
    })
})

app.get("/*", store_arduino)
