const lib = require('../src/lib')

test('It returns true', ()=>{
    expect(lib.has({"something": null}, null)).toBe(true)
})

test('also true', ()=>{
    expect(lib.has({"a_thing": 12}, 12)).toBe(true)
})

test('this fails', ()=>{
    expect(lib.has({"a_thing": 12}, 1)).toBe(false)
})

test('exports functions correctly', ()=>{
    function test(){}
    expect(lib.export_functs(test)).toMatchObject({'test': test})
})
