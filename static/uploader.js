
data_file = null

function file_attached(files){
    data_file = files[0]
}

function upload(){
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser. Please try the latest version of your browser, Chrome or Firefox');
        return;
    }   
    else{

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
            alert("Please attach a file before submitting")
        }
        // reader.onload = decode
        
        // reader.readAsText(f)
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
    var progress = String((index / total_rows) * 100) + "%"
    var progress_bar = document.getElementById("myBar")
    progress_bar.innerText = progress
    progress_bar.style.width = progress
    
}

var URL = 'localhost:81/'

// transmits data to server just need to put payload in body somehow then return result and turn into csv on client
function clean_row(row, on_received){

    // $.post(
    //     "localhost:81/clean",
    //     data = row,
    //     function(data){
    //         on_received(JSON.parse(data))
    //     }
    // )
    // configuring request data
    
    var xhr = new XMLHttpRequest();
    
    xhr.open("POST", URL + "clean", true);

    xhr.ontimeout = function(ev){
        console.error("Connection timed out")
    }

    xhr.onerror = function(error){
        console.error(error)
    }

    xhr.onprogress = function(){
        console.log("loading")
    }

    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            on_received(JSON.parse(xhr.responseText))
            // var json = JSON.parse(xhr.responseText);
            // console.log(json.email + ", " + json.password);

        }
    };

    xhr.send(JSON.stringify(row));
}

function decode(csv){
    json = csvJSON(csv)
    document.getElementById("myProgress").style.display = 'block'
    var index = 0

    var total_rows = json.length

    for(i = 0; i < json.length; i++){

        clean_row(json[i], (cleaned)=>{
            json[i].Dust10 = cleaned.Dust10
            json[i].Dust2_5 = cleaned.Dust2_5
            console.log(json)
            index = i
            update_progress(index, total_rows)
        })

    }
    // json.forEach(row => {
    //     // result.append(clean_row(row))
    //     update_progress(index, total_rows)
    //     index = index + 1

    //     clean_row(row, (cleaned)=>{
            
    //     })
    //     // send request to server with data and get response
    // });
    // add last 1%
    update_progress(index, total_rows)

    // insert library reference in HTML
    // variable for the final download
    CSV = json2csv(json)

    // get the final name here and data
    // might have to stream this somehow
    save('clean.csv', CSV)
}

function save(filename, data) {
    var blob = new Blob([data], {type: 'text/csv'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
}