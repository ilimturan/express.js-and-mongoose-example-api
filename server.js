var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoConnectionString = "mongodb://localhost:27017/mApi"

//get models
var User = require("./app/models/user")
var Message = require("./app/models/message")

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//mongodb database connection
var mongoose = require("mongoose")
mongoose.connect(mongoConnectionString)

var port = process.env.PORT || 1234
var router = express.Router()

//password hash
function passHash(pass){
  var crypto = require('crypto');
  return crypto.createHash('sha256').update(pass).digest('hex');
}

//api user routers
router.route("/users")
	.get(function(req, res){
		User.find(function(err, users){
			if(err) res.json(400, err)
			res.json({
				action: true,
				message: "",
				data: users
			})
		})
	
	}) //end of get
	.post(function(req, res){
		var user = new User();
		user.name = req.body.name;
		user.fullname = req.body.fullname;
		user.email = req.body.email;
		user.password = passHash(req.body.password);
		user.age = req.body.age;
		//user.isActive = req.body.isActive;

		user.save(function(err){
			if(err) res.json(400, err)
			res.json({
				action: true,
				message: "New user created",
				data: user
			})
		})
	}) //end of post
	.put(function(req, res){
		res.json(400, {
			action: false,
			message: "Please use id number",
			data: null
		})
	}) //end of put
	.delete(function(req, res){
		User.remove({}, function(err){
			if(err) res.json(400, err)
			res.json({
				action: true,
				message: "All users deleted",
				data: null
			})
		})
	}) //end of delete

//get, post, delete with user_id
router.route("/users/:user_id")
	.get(function(req, res){
		var user_id = req.params.user_id
		User.findById(user_id, function(err, user){
			if(err) res.send(err)
			res.json({
				action: true,
				message: "",
				data: user
			})
		})	
	}) //end of get
	.post(function(req, res){
		res.json(400, {
			action: false,
			message: "Please use without id number",
			data: null
		})
	}) //end of put
	.put(function(req, res){
		var user_id = req.params.user_id
		//console.log(user_id); 
		User.findById(user_id, function(err, user){
			if(err) res.json(400, err)
			//set user new data	
			user.name = req.body.name;
			user.fullname = req.body.fullname;
			user.email = req.body.email;
			user.password = req.body.password;
			user.age = req.body.age;
			user.isActive = req.body.isActive;

			user.save(function(err){
				if(err) res.send(err)
				res.json({
					action: true,
					message: user_id + " updated",
					data: user
				})
			}) //end of user save
		})	//end of findById
	}) //end of put
	.delete(function(req, res){
		var user_id = req.params.user_id
		User.remove({_id: user_id}, function(err){
			if(err) res.json(400, err)
			res.json({
				action: true,
				message: user_id + " deleted"
			})
		})
	}); //end of delete
	// end of user route


// message api routers
router.route("/messages")
	.get(function(req, res){
		Message.find(function(err, msgs){
			if(err) res.json(400, err)
			res.json({
				action: true,
				message: "",
				data: msgs
			})
		})
	
	}) //end of get
	.post(function(req, res){
		var msg = new Message();
		msg.title = req.body.title;
		msg.text = req.body.text;
		msg.user = req.body.user_id;

		msg.save(function(err){
			if(err) res.json(400, err)
			res.json({
				action: true,
				message: "New message created",
				data: msg
			})
		})
	}) //end of post
	.put(function(req, res){
		res.json(400, {
			action: false,
			message: "Please use id number",
			data: null
		})
	}) //end of put
	.delete(function(req, res){
		Message.remove({}, function(err){
			if(err) res.json(400, err)
			res.json({
				action: true,
				message: "All messages deleted",
				data: null
			})
		})
	}); //end of delete


//get, post, delete with msg_id
router.route("/messages/:msg_id")
	.get(function(req, res){
		var msg_id = req.params.msg_id
		Message.findById(msg_id, function(err, msg){
			if(err) res.json(400, err)
			res.json({
				action: true,
				message: "",
				data: msg
			})
		})	
	}) //end of get
	.post(function(req, res){
		res.json(400, {
			action: false,
			message: "Please use without id number",
			data: null
		})
	}) //end of put
	.put(function(req, res){
		var msg_id = req.params.msg_id
		Message.findById(msg_id, function(err, msg){
			if(err) res.json(400, err)
			//set msg new data	
			msg.title = req.body.title;
			msg.text = req.body.text;
			msg.user = req.body.user_id;

			msg.save(function(err){
				if(err) res.send(err)
				res.json({
					action: true,
					message: msg_id + " updated"
				})
			}) 
		})	//end of findById
	}) //end of put
	.delete(function(req, res){
		var msg_id = req.params.msg_id
		Message.remove({_id: msg_id}, function(err){
			if(err) res.json(400, err)
			res.json({
				action: true,
				message: msg_id + " deleted"
			})
		})
	}); //end of delete
	// end of user route

app.use("/api", router)


//app
app.listen(port)
console.log("App working on " + port + " port!")