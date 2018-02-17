function authenticate(correct_pass, entered_password, onsuccess, onfail){

    if(entered_password === correct_pass){
        onsuccess()
        return true
    }
    else{
        let message = "invalid password"
        onfail(message)
        return message
    }
}

module.exports.authenticate = authenticate