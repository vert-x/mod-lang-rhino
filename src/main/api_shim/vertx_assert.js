if (typeof module === 'undefined') {
  throw "Use require() to load Vert.x API modules"
}

var vertxAssert = Packages.org.vertx.testtools.VertxAssert;
vertxAssert.initialize(__jvertx);

module.exports = vertxAssert;
