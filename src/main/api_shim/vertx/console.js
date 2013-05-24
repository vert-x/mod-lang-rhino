if (typeof __vertxload === 'string') {
  throw "Use require() to load the Vert.x API"
}

var stdout = java.lang.System.out;
var stderr = java.lang.System.err;

// Add a console object which will be familiar to JavaScript devs
var console =  {
  // TODO this should take varargs and allow formatting a la sprintf

  log: function(msg) {
    stdout.println(msg);
  },
  warn: function(msg) {
    stderr.println(msg);
  },
  error: function(msg) {
    stderr.println(msg);
  }
};

module.exports = console;

