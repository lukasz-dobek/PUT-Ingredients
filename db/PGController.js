const { Pool, Client } = require('pg');

const poolConnectionOptions = {
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'super456',
  database: 'postgres',
};

const clientConnectionOptions = {
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'super456',
  database: 'postgres',
};

const dbCheckQS = `SELECT current_database() AS "Current_database", now() AS "Current_time", $1 AS "Mode";`;

const pool = new Pool(poolConnectionOptions);
// const client = new Client(clientConnectionOptions);

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

// client.connect(clientConnectError => {
//   console.log(`${new Date().toISOString()} - connecting PostgreSQL query client`);

//   if (clientConnectError) {
//     return console.error('Error acquiring query client:', poolConnectError.stack);
//   }
//   client.query(dbCheckQS, ["client"], (dbCheckQE, dbCheckQR) => {
//     if (dbCheckQE) {
//       return console.error('Error executing dbCheckQS query for client:', dbCheckQE.stack);
//     }
//     console.log(dbCheckQR.rows);
//   });
// });

module.exports = pool;
