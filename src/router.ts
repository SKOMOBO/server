// move app and all the routes here they call functions in server
import * as express from "express"

import {store_arduino, store_raspi} from "../server"
import {get_type} from "./database_manager"

// move the below to a seperate module called config

var helmet = require("helmet")
var compress = require("compression")
export var app = express()

// Enable GZIP compression for improved performance
app.use(compress())

// Fix headers to make things more secure
app.use(helmet())

//! look through here for abstraction oppurtunities
//! create unit tests for all the things!!!


// to make my own router for tcp just need to match first number to a route and send the rest
// to the function

// need a way to make my functions protocol agnostic too?? how to do that I think it might be already

// app.get("/raspi*", store_raspi)

//! make a route called /web* to forward data to the keystonejs website
//!
//! 

import {authenticate} from './authentication_manger'
import {send_zip, send_file} from './file_manager'
import {please_send_type} from './message_manager'

var supported_types = ['arduino', 'raspi']

const proxy = require('http-proxy-middleware')

// app.use("/dust-tool*", express.static("../static"))

app.use(express.static("static"))

app.use("/clean", proxy({target: 'http://localhost:82', changeOrigin: true}))
// app.use("/get_file", proxy({target: 'http://localhost:82', changeOrigin: true}))

// bugsnag integration only enable if we are in production
import * as bugsnag from "bugsnag"
if (app.settings.env !== "development"){
    bugsnag.register(require("./global_keys.json").bugsnag_key)
    app.use(bugsnag.requestHandler);
    app.use(bugsnag.errorHandler);
}


// app.get("/dust-tool", (req, resp)=>{
//     resp.sendFile(__dirname.substr(0, __dirname.length - 3) + "file_thing.html")
// })
// app.use("/test", proxy({target: 'http://localhost:82', changeOrigin: true}))


app.get("/dash*", (req, resp) =>{
    resp.send("A awesome dashboard is coming here soon stay tuned.")

    // make a request using http to the website node process and then just send the response via a proxy


})

// import {clean_data} from "./database_manager"
// app.get("/clean*", (req, resp) =>{
//     // console.log("Cleaning data!", req.query.one, req.query.two)
//     resp.send(clean_data(req.query.one, req.query.two))
// })



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

// fix the regex here to match any number ___

// interpret a random group of numbers seperated by underscores as arduino transmissions
app.get(/\/[0-9]_.*/g, store_arduino)   