# move app and all the routes here they call functions in server

# import {store_arduino} from "../server"

{get_type, store_arduino} = require('./database_manager')
{app} = require('./config')
{send_zip} = require('./file_manager')

{please_send_type} = require("./messages")

supported_types = ['arduino']

lib = require('./lib')

proxy = require('http-proxy-middleware')

bugsnag = require("bugsnag")

if (app.settings.env isnt "development" and app.settings.env isnt "test")
    bugsnag.register(require("../keys/global_keys.json").bugsnag_key)
    app.use(bugsnag.requestHandler)
    app.use(bugsnag.errorHandler)

app.get "/dash*", (req, resp) ->
    resp.send("A awesome dashboard is coming here soon stay tuned.")

    # make a request using http to the website node process and then just send the response via a proxy

correct_pass = require("../keys/download_password.json").password

{authenticate} = require('./validator')

app.get "/get*", (req, resp) ->
    invalid = (message)->
        resp.send(400, message)

    authenticate(correct_pass, req.query.pass, ->
        if(req.query.type is 'all')
            send_zip(resp, {})
        
        else if(supported_types.includes(req.query.type))
            get_type(req.query.type, req.query.id, resp, req.query.format)
        
        else
            resp.send(please_send_type)
        
    , invalid)


# interpret a random group of numbers seperated by underscores as arduino transmissions
app.get(/\/[0-9]+_.*/g, store_arduino)

# the regex above fails on every second request for some reason?
# monkey patching to make it work for now
app.get '*', (req, resp)->
    if(req.url.indexOf('_') > -1)
        store_arduino(req, resp)

    else
        resp.sendStatus(404)

module.exports.store_arduino = store_arduino
module.exports.app = app