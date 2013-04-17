var vassert = Packages.org.vertx.testtools.VertxAssert;

function initTests(top) {
  var methodName = vertx.config.methodName;
  vassert.initialize(__jvertx);
  top[methodName]();
}
