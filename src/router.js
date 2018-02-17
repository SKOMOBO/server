// move app and all the routes here they call functions in server

// import {store_arduino} from "../server"

const get_type = require('./database_manager').get_type
const store_arduino = require('../server').store_arduino
const my_config = require('./config')
var app = my_config.app
const send_zip = require('./file_manager').send_zip

const please_send_type = require("./messages").please_send_type

var supported_types = ['arduino']

const proxy = require('http-proxy-middleware')

app.use("/clean", proxy({target: 'http://localhost:82', changeOrigin: true}))

// import * as bugsnag from "bugsnag"
const bugsnag = require("bugsnag")

if (app.settings.env !== "development"){
    bugsnag.register(require("../keys/global_keys.json").bugsnag_key)
    app.use(bugsnag.requestHandler);
    app.use(bugsnag.errorHandler);
}

app.get("/dash*", (req, resp) =>{
    resp.send("A awesome dashboard is coming here soon stay tuned.")

    // make a request using http to the website node process and then just send the response via a proxy
})

const correct_pass = require("../keys/download_password.json").password

const authenticate = require('authenticate').authenticate

app.get("/get*", async (req, resp) =>{
    
    authenticate(correct_pass, req.query.pass, ()=>{
        if(req.query.type == 'all'){
            send_zip(resp, {})
        }
        else if(supported_types.includes(req.query.type)){
            get_type(req.query.type, req, resp, req.query.format)
        }
        else{
            resp.send(please_send_type)
        }
    }, resp.send)
})

// interpret a random group of numbers seperated by underscores as arduino transmissions
app.get(/\/[0-9]_.*/g, store_arduino)   

module.exports.app = app