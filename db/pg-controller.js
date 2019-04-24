const { Client } = require('pg')
const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'super456',
    database: 'sandbox'
})

client.connect((err) => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected')
    }
});

// client.query('SELECT * FROM recipes;', (err, res) => {
//     if (err) throw err;
//     console.log(res.rows[0]['recipe_name']);
// });

module.exports = client;