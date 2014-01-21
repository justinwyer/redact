var acorn = require("acorn")
var featured = require("../featured")

describe("if statements", function () {
	it("should detect an if statement", function() {
		var ifs = featured.findIfStatementFeatureFlags("if (true) console.log('its true');");
		expect(ifs.length).toBe(1);
	});
});