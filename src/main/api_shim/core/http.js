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

if (!vertx.createHttpServer) {

  (function() {

    function wrappedRequestHandler(handler) {
      return function(j_req) {

        //We need to add some functions to the request and the response

        var reqHeaders = null;
        var reqParams = null;

        var req = {
          method: function() {
            return j_req.method();
          },
          uri: function() {
            return j_req.uri();
          },
          path: function() {
            return j_req.path();
          },
          query: function() {
            return j_req.query();
          },
          headers: function() {
            if (!reqHeaders) {
              reqHeaders = new org.vertx.java.platform.impl.ScriptableMap(j_req.headers());
            }
            return reqHeaders;
          },
          params: function() {
            if (!reqParams) {
              reqParams = new org.vertx.java.platform.impl.ScriptableMap(j_req.params());
            }
            return reqParams;
          },
          remoteAddress: function() {
            return j_req.remoteAddress();
          },
          peerCertificateChain: function() {
            return j_req.peerCertificateChain();
          },
          absoluteURI: function() {
            return j_req.absoluteURI();
          },
          bodyHandler: function(handler) {
            j_req.bodyHandler(handler);
            return req;
          }
        };

        addReadStreamFunctions(req, j_req);

        var j_resp = j_req.response();
        var respHeaders = null;
        var respTrailers = null;

        var resp = {
          statusCode: function(code) {
            if (code) {
              j_resp.setStatusCode(code);
              return resp;
            } else {
              return j_resp.getStatusCode();
            }
          },
          statusMessage: function(msg) {
            if (msg) {
              j_resp.setStatusMessage(msg);
              return resp;
            } else {
              return j_resp.getStatusMessage();
            }
          },
          chunked: function(ch) {
            if (ch) {
              j_resp.setChunked(ch);
              return resp;
            } else {
              return j_resp.isChunked();
            }
          },
          headers: function() {
            if (!respHeaders) {
              respHeaders = new org.vertx.java.platform.impl.ScriptableMap(j_resp.headers());
            }
            return respHeaders;
          },
          putHeader: function(k, v) {
            j_resp.putHeader(k, v);
            return resp;
          },
          putAllHeaders: function(other) {
            var hdrs = resp.headers();
            for (var k in other) {
              hdrs[k] = other[k];
            }
            return resp;
          },
          trailers: function() {
            if (!respTrailers) {
              respTrailers = new org.vertx.java.platform.impl.ScriptableMap(j_resp.trailers());
            }
            return respTrailers;
          },
          putTrailer: function(k, v) {
            j_resp.putTrailer(k, v);
            return resp;
          },
          putAllTrailers: function(other) {
            var trlrs = resp.trailers();
            for (var k in other) {
              trlrs[k] = other[k];
            }
            return resp;
          },
          write: function(arg0, arg1, arg2) {
            if (arg1) {
              if (arg2) {
                j_resp.write(arg0, arg1, arg2);
              } else {
                j_resp.write(arg0, arg1);
              }
            } else {
              j_resp.write(arg0);
            }
            return resp;
          },
          sendHead: function() {
            j_resp.sendHead();
            return resp;
          },
          end: function(arg0, arg1) {
            if (arg0) {
              if (arg1) {
                j_resp.end(arg0, arg1);
              } else {
                j_resp.end(arg0);
              }
            } else {
              j_resp.end();
            }
          },
          sendFile: function(fileName) {
            j_resp.sendFile(fileName);
            return resp;
          }
        }

        addWriteStreamFunctions(resp, j_resp);
        req.response = resp;

        handler(req);
      }
    }

    vertx.createHttpServer = function() {

      var j_server = org.vertx.java.platform.impl.RhinoVerticleFactory.vertx.createHttpServer();

      var server = {
        requestHandler: function(handler) {

          if (handler) {

            if (typeof handler === 'function') {
              handler = wrappedRequestHandler(handler);
            } else {
              // It's a route matcher
              handler = handler._to_java_handler();
            }

            j_server.requestHandler(handler);
          }
          return server;
        },
        websocketHandler: function(handler) {
          if (handler) {
            j_server.websocketHandler(handler);
          }
          return server;
        },
        close: function(handler) {
          if (handler) {
            j_server.close(handler);
          } else {
            j_server.close();
          }
        },
        listen: function(port, host) {
          if (host) {
            j_server.listen(port, host);
          } else {
            j_server.listen(port);
          }
          return server;
        },
        clientAuthRequired: function(required) {
          if (required === undefined) {
            return j_server.isClientAuthRequired();
          } else {
            j_server.setClientAuthRequired(required);
            return server;
          }
        }
      }

      addSSLFunctions(server, j_server);
      addTCPFunctions(server, j_server);

      return server;
    }

    vertx.createHttpClient = function() {
      var j_client = org.vertx.java.platform.impl.RhinoVerticleFactory.vertx.createHttpClient();

      function wrapResponseHandler(handler) {
        var wrapperHandler = function(j_resp) {

          var respHeaders = null;
          var respTrailers = null;

          var resp = {

            statusCode: function() {
              return j_resp.statusCode();
            },
            statusMessage: function() {
              return j_resp.statusMessage();
            },
            headers: function() {
              if (!respHeaders) {
                respHeaders = new org.vertx.java.platform.impl.ScriptableMap(j_resp.headers());
              }
              return respHeaders;
            },
            trailers: function() {
              if (!respTrailers) {
                respTrailers = new org.vertx.java.platform.impl.ScriptableMap(j_resp.trailers());
              }
              return respTrailers;
            },
            cookies: function() {
              return j_resp.cookies();
            },
            bodyHandler: function(handler) {
              j_resp.bodyHandler(handler);
              return resp;
            }
          };

          addReadStreamFunctions(resp, j_resp);

          handler(resp);
        }
        return wrapperHandler;
      }

      function wrapRequest(j_req) {

        var reqHeaders = null;

        var req = {
          chunked: function(ch) {
            if (ch === undefined) {
              return j_req.isChunked();
            } else {
              j_req.setChunked(ch);
            }
          },
          headers: function() {
            if (!reqHeaders) {
              reqHeaders = new org.vertx.java.platform.impl.ScriptableMap(j_req.headers());
            }
            return reqHeaders;
          },
          putHeader: function(k, v) {
            j_req.putHeader(k, v);
            return req;
          },
          putAllHeaders: function(other) {
            var hdrs = wrapped.headers();
            for (var k in other) {
              hdrs[k] = other[k];
            }
            return req;
          },
          write: function(arg0, arg1, arg2) {
            if (arg1) {
              if (arg2) {
                j_req.write(arg0, arg1, arg2);
              } else {
                j_req.write(arg0, arg1);
              }
            } else {
              j_req.write(arg0);
            }
            return req;
          },
          continueHandler: function(handler) {
            j_req.continueHandler(handler);
            return req;
          },
          sendHead: function() {
            j_req.sendHead();
            return req;
          },
          end: function(arg0, arg1) {
            if (arg0) {
              if (arg1) {
                j_req.end(arg0, arg1);
              } else {
                j_req.end(arg0);
              }
            } else {
              j_req.end();
            }
          },
          timeout: function(t) {
            j_req.setTimeout(t);
          },
          writeBuffer: function(buff) {
            j_req.writeBuffer(buff);
            return req;
          }
        };
        addWriteStreamFunctions(req, j_req);
        return req;
      }

      var client = {
        exceptionHandler: function(handler) {
          j_client.exceptionHandler(handler);
          return client;
        },
        maxPoolSize: function(size) {
          if (size === undefined) {
            return j_client.getMaxPoolSize();
          } else {
            j_client.setMaxPoolSize(size);
            return client;
          }
        },
        keepAlive: function(ka) {
          if (ka === undefined) {
            return j_client.isKeepAlive();
          } else {
            j_client.setKeepAlive(ka);
            return client;
          }
        },
        trustAll: function(ta) {
          if (ta === undefined) {
            return j_client.isTrustAll();
          } else {
            j_client.setTrustAll(ta);
            return client;
          }
        },
        port: function(p) {
          if (p === undefined) {
            return j_client.getPort();
          } else {
            j_client.setPort(p);
            return client;
          }
        },
        host: function(h) {
          if (h === undefined) {
            return j_client.getHost();
          } else {
            j_client.setHost(h);
            return client;
          }
        },
        connectWebsocket: function(uri, handler) {
          j_client.connectWebsocket(uri, handler);
        },
        getNow: function(uri, handler) {
          return wrapRequest(j_client.getNow(uri, wrapResponseHandler(handler)));
        },
        options: function(uri, handler) {
          return wrapRequest(j_client.options(uri, wrapResponseHandler(handler)));
        },
        get: function(uri, handler) {
          return wrapRequest(j_client.get(uri, wrapResponseHandler(handler)));
        },
        head: function(uri, handler) {
          return wrapRequest(j_client.head(uri, wrapResponseHandler(handler)));
        },
        post: function(uri, handler) {
          return wrapRequest(j_client.post(uri, wrapResponseHandler(handler)));
        },
        put: function(uri, handler) {
          return wrapRequest(j_client.put(uri, wrapResponseHandler(handler)));
        },
        delete: function(uri, handler) {
          return wrapRequest(j_client.delete(uri, wrapResponseHandler(handler)));
        },
        trace: function(uri, handler) {
          return wrapRequest(j_client.trace(uri, wrapResponseHandler(handler)));
        },
        connect: function(uri, handler) {
          return wrapRequest(j_client.connect(uri, wrapResponseHandler(handler)));
        },
        patch: function(uri, handler) {
          return wrapRequest(j_client.patch(uri, wrapResponseHandler(handler)));
        },
        request: function(method, uri, handler) {
          return wrapRequest(j_client.request(method, uri, wrapResponseHandler(handler)));
        },
        close: function() {
          j_client.close();
        }
      };

      addSSLFunctions(client, j_client);
      addTCPFunctions(client, j_client);

      return client;
    }

    vertx.RouteMatcher = function() {

      var j_rm = new org.vertx.java.core.http.RouteMatcher();

      this.get = function(pattern, handler) {
        j_rm.get(pattern, wrappedRequestHandler(handler));
      }

      this.put = function(pattern, handler) {
        j_rm.put(pattern, wrappedRequestHandler(handler));
      }

      this.post = function(pattern, handler) {
        j_rm.post(pattern, wrappedRequestHandler(handler));
      }

      this.delete = function(pattern, handler) {
        j_rm.delete(pattern, wrappedRequestHandler(handler));
      }

      this.options = function(pattern, handler) {
        j_rm.options(pattern, wrappedRequestHandler(handler));
      }

      this.head = function(pattern, handler) {
        j_rm.head(pattern, wrappedRequestHandler(handler));
      }

      this.trace = function(pattern, handler) {
        j_rm.trace(pattern, wrappedRequestHandler(handler));
      }

      this.connect = function(pattern, handler) {
        j_rm.connect(pattern, wrappedRequestHandler(handler));
      }

      this.patch = function(pattern, handler) {
        j_rm.patch(pattern, wrappedRequestHandler(handler));
      }

      this.all = function(pattern, handler) {
        j_rm.all(pattern, wrappedRequestHandler(handler));
      }

      this.getWithRegEx = function(pattern, handler) {
        j_rm.getWithRegEx(pattern, wrappedRequestHandler(handler));
      }

      this.putWithRegEx = function(pattern, handler) {
        j_rm.putWithRegEx(pattern, wrappedRequestHandler(handler));
      }

      this.postWithRegEx = function(pattern, handler) {
        j_rm.postWithRegEx(pattern, wrappedRequestHandler(handler));
      }

      this.deleteWithRegEx = function(pattern, handler) {
        j_rm.deleteWithRegEx(pattern, wrappedRequestHandler(handler));
      }

      this.optionsWithRegEx = function(pattern, handler) {
        j_rm.optionsWithRegEx(pattern, wrappedRequestHandler(handler));
      }

      this.headWithRegEx = function(pattern, handler) {
        j_rm.headWithRegEx(pattern, wrappedRequestHandler(handler));
      }

      this.traceWithRegEx = function(pattern, handler) {
        j_rm.traceWithRegEx(pattern, wrappedRequestHandler(handler));
      }

      this.connectWithRegEx = function(pattern, handler) {
        j_rm.connectWithRegEx(pattern, wrappedRequestHandler(handler));
      }

      this.patchWithRegEx = function(pattern, handler) {
        j_rm.patchWithRegEx(pattern, wrappedRequestHandler(handler));
      }

      this.allWithRegEx = function(pattern, handler) {
        j_rm.allWithRegEx(pattern, wrappedRequestHandler(handler));
      }

      this.noMatch = function(handler) {
        j_rm.noMatch(wrappedRequestHandler(handler));
      }

      this._to_java_handler = function() {
        return j_rm;
      }

    }

    function addReadStreamFunctions(obj, jobj) {
      obj.dataHandler = function(handler) {
        jobj.dataHandler(handler);
        return obj;
      };
      obj.pause = function() {
        j_obj.pause();
      };
      obj.resume = function() {
        j_obj.resume();
      };
      obj.exceptionHandler = function(handler) {
        jobj.exceptionHandler(handler);
        return obj;
      };
      obj.endHandler = function(handler) {
        jobj.endHandler(handler);
        return obj;
      };
    }

    function addWriteStreamFunctions(obj, jobj) {
      obj.writeBuffer = function(buffer) {
        jobj.writeBuffer(buffer);
        return obj;
      };
      obj.writeQueueMaxSize = function(maxSize) {
        jobj.setWriteQueueMaxSize(maxSize);
        return obj;
      };
      obj.writeQueueFull = function() {
        return j_resp.isWriteQueueFull();
      };
      obj.drainHandler = function(handler) {
        jobj.drainHandler(handler);
        return obj;
      };
      obj.exceptionHandler = function(handler) {
        jobj.exceptionHandler(handler);
        return obj;
      };
    }

    function addSSLFunctions(obj, jobj) {

      obj.ssl = function(ssl) {
        if (ssl === undefined) {
          return jobj.isSSL();
        } else {
          jobj.setSSL(ssl);
          return obj;
        }
      }

      obj.keyStorePath = function(path) {
        if (path === undefined) {
          return jobj.getKeyStorePath();
        } else {
          jobj.setKeyStorePath(path);
          return obj;
        }
      }

      obj.keyStorePassword = function(password) {
        if (password === undefined) {
          return jobj.getKeyStorePassword();
        } else {
          jobj.setKeyStorePassword(password);
          return obj;
        }
      }

      obj.trustStorePath = function(path) {
        if (path === undefined) {
          return jobj.getTrustStorePath();
        } else {
          jobj.setTrustStorePath(path);
          return obj;
        }
      }

      obj.trustStorePassword = function(password) {
        if (password === undefined) {
          return jobj.getTrustStorePassword();
        } else {
          jobj.setTrustStorePassword(password);
          return obj;
        }
      }
    }

    function addTCPFunctions(obj, jobj) {
      obj.tcpNoDelay = function(noDelay) {
        if (noDelay === undefined) {
          return jobj.isTCPNoDelay();
        } else {
          jobj.setTCPNoDelay(tcpNoDelay);
          return obj;
        }
      }

      obj.sendBufferSize = function(size) {
        if (size === undefined) {
          return jobj.getSendBufferSize();
        } else {
          jobj.setSendBufferSize(size);
          return obj;
        }
      }

      obj.receiveBufferSize = function(size) {
        if (size === undefined) {
          return jobj.getReceiveBufferSize();
        } else {
          jobj.setReceiveBufferSize(size);
          return obj;
        }
      }

      obj.tcpKeepAlive = function(keepAlive) {
        if (keepAlive === undefined) {
          return jobj.isTCPKeepAlive();
        } else {
          jobj.setTCPKeepAlive(keepAlive);
          return obj;
        }
      }

      obj.setReuseAddress = function(reuse) {
        if (reuse === undefined) {
          return jobj.isReuseAddress();
        } else {
          jobj.setReuseAddress(reuse);
          return obj;
        }
      }

      obj.soLinger = function(linger) {
        if (linger === undefined) {
          return jobj.isSoLinger();
        } else {
          jobj.setSoLinger(linger);
          return obj;
        }
      }

      obj.trafficClass = function(cls) {
        if (cls === undefined) {
          return jobj.getTrafficClass();
        } else {
          jobj.setTrafficClass(cls);
          return obj;
        }
      }
    }
  })();
}
