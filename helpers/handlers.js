var AWS = require("aws-sdk");

AWS.config.update({
	region: "us-west-2",
	endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

var DB = new AWS.DynamoDB.DocumentClient();

var table = "Alexa_Dorm";

var addMember = function(number, group) {
	var params = {
		TableName: table,
		Key: {
			"name": group,
		},
		UpdateExpression: "set members[999] = :n",
		ExpressionAttributeValues: {
			":n": number
		}
	};
	return new Promise(function(res, rej) {
		DB.update(params, function(err, data) {
			if (err) {
				rej(err);
			}
			res(data);
		});
	});
};


exports.getGroups = function() {
	var params = {
		TableName: table
	};
	return new Promise(function(res, rej) {
		DB.scan(params, function(err, data) {
			if (err)
				rej(err);
			res(data.Items.map(function(v) {
				return v.name;
			}));
		});
	});
};
exports.getGroup = function(name) {
	var params = {
		TableName: table,
		Key: {
			"name": name
		}
	};
	return new Promise(function(res, rej) {
		DB.get(params, function(err, data) {
			if (err) {
				rej(err);
			}
			res(data);
		});
	});

};

exports.addMember = function(number, group) {
	return exports.getGroup(group).then(function(res) {
		if (!Object.keys(res).length) {
			return exports.addGroup(group).then(function(res) {
				return addMember(number, group);
			});
		} else {
			return addMember(number, group)
		}
	});
};
exports.addGroup = function(group) {
	var params = {
		TableName: table,
		Item: {
			"name": group,
			"members": []
		}
	};
	return new Promise(function(res, rej) {
		DB.put(params, function(err, data) {
			if (err) {
				rej(err);
			}
			res(data);
		});
	});
}
exports.removeMember = function(number, group) {
	var params = {
		TableName: table,
		Key: {
			"name": group,
			"member": number
		}
	};
	return new Promise(function(res, rej) {
		DB.delete(params, function(err, data) {
			if (err) {
				rej(err);
			}
			res(data);
		});
	})
};
