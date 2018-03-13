fm = require '../src/file_manager'

describe 'The file manager sends files', ->
    disposition = null
    result = null

    send = (message)->
        result = message

    set = (data)->
        disposition = data
    
    fake_response = 
    send: send
    set: set
    csv: send
    
    test 'It sends a JSON file', ->

        now = new Date Date.now()

        expected = 
        [
            "Presence": "0"
            'Time_sent': now 
            'Time_received': now
        ]

        fm.send_json expected, fake_response

        expect result
        .toMatchObject expected

    test 'It sends a CSV file', ->
        data = 
        "cat": "dog"
        "hello":"world"

        fm.send_csv 'test.csv', data, fake_response

        expected = 
            "Content-Disposition": "attachment; filename=\"test.csv\""
        
        expect disposition
        .toMatchObject expected
        
        # passes just a object to the response csv function now
        expect result
        .toMatchObject data