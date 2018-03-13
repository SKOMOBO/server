
{no_zip} = require('./messages')
fs = require("fs")

#! this desperately needs to be cleaned up to make dependency tree simpler

send_zip = (resp, data)->
    resp.send(no_zip)

send_file = (file, resp)->

    # telling the browser to treat the text as a file with a specific name
    resp.set({'Content-Disposition': 'attachment; filename="' + file + '"'})

    fs.readFile file, (err, text)->
        resp.send(text)

# Readable = require('stream').Readable

csv = require('csv-express')
# csv = require('./express-csv-stream')

send_csv = (file_name, data, resp) ->
    # Excel stupidly assumes that a CSV starting with ID as the first column is a SYLK file
    data = JSON.parse(JSON.stringify(data).replace(/ID/g, 'Id'))
    # telling the browser to treat the text as a attachment
    resp.set({'Content-Disposition': 'attachment; filename="' + file_name + '"'})
    resp.csv(data, true, stream=true)

# abstract formatting to format manager
###**
 * Converts the presence nodejs buffer to a single bit 1 or 0 to represent booleans
 * 
 * @param {any} data 
 * @returns 
 ###
fix_formatting = (data)->

    if data[0].Presence isnt undefined
        # for each text row

        for row in [0 .. data.length-1]
            data[row].Presence = String(data[row].Presence[0])
            data[row].Time_received = fix_timestamp(data[row].Time_received)
            data[row].Time_sent = fix_timestamp(data[row].Time_sent)
            
    return data

# below two timestamp functions were retrieved from https:#stackoverflow.com/a/5133807/6142189

fix_timestamp = (data) ->
    
    return data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate() + " " + data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();


send_json = (data, resp) ->
    resp.send(fix_formatting(data))


{export_functs} = require('./lib')
module.exports = export_functs(send_zip, send_csv, send_file, send_json)