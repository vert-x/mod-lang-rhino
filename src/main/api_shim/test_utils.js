if (typeof __vertxload === 'string') {
  throw "Use require() to load the Vert.x API"
}

var testUtils = {};

var jutils = new org.vertx.java.testframework.TestUtils(__jvertx);

testUtils.azzert = function(result, message) {
  if (message) {
    jutils.azzert(result, message);
  } else {
    jutils.azzert(result);
  }
}

testUtils.appReady = function() {
  jutils.appReady();
}

testUtils.appStopped = function() {
  jutils.appStopped();
}

testUtils.testComplete = function() {
  jutils.testComplete();
}

testUtils.register = function(testName, test) {
  jutils.register(testName, test);
}

testUtils.registerTests = function(obj) {
  for(var key in obj){
    var val = obj[key];
    if (typeof val === 'function' && key.substring(0, 4) === 'test') {
      jutils.register(key, val);
    }
 }
}

testUtils.unregisterAll = function() {
  jutils.unregisterAll();
}

testUtils.checkThread = function() {
  jutils.checkThread();
}

testUtils.generateRandomBuffer = function(size) {
  return jutils.generateRandomBuffer(size);
}

testUtils.randomUnicodeString = function(size) {
  return jutils.randomUnicodeString(size);
}

testUtils.buffersEqual = function(buff1, buff2) {
  return jutils.buffersEqual(buff1, buff2);
}

module.exports = testUtils;