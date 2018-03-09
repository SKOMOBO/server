const messages = require('../src/messages')

test('It says no box with correct ID', ()=>{
    expect(messages.no_box(1)).toBe('No box with ID 1')
})