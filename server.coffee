lib = require "./src/lib"
{app} = require "./src/router"

app.listen 81, '0.0.0.0', ->
    console.log "Server listening on: http://%s:%s", require("ip").address(), 81