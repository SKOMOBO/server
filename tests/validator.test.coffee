{authenticate, validate_data} = require("../src/validator")

describe 'authentication works', ->
    test 'it fails to authenticate', ->
        expect authenticate '1234', '2345', ->, ->
        .toBe 'invalid password'
    
    test 'it authenticates', ->
        expect authenticate '1234', '1234', ->, ->
        .toBe true

describe 'validate_data says data is invalid', ->
    test 'null is invalid', ->
        expect validate_data null
        .toBe false

    test 'undefined is invalid', ->
        expect validate_data undefined
        .toBe false

    test 'space is invalid', ->
        expect validate_data ' '
        .toBe false

    test 'empty is invalid', ->
        expect validate_data ''
        .toBe false