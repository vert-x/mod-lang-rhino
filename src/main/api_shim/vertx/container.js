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

var container = {};

var VERTICLE = 0;
var WORKER = 1;
var MODULE = 2;

load("vertx/convert_handler.js");
load("vertx/args.js");


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

/**
 * Deploy a verticle. The actual deploy happens asynchronously
 * @param main the main of the verticle to deploy
 */
container.deployVerticle = function(main) {
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  deploy(VERTICLE, main, args);
}

/**
 * Deploy a worker verticle. The actual deploy happens asynchronously
 *
 * @param main the main of the verticle to deploy
 */
container.deployWorkerVerticle = function(main) {
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  deploy(WORKER, main, args);
}

/**
 * Deploy a module. The actual deploy happens asynchronously
 *
 * @param moduleMame The name of the module to deploy
 */
container.deployModule = function(moduleName) {
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  deploy(MODULE, moduleName, args);
}

/**
 * Undeploy a verticle
 *
 * @param id the unique id of the deployment
 * @param handler an handler that will be called when undeploy has completed
 */
container.undeployVerticle = function(id, doneHandler) {
  if (doneHandler) {
    doneHandler = adaptAsyncResultHandler(doneHandler);
  } else {
    doneHandler = null;
  }
  __jcontainer.undeployVerticle(id, doneHandler);
}

/**
 * Undeploy a module
 *
 * @param id the unique id of the module
 * @param handler an handler that will be called when undeploy has completed
 */
container.undeployModule = function(id, doneHandler) {
  if (doneHandler) {
    doneHandler = adaptAsyncResultHandler(doneHandler);
  } else {
    doneHandler = null;
  }
  __jcontainer.undeployModule(id, doneHandler);
}
/**
 * Cause the container to exit
 */
container.exit = function() {
  __jcontainer.exit();
}

var j_conf = __jcontainer.config();
container.config =  j_conf == null ? null : JSON.parse(j_conf.encode());

container.env = {};
var j_map = __jcontainer.env();
var j_iter = j_map.entrySet().iterator();
while (j_iter.hasNext()) {
  var entry = j_iter.next();
  container.env[entry.getKey()] = entry.getValue();
}

container.logger = __jcontainer.logger();

module.exports = container;



