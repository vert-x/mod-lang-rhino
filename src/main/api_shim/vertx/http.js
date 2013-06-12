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

var http = {};

load("vertx/read_stream.js");
load("vertx/write_stream.js");
load("vertx/ssl_support.js");
load("vertx/tcp_support.js");
load("vertx/args.js");
load("vertx/convert_handler.js");

function wrappedRequestHandler(handler) {
  return function(jreq) {

    //We need to add some functions to the request and the response

    var reqHeaders = null;
    var reqParams = null;
    var version = null;
    var reqFormAttrs = null;

    var req = {};
    readStream(req, jreq);

    /**
     * The HTTP version - either HTTP_1_0 or HTTP_1_1
     *
     * @returns {string} version
     */
    req.version = function() {
      if (version === null) {
        version = jreq.version().toString();
      }
      return version;
    };

    /**
     * The HTTP method, one of HEAD, OPTIONS, GET, POST, PUT, DELETE, CONNECT, TRACE
     *
     * @returns {string} method
     */
    req.method = function() {
      return jreq.method();
    };

    /**
     * The uri of the request. For example 'http://www.somedomain.com/somepath/somemorepath/somresource.foo?someparam=32&someotherparam=x
     *
     * @returns {string} uri
     */
    req.uri = function() {
      return jreq.uri();
    };

    /**
     * The path part of the uri. For example /somepath/somemorepath/somresource.foo
     *
     * @returns {string} path
     */
    req.path = function() {
      return jreq.path();
    };

    /**
     * The query part of the uri. For example someparam=32&someotherparam=x
     *
     * @returns {string} query
     */
    req.query = function() {
      return jreq.query();
    };

    /**
     * The headers of the request.
     *
     * @returns {wrapMultiMap}
     */
    req.headers = function() {
      if (!reqHeaders) {
        reqHeaders = wrapMultiMap(jreq.headers());
      }
      return reqHeaders;
    };

    /**
     * Return the remote (client side) address of the request
     *
     * @returns {wrapMultiMap}
     */
    req.params = function() {
      if (!reqParams) {
        reqParams = wrapMultiMap(jreq.params());
      }
      return reqParams;
    };

    /**
     * The address of the remote peer
     */
    req.remoteAddress = function() {
      return jreq.remoteAddress();
    };


    req.peerCertificateChain = function() {
      return jreq.peerCertificateChain();
    };

    /**
     * Return the absolute URI corresponding to the the HTTP request
     *
     * @returns {string} absoluteURI
     */
    req.absoluteURI = function() {
      return jreq.absoluteURI();
    };

    req.formAttributes = function() {
      if (!reqFormAttrs) {
        reqFormAttrs =  wrapMultiMap(jreq.formAttributes());
      }
      return reqFormAttrs;
    }

    /**
     * Set the upload handler. The handler will get notified once a new file upload was received and so allow to
     * get notified by the upload in progress.
     *
     * @param handler The handler to call
     * @returns {req}
     */
    req.uploadHandler = function(handler) {
      if (handler) {
        jreq.uploadHandler(wrapUploadHandler(handler));
      }
      return req;
    }

    /**
     *  Set the body handler for this request, the handler receives a single Buffer object as a parameter.
     *  This can be used as a decorator.
     *
     * @param handler The handler to call once the body was received
     * @returns {req}
     */
    req.bodyHandler = function(handler) {
      jreq.bodyHandler(handler);
      return req;
    }
    req._to_java_request = function() {
      return jreq;
    }

    var jresp = jreq.response();
    var respHeaders = null;
    var respTrailers = null;

    /**
     * The response
     *
     * @type {{}}
     */
    var resp = {};
    writeStream(resp, jresp);

    /**
     * Get or set HTTP status code of the response.
     *
     */
    resp.statusCode = function(code) {
      if (code) {
        jresp.setStatusCode(code);
        return resp;
      } else {
        return jresp.getStatusCode();
      }
    };

    /**
     * Get or set HTTP status message of the response.
     *
     *
     */
    resp.statusMessage = function(msg) {
      if (msg) {
        jresp.setStatusMessage(msg);
        return resp;
      } else {
        return jresp.getStatusMessage();
      }
    };

    /**
     * Get or set if the response is chunked
     *
     */
    resp.chunked = function(ch) {
      if (ch) {
        jresp.setChunked(ch);
        return resp;
      } else {
        return jresp.isChunked();
      }
    };

    /**
     * Return the http headers of the response
     *
     * @returns {wrapMultiMap} respHeaders
     */
    resp.headers = function() {
      if (!respHeaders) {
        respHeaders = wrapMultiMap(jresp.headers());
      }
      return respHeaders;
    };

    /**
     * Put a header on the response.
     *
     * @param k The name under which the header should be stored
     * @param v T the value of the header
     * @returns {resp}
     */
    resp.putHeader = function(k, v) {
      jresp.putHeader(k, v);
      return resp;
    };
    /**
     * Return the trailing headers of the response
     *
     * @returns {respTrailers}
     */
    resp.trailers = function() {
      if (!respTrailers) {
        respTrailers = wrapMultiMap(jresp.trailers());
      }
      return respTrailers;
    };

    /**
     * Put a trailing header
     *
     * @param k The name under which the header should be stored
     * @param v T the value of the header
     * @returns {resp}
     */
    resp.putTrailer = function(k, v) {
      jresp.putTrailer(k, v);
      return resp;
    };

    /**
     * Write content to the response
     *
     * @param arg0
     * @param arg1
     * @returns {{}}
     */
    resp.write = function(arg0, arg1) {
      if (arg1 === undefined) {
        jresp.write(arg0);
      } else {
        jresp.write(arg0, arg1);
      }
      return resp;
    };

    /**
     * Forces the head of the request to be written before end is called on the request. This is normally used
     * to implement HTTP 100-continue handling, see continue_handler for more information.
     * @returns {resp}
     */
    resp.sendHead = function() {
      jresp.sendHead();
      return resp;
    };
    resp.end = function(arg0, arg1) {
      if (arg0) {
        if (arg1) {
          jresp.end(arg0, arg1);
        } else {
          jresp.end(arg0);
        }
      } else {
        jresp.end();
      }
    };

    /**
     * Tell the kernel to stream a file directly from disk to the outgoing connection, bypassing userspace altogether
     * (where supported by the underlying operating system. This is a very efficient way to serve files.
     * @param fileName  Path to file to send.
     * @param notFoundFile
     * @returns {{}}
     */
    resp.sendFile = function(fileName, notFoundFile) {
      if (notFoundFile === undefined) {
        jresp.sendFile(fileName);
      } else {
        jresp.sendFile(fileName, notFoundFile);
      }
      return resp;
    };

    req.response = resp;
    handler(req);
  }
}

