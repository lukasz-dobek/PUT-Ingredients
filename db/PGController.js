const { Pool } = require('pg');

const poolConnectionOptions = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'super456',
  database: 'sandbox',
};

const dbCheckQS = `SELECT current_database() AS "Current_database", now() AS "Current_time", $1 AS "Mode";`;

const pool = new Pool(poolConnectionOptions);

pool.connect((poolConnectError, poolClient, poolRelease) => {
  console.log(`${new Date().toISOString()} - connecting PostgreSQL pool client`);
  if (poolConnectError) {
    return console.error('Error acquiring pool client:', poolConnectError.stack);
  }

  poolClient.query(dbCheckQS, ["pool"], (dbCheckQE, dbCheckQR) => {
    poolRelease();
    if (dbCheckQE) {
      return console.error('Error executing dbCheckQS query for pool:', dbCheckQE.stack);
    }
    console.log(dbCheckQR.rows);
  });
});

module.exports = pool;
