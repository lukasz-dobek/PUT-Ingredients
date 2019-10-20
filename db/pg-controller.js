const { Client } = require('pg')

const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: 'super456',
    database: 'postgres'
})

client.connect((err) => {
  client.query("SELECT current_database();").then(res => console.log(res.rows[0])).catch(e => console.log(e));

    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected')
    }
});

module.exports = client;