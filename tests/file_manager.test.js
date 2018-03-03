const fm = require('../src/file_manager')

var disposition

var result

function send(message){
    result = message
}

function set(data){
    disposition = data
}

var fake_response = {'send': send, 'set': set}
test('It sends a JSON file', ()=>{
   expected = [{"Presence": "0"}]
   fm.send_json(expected, fake_response)

   expect(result).toMatchObject(expected)
})

// test('It sends a CSV file', ()=>{
//     data = {"cat": "dog"}
//     fm.send_csv('test.csv', data, fake_response)
    
//     expect(disposition).toMatchObject({"Content-Disposition": "attachment; filename=\"test.csv\""})
//     expect(result).toMatchObject("\"cat\"\n\"dog\"")
//  })