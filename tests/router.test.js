const router = require('../src/router')

test('The app is defined', ()=>{
    expect(router.app).toBeDefined()
})