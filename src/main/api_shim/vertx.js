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

var vertx = {};

function addProps(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      vertx[key] = obj[key];
    }
  }
}

vertx.Buffer = require('buffer');
vertx.eventBus = require('event_bus');
addProps(require('net'));
addProps(require('http'));
vertx.Pump = require('pump');
addProps(require('timer'));
addProps(require('sockjs'));
addProps(require('parse_tools'));
addProps(require('shared_data'));
vertx.fileSystem = require('file_system');

vertx.runOnContext = function(task) {
  __jvertx.runOnContext(task);
}

vertx.currentContext = function() {
  return __jvertx.currentContext();
}

module.exports = vertx;
