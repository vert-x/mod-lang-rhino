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

var sockJS = {};

/**
 * Create a new sockjsServer
 *
 * @param httpServer
 * @returns {{installApp: Function, setEventBusBridgeListener: Function, bridge: Function}}
 */
sockJS.createSockJSServer = function(httpServer) {

  if (typeof httpServer._to_java_server !== 'function') {
    throw "Please construct a vertx.SockJSServer with an instance of vert.HttpServer"
  }

  var vertx = __jvertx;

  var jserver = vertx.createSockJSServer(httpServer._to_java_server());

  function convertPermitted(permitted) {
    var json_arr = new org.vertx.java.core.json.JsonArray();
    for (var i = 0; i < permitted.length; i++) {
      var match = permitted[i];
      var json_str = JSON.stringify(match);
      var jJson = new org.vertx.java.core.json.JsonObject(json_str);
      json_arr.add(jJson);
    }
    return json_arr;
  }

  /**
   * This is an implementation of the server side part of https://github.com/sockjs
   *
   * SockJS enables browsers to communicate with the server using a simple WebSocket-like api for sending
   * and receiving messages. Under the bonnet SockJS chooses to use one of several protocols depending on browser
   * capabilities and what apppears to be working across the network.
   *
   * Available protocols include:
   *
   * WebSockets
   * xhr-polling
   * xhr-streaming
   * json-polling
   * event-source
   * html-file
   *
   * This means, it should just work irrespective of what browser is being used, and whether there are nasty
   * things like proxies and load balancers between the client and the server.
   *
   * For more detailed information on SockJS, see their website.
   *
   * On the server side, you interact using instances of SockJSSocket - this allows you to send data to the
   * client or receive data via the ReadStream data_handler.
   *
   * You can register multiple applications with the same SockJSServer, each using different path prefixes, each
   * application will have its own handler, and configuration is described in a Hash.
   * @type {{installApp: Function, setEventBusBridgeListener: Function, bridge: Function}}
   */
  var server = {
    /**
     * Install an application
     *
     * @param config Tconfiguration for the application
     * @param handler The handler
     */
    installApp: function(config, handler) {
      jserver.installApp(new org.vertx.java.core.json.JsonObject(JSON.stringify(config)), handler);
    },
    setEventBusBridgeListener: function(bridgeListener) {
        jserver.setEventBusBridgeListener(new org.vertx.java.core.sockjs.EventBusBridgeListener(bridgeListener));
        return server;
    },
    bridge: function(config, inboundPermitted, outboundPermitted, authTimeout, authAddress) {
      if (typeof authTimeout === 'undefined') {
        authTimeout = 5 * 50 * 1000;
      }
      if (typeof authAddress === 'undefined') {
        authAddress = null;
      }
      var jInboundPermitted = convertPermitted(inboundPermitted);
      var jOutboundPermitted = convertPermitted(outboundPermitted);
      jserver.bridge(new org.vertx.java.core.json.JsonObject(JSON.stringify(config)),
          jInboundPermitted, jOutboundPermitted, authTimeout, authAddress);
    }
  }
  return server;
}

module.exports = sockJS;

