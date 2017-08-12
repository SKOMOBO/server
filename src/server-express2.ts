import * as express from "express"

var app = express()

app.get("/raspi*", (request, response) =>{
    response.send("Hi raspi!")
})

async function get_data(){
    // return only this boxes data
    let arduino = await connection.query('SELECT * from arduino where Box_ID = ?', values.query.ID )
    let raspi = await connection.query('SELECT * from raspi where Box_ID = ?', values.query.ID )
    
}

app.get("/get*", (request, response) =>{
    response.send("getting data!")
    let user_pass = request.param("pass")
    let correct_pass = require("../../download_password.json")

    if(user_pass === correct_pass.password){
         if(request.param("id") !== null){
         
            // add in express use it to clean all this shit
            // attach the file to the response and send the response
            response.attach()
        }
        else{
            // return all data
        }
    }
})

app.get("/*", (request, response) =>{
    response.send("Hi arduino!")
})

app.listen(81, function () {
  console.log('Example app listening on port 81!')
})