import {IncomingMessage, ServerResponse} from "http"

import {handler_generator, spawn} from "./lib"

// create server for tests 
export var raspi_server = spawn(82, handler_generator("request.rawTrailers", JSON.parse, "raspi"))