import * as supertest from "supertest"

//checking if arduino fails correctly
supertest('http://192.168.1.16:81/')
.get('/')
.expect(400)
.end((err, res) =>{
    if (err) console.log(err)
})

// checking if rapi fails correctly
supertest('http://192.168.1.16:82/')
.get('/raspi')
.expect(400)
.end((err, res) =>{
    if (err) console.log(err)
})