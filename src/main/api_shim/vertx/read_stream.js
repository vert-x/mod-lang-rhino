function readStream(jsObj, jObj) {
  /**
   * Set a data handler. As data is read, the handler will be called with the data.
   *
   * @param handler The data handler
   * @returns {*}
   */
  jsObj.dataHandler = function(handler) {
    jObj.dataHandler(handler);
    return jsObj;
  }

  /**
   * Pause the ReadStream. After calling this, the ReadStream will aim to send no more data
   *
   * @returns {*}
   */
  jsObj.pause = function() {
    jObj.pause();
    return jsObj;
  }

  /**
   * Resume reading. If the ReadStream has been paused, reading will recommence on it.
   *
   * @returns {*}
   */
  jsObj.resume = function() {
    jObj.resume();
    return jsObj;
  }

  /**
   * Set an end handler on the stream. Once the stream has ended, and there is no more data to be read, this handler will be called.
   *
   * @param handler: The end handler
   * @returns {*}
   */
  jsObj.endHandler = function(handler) {
    jObj.endHandler(handler);
    return jsObj;
  }

  /**
   * Set an execption handler on the stream.
   *
   * @param handler The handler which will be called on an exception
   * @returns {*}
   */
  jsObj.exceptionHandler = function(handler) {
    jObj.exceptionHandler(handler);
    return jsObj;
  }
}

