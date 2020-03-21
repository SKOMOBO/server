const helmet = require("helmet")
const compress = require("compression")

const parser = require('body-parser')
const express = require("express")
const app = express();

app.use(parser.json())

// Enable GZIP compression for improved performance
app.use(compress())

// Fix headers to make things more secure
app.use(helmet())

app.set('view engine', 'pug')

exports.app = app