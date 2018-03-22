var data_file = null

function file_attached(files){
    data_file = files[0]
}

var errors = []

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}


function add_error(msg){
    errors.push(msg)
}

var has_errored = false
function display_errors(msg){
    errors = errors.filter(onlyUnique)

    errors.forEach(function(error){
        $('#myBar').hide() 
        alert(error)
        $('#error').text(error)
        $('#error').show()
    });

    errors = []
    has_errored = true
}

function clear_error(){
    $('#error').hide()
}

function upload(){
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        add_error('The File APIs are not fully supported in this browser. Please try the latest version of your browser, Chrome or Firefox');
        display_errors()
        return;
    }   
    else{
        clear_error()

        var reader = new FileReader()
        // var f = document.getElementById("uploader").files[0]

        if(data_file !== null){
            reader.readAsText(data_file)

            reader.onloadend = function(event){

                // pass file name in
                decode(this.result)
            }
        }
        else{
            add_error("Please attach a file before submitting")
            display_errors()
        }
    }
}

function csvJSON(csv){
    var lines=csv.split("\n");

    var result = [];

    var headers=lines[0].split(",");
    headers = headers.map((header)=>{
        header = header.replace(/'/g, "")
        header = header.replace(/\r/g, "")
        return header.replace(/"/g, "")
    })
    for(var i=1;i<lines.length;i++){

        var obj = {};
        var currentline=lines[i].split(",");

        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
         // Convert to floats and ints
        obj.Temperature = Number(obj.Temperature)
        obj.Humidity = Number(obj.Humidity)
        obj.CO2 = Number(obj.CO2.slice(0, -1))
        obj.Dust1 = Number(obj.Dust1)
        obj.Dust2_5 = Number(obj.Dust2_5)
        obj.Dust10 = Number(obj.Dust10)
        result.push(obj);

    }
    
    return result; //JavaScript object
    // return JSON.stringify(result); //JSON
}

function update_progress(index, total_rows){
    console.log(index, total_rows)
    var progress = String((index / total_rows) * 100) + "%"
    console.log(progress)
    $("#myBar").text(progress)
    $("#myBar").width(progress)
}

// var my_url = 'localhost:81/'

// transmits data to server just need to put payload in body somehow then return result and turn into csv on client

function clean_row(row, on_received, on_error){
    return $.ajax({
        type: "post",
        url: "clean",
        data: JSON.stringify(row),
        contentType: 'application/json',
        success:function(data){
            try{
                clear_error()
                on_received(JSON.parse(data))
            }
            catch(error){
                on_error(data)
            }
        },
        error: function(xmlhttprequest, textstatus, message) {
            if(textstatus==="timeout") {
                alert("No server connection");
                has_errored = true
            } else {
                alert(textstatus);
            }
        }
    })
}

function decode(csv){
    var json = csvJSON(csv)
    $("#myProgress").show()
    var index = 0

    var total_rows = json.length

    var requests = []
    for(i = 0; i < json.length; i++){
        update_progress(index, total_rows)

        requests.push(clean_row(json[i], function(cleaned){
            json[i].Dust10 = cleaned.Dust10
            json[i].Dust2_5 = cleaned.Dust2_5
            index = i
        }, function(msg){
            add_error(msg)
        }))

    }

    if(!has_errored){
        $.when.apply($, requests).done(function(){
            update_progress(index, total_rows)
    
            console.log(json)
            json = {"keys": json[0].keys, "data": json}
    
            // insert library reference in HTML
            // variable for the final download
            CSV = json2csv(json)
    
            // correct weird formatting
            CSV = CSV.replace(/"""/g, '"')
    
            // get the final name here and data
            download(CSV, data_file.name.slice(0, -4) + '_clean.csv', 'text/csv')
        })
    }
    else{
        display_errors()    
    }

    has_errored = false

}
