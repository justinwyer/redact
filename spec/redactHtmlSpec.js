var acorn = require("acorn");
var featured = require("../redact");

describe("redact html", function () {
  it("should know when to remove a feature from the html", function() {
    var html = '<div><div redact="aToggle"></div></div>';
    expect(featured.redactHtml(html, {aToggle: false})).toEqual("<div></div>");
  });

  it("should know when not to remove a feature from the html", function() {
    var html = '<div><div redact="aToggle"></div></div>';
    expect(featured.redactHtml(html, {aToggle: true})).toEqual('<div><div redact="aToggle"></div></div>');
  });

  it("should know how to remove an inner feature from the html", function() {
    var html = '<div><div redact="aToggle"><div><div redact="anotherToggle"></div></div></div></div>';
    expect(featured.redactHtml(html, {aToggle: true, anotherToggle: false})).toEqual('<div><div redact="aToggle"><div></div></div></div>');
  });

  it("should know how to remove an outer feature from the html", function() {
    var html = '<div><div redact="aToggle"><div><div redact="anotherToggle"></div></div></div></div>';
    expect(featured.redactHtml(html, {aToggle: false, anotherToggle: true})).toEqual("<div></div>");
  });
});