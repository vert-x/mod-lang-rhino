if (typeof __vertxload === 'string') {
  throw "Use require() to load the Vert.x API"
}

var stdout = java.lang.System.out;
var stderr = java.lang.System.err;

/**
 * A simple console object that can be used to print log messages
 * errors, and warnings. 
 * @example
 * var console = require('vertx/console');
 *
 * console.log('Hello standard out');
 * console.warn('Warning standard error');
 * console.error('Alert! Alert!');
 *
 * @exports console
 */
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

