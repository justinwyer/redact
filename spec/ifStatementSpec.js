var acorn = require("acorn");
var redact = require("../redact");

describe("collectIfStatements", function() {
  it("should detect an if statement", function() {
    expect(redact.collectIfStatements(
      "if (feature.aToggle) { console.log('its true'); }", {aToggle: true}).length).toBe(1);
  });

  it("should detect multiple if statements", function() {
    expect(redact.collectIfStatements(
      "if (feature.aToggle) console.log('its true'); " +
        "if (feature.anotherToggle) {console.log('so is this');}",
      {aToggle: true, anotherToggle: true}).length).toBe(2);
  });

  it("should detect nested if statements", function() {
    expect(redact.collectIfStatements(
      "if (feature.aToggle) if (feature.anotherToggle) " +
        "console.log('its true');", {aToggle: true, anotherToggle: true}).length).toBe(2);
  });

  it("should detect nested if statement with braces", function() {
    expect(redact.collectIfStatements(
      "if (feature.aToggle) {\nif (feature.anotherToggle) {\n " +
        "console.log('its true');}\n}", {aToggle: true, anotherToggle: true}).length).toBe(2);
  });

  it("should report the start and end bytes of the consequent and the start and end bytes of the conditional", function() {
    expect(redact.collectIfStatements(
      "console.log('something'); if (feature.aToggle) console.log('its true');",
      {aToggle: true, anotherToggle: true})[0]).toEqual(
      {name: "aToggle", toggled: true, start: 47, end: 71, conditional_start: 26});
  });

  it("should detect wrapped if statement", function() {
    expect(redact.collectIfStatements(
      "(function () { if (feature.aToggle) console.log('its true'); })();", {aToggle: true}).length).toBe(1);
  });
});

describe("isIfStatement", function() {
  it("should know a node may not be an if statement", function() {
    var notAnIfStatement = acorn.parse(
      "console.log('its toggled');").body[0];
    expect(redact.isIfStatement(notAnIfStatement)).toBeFalsy();
  });

  it("should know a node may be an if statement", function() {
    var anIfStatement = acorn.parse(
      "if (true) console.log('its toggled');").body[0];
    expect(redact.isIfStatement(anIfStatement)).toBeTruthy();
  });
});