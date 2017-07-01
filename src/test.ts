// write tdd style tests here using avajs

import test from "ava"

import {has, repeat, config_production} from "./lib"

test('child is null', t =>{
    t.is(has({"cat": null}, null), true)
})

test('is null', t =>{
    t.is(has(null, null), true)
})

test('password present', t=>{
    let details = require("../prod-password.json")
    t.pass()
})

test('production config different to development', t=>{
    let prod = config_production()
    let config = require('config')

    let dev_details = config.get('Dbconfig')
    t.is((prod.password !== dev_details.password), true)
})