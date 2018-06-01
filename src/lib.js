// make sure it excludes things like map partial etc that ES6 already provides

/**
 * Checks if the object contains any children with value or if it itself is that value
 * 
 * @param {*} object 
 */
function has(object, val){
    if(object !== val){
        for (let prop in object){
            if (object[prop] === val){
                return true
            }
        }
    }
    else{
        return object === val
    }

    return false

}

let config = {
    "host":"localhost",
    "database": "skomobo"
}

function config_db(){

    if(process.env.NODE_ENV === 'production'){
    
        let login_details = config_production()
        login_details["host"] = config["host"]
        login_details["database"] = config["database"]

        //set production password and user to production username and password stored locally on computer
        return connect_db(login_details)

    }else{
        config["user"] = "root"
        config["password"] = "dev1234"

        return connect_db(config)

    //    todo remove config dependency and replace with manually settting up details here
    }

}


// fix this so that it has proper typescript definitions
const mysql = require("mysql2")

function connect_db(details){

    let connection = null
    try{
        connection = mysql.createConnection(details)
    }
    catch(e){
        console.error(e)
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
function config_production(){

    let login_details = require('../keys/prod-password.json')

    return login_details
}

function extract(data){

    // make sure there is actually data available  
    if( data !== '' && data !== ' ' && data != undefined){
        // breaks up each value by a dash and removes /0 in the front
        let tokens = data.split('_')
        
        // layout how the data is going to be mapped
        let col_names = ['Box_ID','Time_sent','Dust1', 'Dust2_5', 'Dust10', 'Temperature', 'Humidity', 'CO2', 'Presence']
    
        let values = {}
    
        if(tokens.includes('')){
            return null
        }

        for(i=0;i<tokens.length;i++){
            values[col_names[i]] = tokens[i]
        }
    
        let times = values['Time_sent'].split("-")
        let date = times.slice(0, 3).join("-")
        let time = times.slice(3, 6).join(":")
        values["Time_sent"] = date + " " + time
    
        values['Presence'] = values['Presence'] == '1'
    
        return values
    }
   
}

// integrate into vscode task system?? so that tsc happens and ava happens at the sane time

// make it linux and windows friendly with the net start thing and put in net start thing "net start MySQL && 

const _ = require('lodash')
function export_functs(){
   let result = {}
   _.forEach(arguments, (arg)=>{
        if(arg.name !== undefined){
            result[arg.name] = arg
        }
   })

   return result
}


module.exports = export_functs(has, extract, config_db, export_functs)