function wrapUploadHandler(handler) {
  return function(jupload) {

    /**
     * The File upload
     *
     * @type {{}}
     */
    var upload = {};
    readStream(upload, jupload);
    /**
     * Stream the upload to the given file
     *
     * @param filename The file to which it wil be streamed
     * @returns {upload}
     */
    upload.streamToFileSystem = function(filename) {
      jupload.streamToFileSystem(filename);
      return upload;
    };

    /**
     * The filename of the upload
     *
     * @returns {string} filenmae
     */
    upload.filename = function() {
      return jupload.filename();
    };

    /**
     * The name of the upload
     *
     * @returns {string} name
     */
    upload.name = function() {
      return jupload.name();
    };

    /**
     * The content type
     *
     * @returns {string} contentType
     */
    upload.contentType = function() {
      return jupload.contentType();
    };

    /**
     * The content transfer encoding
     *
     * @returns {string} contentTransferEncoding
     */
    upload.contentTransferEncoding = function() {
      return jupload.contentTransferEncoding();
    }

    /**
     * The charset
     *
     * @returns {string} charset
     */
    upload.charset = function() {
      return jupload.charset().toString();
    }

    /**
     * The size
     *
     * @returns {string} size
     */
    upload.size = function() {
      return jupload.size();
    }
    handler(upload);
  }
}

