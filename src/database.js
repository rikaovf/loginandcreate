require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(`mongodb://${process.env.DB_SERVER}/${process.env.DATABASE}`)
.then(()=>{
	console.log('MongoDB Online');
}).catch((err)=>{
	console.log(err);
})

connection = mongoose.connection

module.exports = connection;