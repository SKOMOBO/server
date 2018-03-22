// requirements

// accepts csv files

// decodes csv files to json

// sends each row one by one to the server

// receives altered data and downloads the data as a csv file again on the client

function update_progress(progress, bar){
    return bar.width(progress)
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

function to_percent(i, total){
    return String((i / total) * 100) + "%"
}

function csv_to_json(csv){

    var lines=csv.split("\n");

    var headers = lines[0].split(",").map(function(header){
        return header.replace(/('|\r|")/g, "")
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

// module exporting to run tests using nodejs
if(module){
    module.exports = {
        csv_to_json: csv_to_json,
        to_num: to_num,
        to_percent: to_percent
    }
}