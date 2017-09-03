// move app and all the routes here they call functions in server
import * as express from "express"

import {no_favicon, store_arduino, store_raspi} from "./server"
import {get_type} from "./database_manager"

export var app = express()

// to make my own router for tcp just need to match first number to a route and send the rest
// to the function

// need a way to make my functions protocol agnostic too?? how to do that I think it might be already

app.get("/favicon.ico", no_favicon)
app.get("/raspi*", store_raspi)

import {authenticate} from './authentication_manger'
import {send_zip} from './file_manager'
import {please_send_type} from './message_manager'

var supported_types = ['arduino', 'raspi']
app.get("/get*", async (req, resp) =>{
    
    authenticate(req.query.pass, resp.send, ()=>{
        if(req.query.type == 'all'){
            send_zip(resp, {})
        }
        else if(supported_types.includes(req.query.type)){
            get_type(req.query.type, req, resp)
        }
        else{
            please_send_type(resp)
        }
    })
})

app.get("/*", store_arduino)
