
    
/**
 * Like the python range function, returns number array starting at start and ending at end
 * 
 * @param {number} start 
 * @param {number} end 
 * @returns {number[]} 
 */
function range(start: number, end: number): number[]{
let nums = Array.apply(null, Array(end + 1)).map(function (_, i) {return i;});

return nums.slice(start)
}


/**
 * 
 * 
 * @export
 * @param {string} col 
 * @param {number} times 
 * @returns 
 */
export function repeat(col: string, times: number){

    return range(1, times).map((value)=>{
        return col + String(value)
    })
}

// import * as R from "ramda"

/**
 * Checks if the object contains any children with value or if it itself is that value
 * 
 * @param {*} object 
 */
export function has(object: any, val: any){

    if(object != val){
        for (let prop in object){
            if (object[prop] === val){
                return true
            }
        }
    }
    else{
        return object === val
    }

}

import * as config from "config"

export function config_db(){
    if(config.util.getEnv('NODE_ENV') === 'production'){
    
        let login_details = config_production()
        //set production password and user to production username and password stored locally on computer
        return connect_db(login_details)

    }else{
        // connection = mysql.createConnection(config.get('Dbconfig'))
       return connect_db(config.get('Dbconfig'))
    }

}


// fix this so that it has proper typescript definitions
let mysql = require("mysql2")
export function connect_db(details: any){

    let connection

    try{
        connection = mysql.createConnection(details)
    }catch(e){
        console.log("Database not started")

        // change this so that it executes cmd cmmand to start DB
    }

    return connection
    
}

/**
 * This function cheats the config system to adjust the password for production
 * 
 * @export
 * @returns 
 */
export function config_production(){
    let config = require('config')

    //get all the publicly available config values
    let the_config = config.get('Dbconfig')
    let login_details = require('..//../src/prod-password.json')

    for(let prop in the_config){

        if(prop !== 'password' && prop !== 'user'){
            login_details[prop] = the_config[prop]
        }
    }

    return login_details
}

export function extract(url){
     // breaks up each value by a dash and removes / in the front
    let tokens: string[] = url.slice(1).split('_')

    // layout how the data is going to be mapped
    // use javascript array.map for this somehow

    // let col_names: string[] = ['Dust1', 'Dust2_5', 'Dust10', 'Box_ID', 'Temperature', 'Humidity', 'CO2', 'Decibals']
    // .concat(repeat('Distance', 7)).concat(['Presence', 'Time'])

    let col_names: string[] = ['Box_ID','Time_sent','Dust1', 'Dust2_5', 'Dust10', 'Temperature', 'Humidity', 'CO2', 'Presence']

    let values = {}

    if(tokens.includes('')){
        return null
    }
    tokens.map((value, index)=>{
        values[col_names[index]] = value
    })

    let times: String[] = values['Time_sent'].split("-")
    let date = times.slice(0, 3).join("-")
    let time = times.slice(3, 6).join(":")
    values["Time_sent"] = date + " " + time

    values['Presence'] = values['Presence'] == '1'

    return values
}

export function no_favicon(url:String, Callback: Function){
   if (url != '/favicon.ico') Callback()
}

// integrate into vscode task system?? so that tsc happens and ava happens at the sane time

// make it linux and windows friendly with the net start thing and put in net start thing "net start MySQL && 

export async function store(response: ServerResponse, database_name: String, values: any){

    let connection = config_db()

    if(!has(values, null)){
        await connection.query('INSERT INTO ' + database_name + ' set ?' , values)
        // tell the client everything is ok
        response.writeHead(200, {"Content-Type": "text/HTML"})
    }
    else{
        console.log("Invalid request!")
        response.writeHead(400, {"Content-Type": "text/HTML"})
    }
       
    //send the response
    response.end()
}

export function handler_generator(data:any, decoder: Function, db_name: String){
    return async (request:IncomingMessage, response:ServerResponse)=>{
        
        no_favicon(request.url, ()=>{
            console.log(request.url)
        
            // evil but it works for now
            data = eval(data)
            let values
            if(data.length !== 0 && data !== "/"){
                values = decoder(data)
                console.log(values)
                store(response, "arduino", values)
            }
            else{
                response.writeHead(400)
                console.log("No data")
            }
            
        })

    }
}

import {createServer, Server, IncomingMessage, ServerResponse} from "http"
export function spawn(port: Number, handler: (request: IncomingMessage, response: ServerResponse) => void): Server{
    let server = createServer(handler)

    //Lets start our server
    server.listen(port, '0.0.0.0', function(){
        //Callback triggered when server is successfully listening. Hurray!
        console.log("Server listening on: http://%s:%s", require("ip").address(), port);
    });

    return server
}