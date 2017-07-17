// import {IncomingMessage, ServerResponse} from "http"

// import {handler_generator, spawn} from "./lib"

// exporting variable for testing
// export var server = spawn(81, handler_generator("request.url", extract, "arduino"))



// import {createServer, Server, IncomingMessage, ServerResponse} from "http"
import * as express from "express" 

export var server = express()

// for url encoding
// routes in form '/sensor?d=geopsjgp
server.get('/', (req, resp)=>{
    resp.send('Nothing to see here')
})
server.get('temp', (req, resp) =>{
    
})
server.get('humidity', (req, resp) =>{
    
})
server.get('pir', (req, resp) =>{
    
})

//GET /dust?pm1=0&pm25=0&pm10=0
server.get('dust', (req, resp) =>{
    
})
server.get('co2', (req, resp) =>{
    
})

// must be sent first
server.get('id', (req, resp) =>{
    let id = req.param('d')
})

// then this one

// /date?d=10,m=12,y=2017
server.get('date', (req, resp)=>{
    let day = req.param('d')
    let month = req.param('m')
    let year = req.param('y')
})

// time
server.get('time', (req, resp) =>{
    let second = req.param('s')
    let minute = req.param('m')
    let hour = req.param('h')
})
// each sensor gets a different route

// for now they will all be lumped in here

// each route will start with the sensor name eg /temp /humid etc

// each route will store in its own column in the db

// need to handle empty route as well

// I think this is time for express js