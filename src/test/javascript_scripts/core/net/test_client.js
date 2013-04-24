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

var tu = require('test_utils')
var net = require('net')
var Buffer = require('buffer')

var client;

function testConnect() {

  var server = net.createNetServer();

  server.connectHandler(function(sock) {
    tu.checkThread();
    sock.dataHandler(function(data) {
      tu.checkThread();
      sock.write(data);
    })
  });

  server.listen(1234, 'localhost', function(err, server) {

    tu.azzert(err === null);
    client = net.createNetClient();

    client.connect(1234, 'localhost', function(err, sock) {

      tu.azzert(err === null);
      tu.azzert(sock != null);

      sock.dataHandler(function(data) {
        tu.testComplete();
      });

      sock.write(new Buffer('this is a buffer'));
    });
  });

}

function testNoConnect() {

  client = net.createNetClient();

  client.connect(1234, 'not-exists', function(err, sock) {

    tu.azzert(err != null);
    tu.testComplete();
  });
}

tu.registerTests(this);
tu.appReady();

function vertxStop() {
  client.close();
  tu.unregisterAll();
  tu.appStopped();
}