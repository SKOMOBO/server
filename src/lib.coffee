# make sure it excludes things like map partial etc that ES6 already provides

###*
 * Checks if the object contains any children with value or if it itself is that value
 * 
 * @param {*} object 
 ###
has = (object, val)->
    if object isnt val
        for prop, propval of object 
                if propval is val
                    return true
    else
        return object is val

    return false

config = require("config")

config_db = ->
    if config.util.getEnv('NODE_ENV') is 'production'
    
        login_details = config_production()
        #set production password and user to production username and password stored locally on computer
        return connect_db login_details

    else
        # connection = mysql.createConnection(config.get('Dbconfig'))
       return connect_db config.get 'Dbconfig'


# fix this so that it has proper typescript definitions
mysql = require "mysql2"

connect_db = (details)->

    connection = null
    try
        if details.host is 'test'
            connection = {'query':jest.fn()}

        else
            connection = mysql.createConnection details
    
    catch e
        console.error(e)
        console.log("Database not started")
        # change this so that it executes cmd cmmand to start DB

    return connection

###*
 * This cheats the config system to adjust the password for production
 * 
 * @export
 * @returns 
 ###
config_production = ->
    #get all the publicly available config values
    the_config = config.get('Dbconfig')
    login_details = require('../keys/prod-password.json')

    for prop in the_config

        if prop isnt 'password' and prop isnt 'user'
            login_details[prop] = the_config[prop]

    return login_details

extract = (data)->

    # make sure there is actually data available  
    if data isnt '' and data isnt ' ' and data != undefined
        # breaks up each value by a dash and removes /0 in the front
        tokens = data.split('_')
        
        # layout how the data is going to be mapped
        col_names = ['Box_ID','Time_sent','Dust1', 'Dust2_5', 'Dust10', 'Temperature', 'Humidity', 'CO2', 'Presence']
    
        values = {}
    
        if tokens.includes('')
            return null
    
        tokens.map (value, index)->
            values[col_names[index]] = value
    
        times = values['Time_sent'].split "-"
        date = times.slice(0, 3).join "-"
        time = times.slice(3, 6).join ":"
        values["Time_sent"] = date + " " + time
    
        values['Presence'] = values['Presence'] is '1'
    
        return values
    
# integrate into vscode task system?? so that tsc happens and ava happens at the sane time

# make it linux and windows friendly with the net start thing and put in net start thing "net start MySQL and 

export_functs = ->
    result = {}
    for arg in arguments
        if arg.name isnt undefined
            result[arg.name] = arg

    return result


module.exports = export_functs has, extract, config_db, export_functs