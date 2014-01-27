var acorn = require("acorn");
var redact = require("../redact");

describe("redact html", function () {
  it("should know when to remove a feature from the html", function() {
    var html = '<div><div feature="aToggle"></div></div>';
    expect(redact.redactHtml(html, {aToggle: false})).toEqual("<div></div>");
  });

  it("should know when not to remove a feature from the html but keep the descriptor", function() {
    var html = '<div><div feature="aToggle">toggled on content</div></div>';
    expect(redact.redactHtml(html, {aToggle: true}, true)).toEqual('<div><div feature="aToggle">toggled on content</div></div>');
  });

  it("should know when not to remove a feature from the html but to remove the descriptor", function() {
    var html = '<div><div feature="aToggle">toggled on content</div></div>';
    expect(redact.redactHtml(html, {aToggle: true}, false)).toEqual('<div><div>toggled on content</div></div>');
  });

  it("should know how to remove an inner feature from the html but keep the descriptor", function() {
    var html = '<div><div feature="aToggle"><div><div feature="anotherToggle"></div></div></div></div>';
    expect(redact.redactHtml(html, {aToggle: true, anotherToggle: false}, true)).toEqual('<div><div feature="aToggle"><div></div></div></div>');
  });

  it("should know how to remove an inner feature from the html but to remove the descriptor", function() {
    var html = '<div><div feature="aToggle">toggled on content (outer)<div>more toggled on content<div feature="anotherToggle">toggled off content (inner)</div></div></div></div>';
    expect(redact.redactHtml(html, {aToggle: true, anotherToggle: false}, false)).toEqual('<div><div>toggled on content (outer)<div>more toggled on content</div></div></div>');
  });

  it("should know how to remove an outer feature from the html", function() {
    var html = '<div>toggleless content<div feature="aToggle"><div><div feature="anotherToggle"></div></div></div></div>';
    expect(redact.redactHtml(html, {aToggle: false, anotherToggle: true})).toEqual("<div>toggleless content</div>");
  });
});