// should we make basic functions in here and just call them from router? i think so to make things
// more legible

const lib = require("./src/lib")

function validate_data(data, handler){
    // console.log(data)
    if (data != undefined && data !== '' && data !== ' ' && data !== 'raspi' && data !== 'raspi/'){
        handler(data)
    }
}

function store_arduino(req, resp){

    let url = req.url.slice(1)
    validate_data(url, (data)=>{
        // console.log(data)
        let values = lib.extract(url)
        // console.log(values)
        lib.store(resp, "arduino", values)
    })
}

module.exports = lib.export_them(store_arduino)

var app = require("./src/router").app
// import {app} from './src/router'


app.listen(81, '0.0.0.0', function () {
    console.log("Server listening on: http://%s:%s", require("ip").address(), 81);
})
