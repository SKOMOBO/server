// make sure it excludes things like map partial etc that ES6 already provides

/**
 * Checks if the object contains any children with value or if it itself is that value
 * 
 * @param {*} object 
 */

const config = require("config")

const mysql = require("mysql2")
    

var self = {
    has(object, val){
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
    
    },

    config_db(){
        if(config.util.getEnv('NODE_ENV') === 'production'){
        
            let login_details = config_production()
            //set production password and user to production username and password stored locally on computer
            return connect_db(login_details)
    
        }else{
            // connection = mysql.createConnection(config.get('Dbconfig'))
           return connect_db(config.get('Dbconfig'))
        }
    
    },
    connect_db(details){
    
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
    },
    
    /**
     * This function cheats the config system to adjust the password for production
     * 
     * @export
     * @returns 
     */
     config_production(){
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
    },
    
    extract(data){
    
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
}


// integrate into vscode task system?? so that tsc happens and ava happens at the sane time

// make it linux and windows friendly with the net start thing and put in net start thing "net start MySQL && 
module.exports = self