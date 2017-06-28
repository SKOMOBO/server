// write tdd style tests here using avajs

import test from "ava"

import {has, repeat} from "./lib"

test('child-is-null', t =>{
    t.is(has({"cat": null}, null), true)
})

test('is-null', t =>{
    t.is(has(null, null), true)
})

test('password-present', t=>{
    let details = require("../prod-password.json")
    t.pass()
})
