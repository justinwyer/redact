var acorn = require("acorn");
var _ = require('lodash');

function collectIfStatements(data) {
	function recurse(acc, value, key, collection) {
		if (value.type === "IfStatement") {
			acc.push(value);
			return _.foldl([value.consequent], recurse, acc);
		} else if (_.has(value, "body")) {
			return _.foldl(value.body, recurse, acc);
		} else {
			return acc;
		}
	}
	return _.foldl([acorn.parse(data)], recurse, []);
}

function isFeatureToggle(ifStatement, toggles) {
	return _.has(ifStatement, "test")
		&& _.has(ifStatement.test, "property")
		&& _.contains(_.keys(toggles), ifStatement.test.property.name);
}

exports.collectIfStatements = collectIfStatements;
exports.isFeatureToggle = isFeatureToggle;