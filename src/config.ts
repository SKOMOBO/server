var helmet = require("helmet")
var compress = require("compression")

import * as express from "express"

export var app = express()

app.use(express.static("static"))

// Enable GZIP compression for improved performance
app.use(compress())

// Fix headers to make things more secure
app.use(helmet())