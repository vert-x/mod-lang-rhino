function tcpSupport(server, jserver) {
  /**
   * Set / get TCP_NO_DELAY
   *
   * @param nodelay: if true TCP_NO_DELAY will be enabled
   * @returns {*}
   */
  server.tcpNoDelay = function(nodelay) {
    if (nodelay === undefined) {
      return jserver.isTCPNoDelay();
    } else {
      jserver.setTCPNoDelay(nodelay);
      return server;
    }
  };

  /**
   * Set / get the TCP send buffer size.
   *
   * @param size: The size in bytes.
   * @returns {*}
   */
  server.sendBufferSize = function(size) {
    if (size === undefined) {
      return jserver.getSendBufferSize();
    } else {
      jserver.setSendBufferSize(size);
      return server;
    }
  };

  /**
   * Set / get the TCP receive buffer size.
   *
   * @param size: The size in bytes.
   * @returns {*}
   */
  server.receiveBufferSize = function(size) {
    if (size === undefined) {
      return jserver.getReceiveBufferSize();
    } else {
      jserver.setReceiveBufferSize(size);
      return server;
    }
  };

  /**
   * Set / get the TCP keep alive setting.
   *
   * @param keepAlive: If true, then TCP keep alive will be enabled.
   * @returns {*}
   */
  server.tcpKeepAlive = function(keepAlive) {
    if (keepAlive === undefined) {
      return jserver.isTCPKeepAlive();
    } else {
      jserver.setTCPKeepAlive(keepAlive);
      return server;
    }
  };

  /**
   * Set / get the TCP reuse address setting.
   *
   * @param reuse: If true, then TCP reuse address will be enabled.
   * @returns {*}
   */
  server.reuseAddress = function(reuse) {
    if (reuse === undefined) {
      return jserver.isReuseAddress();
    } else {
      jserver.setReuseAddress(reuse);
      return server;
    }
  };

  /**
   * Set / get the TCP so linger setting.
   *
   * @param linger: If true, then TCP so linger will be enabled.
   * @returns {*}
   */
  server.soLinger = function(linger) {
    if (linger === undefined) {
      return jserver.isSoLinger();
    } else {
      jserver.setSoLinger(linger);
      return server;
    }
  };

  /**
   * Set / get the TCP traffic class setting.
   *
   * @param cls: The TCP traffic class setting.
   * @returns {*}
   */
  server.trafficClass = function(cls) {
    if (cls === undefined) {
      return jserver.getTrafficClass();
    } else {
      jserver.setTrafficClass(cls);
      return server;
    }
  };

  /**
   * Set if vert.x should use pooled buffers for performance reasons.
   * Doing so will give the best throughput but may need a bit higher memory footprint.
   *
   * @param use: if true pooled buffers will be used.
   * @returns {*}
   */
  server.usePooledBuffers = function(use) {
    if (use === undefined) {
      return jserver.isUsedPooledBuffers();
    } else {
      jserver.setUsePooledBuffers(use);
      return server;
    }
  };
}

function serverTcpSupport(server, jserver) {
  /**
   * Set / get the accept backlog
   *
   * @param backlog set the accept backlog to the value
   * @returns {*}
   */
  server.acceptBacklog = function(backlog) {
    if (backlog === undefined) {
      return jserver.getAcceptBacklog();
    } else {
      jserver.setAcceptBacklog(backlog);
      return server;
    }
  };
}