function wrapWebsocketHandler(server, handler) {
  return function(jwebsocket) {
    var ws = {};
    var headers = null;
    readStream(ws, jwebsocket);
    writeStream(ws, jwebsocket);

    /**
     *
     * When a WebSocket is created it automatically registers an event handler with the eventbus, the ID of that
     * handler is returned.
     *
     * Given this ID, a different event loop can send a binary frame to that event handler using the event bus and
     * that buffer will be received by this instance in its own event loop and written to the underlying connection. This
     * allows you to write data to other websockets which are owned by different event loops.
     *
     * @returns {string} id
     */
    ws.binaryHandlerID = function() {
      return jwebsocket.binaryHandlerID();
    };

    /**
     * When a WebSocket is created it automatically registers an event handler with the eventbus, the ID of that
     * handler is returned.
     *
     * Given this ID, a different event loop can send a text frame to that event handler using the event bus and
     * that buffer will be received by this instance in its own event loop and written to the underlying connection. This
     * allows you to write data to other websockets which are owned by different event loops.
     *
     * @returns {string} id
     */
    ws.textHandlerID = function() {
      return jwebsocket.textHandlerID();
    };

    /**
     *  Write data to the websocket as a binary frame
     *
     * @param data
     */
    ws.writeBinaryFrame = function(data) {
      jwebsocket.writeBinaryFrame(data);
    };
    ws
    /**
     *  Write data to the websocket as a text frame
     *
     * @param data
     */.writeTextFrame = function(data) {
      jwebsocket.writeTextFrame(data);
    };

    /**
     *  Set a closed handler on the connection, the handler receives a no parameters.
     * This can be used as a decorator.
     *
     * @param handler
     * @returns ws
     */
    ws.closeHandler = function(handler) {
      jwebsocket.closeHandler(handler);
      return ws;
    };
    /**
     * Close the websocket connection
     */
    ws.close = function() {
      jwebsocket.close();
    };
    if (server) {
      /**
       * The path the websocket connect was attempted at.
       *
       * @returns {string} path
       */
      ws.path = function() {
        return jwebsocket.path();
      };

      /**
       * Reject the WebSocket. Sends 404 to client
       *
       * @returns {ws}
       */
      ws.reject = function() {
        jwebsocket.reject();
        return ws;
      }
      /**
       * The headers of the handshake request
       *
       * @returns {headers}
       */
      ws.headers = function() {
        if (!headers) {
          headers = wrapMultiMap(jwebsocket.headers());
        }
        return headers;
      }
    }
    handler(ws);
  }
}

/**
 * Return a HttpServer
 *
 * @return server
 */
http.createHttpServer = function() {

  var jserver = __jvertx.createHttpServer();

  /**
   * An HTTP and websockets server
   *
   * @type {{}}
   */
  var server = {};
  sslSupport(server, jserver);
  serverSslSupport(server, jserver);
  tcpSupport(server, jserver);
  serverTcpSupport(server, jserver);

  /**
   * Set org get the HTTP request handler for the server.
   * As HTTP requests arrive on the server it will be passed to the handler.
   *
   * @param handler the function used to handle the request.
   * @return server
   */
  server.requestHandler = function(handler) {
    if (handler) {
      if (typeof handler === 'function') {
        handler = wrappedRequestHandler(handler);
      } else {
        // It's a route matcher
        handler = handler._to_java_handler();
      }
      jserver.requestHandler(handler);
    }
    return server;
  };

  /**
   * Set org get the websocket handler for the server.
   * As websocket requests arrive on the server it will be passed to the handler.
   *
   * @param handler the function used to handle the request.
   * @return server
   */
  server.websocketHandler = function(handler) {
    if (handler) {
      jserver.websocketHandler(wrapWebsocketHandler(true, handler));
    }
    return server;
  };

  /**
   * Close the server and notify the handler once it was done
   *
   * @param handler The handler to notify
   */
  server.close = function(handler) {
    if (jserver) {
      jserver.close(handler);
    } else {
      jserver.close();
    }
  };

  /**
   * Start to listen for HTTP
   *
   * @returns {{server}}
   */
  server.listen = function() {
    var args = Array.prototype.slice.call(arguments);
    var handler = getArgValue('function', args);
    var host = getArgValue('string', args);
    var port = getArgValue('number', args);
    if (handler) {
      handler = adaptAsyncResultHandler(handler);
    }
    if (host == null) {
      host = "0.0.0.0";
    }
    jserver.listen(port, host, handler);
    return server;
  }

  /**
   * @private
   */
  server._to_java_server = function() {
    return jserver;
  }
  return server;
}

