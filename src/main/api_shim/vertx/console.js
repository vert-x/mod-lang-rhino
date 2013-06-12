if (typeof __vertxload === 'string') {
  throw "Use require() to load the Vert.x API"
}

var stdout = java.lang.System.out;
var stderr = java.lang.System.err;

// Add a console object which will be familiar to JavaScript devs
var console = {
  // TODO this should take varargs and allow formatting a la sprintf

  /**
   * Log the msg to STDOUT.
   *
   * @param msg The msg to log
   */
  log: function(msg) {
    stdout.println(msg);
  },

  /**
   * Log the msg to STDERR
   *
   * @param msg The msg to log
   */
  warn: function(msg) {
    stderr.println(msg);
  },

  /**
   * Log the msg to STDERR
   *
   * @param msg The msg to log
   */
  error: function(msg) {
    stderr.println(msg);
  }
};

module.exports = console;

