
//? probably a lodash function for this too, check and create my own custom lib
// make sure it excludes things like map partial etc that ES6 already provides

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
        // console.log("Database not started")

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
    let login_details = require('../keys/prod-password.json')

    for(let prop in the_config){

        if(prop !== 'password' && prop !== 'user'){
            login_details[prop] = the_config[prop]
        }
    }

    return login_details
}

export function extract(data:String){

    // make sure there is actually data available  
    if( data !== '' && data !== ' ' && data != undefined){
          // breaks up each value by a dash and removes / in the front
        let tokens: string[] = data.split('_')
        
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
        // values['Temperature'] = Number(values['Temperature']) / 100
        // values['Humidity'] = Number(values['Temperature']) / 100
    
        return values
    }
   
}

// integrate into vscode task system?? so that tsc happens and ava happens at the sane time

// make it linux and windows friendly with the net start thing and put in net start thing "net start MySQL && 


export var connection = config_db()

import {ServerResponse} from "http"

export async function store(response: ServerResponse, database_name: String, values: any){

    if(!has(values, null)){
        await connection.query('INSERT INTO ' + database_name + ' set ?' , values)
        // tell the client everything is ok
        response.writeHead(200, {"Content-Type": "text/HTML"})
    }
    else{
        // console.log("Invalid request!")
        response.writeHead(400, {"Content-Type": "text/HTML"})
    }
       
    //send the response
    response.end()
}