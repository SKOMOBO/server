var {app} = require('../src/router')

test('The app is defined', ()=>{
    expect(app).toBeDefined()
})

var request = require('supertest')(app)

const {password} = require('../keys/download_password')

describe('the routes work correctly', ()=>{
    test('returns invalid route', ()=>{
       return request.get('/').expect(404)
    })

    test('returns invalid password', ()=>{
        return request.get('/get?type=arduino&id=2').expect('invalid password')
    })

    test('returns no zip', ()=>{
        return request.get('/get?type=all&id=2&pass=' + password).expect("This will send a zip file with both raspberry pi and arduino data in the near future")
    })

    test('returns no dashboard', ()=>{
        return request.get('/dashboard').expect('A awesome dashboard is coming here soon stay tuned.')
    })

    test('storing route works', ()=>{
        return request.get('/123_2014-12-30-12-59-59_12_16_1000_30.00_90.00_400_1').expect(200)
    })

    test('multiple store requests works', ()=>{
        request.get('/23_2014-12-30-12-59-59_12_16_1000_30.00_90.00_400_1').expect(200)
        return request.get('/23_2014-12-30-12-59-59_12_16_1000_30.00_90.00_400_1').expect(200)
    })

    const pug = require('pug')

    function get_view(file, data){
        return pug.renderFile('views/' + file + '.pug', data)
    }

    test('box exists works', ()=>{
        return request.get('/exists?id=1&pass=' + password).expect(
            get_view('no_box', {id:1}))
    })

    test('box exists says no box exists', ()=>{
        return request.get('/exists?id=ha&pass=' + password).expect(
            get_view('no_box', {id:'ha'}))
    })

    test('box processor returns processor of box', ()=>{
        return request.get('/processor?id=1&pass=' + password).expect("Box 1 has a arduino processor")
    })

    test('box processor returns no box', ()=>{
        return request.get('/processor?id=ha&pass=' + password).expect("No box with ID ha")
    })

    test('latest returns 200', ()=>{
        return request.get('/latest?id=1&pass=' + password).expect(200)
    })
})



// readd dust cleaner and just use super test attach to test csv??