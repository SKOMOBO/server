helmet = require "helmet"
compress = require "compression"
express = require "express"

app = express()

# Enable GZIP compression for improved performance
app.use compress()

# Fix headers to make things more secure
app.use helmet()

module.exports.app = app