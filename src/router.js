// move app and all the routes here they call functions in server

// import {store_arduino} from "../server"

const {get_box, store_arduino} = require('./database_manager')
var {app} = require('./config')
const {send_zip} = require('./file_manager')

var supported_types = ['arduino']

const lib = require('./lib')

const bugsnag = require("bugsnag")


if (app.settings.env !== "development" && app.settings.env !== "test"){
    bugsnag.register(require("../keys/global_keys.json").bugsnag_key)
    app.use(bugsnag.requestHandler);
    app.use(bugsnag.errorHandler);
}

app.get("/dash*", (req, resp) =>{
    resp.send("A awesome dashboard is coming here soon stay tuned.")

    // make a request using http to the website node process and then just send the response via a proxy
})

const correct_pass = require("../keys/download_password.json").password

const {authenticate} = require('./validator')


function safe_route(route, callback){

    app.get(route, (req, resp)=>{
        authenticate(correct_pass, req.query.pass, ()=>{
            callback(req, resp)
        }, (message)=>{
            resp.send(message)
            // make this send 400 somehow as wells
        })
    })
 
}

const {box_exists, box_processor, latest, stats} = require('./database_manager')

safe_route('/exists', (req, resp)=>{

    let id = req.query.id

    box_exists(id, (exists)=>{
        if(exists){
            resp.render('box_exists', {id:id})
        }
        else{
            resp.render('no_box.pug', {id: id})
        }
    })
})

safe_route('/get_window', (req, resp)=>{

    influx.get_window(req.query.id, (data)=>{
        resp.send(data)
    }, req.query.symbol, req.query.val)
})

safe_route("/get*", async (req, resp) =>{

    if(req.query.type == 'all'){
        send_zip(resp, {})
    }
    else{
        get_box(req.query.id, resp, req.query.format, req.query.from, req.query.to)
    }
    // else if(supported_types.includes(req.query.type)){
       
    // }
    // else{
    //     resp.render('please_send_type.pug')
    // }
})


safe_route('/processor', (req, resp)=>{

    let id = req.query.id

    box_processor(id, (exists, processor_type)=>{
        if(exists){
            resp.send("Box " + String(id) + ' has a ' + processor_type + ' processor')
        }
        else{
            resp.render('no_box.pug', {id: id})
        } 
    })
})

const influx = require('./influx_manager')

app.post('/window_moved', (req, resp)=>{
    console.log("got: ", req.body)
    influx.store_window(req.body)
    resp.send("Data received")
})

safe_route('/stats', (req, resp)=>{
    stats(req.query.id, req.query.format, resp)
})

safe_route('/latest', (req, resp)=>{
    latest(req.query.id, req.query.format, resp)
})

app.get('/ping', (req, resp)=>{
    resp.render('ping.pug')
})

// interpret a random group of numbers seperated by underscores as arduino transmissions
app.get(/\/[0-9]+_.*/g, store_arduino)

// the regex above fails on every second request for some reason?
// monkey patching to make it work for now
app.get('*', (req, resp)=>{
    if(req.url.indexOf('_') > -1){
        store_arduino(req, resp)
    }
    else{
        resp.sendStatus(404)
    }
})

module.exports.store_arduino = store_arduino
module.exports.app = app