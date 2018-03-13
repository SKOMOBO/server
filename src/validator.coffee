validate_data = (data, handler = null, invalid = null) ->
    if data isnt undefined and data isnt null and data isnt '' and data isnt ' ' 
        if handler isnt null
            handler data
        
        return true
    
    else
        if invalid isnt null
            invalid data

        return false

authenticate = (correct_pass, entered_password, onsuccess, onfail)->

    if entered_password is correct_pass
        onsuccess()
        return true

    else
        message = "invalid password"
        onfail message
        return message

exports.authenticate = authenticate
exports.validate_data = validate_data