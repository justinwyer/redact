var acorn = require("acorn");
var featured = require("../redact");

describe("is feature toggle", function () {
  it("should know an if statement may not be a feature toggle", function() {
    var ifStatement = acorn.parse(
      "if (true) console.log('its true');").body[0];
    expect(featured.isFeatureToggle(ifStatement, {})).toBeFalsy();
  });

  it("should know an if statement may be a feature toggle", function() {
    var ifStatement = acorn.parse(
      "if (featured.someToggle) console.log('its toggled');").body[0];
    expect(featured.isFeatureToggle(ifStatement, {someToggle: true})).toBeTruthy();
  });
});