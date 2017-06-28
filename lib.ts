
    
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


/**
 * 
 * 
 * @export
 * @param {string} col 
 * @param {number} times 
 * @returns 
 */
export function repeat(col: string, times: number){

    return range(1, times).map((value)=>{
        return col + String(value)
    })
}


/**
 * Checks if the object contains any children with value or if it itself is that value
 * 
 * @param {*} object 
 */
export function has(object: any, val: any){

    if(object != val){
        for (let prop in object){
            if (object[prop] === val){
                return true
            }
        }
    }
    else{
        return object === val
    }

}

export function config_production(){
    let config = require('config')

    //get all the publicly available config values
    let the_config = config.get('Dbconfig')
    let login_details = require('../prod-password.json')

    for(let prop in the_config){

        if(prop !== 'password' && prop !== 'user'){
            login_details[prop] = the_config[prop]
        }
    }

    return login_details
}

export function extract(url){
     // breaks up each value by a dash and removes / in the front
    let tokens: string[] = url.slice(1).split('_')

    // layout how the data is going to be mapped
    // use javascript array.map for this somehow

    // let col_names: string[] = ['Dust1', 'Dust2_5', 'Dust10', 'Box_ID', 'Temperature', 'Humidity', 'CO2', 'Decibals']
    // .concat(repeat('Distance', 7)).concat(['Presence', 'Time'])

    let col_names: string[] = ['Box_ID','Time_sent','Dust1', 'Dust2_5', 'Dust10', 'Temperature', 'Humidity', 'CO2', 'Presence']

    let values = {}

    if(tokens.includes('')){
        return null
    }
    tokens.map((value, index)=>{
        values[col_names[index]] = value
    })

    let times: String[] = values['Time_sent'].split("-")
    let date = times.slice(0, 3).join("-")
    let time = times.slice(3, 6).join(":")
    values["Time_sent"] = date + " " + time

    values['Presence'] = values['Presence'] == '1'

    return values
}

// integrate into vscode task system?? so that tsc happens and ava happens at the sane time

// make it linux and windows friendly with the net start thing and put in net start thing "net start MySQL && 
