
import {send_file} from './file_manager'
import {no_box} from './message_manager'

/**
 * Converts the presence nodejs buffer to a single bit 1 or 0 to represent booleans
 * 
 * @param {any} data 
 * @returns 
 */
function buff_to_bit(data){
    // for each text row
   for(let row=0; row<data.length; row++){
       data[row].Presence = String(data[row].Presence[0])
   }

   return data
}

import {connection} from './lib'
export function get_arduino(req, resp){
    connection.query('SELECT * from arduino where Box_ID = ' + String(req.query.id), (err, results , fields)=>{ 
        if(results !== null && results.length !== 0){
            send_file('arduino.csv', buff_to_bit(results), resp)
        }
        else{
            no_box(resp, req.query.id)
        }
    })
}

export function get_raspi(req, resp){
    connection.query('SELECT * from raspi where Box_ID = ' + String(req.query.id), (err, results , fields)=>{
        if(results !== null && results.length !== 0){
            send_file('raspi.csv', results, resp)
        }
        else{
            // resp.send("No box with ID " + req.query.id)
            no_box(resp, req.query.id)
        }
    })
}

export function get_all_arduino(req, resp){
    connection.query('SELECT * from arduino', (err, results , fields)=>{
        if( results !== null && results.length !== 0){
            send_file('arduino.csv', buff_to_bit(results), resp)
        }
        else{
            resp.send("No arduino data stored in database")
        }
    })
}

export function get_all_raspi(req, resp){
    connection.query('SELECT * from raspi', (err, results , fields)=>{
        if(results !== null && results.length !== 0){
            send_file('raspi.csv', results, resp)
        }
        else{
            resp.send("No Raspberry pi data stored in database")
        }
    })
}