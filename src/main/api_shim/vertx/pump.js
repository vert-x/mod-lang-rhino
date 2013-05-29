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
    start: function() {
      rs.dataHandler(dataHandler);
      return p;
    },
    stop: function() {
      ws.drainHandler(null);
      rs.dataHandler(null);
      return p;
    },
    getBytesPumped: function() {
      return pumped;
    },
    setWriteQueueMaxSize: function(maxSize) {
      ws.setWriteQueueMaxSize(maxSize);
      return p;
    }
  };
  return p;
}

module.exports = Pump;
