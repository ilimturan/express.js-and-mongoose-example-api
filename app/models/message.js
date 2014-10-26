var mongoose = require("mongoose")
//var mUser = require("./user")

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	title: String,
	text: String,
	isActive: {type: Boolean, default: true},
	user: [Schema.Types.ObjectId] //[mUser.Schema]
})

module.exports = mongoose.model("Bear", MessageSchema)