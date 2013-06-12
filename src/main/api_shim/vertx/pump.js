/*
 * Copyright 2011-2012 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if (typeof __vertxload === 'string') {
  throw "Use require() to load the Vert.x API"
}

/**
 * Pumps data from a ReadStream to a WriteStream and performs flow control where necessary to
 * prevent the write stream from getting overloaded.
 *
 * Instances of this class read bytes from a ReadStream and write them to a WriteStream. If data
 * can be read faster than it can be written this could result in the write queue of the WriteStream growing
 * without bound, eventually causing it to exhaust all available RAM.
 * To prevent this, after each write, instances of this class check whether the write queue of the WriteStream
 * is full, and if so, the ReadStream is paused, and a WriteStreamdrain_handler is set on the WriteStream.
 * When the WriteStream has processed half of its backlog, the drain_handler will be called,
 * which results in the pump resuming the ReadStream.
 *
 *
 * @param rs
 * @param ws
 * @returns {{start: Function, stop: Function, getBytesPumped: Function, setWriteQueueMaxSize: Function}}
 * @constructor
 */
var Pump = function(rs, ws) {

  var pumped = 0;

  var drainHandler = function() {
    rs.resume();
  }

  var dataHandler = function(buffer) {
    ws.write(buffer);
    pumped += buffer.length();
    if (ws.writeQueueFull()) {
      rs.pause();
      ws.drainHandler(drainHandler);
    }
  }

  var p = {
    /**
     * Start the Pump. The Pump can be started and stopped multiple times
     *
     * @returns {{start: Function, stop: Function, getBytesPumped: Function, setWriteQueueMaxSize: Function}}
     */
    start: function() {
      rs.dataHandler(dataHandler);
      return p;
    },
    /**
     * Stop the Pump. The Pump can be started and stopped multiple times
     *
     * @returns {{start: Function, stop: Function, getBytesPumped: Function, setWriteQueueMaxSize: Function}}
     */
    stop: function() {
      ws.drainHandler(null);
      rs.dataHandler(null);
      return p;
    },

    /**
     * Return the total number of bytes pumped by this pump
     *
     * @returns {number}
     */
    getBytesPumped: function() {
      return pumped;
    },

    /**
     * Set the write queue max size
     *
     * @param maxSize The write queue max size
     * @returns {{start: Function, stop: Function, getBytesPumped: Function, setWriteQueueMaxSize: Function}}
     */
    setWriteQueueMaxSize: function(maxSize) {
      ws.setWriteQueueMaxSize(maxSize);
      return p;
    }
  };
  return p;
}

module.exports = Pump;
