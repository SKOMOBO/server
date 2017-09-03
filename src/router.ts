// move app and all the routes here they call functions in server
import * as express from "express"

import {no_favicon, store_arduino, store_raspi} from "./server"
import {get_arduino, get_raspi, get_all_arduino, get_all_raspi} from "./database_manager"

export var app = express()

// to make my own router for tcp just need to match first number to a route and send the rest
// to the function

// need a way to make my functions protocol agnostic too?? how to do that I think it might be already

app.get("/favicon.ico", no_favicon)

app.get("/*", store_arduino)
app.get("/raspi*", store_raspi)

import {authenticate} from './authentication_manger'
import {send_zip} from './file_manager'
import {please_send_type} from './message_manager'

app.get("/get*", async (req, resp) =>{
    
    authenticate(req.query.pass, resp.send, ()=>{
        if(req.query.id != null){
            
            if(req.query.type == 'arduino'){
                get_arduino(req, resp)
            }
            
            else if(req.query.type == 'raspi'){
                get_raspi(req, resp)
            }

            else if(req.query.type == 'all'){

                send_zip(resp, {})
            }
            else{
                please_send_type(resp)
            }

        }
        else{

            if(req.query.type == 'arduino'){
                get_all_arduino(req, resp)
            }
            
            else if(req.query.type == 'raspi'){
                get_all_raspi(req,resp)
            }

            else if(req.query.type == 'all'){
                send_zip(resp, {})
            }
            else{
                please_send_type(resp)
            }
        }
    })
})
