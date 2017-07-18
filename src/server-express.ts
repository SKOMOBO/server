// import {IncomingMessage, ServerResponse} from "http"

// import {handler_generator, spawn} from "./lib"

// exporting variable for testing
// export var server = spawn(81, handler_generator("request.url", extract, "arduino"))



// import {createServer, Server, IncomingMessage, ServerResponse} from "http"
import * as express from "express" 

export var server = express()

// must be sent first
server.get('id', (req, resp) =>{
    let id = req.param('d')
})

// then this one
//  need to join with this somehow??
// this should be easy to fill in during analysis if blank

// need to put in seperate columns
server.get('date', (req, resp)=>{
    let day = req.param('d')
    let month = req.param('m')
    let year = req.param('y')
    resp.status(200)
})

// time
server.get('time', (req, resp) =>{
    let second = req.param('s')
    let minute = req.param('m')
    let hour = req.param('h')
    resp.status(200)
})


// after this it doesnt matter


// for url encoding
// routes in form '/sensor?d=geopsjgp
server.get('/', (req, resp)=>{
    resp.send('Nothing to see here right now, maybe we will have a nice login and charts in the future')
    resp.sendStatus(200)
})
server.get('temp', (req, resp) =>{
    let temp = req.param('d')
    resp.sendStatus(200)
})
server.get('humidity', (req, resp) =>{
    let humidity = req.param('d')
    resp.sendStatus(200)
})
server.get('pir', (req, resp) =>{
    let pir = req.param('d')
    resp.sendStatus(200)
})

//GET /dust?pm1=0&pm25=0&pm10=0
server.get('dust', (req, resp) =>{
    let pm1 = req.param('p1')
    let pm25 = req.param('p25')
    let pm10 = req.param('p10')
    resp.sendStatus(200)
})

server.get('co2', (req, resp) =>{
    let co2 = req.param('d')
    resp.sendStatus(200)
})
// each sensor gets a different route

// for now they will all be lumped in here

// each route will start with the sensor name eg /temp /humid etc

// each route will store in its own column in the db

// need to handle empty route as well

// I think this is time for express js