/**
 * Return a HTTP Client
 *
 * @returns {{client}}
 */
http.createHttpClient = function() {

  var jclient = __jvertx.createHttpClient();

  function wrapResponseHandler(handler) {
    return function(jresp) {

      var respHeaders = null;
      var respTrailers = null;

      /**
       *
       * @type {{}}
       */
      var resp = {};
      readStream(resp, jresp)

      /**
       * The HTTP status code of the response.
       *
       * @returns {code} The HTTP Status code
       */
      resp.statusCode = function() {
        return jresp.statusCode();
      };

      /**
       * The HTTP Status message of the response
       *
       * @returns {code} The HTTP Status message
       */
      resp.statusMessage = function() {
        return jresp.statusMessage();
      };

      /**
       * Get all the headers of the response.
       *
       * @returns {respHeaders} The headers
       */
      resp.headers = function() {
        if (!respHeaders) {
          respHeaders = wrapMultiMap(jresp.headers());
        }
        return respHeaders;
      };

      /**
       * Get all the trailing headers of the response.
       *
       * @returns {respTrailers}
       */
      resp.trailers = function() {
        if (!respTrailers) {
          respTrailers = wrapMultiMap(jresp.trailers());
        }
        return respTrailers;
      };

      /**
        * The Set-Cookie headers (including trailers)
       *
       * @returns {cookies} The cookies
       */
      resp.cookies = function() {
        return jresp.cookies();
      };

      /**
       * Set a handler to receive the entire body in one go - do not use this for large bodies
       *
       * @param handler The handler to use
       * @returns {resp}
       */
      resp.bodyHandler = function(handler) {
        jresp.bodyHandler(handler);
        return resp;
      };
      handler(resp);
    }
  }

  function wrapRequest(jreq) {
    var reqHeaders = null;

    var req = {};
    writeStream(req, jreq);

    /**
     * Sets or gets whether the request should used HTTP chunked encoding or not.
     *
     * @param ch If val is true, this request will use HTTP chunked encoding, and each call to write to the body
     *  will correspond to a new HTTP chunk sent on the wire. If chunked encoding is used the HTTP header
     * 'Transfer-Encoding' with a value of 'Chunked' will be automatically inserted in the request.
     * @returns {req}
     */
    req.chunked = function(ch) {
      if (ch === undefined) {
        return jreq.isChunked();
      } else {
        jreq.setChunked(ch);
        return req;
      }
    };
    /**
     * Returns the headers for the requests
     *
     * @returns {reqHeaders} The headers
     */
    req.headers = function() {
      if (!reqHeaders) {
        reqHeaders = wrapMultiMap(jreq.headers());
      }
      return reqHeaders;
    };

    /**
     * Put a header on the request
     *
     * @param k The name under which to store
     * @param V the value to store
     * @returns {req}
     */
    req.putHeader = function(k, v) {
      jreq.putHeader(k, v);
      return req;
    };

    /**
     * Put muliple headers on the request
     *
     * @param k The name under which to store
     * @param V the value to store
     * @returns {req}
     */
    req.putAllHeaders = function(other) {
      var hdrs = wrapped.headers();
      for (var k in other) {
        hdrs[k] = other[k];
      }
      return req;
    };

    /**
     * Write a to the request body
     * @param arg0
     * @param arg1
     * @returns {{}}
     */
    req.write = function(arg0, arg1) {
      if (arg1 === undefined) {
        jreq.write(arg0);
      } else {
        jreq.write(arg0, arg1);
      }
      return req;
    };

    /**
     * If you send an HTTP request with the header 'Expect' set to the value '100-continue'
     * and the server responds with an interim HTTP response with a status code of '100' and a continue handler
     * has been set using this method, then the handler will be called.
     * You can then continue to write data to the request body and later end it. This is normally used in conjunction with
     * the send_head method to force the request header to be written before the request has ended.
     *
     * @param handler The handler
     * @returns {req}
     */
    req.continueHandler = function(handler) {
      jreq.continueHandler(handler);
      return req;
    };

    /**
     * Forces the head of the request to be written before end is called on the request. This is normally used
     * to implement HTTP 100-continue handling, see continue_handler for more information.
     *
     * @returns req
     */
    req.sendHead = function() {
      jreq.sendHead();
      return req;
    };

    /**
     * Ends the request. If no data has been written to the request body, and send_head has not been called then
     * the actual request won't get written until this method gets called.
     * Once the request has ended, it cannot be used any more, and if keep alive is true the underlying connection will
     * be returned to the HttpClient pool so it can be assigned to another request.
     * @param arg0 The data to write
     * @param arg1 The charset to use
     */
    req.end = function(arg0, arg1) {
      if (arg0) {
        if (arg1) {
          jreq.end(arg0, arg1);
        } else {
          jreq.end(arg0);
        }
      } else {
        jreq.end();
      }
    };

    /**
     * Set the timeout
     *
     * @param t The timeout to set
     */
    req.timeout = function(t) {
      jreq.setTimeout(t);
    };
    return req;
  }

  /**
   * An HTTP client.
   * A client maintains a pool of connections to a specific host, at a specific port. The HTTP connections can act
   * as pipelines for HTTP requests.
   * It is used as a factory for HttpClientRequest instances which encapsulate the actual HTTP requests. It is also
   * used as a factory for HTML5 WebSocket websockets.
   * @type {{}}
   */
  var client = {};
  sslSupport(client, jclient);
  clientSslSupport(client, jclient);
  tcpSupport(client, jclient);

  /**
   * Set the exception handler.
   *
   * @param handler The handler which is called on an exception
   * @returns {{}}
   */
  client.exceptionHandler = function(handler) {
    jclient.exceptionHandler(handler);
    return client;
  };

  /**
   * Get or set the maxium number of connections this client will pool
   *
   * @param size
   * @returns {*}
   */
  client.maxPoolSize = function(size) {
    if (size === undefined) {
      return jclient.getMaxPoolSize();
    } else {
      jclient.setMaxPoolSize(size);
      return client;
    }
  };
  /**
   * Get or set if the client use keep alive
   *
   * @param size
   * @returns {*}
   */
  client.keepAlive = function(ka) {
    if (ka === undefined) {
      return jclient.isKeepAlive();
    } else {
      jclient.setKeepAlive(ka);
      return client;
    }
  };

  /**
   * Get or set the port that the client will attempt to connect to on the server on. The default value is 80
   * @param p
   * @returns {*}
   */
  client.port = function(p) {
    if (p === undefined) {
      return jclient.getPort();
    } else {
      jclient.setPort(p);
      return client;
    }
  };

  /**
   *  Get or set the host name or ip address that the client will attempt to connect to on the server on
   *
   * @param h
   * @returns {*}
   */
  client.host = function(h) {
    if (h === undefined) {
      return jclient.getHost();
    } else {
      jclient.setHost(h);
      return client;
    }
  };
  /**
   * Get or set if the host should be verified.  If set then the client will try to validate the remote server's certificate
   * hostname against the requested host. Should default to 'true'.
   * This method should only be used in SSL mode
   *
   * @param h
   * @returns {*}
   */
  client.verifyHost = function(h) {
    if (h === undefined) {
      return jclient.isVerifyHost();
    } else {
      jclient.setVerifyHost(h);
      return client;
    }
  };

  /**
   * Attempt to connect an HTML5 websocket to the specified URI.
   * The connect is done asynchronously and the handler is called with a WebSocket on success.
   *
   * @param uri A relative URI where to connect the websocket on the host, e.g. /some/path
   * @param handler The handler to be called with the WebSocket
   */
  client.connectWebsocket = function(uri, handler) {
    jclient.connectWebsocket(uri, wrapWebsocketHandler(false, handler));
  };

  /**
   * This is a quick version of the get method where you do not want to do anything with the request
   * before sing.
   * With this method the request is immediately sent.
   * When an HTTP response is received from the server the handler is called passing in the response.
   *
   * @param uri A relative URI where to perform the GET on the server.
   * @param handler The handler to be called

   * @returns {*}
   */
  client.getNow = function(uri, handler) {
    return wrapRequest(jclient.getNow(uri, wrapResponseHandler(handler)));
  };

  /**
   * his method returns an request which represents an HTTP OPTIOS request with the specified uri.
   * When an HTTP response is received from the server the handler is called passing in the response.
   *
   * @param uri A relative URI where to perform the OPTIONS on the server.
   * @param handler The handler to be called
   * @returns {*}
   */
  client.options = function(uri, handler) {
    return wrapRequest(jclient.options(uri, wrapResponseHandler(handler)));
  };

  /**
   * his method returns an request which represents an HTTP GET request with the specified uri.
   * When an HTTP response is received from the server the handler is called passing in the response.
   *
   * @param uri A relative URI where to perform the GET on the server.
   * @param handler The handler to be called
   * @returns {*}
   */
  client.get =function(uri, handler) {
    return wrapRequest(jclient.get(uri, wrapResponseHandler(handler)));
  };

  /**
   * his method returns an request which represents an HTTP HEAD request with the specified uri.
   * When an HTTP response is received from the server the handler is called passing in the response.
   *
   * @param uri A relative URI where to perform the HEAD on the server.
   * @param handler The handler to be called
   * @returns {*}
   */
  client.head =function(uri, handler) {
    return wrapRequest(jclient.head(uri, wrapResponseHandler(handler)));
  };

  /**
   * his method returns an request which represents an HTTP POST request with the specified uri.
   * When an HTTP response is received from the server the handler is called passing in the response.
   *
   * @param uri A relative URI where to perform the POST on the server.
   * @param handler The handler to be called
   * @returns {*}
   */
  client.post = function(uri, handler) {
    return wrapRequest(jclient.post(uri, wrapResponseHandler(handler)));
  };

  /**
   * his method returns an request which represents an HTTP PUT request with the specified uri.
   * When an HTTP response is received from the server the handler is called passing in the response.
   *
   * @param uri A relative URI where to perform the PUT on the server.
   * @param handler The handler to be called
   * @returns {*}
   */
  client.put = function(uri, handler) {
    return wrapRequest(jclient.put(uri, wrapResponseHandler(handler)));
  };

  /**
   * his method returns an request which represents an HTTP DELETE request with the specified uri.
   * When an HTTP response is received from the server the handler is called passing in the response.
   *
   * @param uri A relative URI where to perform the DELETE on the server.
   * @param handler The handler to be called
   * @returns {*}
   */
  client.delete = function(uri, handler) {
    return wrapRequest(jclient.delete(uri, wrapResponseHandler(handler)));
  };

  /**
   * his method returns an request which represents an HTTP TRACE request with the specified uri.
   * When an HTTP response is received from the server the handler is called passing in the response.
   *
   * @param uri A relative URI where to perform the TRACE on the server.
   * @param handler The handler to be called
   * @returns {*}
   */
  client.trace = function(uri, handler) {
    return wrapRequest(jclient.trace(uri, wrapResponseHandler(handler)));
  };

  /**
   * his method returns an request which represents an HTTP CONNECT request with the specified uri.
   * When an HTTP response is received from the server the handler is called passing in the response.
   *
   * @param uri A relative URI where to perform the CONNECT on the server.
   * @param handler The handler to be called
   * @returns {*}
   */
  client.connect = function(uri, handler) {
    return wrapRequest(jclient.connect(uri, wrapResponseHandler(handler)));
  };

  /**
   * his method returns an request which represents an HTTP PATCH request with the specified uri.
   * When an HTTP response is received from the server the handler is called passing in the response.
   *
   * @param uri A relative URI where to perform the PATCH on the server.
   * @param handler The handler to be called
   * @returns {*}
   */
  client.patch = function(uri, handler) {
    return wrapRequest(jclient.patch(uri, wrapResponseHandler(handler)));
  };

  /**
   * his method returns an request which represents an HTTP request with the specified uri.
   * When an HTTP response is received from the server the handler is called passing in the response.
   *
   * @param method The HTTP method which is used for the request
   * @param uri A relative URI where to perform the PUT on the server.
   * @param handler The handler to be called
   * @returns {*}
   */
  client.request = function(method, uri, handler) {
    return wrapRequest(jclient.request(method, uri, wrapResponseHandler(handler)));
  };

  /**
   * Close the client
   */
  client.close = function() {
    jclient.close();
  };
  return client;
}

