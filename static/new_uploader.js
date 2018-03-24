// requirements

// accepts csv files

// decodes csv files to json

// sends each row one by one to the server

// receives altered data and downloads the data as a csv file again on the client

// module exporting to run tests using nodejs and importing to make tests happy

function update_progress(progress, bar){
    return bar.width(progress)
}

var data_file = null

function file_attached(files){
    data_file = files[0]
}

function process_file(){
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

                // pass file data
                decode(this.result)
            }
        }
        else{
            alert("Please attach a file before submitting")
        }
    }
}

function display(errors){
    if(errors.length > 0){
        unique(errors).forEach(function(error) {
            alert(element)
        });
        return []
    }
}

function decode(text){
    json = to_num(csv_to_json(text), ['Dust1', 'Dust2_5', 'Dust10', 'Temperature','Humidity','CO2'])

    errors = []
    json = json.map(function(item, i){
        item = clean_string(item, ['Box_ID', "Presence", "Time_received", "Time_sent"])
        item = to_bool(item, ["Presence"])

        num_processed = 0

        // send requests show upload progress
        upload(item, 'clean', (response)=>{
            try{
                json[i] = JSON.parse(response)
                num_processed = num_processed + 1
            }
            catch{
                errors.push(response)
            }
        })
    })

    // wait in a non blocking fashion for the servr to process everything
    ticks = 0
    ticker = setInterval(function(){
        if(num_processed === 0){
            ticks = ticks + 1

            // timeout after 3 seconds waiting and no progress
            if(ticks === 3000){
                clearInterval(ticker)
                alert('Connection to cleaning server timed out, please try again later :)')
            }
        }
        else if(num_processed > 0 && num_processed < json.length){
            // update progress bar
            console.log(num_processed / json.length)
        }
        else if(num_processed === json.length){
            clearInterval(ticker)
            alert('Download complete!')

            download(CSV, data_file.name.slice(0, -4) + '_clean.csv', 'text/csv')
        }
    }, 1)

    errors = display(errors)
}