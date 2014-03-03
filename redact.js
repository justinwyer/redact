var acorn = require('acorn');
var _ = require('lodash');
var cheerio = require('cheerio');

function collectIfStatements(code, toggles) {
  function addIfStatements(accumulator, node) {
    if (isIfStatement(node) && isFeatureToggle(node, toggles)) {
      accumulator.push({name: node.test.property.name, toggled: toggles[node.test.property.name],
        start: node.consequent.start, end: node.consequent.end, conditional_start: node.start });
      return _.foldl([node.consequent], addIfStatements, accumulator);
    } else if (_.has(node, "body") && _.isArray(node.body)) {
      return _.foldl(node.body, addIfStatements, accumulator);
    } else if (_.has(node, "body") && !_.isArray(node.body)) {
      return _.foldl([node.body], addIfStatements, accumulator);
    } else if (_.has(node, "callee")) {
      return _.foldl([node.callee], addIfStatements, accumulator);
    } else if (_.has(node, "expression")) {
      return _.foldl([node.expression], addIfStatements, accumulator);
    } else {
      return accumulator;
    }
  }

  return _.foldl([acorn.parse(code)], addIfStatements, []);
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

  function recurse(redactedCode, toggleIfStatement) {
    var nextToConditional = "{} // " + toggleIfStatement.name + " redacted";
    var beginning = toggleIfStatement.start;
    var newNextByte = toggleIfStatement.end;

    if (toggleIfStatement.toggled) {
      nextToConditional = '';
      beginning = toggleIfStatement.conditional_start;
      newNextByte = toggleIfStatement.start;
    }

    if (beginning > nextByte || nextByte == 0) {
      redactedCode += code.substring(nextByte, toggleIfStatement.conditional_start);
      if (keepDescriptor) {
        redactedCode += code.substring(toggleIfStatement.conditional_start, toggleIfStatement.start) + nextToConditional;
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
  _.forEach(features, function(toggled, feature) {
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