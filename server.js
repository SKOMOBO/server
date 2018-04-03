const lib = require("./src/lib")

const {app} = require("./src/router")

let listener = app.listen(81, '0.0.0.0', function () {
    let address = listener.address()
    console.log("Server listening on: http://%s:%s", address.address, address.port);
})
