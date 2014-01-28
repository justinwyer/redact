var acorn = require("acorn");
var redact = require("../redact");

describe("redact html", function () {
  describe("when using the feature attribute", function () {
    it("should know when to remove a feature", function () {
      var html = '<div><div feature="aToggle"></div></div>';
      expect(redact.redactHtml(html, {aToggle: false})).toEqual("<div></div>");
    });

    it("should know when not to remove a feature but keep the descriptors", function () {
      var html = '<div><div feature="aToggle">toggled on content</div></div>';
      expect(redact.redactHtml(html, {aToggle: true}, true)).toEqual('<div><div feature="aToggle">toggled on content</div></div>');
    });

    it("should know when not to remove a feature but to remove the descriptors", function () {
      var html = '<div><div feature="aToggle">toggled on content</div></div>';
      expect(redact.redactHtml(html, {aToggle: true}, false)).toEqual('<div><div>toggled on content</div></div>');
    });

    it("should know how to remove an inner feature but keep the descriptors", function () {
      var html = '<div><div feature="aToggle"><div><div feature="anotherToggle"></div></div></div></div>';
      expect(redact.redactHtml(html, {aToggle: true, anotherToggle: false}, true)).toEqual('<div><div feature="aToggle"><div></div></div></div>');
    });

    it("should know how to remove an inner feature but to remove the descriptors", function () {
      var html = '<div><div feature="aToggle">toggled on content (outer)<div>more toggled on content<div feature="anotherToggle">toggled off content (inner)</div></div></div></div>';
      expect(redact.redactHtml(html, {aToggle: true, anotherToggle: false}, false)).toEqual('<div><div>toggled on content (outer)<div>more toggled on content</div></div></div>');
    });

    it("should know how to remove an outer feature", function () {
      var html = '<div>toggleless content<div feature="aToggle"><div><div feature="anotherToggle"></div></div></div></div>';
      expect(redact.redactHtml(html, {aToggle: false, anotherToggle: true})).toEqual("<div>toggleless content</div>");
    });
  });

  describe("when using the not-feature attribute", function () {
    it("should know when to remove a feature", function () {
      var html = '<div><div not-feature="aToggle"></div></div>';
      expect(redact.redactHtml(html, {aToggle: true})).toEqual("<div></div>");
    });

    it("should know when not to remove a feature but keep the descriptors", function () {
      var html = '<div><div not-feature="aToggle">toggled on content</div></div>';
      expect(redact.redactHtml(html, {aToggle: false}, true)).toEqual('<div><div not-feature="aToggle">toggled on content</div></div>');
    });

    it("should know when not to remove a feature but to remove the descriptors", function () {
      var html = '<div><div not-feature="aToggle">shown when aToggle is off</div></div>';
      expect(redact.redactHtml(html, {aToggle: false}, false)).toEqual('<div><div>shown when aToggle is off</div></div>');
    });

    it("should know how to remove an inner feature but keep the descriptors", function () {
      var html = '<div><div not-feature="aToggle"><div><div not-feature="anotherToggle"></div></div></div></div>';
      expect(redact.redactHtml(html, {aToggle: false, anotherToggle: true}, true)).toEqual('<div><div not-feature="aToggle"><div></div></div></div>');
    });

    it("should know how to remove an inner feature and remove descriptors", function () {
      var html = '<div><div not-feature="aToggle">toggled on content (outer)<div>more toggled on content<div not-feature="anotherToggle">toggled off content (inner)</div></div></div></div>';
      expect(redact.redactHtml(html, {aToggle: false, anotherToggle: true}, false)).toEqual('<div><div>toggled on content (outer)<div>more toggled on content</div></div></div>');
    });

    it("should know how to remove an outer feature", function () {
      var html = '<div>toggleless content<div not-feature="aToggle"><div><div not-feature="anotherToggle"></div></div></div></div>';
      expect(redact.redactHtml(html, {aToggle: true, anotherToggle: false}, false)).toEqual("<div>toggleless content</div>");
    });
  });

  describe("when mixing the feature and not-feature attributes", function() {
    it("should know how to remove an inner feature when it is specified by not-feature", function() {
      var html = '<div>toggleless content<div feature="outerToggle"><div><div not-feature="innerToggle"></div></div></div></div>';
      expect(redact.redactHtml(html, {outerToggle: true, innerToggle: true}, true)).toEqual('<div>toggleless content<div feature="outerToggle"><div></div></div></div>');
    });

    it("should know how to remove an outer feature when it is specified by not-feature", function() {
      var html = '<div>toggleless content<div not-feature="outerToggle"><div><div feature="innerToggle"></div></div></div></div>';
      expect(redact.redactHtml(html, {outerToggle: true, innerToggle: false}, true)).toEqual('<div>toggleless content</div>');
    });
  });
});