import {app} from './server'
import {store} from './lib'

function extract_raspi(data: String){
    
    // breaks up each value by a dash and removes / in the front
    let tokens: string[] = data.split('_')
    // console.log

    let values = {}

    // assume reqs hit router nodejs that will probably be programmed with express? first which then splits into raspi and arduino respectively

    let col_names1 = ['BOX_ID', 'Time_sent', 'Decibels', 'Distance1', 'Distance2', 'Distance3', 'Distance4', 'Distance5', 'Distance6', 'Distance7']

    // fix this monkey patch so that the time sent gets converted to hex properly
    // store the original time token before we accidentally convert it form hex
    let correct_time = tokens[1]
    tokens.map((value, index)=>{

        // converts from HEX to string integers
        values[col_names1[index]] = String(parseInt("0x" + value))
    })

    let times: String[] = correct_time.split("-")
    let date = times.slice(0, 3).join("-")
    let time = times.slice(3, 6).join(":")
    values["Time_sent"] = date + " " + time

    return values
}

app.get("/raspi*", (req, resp) =>{

    let data = req.url.slice(7)
    console.log(data)
    let values = extract_raspi(data)
    console.log(values)
    store(resp, "raspi", values)
})