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

test('extracts URLS correctly', ()=>{
    let url = '0_123_30-12-2014-12-59-59_12_16_1000_30.00_90.00_400_1'
    let expected = {"Box_ID": "123", "Dust1": "12", "Dust10": "1000", 
        "Dust2_5": "16", "Presence": true, "Time_sent": "30-12-2014 12:59:59",
        'Temperature': "30.00", 'Humidity':"90.00", 'CO2':"400"}

    expect(lib.extract(url)).toMatchObject(expected)
})
