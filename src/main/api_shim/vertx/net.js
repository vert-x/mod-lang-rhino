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
 * The 'vertx/net' module provides NET functions
 * @exports vertx/net
 */
var net = {};

load("vertx/convert_handler.js");
load("vertx/ssl_support.js");
load("vertx/tcp_support.js");
load("vertx/read_stream.js");
load("vertx/write_stream.js");
load("vertx/args.js");

/**
 * Return a HTTP Server
 *
 * @returns {{server}}
 */
net.createNetServer = function() {
  var jserver = __jvertx.createNetServer();
  var server = {};
  sslSupport(server, jserver);
  serverSslSupport(server, jserver);
  tcpSupport(server, jserver);
  serverTcpSupport(server, jserver);

  /**
   * Supply a connect handler for this server. The server can only have at most one connect handler at any one time.
   * As the server accepts TCP or SSL connections it creates an instance of NetSocket and passes it to the
   * connect handler.
   *
   * @param handler: connection handler
   * @returns {{}}
   */
  server.connectHandler = function(handler) {
    jserver.connectHandler(function(result) {
      handler(jsNetSocket(result));
    });
    return server;
  };

  /**
   * Start to listen for TCP
   *
   * @returns {{server}}
   */
  server.listen = function() {
    var args = Array.prototype.slice.call(arguments);
    var handler = getArgValue('function', args);
    var host = getArgValue('string', args);
    var port = getArgValue('number', args);
    if (handler != null) {
      handler = adaptAsyncResultHandler(handler);
    }
    if (host == null) {
      host = "0.0.0.0";
    }
    jserver.listen(port, host, handler);
    return server;
  };

  /**
   * Close the server. The handler will be called when the close is complete.
   *
   * @param handler The handler which will be calling in completion.
   */
  server.close = function(handler) {
    if (handler === undefined) {
      jserver.close();
    } else {
      jserver.close(adaptAsyncResultHandler(handler));
    }
  };

  /**
   * The actual port the server is listening on. This is useful if you bound the server specifying 0 as port number
   * signifying an ephemeral port
   *
   * @returns {number} port
   */
  server.port = function() {
    return jserver.port();
  }

  /**
   * The host to which the server is bound.
   *
   * @returns {string} host
   */
  server.host = function() {
    return jserver.host();
  }
  return server;
}

/**
 * Return a TCP Client
 *
 * @returns {{client}}
 */
net.createNetClient = function() {
  var jclient = __jvertx.createNetClient();
  var client = {};
  sslSupport(client, jclient);
  clientSslSupport(client, jclient);
  tcpSupport(client, jclient);
  /**
   * Attempt to open a connection to a server. The connection is opened asynchronously and the result returned in the
   * handler.
   *
   * @param arg0: The port to connect to.
   * @param arg2: The host or ip address to connect to.
   * @param arg3: The connection handler
   * @returns {{}}
   */
  client.connect = function(arg0, arg1, arg2) {
    var port = arg0;
    var host;
    var handler;
    if (arg2 === undefined) {
      host = 'localhost';
      handler = arg1;
    } else {
      host = arg1;
      handler = arg2;
    }
    jclient.connect(port, host, adaptAsyncResultHandler(handler, function(result) {
      return jsNetSocket(result);
    }));
    return client;
  };

  /**
   * Set or get the number of reconnection attempts. In the event a connection attempt fails, the client will attempt
   * to connect a further number of times, before it fails. Default value is zero.
   *
   * @param attempts
   * @returns {*}
   */
  client.reconnectAttempts = function(attempts) {
    if (attempts === undefined) {
      return jclient.getReconnectAttempts();
    } else {
      jclient.setReconnectAttempts(attempts);
      return client;
    }
  };

  /**
   * Set or get the number of reconnect attempts
   *
   * @param interval
   * @returns {*}
   */
  client.reconnectInterval = function(interval) {
    if (interval === undefined) {
      return jclient.getReconnectInterval();
    } else {
      jclient.setReconnectInterval(interval);
      return client;
    }
  };

  /**
   * Get or set the connect timeout in milliseconds.
   * @param timeout
   * @returns {*}
   */
  client.connectTimeout = function(timeout) {
    if (timeout === undefined) {
      return jclient.getConnectTimeout();
    } else {
      jclient.setConnectTimeout(timeout);
      return client;
    }
  };

  /**
   * Close the NetClient. Any open connections will be closed.
   */
  client.close = function() {
    jclient.close();
  }
  return client;
}

function jsNetSocket(jNetSocket) {
  var netSocket = {};
  readStream(netSocket, jNetSocket);
  writeStream(netSocket, jNetSocket);
  /**
   * Return the id of the write handler
   *
   * @returns {*}
   */
  netSocket.writeHandlerID = function() {
    return jNetSocket.writeHandlerID();
  };
  /**
   *
   * Write data to the socket. The handler will be called when the data has actually been written to the wire.
   *
   * @param arg0: The data to write.
   * @param arg1: The handler to notify
   * @returns {{}}
   */
  netSocket.write = function(arg0, arg1) {
    if (arg1 === undefined) {
      jNetSocket.write(arg0);
    } else {
      jNetSocket.write(arg0, arg1);
    }
    return netSocket;
  };

  /**
   * Tell the kernel to stream a file directly from disk to the outgoing connection, bypassing userspace altogether
   * (where supported by the underlying operating system. This is a very efficient way to stream files.
   *
   * @param filename Path to file to send.
   * @returns {{}}
   */
  netSocket.sendFile = function(filename) {
    jNetSocket.sendFile(filename);
    return netSocket;
  };

  /**
   * Return the remote address
   *
   * @returns {{ipaddress: string, port: number}}
   */
  netSocket.remoteAddress = function() {
    return {
      'ipaddress': jNetSocket.remoteAddress().getAddress().getHostAddress(),
      'port': jNetSocket.remoteAddress().getPort()
    };
  };

  /**
   * Return the local bound address
   *
   * @returns {{ipaddress: string, port: number}}
   */
  netSocket.localAddress = function() {
    return {
      'ipaddress': jNetSocket.localAddress().getAddress().getHostAddress(),
      'port': jNetSocket.localAddress().getPort()
    };
  }

  /**
   * Close the socket
   */
  netSocket.close = function() {
    jNetSocket.close();
  };

  /**
   * Set a close handler on the socket.
   *
   * @param handler A block to be used as the handler
   * @returns {{}}
   */
  netSocket.closeHandler = function(handler) {
    jNetSocket.closeHandler(handler);
    return netSocket;
  };
  return netSocket;
}

module.exports = net;
