const Influx = require('influx')

var influx = null

function resolve_db(){

    if(influx === null){
        influx = new Influx.InfluxDB({
            host: 'localhost',
            database: 'skomobo',
            schema: [
                {
                    measurement: 'window_movement',
                    fields: {
                        RSSI: Influx.FieldType.INTEGER,
                        temperature: Influx.FieldType.FLOAT,
                        memory: Influx.FieldType.INTEGER,
                        heading:Influx.FieldType.INTEGER,
                        localIP:Influx.FieldType.STRING,
                        id:Influx.FieldType.STRING,
                        ax:Influx.FieldType.FLOAT, 
                        ay:Influx.FieldType.FLOAT,
                        az:Influx.FieldType.FLOAT, 
                        gx:Influx.FieldType.FLOAT, 
                        gy:Influx.FieldType.FLOAT, 
                        gz:Influx.FieldType.FLOAT, 
                        mx:Influx.FieldType.FLOAT, 
                        my:Influx.FieldType.FLOAT, 
                        mz:Influx.FieldType.FLOAT
                    },
                    tags: [
                        'id'
                    ]
                }
            ]
        })
    }
   return influx
}

var self = {
    store_window(object){
        let db = resolve_db()
    
        let {id,...point} = object
   
        point = {
            measurement: 'window_movement',
            tags: {id},
            fields: object
        }

        db.writePoints([point]).then(()=>{
            console.log("stored ", id)
        }).catch((err)=>{
            console.error(err.message)
        })
    },
    get_window(id, callback, symbol = null, val = null){
        let db = resolve_db()
        let query = ""
        if(symbol !== null && val !== null){
            query = `select * from window_movement where id = '${id}' and time ${symbol} now() - ${val}`
        }
        else{
            query = `select * from window_movement where id = '${id}'`
        }

        db.query(query).then((data)=>{
            callback(data)
        }).catch((err)=>{
            console.error(err)
            callback(false)
        })
    }
}

module.exports = self