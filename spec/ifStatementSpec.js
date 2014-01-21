var acorn = require("acorn");
var featured = require("../featured");

describe("if statements", function () {
	it("should detect an if statement", function() {
		expect(featured.collectIfStatements(
			"if (true) console.log('its true');").length).toBe(1);
	});

	it("should detect multiple if statements", function() {
		expect(featured.collectIfStatements(
			"if (true) console.log('its true'); if (true) console.log('so is this');").length).toBe(2);
	});

	it("should detect a nested if statement", function() {
		expect(featured.collectIfStatements(
			"if (true) if (true) console.log('its true');").length).toBe(2);
	});
});