

// const Pool = require('pg').Pool;

// const pool = new Pool({
//     user:'postgres',
//     password:'root',
//     host:'127.0.0.1',
//     port:5432,
//     database:'Braniac_Blast'
// });


const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.PG_URL,
})
module.exports = pool;
