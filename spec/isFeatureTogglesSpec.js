var acorn = require("acorn");
var featured = require("../featured");

describe("is feature toggle", function () {
	it("should know an if statement is not a feature toggle", function() {
		var ifStatement = featured.collectIfStatements(
			"if (true) console.log('its true');")[0];
		expect(featured.isFeatureToggle(ifStatement, {})).toBeFalsy();
	});

	it("should know an if statement is a feature toggle", function() {
		var ifStatement = featured.collectIfStatements(
			"if (featured.someToggle) console.log('its toggled');")[0];
		expect(featured.isFeatureToggle(ifStatement, {someToggle: true})).toBeTruthy();
	});
});