const db = require('../src/database_manager')

describe('the database stores data correctly', ()=>{
    test('The connection is resolved', ()=>{
        expect(jest.isMockFunction(db.resolve_db().query)).toBe(true)
    })

    function non(){}
    var fake_response = {'send': non, 'writeHead':non, 'end':non}

    test('The database manager formats the insert statement correctly', ()=>{
   
        db.store_arduino({'url': '123_2342_2324_2324_232'}, fake_response)
        expect(db.get_connection().query.mock.calls[0][0]).toBe("INSERT INTO arduino set ?")
    })

    test('The database manager parses the URL correctly', ()=>{
       
        let url = '/123_2014-12-30-12-59-59_12_16_1000_30.00_90.00_400_1'
        let expected = {"Box_ID": "123", "Dust1": "12", "Dust10": "1000", 
            "Dust2_5": "16", "Presence": true, "Time_sent": "2014-12-30 12:59:59",
            'Temperature': "30.00", 'Humidity':"90.00", 'CO2':"400"}

        db.store_arduino({'url': url}, fake_response)
        expect(db.get_connection().query.mock.calls.length).toBe(2)
        expect(db.get_connection().query.mock.calls[1][1]).toMatchObject(expected)
    })

    test('The database manager uses the correct query to retrieve data', ()=>{
        db.get_type('arduino', '1', fake_response)
        expect(db.get_connection().query.mock.calls[2][0]).toBe("SELECT * from arduino where Box_ID = 1")
    })

    test('The data format correcter is defined', ()=>{
        expect(db.fix_format).toBeDefined()
    })

    test('Box exists function is defined', ()=>{
        expect(db.box_exists).toBeDefined()
    })
})