
function sslSupport(jsObj, jObj) {
  /**
   * Set or get whether the server or client will use SSL.
   *
   * @param ssl If true then ssl will be used.
   * @returns {*}
   */
  jsObj.ssl = function(ssl) {
    if (ssl === undefined) {
      return jObj.isSSL();
    } else {
      jObj.setSSL(ssl);
      return jsObj;
    }
  };

  /**
   * Set org get the path to the SSL key store. This method should only be used with the client/server in SSL mode, i.e. after {#ssl=}
   * has been set to true.
   * The SSL key store is a standard Java Key Store, and should contain the client/server certificate. For a client, it's only necessary to supply
   * a client key store if the server requires client authentication via client certificates.
   *
   * @param path: The path to the key store
   * @returns {*}
   */
  jsObj.keyStorePath = function(path) {
    if (path === undefined) {
      return jObj.getKeyStorePath();
    } else {
      jObj.setKeyStorePath(path);
      return jsObj;
    }
  };

  /**
   * Set org get the password for the SSL key store. This method should only be used with the client in SSL mode, i.e. after ssl
   * has been set to true.
   *
   * @param password The password
   * @returns {*}
   */
  jsObj.keyStorePassword = function(password) {
    if (password === undefined) {
      return jObj.getKeyStorePassword();
    } else {
      jObj.setKeyStorePassword(password);
      return jsObj;
    }
  };

  /**
   * Set or get the path to the SSL trust store. This method should only be used with the client/server in SSL mode, i.e. after {#ssl=}
   * has been set to true.
   * The SSL trust store is a standard Java Key Store, and should contain the certificate(s) of the clients/servers that the server/client trusts. The SSL
   * handshake will fail if the server provides a certificate that the client does not trust, or if client authentication is used,
   * if the client provides a certificate the server does not trust.
   *
   * @param path The path to the trust store
   * @returns {*}
   */
  jsObj.trustStorePath = function(path) {
    if (path === undefined) {
      return jObj.getTrustStorePath();
    } else {
      jObj.setTrustStorePath(path);
      return jsObj;
    }
  };

  /**
   * Set or get the password for the SSL trust store. This method should only be used in set mode when the client is in SSL mode.
   *
   * @param password: The password.
   * @returns {*}
   */
  jsObj.trustStorePassword = function(password) {
    if (password === undefined) {
      return jObj.getTrustStorePassword();
    } else {
      jObj.setTrustStorePassword(password);
      return jsObj;
    }
  };
}

function serverSslSupport(jsObj, jObj) {
  /**
   * Client authentication is an extra level of security in SSL, and requires clients to provide client certificates.
   * Those certificates must be added to the server trust store.
   *
   * @param {*}: If true then the server will request client authentication from any connecting clients, if they
   * do not authenticate then they will not make a connection.
   * @returns {*}
   */
  jsObj.clientAuthRequired = function(required) {
    if (required === undefined) {
      return jObj.isClientAuthRequired();
    } else {
      jObj.setClientAuthRequired(required);
      return jsObj;
    }
  };
}

function clientSslSupport(jsObj, jObj) {
  /**
   * Should the client trust ALL server certificates?
   *
   * @param all: all val is set to true then the client will trust ALL server certificates and will not attempt to authenticate them
   * against it's local client trust store. The default value is false.
   * Use this method with caution!
   * @returns {*}
   */
  jsObj.trustAll = function(all) {
    if (all === undefined) {
      return jObj.isTrustAll();
    } else {
      jObj.setTrustAll(all);
      return jsObj;
    }
  };
}
