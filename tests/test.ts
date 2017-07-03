// write tdd style tests here using avajs

import test from "ava"

import {has, repeat, config_production} from "../src/lib"

import * as supertest from "supertest"

import {server} from "../src/server"

import {raspi_server} from "../src/raspi"

import {Server} from "http"

function check_status(server: Server, code: Number, path: string){

    //checking if arduino fails correctly
    supertest(server)
    // supertest('http://192.168.1.16:' + port + "/")

    // use the above for testing production server
    .get(path)
    .expect(code)
    .end((err, res) =>{
        if (err) throw err
    })

}

test('raspi fails correctly', t=>{
    check_status(raspi_server, 400, "/")
    t.pass()
})

test('arduino fails correctly', t=>{
    check_status(server, 400, "/")
    t.pass()
})


test('child is null', t =>{
    t.is(has({"cat": null}, null), true)
})

test('is null', t =>{
    t.is(has(null, null), true)
})

test('password present', t=>{
    let details = require("../../src/prod-password.json")
    t.pass()
})

test('production config different to development', t=>{
    let prod = config_production()
    let config = require('config')

    let dev_details = config.get('Dbconfig')
    t.is((prod.password !== dev_details.password), true)
})
