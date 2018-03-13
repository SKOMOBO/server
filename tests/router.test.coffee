app = require('../src/router').app

test 'The app is defined', ->
    expect(app).toBeDefined()

request = require('supertest')(app)

password = require('../keys/download_password').password

# {no_zip} = require '../src/messages'
no_zip = require('../src/messages').no_zip

# readd dust cleaner and just use super test attach to test csv
describe 'the routes work correctly', ->
    test 'returns invalid route', ->
       return request.get '/'
       .expect 404

    test 'returns invalid password', ->
        return request.get '/get?type=arduino&id=2'
        .expect 400

    test 'returns no zip', ->
        return request.get '/get?type=all&id=2&pass=' + password
        .expect no_zip

    test 'returns no dashboard', ->
        return request.get '/dashboard'
        .expect 'A awesome dashboard is coming here soon stay tuned.'

    test 'storing route works', ->
        return request.get '/123_2014-12-30-12-59-59_12_16_1000_30.00_90.00_400_1'
        .expect(200)

    test 'multiple store requests works', ->
        request.get '/23_2014-12-30-12-59-59_12_16_1000_30.00_90.00_400_1'
        .expect 200
        return request.get '/123_1'
        .expect 200