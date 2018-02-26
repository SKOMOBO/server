const router = require('../src/router')

test('The app is defined', ()=>{
    expect(router.app).toBeDefined()
})

var request = require('supertest')(router)

describe('the routes work correctly', ()=>{
    test('returns invalid route', ()=>{

        var result = null
        request.get('/').end((err, res)=>{
            result = res.status
        })

        expect(result).toBe(200)
    })
})



// readd dust cleaner and just use super test attach to test csv??