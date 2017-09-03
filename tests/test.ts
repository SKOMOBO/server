// // write tdd style tests here using avajs

import test from "ava"

import {authenticate} from '../src/authentication_manger'

test('authentication_fails', t=>{
    let failed = false
    authenticate('1345', ()=>{ failed = true }, ()=>{})

    t.true(failed)
})

test('authentication_works', t=>{
    let success = false

    let right_password = require('../../src/download_password.json').password

    authenticate(right_password, ()=>{}, ()=>{ success = true  })

    t.true(success)
})

import {extract} from '../src/lib'
test('extract works', t=>{

    let data = extract('0_2016-6-23-12-23-2_12332_12_31_23434_12_2434_1')
    let true_data = { 
        Box_ID: '0',
        Time_sent: '2016-6-23 12:23:2',
        Dust1: '12332',
        Dust2_5: '12',
        Dust10: '31',
        Temperature: '23434',
        Humidity: '12',
        CO2: '2434',
        Presence: true 
    }

    t.deepEqual(data, true_data)
})

test('extract fails', t=>{
    
    let data = extract('0_2017-6-23-12-23-2_12332_12_31_23434_12_2434_1')
    let true_data = { 
        Box_ID: '0',
        Time_sent: '2016-6-23 12:23:2',
        Dust1: '12332',
        Dust2_5: '12',
        Dust10: '31',
        Temperature: '23434',
        Humidity: '12',
        CO2: '2434',
        Presence: true 
    }

    t.notDeepEqual(data, true_data)
})

// succeed requires the password


// import {has, repeat, config_production} from "../src/lib"

// import * as supertest from "supertest"

// import {app} from "../src/server"

// import {raspi_server} from "../src/raspi"

// import {Server} from "http"

// function check_status(server: Server | String , code: Number, path: string){

//     //checking if arduino fails correctly
//     supertest(server)
//     // supertest('http://192.168.1.16:' + port + "/")

//     // use the above for testing production server
//     .get(path)
//     .expect(code)
//     .end((err, res) =>{
//         if (err) throw err
//     })

// }

// test('raspi fails correctly', t=>{
//     check_status(raspi_server, 400, "/")
//     t.pass()
// })

// test('arduino fails correctly', t=>{
//     check_status(app, 400, "/")
//     t.pass()
// })

// test('child is null', t =>{
//     t.is(has({"cat": null}, null), true)
// })

// test('is null', t =>{
//     t.is(has(null, null), true)
// })

// test('password present', t=>{
//     let details = require("../../src/prod-password.json")
//     t.pass()
// })

// test('production config different to development', t=>{
//     let prod = config_production()
//     let config = require('config')

//     let dev_details = config.get('Dbconfig')
//     t.is((prod.password !== dev_details.password), true)
// })
