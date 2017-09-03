
import {send_file} from './file_manager'
import {no_box} from './message_manager'

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
        }
    }
   
   return data
}


function fix_timestamp(data: Date){
    
    //! apparently there is a date object we somehow need to get the correct timestamp and datefrom it



    // let [date, time] = data.split('T')

    // // remove .000Z at end
    // time = time.slice(0, -4);

    // // swap pm to am and vice versa in 24 hour time
    // let hour = Number(time.slice(0, 2))
    
    // // add 12 hours to swap from pm to am etc 
    // hour += 12

    // // set to remainder of 24 to get actual am or pm time
    // hour = hour % 24

    // time = String(hour) + time.slice(2)
    
    // return date + ' ' + time
}

import {connection} from './lib'

// to stream use AND ROWNUM <= 3 AND ROWNUM > ....
// so that we only get x number of rows will have to calculate chunks

export function get_type(name: String, req, resp){
    let query = 'SELECT * from ' + name
    
    if(req.query.id != null){ 
        query += ' where Box_ID = ' + String(req.query.id)
    }
    connection.query(query, (err, results , fields)=>{ 
        if(results !== null && results.length !== 0){
            send_file(name + '.csv', fix_formatting(results), resp)
        }
        else{
            no_box(resp, req.query.id)
        }
    })
}