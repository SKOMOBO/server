export function authenticate(entered_password, send, onsuccess){
    let correct_pass = require("../../src/download_password.json").password

    if(entered_password === correct_pass){
        onsuccess()
    }
    else{
        send("invalid password")
    }
}