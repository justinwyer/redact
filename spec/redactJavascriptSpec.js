var acorn = require("acorn");
var redact = require("../redact");

describe("redact javascript", function() {
  describe("when checking if a feature is on", function() {
    it("should know when to remove a feature from the code and keep the descriptor", function() {
      var code = "console.log('stuff before'); if (feature.aToggle) console.log('its true');\nconsole.log('more stuff');";
      expect(redact.redactJavascript(code, {aToggle: false}, true)).toEqual(
        "console.log('stuff before'); if (feature.aToggle) {} // aToggle redacted\nconsole.log('more stuff');");
    });

    it("should know when to remove a feature from the code and keep the descriptor when braces are used", function() {
      var code = "console.log('stuff before');\nif (feature.aToggle) {\nconsole.log('its true');\n}\nconsole.log('more stuff');";
      expect(redact.redactJavascript(code, {aToggle: false}, true)).toEqual(
        "console.log('stuff before');\nif (feature.aToggle) {} // aToggle redacted\nconsole.log('more stuff');");
    });

    it("should know when to remove a feature from the code and remove the descriptor", function() {
      var code = "console.log('stuff before'); if (feature.aToggle) console.log('its true'); console.log('stuff after');";
      expect(redact.redactJavascript(code, {aToggle: false}, false)).toEqual(
        "console.log('stuff before');  console.log('stuff after');");
    });

    it("should know when to remove a feature from the code and remove the descriptor when braces are used", function() {
      var code = "console.log('stuff before');\nif (feature.aToggle) {\nconsole.log('its true');\n}\nconsole.log('stuff after');";
      expect(redact.redactJavascript(code, {aToggle: false}, false)).toEqual(
        "console.log('stuff before');\n\nconsole.log('stuff after');");
    });

    it("should know when to NOT redact code if it is not explicitly a feature toggle", function() {
      var code = "if (abc.propertyThatIsNotAToggleButHasTheSameNameAsAToggle) console.log('this is not a feature toggle');\nconsole.log('more stuff');";
      expect(redact.redactJavascript(code, {propertyThatIsNotAToggleButHasTheSameNameAsAToggle: false})).toEqual(
        "if (abc.propertyThatIsNotAToggleButHasTheSameNameAsAToggle) console.log('this is not a feature toggle');\nconsole.log('more stuff');");
    });

    it("should know when not to remove a feature from the code but remove the descriptor", function() {
      var code = "console.log('toggleless code'); if (feature.keepButRemoveDescriptor) { console.log('toggled on code'); }";
      expect(redact.redactJavascript(code, {keepButRemoveDescriptor: true}, false)).toEqual(
        "console.log('toggleless code'); { console.log('toggled on code'); }");
    });

    it("should know when not to remove a feature from the code and keep the descriptor", function() {
      var code = "if (feature.everythingStays) console.log('its true');";
      expect(redact.redactJavascript(code, {aToggle: true}, true)).toEqual(
        "if (feature.everythingStays) console.log('its true');");
    });

    it("should know how to remove an inner feature from the code and keep the descriptor", function() {
      var code = "if (feature.outerToggle2) if (feature.innerToggle2) console.log('its true');";
      expect(redact.redactJavascript(code, {outerToggle2: true, innerToggle2: false}, true)).toEqual(
        "if (feature.outerToggle2) if (feature.innerToggle2) {} // innerToggle2 redacted");
    });

    it("should know how to remove an inner feature from the code and remove the descriptor", function() {
      var code = "if (feature.outerToggle4)\n{ console.log('outer stuff'); if (feature.innerToggle4) console.log('inner stuff')\n};";
      expect(redact.redactJavascript(code, {outerToggle4: true, innerToggle4: false}, false)).toEqual(
        "{ console.log('outer stuff'); \n};");
    });

    it("should know how to remove an outer feature from the code and keep the descriptor", function() {
      var code = "if (feature.outerToggle3) if (feature.innerToggle3) console.log('its true');";
      expect(redact.redactJavascript(code, {outerToggle3: false, innerToggle3: true}, true)).toEqual(
        "if (feature.outerToggle3) {} // outerToggle3 redacted");
    });

    it("should know how to remove an outer feature from the code and remove the descriptor", function() {
      var code = "if (feature.aToggle) if (feature.anotherToggle) console.log('its true');";
      expect(redact.redactJavascript(code, {aToggle: false, anotherToggle: true}, false)).toEqual('');
    });

    it("should know how to remove a wrapped feature", function() {
      var code = "(function () { if (feature.aToggle) console.log('its true'); })();";
      expect(redact.redactJavascript(code, {aToggle: false}, false)).toEqual(
        "(function () {  })();");
    });
  });
});