var acorn = require("acorn");
var featured = require("../redact");

describe("redact javascript", function () {
  it("should know when to remove a feature from the code", function() {
    var code = "if (featured.aToggle) console.log('its true');\nconsole.log('more stuff');";
    expect(featured.redactJavascript(code, {aToggle: false})).toEqual(
      "if (featured.aToggle) {} // aToggle redacted\nconsole.log('more stuff');");
  });

  it("should know when not to remove a feature from the code", function() {
    var code = "if (featured.aToggle) console.log('its true');";
    expect(featured.redactJavascript(code, {aToggle: true})).toEqual(
      "if (featured.aToggle) console.log('its true');");
  });

  it("should know how to remove an inner feature from the code", function() {
    var code = "if (featured.aToggle)\n{ if (featured.anotherToggle) console.log('its true')\n};";
    expect(featured.redactJavascript(code, {aToggle: true, anotherToggle: false})).toEqual(
      "if (featured.aToggle)\n{ if (featured.anotherToggle) {} // anotherToggle redacted\n};");
  });

  it("should know how to remove an outer feature from the code", function() {
    var code = "if (featured.aToggle) if (featured.anotherToggle) console.log('its true');";
    expect(featured.redactJavascript(code, {aToggle: false, anotherToggle: true})).toEqual(
      "if (featured.aToggle) {} // aToggle redacted");
  });
});