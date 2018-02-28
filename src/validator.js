function validate_data(data, handler, invalid = null){
    // console.log(data)
    if(data != undefined && data !== '' && data !== ' '){
        handler(data)
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