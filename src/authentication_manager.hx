package;

class authentication_manager {
    public static function authenticate(entered_password, resp, onsuccess){
        private var correct_pass = require("./download_password.json").password;
   
        if(entered_password === correct_pass){
            onsuccess();
        }
        else{
            resp.send("invalid password");
        }
    }
}