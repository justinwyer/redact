var acorn = require("acorn");
var redact = require("../redact");

describe("is feature toggle", function () {
  it("should know an if statement may not be a feature toggle", function() {
    var ifStatement = acorn.parse(
      "if (true) console.log('its true');").body[0];
    expect(redact.isFeatureToggle(ifStatement, {})).toBeFalsy();
  });

  it("should know an if statement may be a feature toggle", function() {
    var ifStatement = acorn.parse(
      "if (feature.someToggle) console.log('its toggled');").body[0];
    expect(redact.isFeatureToggle(ifStatement, {someToggle: true})).toBeTruthy();
  });

  it("should know an if statement with a property with the same name as a toggle is NOT a feature toggle", function() {
    var ifStatement = acorn.parse(
      "if (abc.somePropertyThatHappensToHaveTheNameOfAToggle) console.log('does not matter');").body[0];
    expect(redact.isFeatureToggle(ifStatement, {somePropertyThatHappensToHaveTheNameOfAToggle: true})).toBeFalsy();
  });
});