/**
 * This class allows you to do route requests based on the HTTP verb and the request URI, in a manner similar
 * to <a href="http://www.sinatrarb.com/">Sinatra</a> or <a href="http://expressjs.com/">Express</a>.
 * RouteMatcher also lets you extract paramaters from the request URI either a simple pattern or using
 * regular expressions for more complex matches. Any parameters extracted will be added to the requests parameters
 * which will be available to you in your request handler.
 *
 * It's particularly useful when writing REST-ful web applications.
 *
 * To use a simple pattern to extract parameters simply prefix the parameter name in the pattern with a ':' (colon).
 *
 * Different handlers can be specified for each of the HTTP verbs, GET, POST, PUT, DELETE etc.
 *
 * For more complex matches regular expressions can be used in the pattern. When regular expressions are used, the extracted
 * parameters do not have a name, so they are put into the HTTP request with names of param0, param1, param2 etc.
 *
 * Multiple matches can be specified for each HTTP verb. In the case there are more than one matching patterns for
 a particular request, the first matching one will be used.
 *
 * @constructor
 */
http.RouteMatcher = function() {

  var j_rm = new org.vertx.java.core.http.RouteMatcher();

  this.call = function(req) {
    j_rm.handle(req._to_java_request())
  }

  /**
   * Specify a handler that will be called for a matching HTTP GET
   *
   * @pattern pattern to match
   * @param handler handler for match
   * @return {RouteMatcher}
   */
  this.get = function(pattern, handler) {
    j_rm.get(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP PUT
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.put = function(pattern, handler) {
    j_rm.put(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP POST
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.post = function(pattern, handler) {
    j_rm.post(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP DELETE
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.delete = function(pattern, handler) {
    j_rm.delete(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP OPTIONS
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.options = function(pattern, handler) {
    j_rm.options(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP HEAD
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.head = function(pattern, handler) {
    j_rm.head(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP TRACE
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.trace = function(pattern, handler) {
    j_rm.trace(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP CONNECT
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.connect = function(pattern, handler) {
    j_rm.connect(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP PATCH
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.patch = function(pattern, handler) {
    j_rm.patch(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP ALL
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.all = function(pattern, handler) {
    j_rm.all(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP GET
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}

   */
  this.getWithRegEx = function(pattern, handler) {
    j_rm.getWithRegEx(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP PUT
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.putWithRegEx = function(pattern, handler) {
    j_rm.putWithRegEx(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP POST
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.postWithRegEx = function(pattern, handler) {
    j_rm.postWithRegEx(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP DELETE
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.deleteWithRegEx = function(pattern, handler) {
    j_rm.deleteWithRegEx(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP PUT
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.optionsWithRegEx = function(pattern, handler) {
    j_rm.optionsWithRegEx(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP HEAD
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.headWithRegEx = function(pattern, handler) {
    j_rm.headWithRegEx(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP TRACE
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.traceWithRegEx = function(pattern, handler) {
    j_rm.traceWithRegEx(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP CONNECT
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.connectWithRegEx = function(pattern, handler) {
    j_rm.connectWithRegEx(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP PATCH
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.patchWithRegEx = function(pattern, handler) {
    j_rm.patchWithRegEx(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for a matching HTTP request
   *
   * @param pattern: pattern to match
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.allWithRegEx = function(pattern, handler) {
    j_rm.allWithRegEx(pattern, wrappedRequestHandler(handler));
    return this;
  }

  /**
   * Specify a handler that will be called for HTTP request that not match any pattern.
   *
   * @param handler: http server request handler
   * @return {RouteMatcher}
   */
  this.noMatch = function(handler) {
    j_rm.noMatch(wrappedRequestHandler(handler));
    return this;
  }
  /**
   *
   * @returns {org.vertx.java.core.http.RouteMatcher}
   * @private
   */
  this._to_java_handler = function() {
    return j_rm;
  }
}

function wrapMultiMap(j_map) {
  var map = {}

  /**
   * Return the value for the given name
   *
   * @param name
   * @returns value The value for the given name
   */
  map.get = function(name) {
    return j_map.get(name);
  }

  /**
   * Execute the given function for every name, value pair stored
   *
   * @param func The function to execute
   */
  map.forEach = function(func) {
    var names = j_map.names().iterator();
    while (names.hasNext()) {
      var name = names.next();
      var values = j_map.getAll(name).iterator();
      while (values.hasNext()) {
        func(name, values.next());
      }
    }
  }

  /**
   * Return all values store for the given name.
   *
   * @param name The name to lookup values for
   * @returns {Array} The values for the given name
   */
  map.getAll = function(name) {
    var n =  j_map.getAll(name);
    return _convertToArray(n);
  }

  /**
   * Returns if a value for the given name is stored
   *
   * @param name The name to check for
   * @returns {boolean}
   */
  map.contains = function(name) {
    return j_map.contains(name);
  }

  /**
   * Returns if this map is empty
   *
   * @returns {boolean}
   */
  map.isEmpty = function() {
    return j_map.isEmpty();
  }

  /**
   * Return all names for which values are stored
   *
   * @returns {Array} The names for which values are stored
   */
  map.names = function() {
    var n =  j_map.names();
    return _convertToArray(n);
  }

  /**
   * Add a value for the given name
   *
   * @param name The name under which the value should be stored
   * @param value The value to store
   * @returns map
   */
  map.add = function(name, value) {
    j_map.add(name, value);
    return this;
  }

  /**
   * Set a value for the given name. All previous stored values under the name will get deleted.
   *
   * @param name The name under which the value should be stored
   * @param value The value to store
   * @returns map
   */
  map.set = function(name, value) {
    j_map.set(name, value);
    return this;
  }

  /**
   * Set the content of the given map.
   *
   * @param map The map to set
   * @returns map
   */
  map.setMap = function(map) {
    j_map.set(map._jmap);
    return this;
  }

  /**
   * Remove all values stored under the name
   *
   * @param name The name for which all values should be removed
   * @returns map
   */
  map.remove = function(name) {
    j_map.remove(name);
    return this;
  }

  /**
   * Clear the map
   *
   * @returns map
   */
  map.clear = function() {
    j_map.clear();
    return this;
  }

  /**
   * Return the number of names stored.
   * @returns {*}
   */
  map.size = function() {
    return j_map.size();
  }

  /**
   * @private
   */
  map._jmap = j_map;
  return map;
}


/**
 *
 * @param j_col
 * @returns {Array}
 * @private
 */
function _convertToArray(j_col) {
  var n = j_col.iterator();
  var array = new Array();
  var i = 0;

  while (n.hasNext()) {
    array[i++] = n.next();
  }
  return array;
}

module.exports = http;
