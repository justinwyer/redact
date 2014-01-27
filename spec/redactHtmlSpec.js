var acorn = require("acorn");
var redact = require("../redact");

describe("redact html", function () {
  it("should know when to remove a feature from the html", function() {
    var html = '<div><div feature="aToggle"></div></div>';
    expect(redact.redactHtml(html, {aToggle: false})).toEqual("<div></div>");
  });

  it("should know when not to remove a feature from the html", function() {
    var html = '<div><div feature="aToggle"></div></div>';
    expect(redact.redactHtml(html, {aToggle: true})).toEqual('<div><div feature="aToggle"></div></div>');
  });

  it("should know how to remove an inner feature from the html", function() {
    var html = '<div><div feature="aToggle"><div><div feature="anotherToggle"></div></div></div></div>';
    expect(redact.redactHtml(html, {aToggle: true, anotherToggle: false})).toEqual('<div><div feature="aToggle"><div></div></div></div>');
  });

  it("should know how to remove an outer feature from the html", function() {
    var html = '<div><div feature="aToggle"><div><div feature="anotherToggle"></div></div></div></div>';
    expect(redact.redactHtml(html, {aToggle: false, anotherToggle: true})).toEqual("<div></div>");
  });
});