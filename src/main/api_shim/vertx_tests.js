if (typeof module === 'undefined') {
  throw "Use require() to load Vert.x API modules"
}

var vassert = Packages.org.vertx.testtools.VertxAssert;

var initTests = function (top) {
  var methodName = vertx.config.methodName;
  vassert.initialize(__jvertx);
  top[methodName]();
}

module.exports = initTests;
