const fs = require("fs")

// const Readable = require('stream').Readable

const csv = require('csv-express')
// const csv = require('./express-csv-stream')

var self = {
    fix_timestamp(data){
    
        return data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate() + " " + data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();
    },
    
    /**
     * Converts the presence nodejs buffer to a single bit 1 or 0 to represent booleans
     * 
     * @param {any} data 
     * @returns 
     */
     fix_format(data){
    
        if(data[0].Presence != undefined){
            // for each text row
            for(let row=0; row<data.length; row++){
                data[row].Presence = String(data[row].Presence[0])
                data[row].Time_received = self.fix_timestamp(data[row].Time_received)
                data[row].Time_sent = self.fix_timestamp(data[row].Time_sent)
                
                // let clean_dust = clean_data(data[row].pm10, data[row].pm2_5)
                // data[row].pm10 = clean_dust.PM10
                // data[row].pm2_5 = clean_dust.PM2_5
            }
        }
       
       return data
    },
    
    //! this desperately needs to be cleaned up to make dependency tree simpler
    
    send_zip(resp, data){
        resp.render('no_zip.pug')
    },
    
     send_file(file, resp){
    
        // telling the browser to treat the text as a file with a specific name
        resp.set({'Content-Disposition': 'attachment; filename="' + file + '"'})
    
        fs.readFile(file, (err, text)=>{
            resp.send(text)
        })
    },
    
     send_csv(file_name, data, resp){
        // Excel stupidly assumes that a CSV starting with ID as the first column is a SYLK file
        for(i=0; i<data.length; i++){
            data[i] = JSON.parse(JSON.stringify(data[i]).replace(/ID/g, 'Id'))
        }
    
        // telling the browser to treat the text as a attachment
        resp.set({'Content-Disposition': 'attachment; filename="' + file_name + '"'})
        resp.csv(data, true, stream=true)
    },
    
    send_json(data, resp){
        resp.send(self.fix_format(data))
    }
    
}

module.exports = self