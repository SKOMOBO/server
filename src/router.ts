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

                // resp.send("This will send a zip file with both raspberry pi and arduino data in the near future")
                send_zip(resp, {})
            }
            else{
                please_send_type(resp)
                // resp.send("Please set board type by adding &type= to your URL. \n eg: http://seat-skomobo.massey.ac.nz/get?pass=8888888888&type=arduino")
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
     

// should we move the app listen to server or leave here? leave here for now
app.listen(81, '0.0.0.0', function () {
    console.log("Server listening on: http://%s:%s", require("ip").address(), 81);
})
