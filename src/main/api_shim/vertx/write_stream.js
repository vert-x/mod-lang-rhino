
function writeStream(jsObj, jObj) {
  /**
   * Write some data to the stream. The data is put on an internal write queue, and the write actually happens
   * asynchronously. To avoid running out of memory by putting too much on the write queue,
   * check the  method before writing.
   *
   * @param data The data to write
   * @returns {*}
   */
  jsObj.write = function(data) {
    jObj.write(data);
    return jsObj;
  }

  /**
   * Set the maximum size of the write queue. You will still be able to write to the stream even
   * if there is more data than this in the write queue.
   *
   * @param size The maximum size, in bytes.
   * @returns {*}
   */
  jsObj.writeQueueMaxSize = function(size) {
    jObj.setWriteQueueMaxSize(size);
    return jsObj;
  }

  /**
   * Is the write queue full?
   *
   * @returns {boolean} True if there are more bytes in the write queue than the max write queue size
   */
  jsObj.writeQueueFull = function() {
    return jObj.writeQueueFull();
  }

  /**
   * Set a drain handler on the stream. If the write queue is full, then the handler will be called when the write
   * queue has been reduced to maxSize / 2. See  for an example of this being used.
   *
   * @param handler: The drain handler
   * @returns {*}
   */
  jsObj.drainHandler = function(handler) {
    jObj.drainHandler(handler);
    return jsObj;
  }

  /**
   * Set an execption handler on the stream.
   * @param handler The exception handler
   * @returns {*}
   */
  jsObj.exceptionHandler = function(handler) {
    jObj.exceptionHandler(handler);
    return jsObj;
  }
}
