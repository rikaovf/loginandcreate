const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    user: String,
    password: String,
    level: Number
})

module.exports = mongoose.model('User', userSchema)