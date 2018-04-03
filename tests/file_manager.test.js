const fm = require('../src/file_manager')

describe('The file manager sends files', ()=>{
    let disposition

    let result

    function send(message){
        result = message
    }

    function set(data){
        disposition = data
    }

    let fake_response = {'send': send, 'set': set, 'csv':send}
    test('It sends a JSON file', ()=>{

        let now = new Date(Date.now())
        expected = [{"Presence": "0", 'Time_sent': now, 'Time_received': now}]
        fm.send_json(expected, fake_response)

        expect(result).toMatchObject(expected)
    })

    test('It sends a CSV file', ()=>{
        data = {"cat": "dog", "hello":"world"}
        fm.send_csv('test.csv', data, fake_response)
        
        expect(disposition).toMatchObject({"Content-Disposition": "attachment; filename=\"test.csv\""})
        
        // passes just a object to the response csv function now
        expect(result).toMatchObject(data)
    })
})