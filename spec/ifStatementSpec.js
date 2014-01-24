var acorn = require("acorn");
var featured = require("../redact");

describe("collectIfStatements", function () {
  it("should detect an if statement", function() {
    expect(featured.collectIfStatements(
      "if (featured.aToggle) console.log('its true');", {aToggle: true}).length).toBe(1);
  });

  it("should detect multiple if statements", function() {
    expect(featured.collectIfStatements(
      "if (featured.aToggle) console.log('its true'); " +
      "if (featured.anotherToggle) console.log('so is this');",
      {aToggle: true, anotherToggle: true}).length).toBe(2);
  });

  it("should detect a nested if statement", function() {
    expect(featured.collectIfStatements(
      "if (featured.aToggle) if (featured.anotherToggle) " +
      "console.log('its true');", {aToggle: true, anotherToggle: true}).length).toBe(2);
  });

  it("should report the start and end bytes of the consequent", function() {
    expect(featured.collectIfStatements(
      "if (featured.aToggle) console.log('its true');",
      {aToggle: true, anotherToggle: true})[0]).toEqual(
        {name: "aToggle", toggled: true, start: 22, end: 46});
  });
});

describe("isIfStatement", function() {
  it("should know a node may not be an if statement", function() {
    var notAnIfStatement = acorn.parse(
      "console.log('its toggled');").body[0];
    expect(featured.isIfStatement(notAnIfStatement)).toBeFalsy();
  });

  it("should know a node may be an if statement", function() {
    var anIfStatement = acorn.parse(
      "if (true) console.log('its toggled');").body[0];
    expect(featured.isIfStatement(anIfStatement)).toBeTruthy();
  });
});