const config = require('../src/config')

test('The app is defined', ()=>{
    expect(config.app).toBeDefined()
})