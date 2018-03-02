/* -----------------------------------------------------------------------------
 *  CONFIG-ME 
 * -----------------------------------------------------------------------------
 *  Paths and available connections on each container
 * -------------------------------------------------------------------------- */

var conn = require("./connections");

var prodCon = conn.production;
var devCon = conn.dev;

module.exports = {
  repoJDBCFolder: "../jdbc",
  production: {
    server: {
      url: 'http://localhost:8080/pentaho',
      path: '/opt/pentaho/server/pentaho-server',
      connections: [prodCon.dw],
      auth: {
        user: 'admin',
        pass: 'password'
      }
    },
    pdi: {
      path: '/opt/pentaho/design-tools/data-integration',
      connections: [prodCon.dw, prodCon.staging]
    }
  },
  dev: {
    server: {
      url: 'http://localhost:8080/pentaho',
      path: '/opt/pentaho/server/pentaho-server',
      connections: [localCon.dw],
      auth: {
        user: 'admin',
        pass: 'password'
      }
    },
    pdi: {
      path: '/opt/pentaho/design-tools/data-integration',
      connections: [devCon.dw, devCon.staging]
    }
  }
}