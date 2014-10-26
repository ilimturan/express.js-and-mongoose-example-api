var mongoose = require("mongoose")

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	fullname: String,
	email: String,
	password: String,
	age: {type: Number, min: 15, max: 99},
	isActive: {type: Boolean, default: true}
})

module.exports = mongoose.model("user", UserSchema)