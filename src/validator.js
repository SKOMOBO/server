function validate_data(data, handler = null, invalid = null){
    if(data !== undefined && data !== null && data !== '' && data !== ' '){
        if(handler !== null){
            handler(data)
        }
        return true
    }
    else{
        if(invalid !== null){
            invalid(data)
        }
        return false
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

exports.authenticate = authenticate
exports.validate_data = validate_data