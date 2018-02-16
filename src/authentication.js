function authenticate(entered_password, resp, onsuccess){
    let correct_pass = require("../keys/download_password.json").password
   
    if(entered_password === correct_pass){
        onsuccess()
    }
    else{
        resp.send("invalid password")
    }
}

module.exports.authenticate = authenticate