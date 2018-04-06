const lib = require("./src/lib")

const {app} = require("./src/router")

app.listen(81, '0.0.0.0', function () {
    console.log("Server listening on: http://%s:%s", require("ip").address(), 81);
})
