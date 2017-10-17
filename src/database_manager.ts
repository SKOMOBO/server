
import {send_csv, send_json} from './file_manager'
import {no_box} from './message_manager'

/**
 * Converts the presence nodejs buffer to a single bit 1 or 0 to represent booleans
 * 
 * @param {any} data 
 * @returns 
 */
export function fix_formatting(data){
    if(data[0].Presence != undefined){
        // for each text row
        for(let row=0; row<data.length; row++){
            data[row].Presence = String(data[row].Presence[0])
            data[row].Time_received = fix_timestamp(data[row].Time_received)
            data[row].Time_sent = fix_timestamp(data[row].Time_sent)
        }
    }
   
   return data
}


// below two timestamp functions were retrieved from https://stackoverflow.com/a/5133807/6142189


export function fix_timestamp(data: Date){
    
    return data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate() + " " + data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();

}

import {connection} from './lib'

// to stream use AND ROWNUM <= 3 AND ROWNUM > ....
// so that we only get x number of rows will have to calculate chunks

export function get_type(name: String, req, resp, format){

    if(req.query.id == undefined || isNaN(req.query.id) && req.query.id != 'all'){
        resp.send(`Please specify a box ID by adding <b>&id=yourID</b> to the end of your URL <br>
        EG: <b>http://seat-skomobo.massey.ac.nz/get?type=arduino&pass=8888888888&id=0</b><br>
        Please note using this example link only has dummy data`)
        return
    }
    
    let query = 'SELECT * from ' + name
    
    if(req.query.id != "all"){ 
        query += ' where Box_ID = ' + String(req.query.id)
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
            no_box(resp, req.query.id)
        }
    })
}