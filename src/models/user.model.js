const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    user: String,
    password: String
})

module.exports = mongoose.model('User', userSchema)