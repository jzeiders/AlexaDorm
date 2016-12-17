var express = require("express");
var bodyParser = require("body-parser");
var sql = require("./helpers/sql.js");

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
	sql.getGroups().then(function(data) {
		res.send(data);
	}).catch(function(err) {
		res.status(500).send(err);
	});
});
//Returns data for given group, property name: group
app.post("/groups", function(req, res) {
	sql.getGroup(req.body.group).then(function(data) {
		res.send(data);
	}).catch(function(err) {
		res.status(500).send(err);
	});
});

//Adds Member to group, property names: number (string), group
app.post("/addMember", function(req, res) {
	var number = req.body.number;
	var group = req.body.group;
	sql.addMember(number, group).then(function(data) {
		res.send("Success");
	}).catch(function(err) {
		res.status(500).send(err);
	});
});

//Adds Group, property name: Group
app.post("/addGroup", function(req, res) {
	var group = req.body.group;
	sql.addGroup(group).then(function(data) {
		res.send("Success");
	}).catch(function(err) {
		res.status(500).send(err);
	});
});
app.post("/deleteGroup", function(req,res){
  var group = req.body.group;
  sql.deleteGroup(group).then(function(data){
    res.send("Success");
  }).catch(function(err){
    res.status(500).send(err);
  });
});

app.post("/deleteMember", function(req,res){
  var number = req.body.number;
  var group = req.body.group;
  sql.deleteMember(number, group).then(function(data) {
    res.send("Success");
  }).catch(function(err) {
    res.status(500).send(err);
  });
});
app.get("/createTables", function(req,res){
  sql.createTables().then(function(data) {
    res.send("Success");
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

app.get("/dropTables", function(req,res){
  sql.dropTables().then(function(data) {
    res.send("Success");
  }).catch(function(err) {
    res.status(500).send(err);
  });
});
app.listen(process.env.PORT || 3000, function() {
  console.log(process.env.PGPASSWORD)
  sql.connect().then(function(data) {
		console.log("Connected");
	}).catch(function(err) {
    console.log("CONNECTION FAILED")
		console.log(err);
	});
  console.log("Server Listening");
});
