package;



//! bugsnag integration
// import {register} from "bugsnag"
// register(require("./global_keys.json").bugsnag_key)

// var helmet = require("helmet")
// var compress = require("compression")
// export var app = express()

//! Enable GZIP compression for improved performance
// app.use(compress())

//! Fix headers to make things more secure
// app.use(helmet())

// should improve dependency graph too
class config_manager {  
    public var app = express();

}