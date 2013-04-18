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

var vertx = vertx || {};

if (!vertx.deployVerticle) {
  (function() {

    var VERTICLE = 0;
    var WORKER = 1;
    var MODULE = 2;

    load("convert_handler.js");
    load("args.js");

    function deploy(deployType, name, args) {
      var doneHandler = getArgValue('function', args);
      var multiThreaded = getArgValue('boolean', args);
      var instances = getArgValue('number', args);
      var config = getArgValue('object', args);
      if (config != null) {
        // Convert to Java Json Object
        var str = JSON.stringify(config);
        config = new org.vertx.java.core.json.JsonObject(str);
      }
      if (doneHandler != null) {
        doneHandler = adaptAsyncResultHandler(doneHandler);
      }
      if (multiThreaded === null) {
        multiThreaded = false;
      }
      if (instances === null) {
        instances = 1;
      }

      //console.log("Deploying " + name + " config: " + config + " multi-threaded " + multiThreaded + " instances " + instances + " doneHandler " + doneHandler);

      switch (deployType) {
        case VERTICLE: {
          __jcontainer.deployVerticle(name, config, instances, doneHandler);
          break;
        }
        case WORKER: {
          __jcontainer.deployWorkerVerticle(name, config, instances, multiThreaded, doneHandler);
          break;
        }
        case MODULE: {
          __jcontainer.deployModule(name, config, instances, doneHandler);
          break;
        }
      }
    }

    vertx.deployVerticle = function(main) {
      var args = Array.prototype.slice.call(arguments);
      args.shift();
      deploy(VERTICLE, main, args);
    }

    vertx.deployWorkerVerticle = function(main) {
      var args = Array.prototype.slice.call(arguments);
      args.shift();
      deploy(WORKER, main, args);
    }

    vertx.deployModule = function(moduleName) {
      var args = Array.prototype.slice.call(arguments);
      args.shift();
      deploy(MODULE, moduleName, args);
    }

    vertx.undeployVerticle = function(name, doneHandler) {
      if (doneHandler) {
        doneHandler = adaptAsyncResultHandler(doneHandler);
      } else {
        doneHandler = null;
      }
      __jcontainer.undeployVerticle(name, doneHandler);
    }

    vertx.undeployModule = function(name, doneHandler) {
      if (doneHandler) {
        doneHandler = adaptAsyncResultHandler(doneHandler);
      } else {
        doneHandler = null;
      }
      __jcontainer.undeployModule(name, doneHandler);
    }

    vertx.exit = function() {
      __jcontainer.exit();
    }

    var j_conf = __jcontainer.config();
    vertx.config =  j_conf == null ? null : JSON.parse(j_conf.encode());

    vertx.env = {};
    var j_map = __jcontainer.env();
    var j_iter = j_map.entrySet().iterator();
    while (j_iter.hasNext()) {
      var entry = j_iter.next();
      vertx.env[entry.getKey()] = entry.getValue();
    }

    vertx.logger = __jcontainer.logger();

    // Add a console object which will be familiar to JavaScript devs
    console = {
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

  })();
}


