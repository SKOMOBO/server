const lib = require("./src/lib")

const {app} = require("./src/router")

let port = 81

app.listen(port, '0.0.0.0', function () {
    console.log("server listening")
})
