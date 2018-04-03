const helmet = require("helmet")
const compress = require("compression")

const express = require("express")
var app = express()

// serve static content
app.use(express.static("static"))

// Enable GZIP compression for improved performance
app.use(compress())

// Fix headers to make things more secure
app.use(helmet())

app.set('view engine', 'pug')

exports.app = app