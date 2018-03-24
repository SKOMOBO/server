if(typeof module !== 'undefined'){
    var $ = require('./jquery-3.3.1.min')
    module.exports = {
        csv_to_json: csv_to_json,
        to_num: to_num,
        to_percent: to_percent,
        upload: upload,
        clean_string:clean_string,
        to_bool: to_bool,
        unique: unique
    }
}


function to_percent(i, total){
    return String((i / total) * 100) + "%"
}

function clean_string(thing, cols=null){

    if(cols !== null){
        cols.forEach(function(col){
            thing[col] = thing[col].replace(/('|"|\r)/g, "")
        })
        return thing
    }
    else{
        return thing.replace(/('|"|\r)/g, "")
    }
    
}

function csv_to_json(csv){

    var lines=csv.split("\n");

    var headers = lines[0].split(",").map(function(header){
        return clean_string(header)
    })

    var result = lines.slice(1).map(function(line){

        var obj = {};
        var columns=line.split(",");

        headers.forEach(function (header, j){
            obj[header] = columns[j];
        })
        
        return obj
    })
    
    return result; //JavaScript object
}


function upload(data, route, callback){
    return $.post(url=route, data = data, callback)
}

function to_num(json, props){
    // Convert to floats and ints
    json = json.map(function(obj){
        props.forEach(function(prop){
            obj[prop] = Number(obj[prop])
        })
        return obj
    })
    return json
}

function unique(items) {
    return items.filter(function(value, index, self){
        return self.indexOf(value) === index
    })
}

function to_bool(item, cols = null){

    if(cols !== null){
        cols.forEach(function(col){
            item[col] = item[col] === '1'
        })

        return item
    }
    else{
        return item === '1'
    }
}