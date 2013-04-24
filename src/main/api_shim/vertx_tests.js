if (typeof module === 'undefined') {
  throw "Use require() to load Vert.x API modules"
}

var vertxTests = {};

var container = require("container");

vertxTests.startTests = function (top) {
  var methodName = container.config.methodName;
  top[methodName]();
}

module.exports = vertxTests;
