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

load('test_utils.js')
load('vertx.js')

var tu = new TestUtils();

var eb = vertx.eventBus;

function testDeploy1() {
  vertx.deployVerticle("core/deploy/child.js", function(err, deployID) {
    tu.checkThread();
    tu.azzert(err === null);
    tu.azzert(deployID != null);
    tu.testComplete();
  });
}

function testDeploy2() {
  var conf = {blah: 'foo'};
  vertx.deployVerticle("core/deploy/child.js", conf, function(err, deployID) {
    tu.checkThread();
    tu.azzert(err === null);
    tu.azzert(deployID != null);
    tu.testComplete();
  });
}

function testDeploy3() {
  vertx.deployVerticle("core/deploy/child.js", 12, function(err, deployID) {
    tu.checkThread();
    tu.azzert(err === null);
    tu.azzert(deployID != null);
    tu.testComplete();
  });
}

function testDeploy4() {
  var conf = {blah: 'foo'};
  vertx.deployVerticle("core/deploy/child.js", conf, 12, function(err, deployID) {
    tu.checkThread();
    tu.azzert(err === null);
    tu.azzert(deployID != null);
    tu.testComplete();
  });
}

function testDeployFail() {
  vertx.deployVerticle("core/deploy/notexist.js", function(err, deployID) {
    tu.checkThread();
    tu.azzert(err != null);
    tu.azzert(deployID === null);
    tu.testComplete();
  });
}

function testUndeploy() {
  vertx.deployVerticle("core/deploy/child.js", function(err, deployID) {
    tu.checkThread();
    vertx.undeployVerticle(deployID, function(err) {
      tu.azzert(err === null);
      tu.testComplete();
    });
  });
}

function testUndeployFail() {
  vertx.deployVerticle("core/deploy/child.js", function(err, deployID) {
    tu.checkThread();
    vertx.undeployVerticle('not_id', function(err) {
      tu.azzert(err != null);
      tu.testComplete();
    });
  });
}

function testDeployWorker() {
  vertx.deployWorkerVerticle("core/deploy/child.js", function(err, deployID) {
    tu.checkThread();
    tu.azzert(err === null);
    tu.azzert(deployID != null);
    tu.testComplete();
  });
}

tu.registerTests(this);
tu.appReady();

function vertxStop() {
  tu.unregisterAll();
  tu.appStopped();
}