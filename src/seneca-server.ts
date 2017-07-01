import SNS = require("seneca")

let seneca = SNS()

seneca.add({"role": "arduino", "cmd":"store"}, (msg, respond)=>{
    respond(null,{"answer": "stored"})
})

seneca.act({"role": "arduino", "cmd":"store"}, console.log)