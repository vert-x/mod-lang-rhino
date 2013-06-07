if (typeof __vertxload === 'string') {
  throw "Use require() to load the Vert.x API"
}

var vertxTests = {};

var container = require("vertx/container");
var vassert = require("vertx_assert");

vertxTests.startTests = function (top) {
  var methodName = container.config.methodName;
  try {
    top[methodName]();
  } catch (err) {
    if (err instanceof java.lang.Throwable) {
      vassert.handleThrowable(err);
    } else {
      vassert.handleThrowable(new java.lang.IllegalStateException(err.toString()));
    }
  }
}

module.exports = vertxTests;
