var acorn = require("acorn");
var featured = require("../featured");

describe("redact feature", function () {
  it("should know when to remove a feature from the code", function() {
    var code = "if (featured.aToggle) console.log('its true');\nconsole.log('more stuff');";
    var features = featured.collectIfStatements(code, {aToggle: false});
    expect(featured.redact(code, features)).toEqual(
      "if (featured.aToggle) {} // aToggle redacted\nconsole.log('more stuff');");
  });

  it("should know when not to remove a feature from the code", function() {
    var code = "if (featured.aToggle) console.log('its true');";
    var features = featured.collectIfStatements(code, {aToggle: true});
    expect(featured.redact(code, features)).toEqual("if (featured.aToggle) console.log('its true');");
  });

  it("should know how to remove an inner feature from the code", function() {
    var code = "if (featured.aToggle)\n{ if (featured.anotherToggle) console.log('its true')\n};";
    var features = featured.collectIfStatements(code, {aToggle: true, anotherToggle: false});
    expect(featured.redact(code, features)).toEqual(
      "if (featured.aToggle)\n{ if (featured.anotherToggle) {} // anotherToggle redacted\n};");
  });

  it("should know how to remove an outer feature from the code", function() {
    var code = "if (featured.aToggle) if (featured.anotherToggle) console.log('its true');";
    var features = featured.collectIfStatements(code, {aToggle: false, anotherToggle: true});
    expect(featured.redact(code, features)).toEqual(
      "if (featured.aToggle) {} // aToggle redacted");
  });
});