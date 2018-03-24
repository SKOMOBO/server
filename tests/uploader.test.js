const uploader = require('../static/uploader_lib')

test('it converts col values to floats and ints', ()=>{
    values = [{cat: "2", dog: "2.3", prof: "0"}]
    expect(uploader.to_num(values, Object.keys(values[0])))
    .toMatchObject([{cat: 2, dog: 2.3, prof: 0}])
})

test('it decodes csv files where rows and columnames are the same', ()=>{
    actual = uploader.csv_to_json("1,2,3\n1,2,3")
    expect(actual).toMatchObject([{1: '1', 2:'2', 3:'3'}])
})

test('it decodes csv files with headers that are different to the values', ()=>{
    actual = uploader.csv_to_json("cat,dog,prof\n1,2,3")
    expect(actual).toMatchObject([{cat: '1', dog:'2', prof:'3'}])
})

test('it converts to percentage', ()=>{
    expect(uploader.to_percent(20, 100)).toBe("20%")
    expect(uploader.to_percent(5, 10)).toBe("50%")
    expect(uploader.to_percent(5, 20)).toBe("25%")
})

test("it removes silly chars from strings", ()=>{
    let word = '\r\r\'h"i\r'
    let item = {'a_thing': word}

    expect(uploader.clean_string(word)).toBe('hi')
    expect(uploader.clean_string(item, ['a_thing'])).toMatchObject({'a_thing':'hi'})
})

test("it converts strings to booleans correctly", ()=>{
    expect(uploader.to_bool("0")).toBe(false)
    expect(uploader.to_bool("1")).toBe(true)
    expect(uploader.to_bool({'he': '1'}, ['he'])).toMatchObject({'he':true})
    expect(uploader.to_bool({'he': '0'}, ['he'])).toMatchObject({'he':false})
})

test("it returns the unique items in the array", ()=>{
    let actual = uploader.unique(['hello', 'hello', 'no', 'ok'])
    expect(actual.length).toBe(3)
    expect(actual).toEqual(['hello', 'no', 'ok'])
})

test('it uploads data correctly', done=>{

    const app = require('express')()
    const cors = require('cors')
    app.use(cors())

    app.post('/test', (req, resp)=>{
        resp.send('hello')
    })

    let listener = app.listen(()=>{
        let port = listener.address().port
        let base = "http://localhost:" + port
        uploader.upload('hello', base + '/test', (response)=>{
            expect(response).toBe('hello')
            done()
        })
    })

})