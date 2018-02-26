const {authenticate} = require("../src/validator")

test('it fails to authenticate', ()=>{
    expect(authenticate('1234', '2345', ()=>{}, ()=>{})).toBe('invalid password')
})

test('it authenticates', ()=>{
    expect(authenticate('1234', '1234', ()=>{}, ()=>{})).toBe(true)
}) 