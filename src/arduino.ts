import {IncomingMessage, ServerResponse} from "http"

import {handler_generator, extract, spawn} from "./lib"

// exporting variable for testing
export var server = spawn(81, handler_generator("request.url", extract, "arduino"))
