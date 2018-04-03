var {app} = require('../src/router')

test('The app is defined', ()=>{
    expect(app).toBeDefined()
})

var request = require('supertest')(app)

const {password} = require('../keys/download_password')
// const {no_zip} = require('../src/messages')
const {no_zip} = require('../src/messages')

describe('the routes work correctly', ()=>{
    test('returns invalid route', ()=>{
       return request.get('/').expect(404)
    })

    test('returns invalid password', ()=>{
        return request.get('/get?type=arduino&id=2').expect(400)
    })

    test('returns no zip', ()=>{
        return request.get('/get?type=all&id=2&pass=' + password).expect(
            "<html><body>" + no_zip + "</body></html>"
        )
    })

    test('returns no dashboard', ()=>{
        return request.get('/dashboard').expect('A awesome dashboard is coming here soon stay tuned.')
    })

    //  test it stores correctly
})



// readd dust cleaner and just use super test attach to test csv??