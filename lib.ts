
    
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


export function extract(url){
     // breaks up each value by a dash and removes / in the front
    let tokens: string[] = url.slice(1).split('_')

    // layout how the data is going to be mapped
    // use javascript array.map for this somehow

    let col_names: string[] = ['Dust1', 'Dust2_5', 'Dust10', 'Box_ID', 'Temperature', 'Humidity', 'CO2', 'Decibals']
    .concat(repeat('Distance', 7)).concat(['Presence', 'Time'])

    let values = {}

    if(tokens.includes('')){
        return null
    }
    tokens.map((value, index)=>{
        values[col_names[index]] = value
    })

    values['Presence'] = values['Presence'] == 'true'

    return values
}

// integrate into vscode task system?? so that tsc happens and ava happens at the sane time

// make it linux and windows friendly with the net start thing and put in net start thing "net start MySQL && 
