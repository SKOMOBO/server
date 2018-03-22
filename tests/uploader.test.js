const {csv_to_json, to_num, to_percent, update_progress} = require('../static/new_uploader')

test('it converts col values to floats and ints', ()=>{
    values = [{cat: "2", dog: "2.3", prof: "0"}]
    expect(to_num(values, Object.keys(values[0])))
    .toMatchObject([{cat: 2, dog: 2.3, prof: 0}])
})

test('it decodes csv files where rows and columnames are the same', ()=>{
    actual = csv_to_json("1,2,3\n1,2,3")
    expect(actual).toMatchObject([{1: '1', 2:'2', 3:'3'}])
})

test('it decodes csv files with headers that are different to the values', ()=>{
    actual = csv_to_json("cat,dog,prof\n1,2,3")
    expect(actual).toMatchObject([{cat: '1', dog:'2', prof:'3'}])
})

test('it converts to percentage', ()=>{
    expect(to_percent(20, 100)).toBe("20%")
})

test('it converts to percentage with a weird total', ()=>{
    expect(to_percent(5, 10)).toBe("50%")
})


test('it converts to percentage with a really weird total', ()=>{
    expect(to_percent(5, 20)).toBe("25%")
})