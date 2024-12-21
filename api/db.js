// const Pool = require('pg').Pool;

// const pool = new Pool({
//     user:'postgres',
//     password:'root',
//     host:'127.0.0.1',
//     port:5432,
//     database:'Braniac_Blast'
// });

// const { Pool } = require('pg')
// require('dotenv').config()

// const pool = new Pool({
//     connectionString: process.env.PG_URL,
// })
// module.exports = pool;
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
