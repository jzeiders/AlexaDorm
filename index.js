var express = require("express");
var bodyParser = require("body-parser");
var handlers = require("./helpers/handlers.js");

var app = express();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));

app.get("/", function(req, res) {
	res.send("Got you some Root");
});

//Returns List of all group name
app.get("/groups", function(req, res) {
	handlers.getGroups().then(function(data) {
		res.send(data);
	}).catch(function(err) {
		res.status(500).send(err);
	});
});
//Returns data for given group, property name: group
app.post("/groups", function(req, res) {
	handlers.getGroup(req.body.group).then(function(data) {
		res.send(data);
	}).catch(function(err) {
		res.status(500).send(err);
	});
});

//Adds Member to group, property names: number (string), group
app.post("/addMember", function(req, res) {
	var number = req.body.number;
	var group = req.body.group;
	handlers.addMember(number, group).then(function(data) {
		res.send("Success");
	}).catch(function(err) {
		res.status(500).send(err);
	});
});

//Adds Group, property name: Group
app.post("/addGroup", function(req, res) {
	var group = req.body.group;
	handlers.addGroup(group).then(function(data) {
		res.send("Success");
	}).catch(function(err) {
		res.status(500).send(err);
	});
});

app.listen(process.env.PORT || 3000, function() {
	console.log("Server Listening");
});
