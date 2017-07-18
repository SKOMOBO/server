import {createServer, Server,IncomingMessage, ServerResponse} from "http"

import {config_db, has} from "./lib"

export async function store(response: ServerResponse, route: number, values: any){

    let connection = config_db()

    if(!has(values, null)){

        // let query = 
        await connection.query('INSERT INTO arduino where BOX_ID = ' + values[0] + ' set ?' , values)
        // tell the client everything is ok
        response.writeHead(200, {"Content-Type": "text/HTML"})
    }
    else{
        console.log("Invalid request!")
        response.writeHead(400, {"Content-Type": "text/HTML"})
    }
       
    //send the response
    response.end()
}

function extract(data: String){

    // breaks up each value by a dash and removes / in the front
    let tokens: string[] = data.slice(3).split('_')
    
    let values = {}
    // route 1
    if(data[1] == '1'){

        let col_names1 = ['Box_ID', 'Time_sent', 'Dust1', 'Dust2_5', 'Dust10']
        if(tokens.includes('')){
            return null
        }
        tokens.map((value, index)=>{
            values[col_names1[index]] = value
        })

        let times: String[] = values['Time_sent'].split("-")
        let date = times.slice(0, 3).join("-")
        let time = times.slice(3, 6).join(":")
        values["Time_sent"] = date + " " + time

        // boxID 
        // day month year second minute hour
        // dust 1 2.5 10



    } // route 2
    else if(data[1] == '2'){
        let col_names2 = ['Box_ID', 'Temperature', 'Humidity', 'CO2', 'Presence']
        if(tokens.includes('')){
            return null
        }
        tokens.map((value, index)=>{
            values[col_names2[index]] = value
        })

        values['Presence'] = values['Presence'] == '1'
        values['Temperature'] = Number(values['Temperature']) / 100
        values['Humidity'] = Number(values['Temperature']) / 100
        // insert into the latest record that has the same box ID
        
        // boxID
        //
        // Temp * 100
        // humidity * 100
        // CO2
        // PIR
    }
    else{
        console.log('invalid route')
    }

    return values
}

async function handler (request:IncomingMessage, response:ServerResponse)
{
    
    console.log(request.url)
    let data = request.url
    // evil but it works for now
 
    if(data.length !== 0 && data !== "/"){
        let values = extract(data)
        console.log(values)
        // store(response, db_name, values)
    }
    else{
        response.writeHead(400)
        console.log("No data")
    }
    
}


export var server = createServer(handler)

server.listen(81, '0.0.0.0', function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://%s:%s", require("ip").address(), 81);
});
