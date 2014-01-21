var acorn = require("acorn");
var _ = require('lodash');

var findIfStatementFeatureFlags = function(data) {
	var recurse = function(acc, value, key, collection) {
		if (value.type === "IfStatement") {
		console.log(data);
			acc.push(value);
			return _.foldl([value.consequent], recurse, acc);
		} else if (_.has(value, "body")) {
			return _.foldl(value.body, recurse, acc)
		} else {
			return acc;
		}
	}
	return _.foldl([acorn.parse(data)], recurse, []);
}

exports.findIfStatementFeatureFlags = findIfStatementFeatureFlags