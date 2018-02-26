function validate_data(data, handler, invalid = null){
    // console.log(data)
    if(data != undefined && data !== '' && data !== ' '){
        handler(data)
    }
    else{
        invalid(data)
    }
}

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
module.exports.validate_data = validate_data