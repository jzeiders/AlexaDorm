// 'esversion: 6'

var pg = require('pg');

// process.env.PGUSER = 'alexadorm';
// process.env.PGDATABASE = 'data';
// process.env.PGPASSWORD = process.env.AWSPASS;
// process.env.PGHOST = 'addb.cfj01akmcn5a.us-west-2.rds.amazonaws.com';
// process.env.port = 5432;
// console.log(process.env)
var client = new pg.Client();

exports.connect = function() {
	return new Promise(function(res, rej) {
		client.connect(function(err) {
			if (err) rej(err);
			return res("Connected");
		});
	});
};

var query = function(query) {
	return new Promise(function(res, rej) {
		client.query(query, function(err, data) {
			if (err) {
				console.log(err);
				rej(err);
			};
			res(data);
		});
	});
};

exports.createTables = function() {
	var string = "CREATE TABLE groups (name text NOT NULL, members text[])";
	return query(string);
};
exports.dropTables = function() {
	var string = "DROP TABLE groups";
	return query(string);
};

exports.getGroups = function() {
	var string = "SELECT name FROM groups";
	return query(string).then(function(data) {
		return data.rows.map((v) => v.name);
	});
};

exports.getGroup = function(name) {
	var string = "SELECT * FROM groups WHERE name='" + name + "';";
	return query(string).then(function(data) {
		return data.rows;
	});
};
exports.addMember = function(number, group) {
	var string = "UPDATE groups SET members = members || ARRAY['" + number + "'] WHERE name='" + group + "'";
	return query(string);
};
exports.addGroup = function(name) {
	var string = "INSERT INTO groups (name,members) VALUES ('" + name + "', ARRAY[]::integer[]);";
	return query(string);
};
exports.deleteGroup = function(name) {
	var string = "DELETE FROM groups WHERE name='" + name + "';";
	return query(string);
}
exports.deleteMember = function(number, group) {
	var string = "UPDATE groups SET members = array_remove(members,'" + number + "') WHERE name='" + group + "'";
	console.log(string);
	return query(string);
};
