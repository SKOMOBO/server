const {send_json, send_csv} = require('./file_manager')

/**
 * Converts the presence nodejs buffer to a single bit 1 or 0 to represent booleans
 * Corrects Funny database formatted date time strings to normal strings
 */
function fix_format(data){

    if(data[0].Presence !== undefined){
        // for each text row
        for(let row=0; row<data.length; row++){
            data[row].Presence = String(data[row].Presence[0])
            data[row].Time_received = fix_timestamp(data[row].Time_received)
            data[row].Time_sent = fix_timestamp(data[row].Time_sent)
        }
    }
   
   return data
}

// below two timestampfunctions were retrieved from https://stackoverflow.com/a/5133807/6142189


function fix_timestamp(data){
    
    return data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate() + " " + data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();

}

var connection = null

const {config_db, extract, has} = require('./lib')

function resolve_db(){

    if(connection === null){
        try{
            connection = config_db()
        }
        catch(error){
            console.error(error)
            console.error("DB not running or not accessible")
            connection = null
        }
        return connection
    }
    else{
        return connection
    }
    
}


/**
 * This function creates our tables and database if it doesn't already exist
 * 
 */
function setup_db(){
    //todo put code in here to do above
    //run on startup, then setup docker container with mariadb to unit test against 
    // / just add services:mariadb to travis file and make sure to include delete statements
    // fix db_manager so that it checks results of functions and tests real db not mock stuff
}


// to stream use AND ROWNUM <= 3 AND ROWNUM > ....
// so that we only get x number of rows will have to calculate chunks

function get_box(id, resp, format){

    // check to make sure that they give a ID value, that it is a valid number and not the value all or a _ seperated list
    resolve_db()

    // check if it is a valid number if it is we carry on without issues
    if(isNaN(id) && id !== "all" ){
        id = String(id)
    }
    
    if(id === 'undefined' || id === '' || id === ' ' || typeof id === 'undefined'){
        return resp.render('please_send_id.pug')
    }

    let query = 'SELECT * from box' + id

    // todo fix later
    // if(id !== "all"){ 
    //     id = String(id)
    //     if(id.indexOf('_') > -1){
    //         query += ' where Box_ID in (' + id.replace('_', ',') + ')'
    //     }else{
    //         query += ' where Box_ID = ' + id
    //     }
    // }

    connection.query(query, (err, results , fields)=>{ 
        if(results != null){
            if(results.length !== 0){
                if(format === 'json'){
                    send_json(results, resp)
                }else{
                    send_csv('skomobo.csv', fix_format(results), resp)
                }
            }
        }
        else{
            resp.render('no_box.pug', {id: id})
        }
    })
}

async function store(response, database_name, values){

    if(!has(values, null)){

        box_exists(values["Box_ID"], (exists)=>{
            if(exists){
                // insert into new table now
                connection.query('INSERT INTO ' + database_name + ' set ?' , values)
                // tell the client everything is ok
                response.writeHead(200, {"Content-Type": "text/HTML"})
                response.end()
            }
            else{

                connection.query('CREATE TABLE ' + database_name + ' LIKE box_data')
                connection.query('ALTER TABLE ' + database_name + ' AUTO_INCREMENT = 1')
                // copy this query structure to migrate data and index correctly 

                let query = 'SELECT `Time_received`, `Box_ID`, `Time_sent`,  `Dust1`,' +
                ' `Dust2_5`,  `Dust10`,  `Presence`,  `Temperature`,  `Humidity`,  `CO2` from arduino' +
                " where Box_ID = '" + values["Box_ID"] + "'"
                
                console.log(query)
                connection.query(query, (err, results , fields)=>{
                    if(typeof results !== 'undefined'){
                        results.map((result)=>{
                            connection.query('Insert into ' + database_name + ' set ?', result)
                        })
                    }
                  
                    // insert new data
                    connection.query('INSERT INTO ' + database_name + ' set ?' , values)
                    
                    // update box metadata
                    let box_meta =  {"ID": values["Box_ID"], "processor": "arduino"}
                    response.writeHead(200, {"Content-Type": "text/HTML"})
                    response.end()
                 })

               
            }    
        })
    }
    else{
        response.writeHead(400, {"Content-Type": "text/HTML"})
        response.end()
    }
}

function box_processor(id, callback){
    // stubbed out for now

    box_exists(id, (exists)=>{
        exists ? callback(true, "arduino") : callback(false)
    })
}

const {validate_data} = require('./validator')
function store_arduino(req, resp){
    resolve_db()

    let url = req.url.slice(1)
    
    validate_data(url, (data)=>{
        let values = extract(url)
        store(resp, "box" + values["Box_ID"], values)
    },()=>{
        resp.send("Invalid data")
    })
}

function get_connection(){
    return connection
}

function set_connection(value){
    connection = value
}

function get_info(id, cols, callback){
    resolve_db()
    if(id != null){

        cols = cols.join(', ')
        connection.query("select " + cols + " from box_info where id = '" + String(id) + "'", (err, results , fields)=>{

            if(err != null){
                console.error(err)
            }
        
            if(results != null){
                if(results.length !== 0){
                    callback(true, results)
                }
                else{
                    callback(false)
                }
            }
            else{
                callback(false)
            }
            
        })
    }
}

function box_exists(id, callback){
    get_info(id, ['id'], (has_result)=>{
        callback(has_result)
    })
}

function box_processor(id, callback){
    get_info(id, ['processor'], (has_result, result)=>{
        has_result ?callback(has_result, result[0]['processor']): callback(has_result)
    })
}

function get_data(id, cols, modifier, callback){
    // check to make sure that they give a ID value, that it is a valid number and not the value all or a _ seperated list
    resolve_db()

    if(cols.length > 1){
        cols = cols.join(', ')
    }
    else if (cols.length === 1){
        cols = cols[0]
    }

    let query = 'SELECT ' + cols + ' from box' + id + ' ' + modifier
 
    if(id != null){
        connection.query(query, (err, results , fields)=>{ 

            if(err != null){
                console.error(err)
            }

            if(results != null){
                if(results.length !== 0){
                    // finish this
                    let values = fix_format(results)[0]
                    callback(true, values)
                
                }
                else{
                    callback(false)
                }
            }
            else{
                callback(false)
            }
        })
    }
}

function latest(id, format, resp){
    // check to make sure that they give a ID value, that it is a valid number and not the value all or a _ seperated list
    resolve_db()

    // check if it is a valid number if it is we carry on without issues
    if(isNaN(id) && id !== "all" ){
        id = String(id)
    }
    else if(id == null || id === 'undefined'){
        resp.render('please_send_id.pug')
        return
    }

    let query = 'SELECT * from box' + id + ' order by Time_received DESC limit 1'

    if(id != null){
        connection.query(query, (err, results , fields)=>{ 

            if(err != null){
                console.error(err)
            }

            if(results != null){
                if(results.length !== 0){
                    if(format === 'json'){
                        send_json(results, resp)
                    }else{
                        // finish this
                        let values = fix_format(results)[0]
                        resp.render('latest.pug', values)
                    }
                }
            }
            else{
                resp.render('no_box.pug', {id: id})
            }
        })
    }
}

const {export_functs} = require('./lib')

module.exports = export_functs(latest, box_processor,set_connection, get_connection, get_box, store_arduino, resolve_db, fix_format, fix_timestamp, box_exists)