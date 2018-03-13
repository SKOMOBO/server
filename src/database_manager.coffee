{send_json, send_csv} = require('./file_manager')
{no_box, please_send_id} = require('./messages')

###**
 * Converts the presence nodejs buffer to a single bit 1 or 0 to represent booleans
 * 
 * @param {any} data 
 * @returns 
 ###
fix_formatting = (data)->

    if data[0].Presence isnt undefined
        # for each text row

        for row in [0 .. data.length-1]
            data[row].Presence = String(data[row].Presence[0])
            data[row].Time_received = fix_timestamp(data[row].Time_received)
            data[row].Time_sent = fix_timestamp(data[row].Time_sent)
            
            # clean_dust = clean_data(data[row].pm10, data[row].pm2_5)
            # data[row].pm10 = clean_dust.PM10
            # data[row].pm2_5 = clean_dust.PM2_5
        
    return data

# dust_cleaner = require("../dust_cleaner/dustCleanerClient.js")


# below two timestampfunctions were retrieved from https:#stackoverflow.com/a/5133807/6142189


fix_timestamp = (data) ->
    
    return data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate() + " " + data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();

connection = null

{config_db, extract, has} = require('./lib')

resolve_db = ->

    if connection is null
        try
            connection = config_db()

        catch error
            console.error(error)
            console.error("DB not running or not accessible")
            connection = null

        return connection

    else
        return connection

# to stream use AND ROWNUM <= 3 AND ROWNUM > ....
# so that we only get x number of rows will have to calculate chunks

get_type = (name, id, resp, format)->

    # check to make sure that they give a ID value, that it is a valid number and not the value all or a _ seperated list
    resolve_db()

    # check if it is a valid number if it is we carry on without issues
    if(isNaN(id) and id isnt "all" )
        id = String(id)
    
    else if(id == undefined)
        resp.send(please_send_id)
        return

    query = 'SELECT * from ' + name
    
    if(id isnt "all")
        id =  String(id)
        if(id.indexOf('_') > -1)
            query += ' where Box_ID in (' + id.replace('_', ',') + ')'
        else
            query += ' where Box_ID = ' + id

    connection.query query, (err, results , fields)->
        if(results isnt null and results isnt undefined)
            if(results.length isnt 0)
                if(format is 'json')
                    send_json(results, resp)
                else
                    send_csv(name + '.csv', fix_formatting(results), resp)
        else
            resp.send(no_box(id))

store = (response, database_name, values)->
    if(not has(values, null))
        await connection.query('INSERT INTO ' + database_name + ' set ?' , values)
        # tell the client everything is ok
        response.writeHead(200, {"Content-Type": "text/HTML"})
    
    else
        response.writeHead(400, {"Content-Type": "text/HTML"})
       
    #send the response
    response.end()

{validate_data} = require('./validator')

store_arduino = (req, resp)->
    resolve_db()

    url = req.url.slice(1)
    
    validate_data url, (data) ->
        values = extract(url)
        store(resp, "arduino", values)
    ,->
        resp.send("Invalid data")

get_connection = ->
    return connection

exports.get_connection = get_connection
exports.get_type = get_type
exports.store_arduino = store_arduino
exports.resolve_db = resolve_db
exports.fix_formatting = fix_formatting