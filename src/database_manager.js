const {send_json, send_csv} = require('./file_manager')
const {no_box, please_send_id} = require('./messages')

/**
 * this function will correct the dust data using our models
 * @todo finish this function has to return JSON like original with outliers removed
 *       and values adjusted
 * 
 * @param {any} data 
 */

function clean_data(pm10, pm2_5){
    

    // make thing to talk to python and get responses 
    let data = {"PM10":0, "PM2_5":0};
    if(data != undefined){
        data.PM10 = data.PM10[0]
        data.PM2_5 = data.PM2_5[0]
    }
    else{
        // data = {}
        // just zero out invalid data for now
        data.PM10 = 0
        data.PM2_5 = 0
    }
    
    return data
}


/**
 * Converts the presence nodejs buffer to a single bit 1 or 0 to represent booleans
 * 
 * @param {any} data 
 * @returns 
 */
function fix_formatting(data){
    if(data[0].Presence != undefined){
        // for each text row
        for(let row=0; row<data.length; row++){
            data[row].Presence = String(data[row].Presence[0])
            data[row].Time_received = fix_timestamp(data[row].Time_received)
            data[row].Time_sent = fix_timestamp(data[row].Time_sent)
            
            let clean_dust = clean_data(data[row].pm10, data[row].pm2_5)
            data[row].pm10 = clean_dust.PM10
            data[row].pm2_5 = clean_dust.PM2_5
        }
    }
   
   return data
}

// var dust_cleaner = require("../dust_cleaner/dustCleanerClient.js")


// below two timestampfunctions were retrieved from https://stackoverflow.com/a/5133807/6142189


function fix_timestamp(data){
    
    return data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate() + " " + data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();

}

var connection = null

const {config_db} = require('./lib')

function resolve_db(){

    if(connection === null){
        try{
            connection = config_db()
        }
        catch(error){
            console.error("DB not running or not accessible")
            connection = null
        }
    }
    else{
        return connection
    }
    
}

// to stream use AND ROWNUM <= 3 AND ROWNUM > ....
// so that we only get x number of rows will have to calculate chunks

function get_type(name, req, resp, format){

    // check to make sure that they give a ID value, that it is a valid number and not the value all or a _ seperated list
    resolve_db()

    // check if it is a valid number if it is we carry on without issues
    if(isNaN(req.query.id) && req.query.id != "all" ){
        console.log(req.query.id)
        req.query.id =  String(req.query.id)

        //check to see if it is underscore seperated
        if(req.query.id.indexOf('_') === -1){
            resp.send(please_send_id)
            return
        }
    }
    else if(req.query.id == undefined){
        resp.send(please_send_id)
        return
    }

    let query = 'SELECT * from ' + name
    
    if(req.query.id != "all"){ 
        req.query.id =  String(req.query.id)
        if(req.query.id.indexOf('_') > -1){
            query += ' where Box_ID in (' + req.query.id.replace('_', ',') + ')'
        }else{
            query += ' where Box_ID = ' + req.query.id
        }
    }

    connection.query(query, (err, results , fields)=>{ 
        if(results !== null && results.length !== 0){

            if(format === 'json'){
                send_json(results, resp)
            }else{
                send_csv(name + '.csv', fix_formatting(results), resp)
            }
        }
        else{
            resp.send(no_box(req.query.id))
        }
    })
}

async function store(response, database_name, values){

    if(!has(values, null)){
        await connection.query('INSERT INTO ' + database_name + ' set ?' , values)
        // tell the client everything is ok
        response.writeHead(200, {"Content-Type": "text/HTML"})
    }
    else{
        response.writeHead(400, {"Content-Type": "text/HTML"})
    }
       
    //send the response
    response.end()
}

const {validate_data} = require('./validator')
function store_arduino(req, resp){

    resolve_db()

    let url = req.url.slice(1)
    validate_data(url, (data)=>{
        // console.log(data)
        let values = lib.extract(url)
        // console.log(values)
        store(resp, "arduino", values)
    },()=>{
        resp.send("Invalid data")
    })
}

exports.store_arduino = store_arduino
exports.connection = connection