
///<reference path="node_modules/@types/node/index.d.ts"/>
import * as http from "http"

let mysql = require('mysql2')

var connection = mysql.createConnection({host:'localhost', user: 'root', database: 'skomobo', password: 'dev1234'});


/**
 * Like the python range function, returns number array starting at start and ending at end
 * 
 * @param {number} start 
 * @param {number} end 
 * @returns {number[]} 
 */
function range(start: number, end: number): number[]{
   let nums = Array.apply(null, Array(end + 1)).map(function (_, i) {return i;});

   return nums.slice(start)
}

function repeat(col: string, times: number){

    return range(1, times).map((value)=>{
          return col + String(value)
    })
}


/**
 * Checks if the object contains any null children or if it itself is null
 * 
 * @param {*} object 
 */
function has_null(object: any){

    if(object != null){
        object.map((value, index) =>{
           return value == null;
        })
    }
    else{
        return object == null;
    }
   
}

function extract(url){
     // breaks up each value by a dash and removes / in the front
    let tokens: string[] = url.slice(1).split('_')

    // layout how the data is going to be mapped
    // use javascript array.map for this somehow

    let col_names: string[] = ['Dust1', 'Dust2_5', 'Dust10', 'Box_ID', 'Temperature', 'Humidity', 'CO2', 'Decibals']
    .concat(repeat('Distance', 7)).concat(['Presence', 'Time'])

    let values = {}

    tokens.map((value, index)=>{
        values[col_names[index]] = value
    })

    values['Presence'] = values['Presence'] == 'true'

    return values
}

async function handleRequest(request, response){

    // for browser testing
    if(request.url != '/favicon.ico'){

       let values = extract(request.url)

       console.log(values)

       if(!has_null(values)){
          await connection.query('INSERT INTO sensor_data set ?' , values)
       }
       else{
           console.log("Invalid request!")
       }
    }

}

//Create a server
var server = http.createServer(handleRequest);

let ip = require("ip")

//Lets start our server
server.listen(8080, '0.0.0.0', function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://%s:%s", ip.address(), 8080);
});
