// write tdd style tests here using avajs

import test from "ava"

import {has_null, repeat} from "./lib"

test('child-is-null', t =>{
    t.is(has_null({"cat": null}), true)
})

test('is-null', t =>{
    t.true(has_null(null))
})