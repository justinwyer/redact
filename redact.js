var acorn = require('acorn');
var _ = require('lodash');
var cheerio = require('cheerio');

function collectIfStatements(data, toggles) {
  function recurse(acc, value, key, collection) {
    if (isIfStatement(value) && isFeatureToggle(value, toggles)) {
      acc.push({name: value.test.property.name, toggled: toggles[value.test.property.name],
        start: value.consequent.start, end: value.consequent.end, conditional_start: value.start });
      return _.foldl([value.consequent], recurse, acc);
    } else if (_.has(value, "body")) {
      return _.foldl(value.body, recurse, acc);
    } else {
      return acc;
    }
  }

  return _.foldl([acorn.parse(data)], recurse, []);
}

function isIfStatement(node) {
  return _.has(node, "type") && node.type === "IfStatement";
}

function isFeatureToggle(ifStatement, toggles) {
  return _.has(ifStatement, "test") &&
    _.has(ifStatement.test, "property") &&
    _.has(ifStatement.test, "object") &&
    ifStatement.test.object.name === 'feature' &&
    _.contains(_.keys(toggles), ifStatement.test.property.name);
}

function redactJavascript(code, features, keepDescriptor) {
  keepDescriptor = keepDescriptor || false;
  var nextByte = 0;

  function recurse(redactedCode, value, index, features) {
    var nextToConditional = "{} // " + value.name + " redacted";
    var beginning = value.start;
    var newNextByte = value.end;

    if (value.toggled) {
      nextToConditional = '';
      beginning = value.conditional_start;
      newNextByte = value.start;
    }

    if (beginning > nextByte || nextByte == 0) {
      redactedCode += code.substring(nextByte, value.conditional_start);
      if (keepDescriptor) {
        redactedCode += code.substring(value.conditional_start, value.start) + nextToConditional;
      }
      nextByte = newNextByte;
    }

    return redactedCode;
  }

  return _.foldl(collectIfStatements(code, features), recurse, "") + code.substring(nextByte, code.length);
}

function redactHtml(html, features, keepDescriptor) {
  keepDescriptor = keepDescriptor || false;
  var $ = cheerio.load(html);
  _.forEach(features, function(toggled, feature, collection) {
    if (toggled) {
      $('[not-feature="' + feature + '"]').remove();
    }
    else {
      $('[feature="' + feature + '"]').remove();
    }

    if (!keepDescriptor) {
      $('[feature="' + feature + '"]').attr('feature', null);
      $('[not-feature="' + feature + '"]').attr('not-feature', null);
    }
  });
  return $.html();
}

exports.collectIfStatements = collectIfStatements;
exports.isFeatureToggle = isFeatureToggle;
exports.isIfStatement = isIfStatement;
exports.redactJavascript = redactJavascript;
exports.redactHtml = redactHtml;