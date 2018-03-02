/* -----------------------------------------------------------------------------
 *  CONFIG-ME 
 * -----------------------------------------------------------------------------
 *  Connections per environment
 * -------------------------------------------------------------------------- */

module.exports = {

  /* ***************************************************************************
   *  LOCAL - Keep here all your local connection info
   * ************************************************************************ */
  dev: {
    dw: {
      type: 'vertica',
      JNDI: 'TTLLA_DW',
      databaseName: "tarantulla",
      port: "5433",
      hostname: 'localhost',
      user: 'dbadmin',
      password: 'password'
    },
    staging: {
      type: 'postgres',
      JNDI: 'TTLLA_STG',
      databaseName: "tarantulla",
      port: "5432",
      hostname: 'localhost',
      user: 'postgres',
      password: 'password'
    }
  },

  /* ***************************************************************************
   *  PRODUCTION - Keep here all the production hot info
   * ************************************************************************ */
  production: {
    dw: {
      type: 'vertica',
      JNDI: 'TTLLA_DW',
      databaseName: "tarantulla",
      port: "5433",
      hostname: 'localhost',
      user: 'dbadmin',
      password: 'password'
    },
    staging: {
      type: 'postgres',
      JNDI: 'TTLLA_STG',
      databaseName: "tarantulla",
      port: "5432",
      hostname: 'localhost',
      user: 'postgres',
      password: 'password'
    }
  }

};
