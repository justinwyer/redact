var acorn = require("acorn");
var redact = require("../redact");

describe("redact javascript", function () {
  it("should know when to remove a feature from the code", function() {
    var code = "if (feature.aToggle) console.log('its true');\nconsole.log('more stuff');";
    expect(redact.redactJavascript(code, {aToggle: false})).toEqual(
      "if (feature.aToggle) {} // aToggle redacted\nconsole.log('more stuff');");
  });

  it("should know when to NOT redact code if it is not explicitly a feature toggle", function() {
    var code = "if (abc.propertyThatIsNotAToggleButHasTheSameNameAsAToggle) console.log('this is not a feature toggle');\nconsole.log('more stuff');";
    expect(redact.redactJavascript(code, {propertyThatIsNotAToggleButHasTheSameNameAsAToggle: false})).toEqual(
      "if (abc.propertyThatIsNotAToggleButHasTheSameNameAsAToggle) console.log('this is not a feature toggle');\nconsole.log('more stuff');");
  });

  it("should know when not to remove a feature from the code", function() {
    var code = "if (feature.aToggle) console.log('its true');";
    expect(redact.redactJavascript(code, {aToggle: true})).toEqual(
      "if (feature.aToggle) console.log('its true');");
  });

  it("should know how to remove an inner feature from the code", function() {
    var code = "if (feature.aToggle)\n{ if (feature.anotherToggle) console.log('its true')\n};";
    expect(redact.redactJavascript(code, {aToggle: true, anotherToggle: false})).toEqual(
      "if (feature.aToggle)\n{ if (feature.anotherToggle) {} // anotherToggle redacted\n};");
  });

  it("should know how to remove an outer feature from the code", function() {
    var code = "if (feature.aToggle) if (feature.anotherToggle) console.log('its true');";
    expect(redact.redactJavascript(code, {aToggle: false, anotherToggle: true})).toEqual(
      "if (feature.aToggle) {} // aToggle redacted");
  });
});