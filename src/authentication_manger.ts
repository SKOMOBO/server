export function authenticate(entered_password, send, onsuccess){
    let correct_pass = require("../../src/download_password.json")

    if(entered_password === correct_pass.password){
        onsuccess()
    }
    else{
        send("invalid password")
    }
}