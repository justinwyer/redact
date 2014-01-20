var acorn = require("acorn");

fs = require('fs')
console.log("1")
var data = fs.readFile('spec/testfile.js', 'utf8', function (err,data) {
  if (err) {
  	console.log("derp");
    return console.log(err);
  }
  console.log(JSON.stringify(acorn.parse(data), undefined, "  "));
});