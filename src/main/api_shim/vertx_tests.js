if (typeof __vertxload === 'string') {
  throw "Use require() to load the Vert.x API"
}

var vertxTests = {};

var container = require("container");

vertxTests.startTests = function (top) {
  var methodName = container.config.methodName;
  top[methodName]();
}

module.exports = vertxTests;
