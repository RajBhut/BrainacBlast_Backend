

const express = require('express');
const app = express();
const pool = require('./db');
const cors = require('cors');
const bcrypt = require('bcrypt');

const port = 3000;


app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

app.get('/api', async (req, res) => {
  try {
    const query = 'SELECT * FROM login';
    const allData = await pool.query(query);
    console.log(allData.rows);
    res.json(allData.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/api/:id', async (req, res) => {
  console.log(req.params.id)
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM questions WHERE 	generation_code = $1';
    if (query.lengthq == 0) return res.status(404).json({ message: 'Not found' });
    const data = await pool.query(query, [id]);
    console.log(data.rows);
    res.json(data.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
})

app.post('/signup', async (req, res) => {
  try {
    const { email, password ,username } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    
    const existingUser = await pool.query('SELECT * FROM login WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

   
    

    // Insert user into database
    const newUser = await pool.query('INSERT INTO login ( username ,email, password) VALUES ($1, $2 ,$3)', [ username,email, password]);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});
app.post('/login', async (req, res) => {
  try {
    const { email, password  , username} = req.body;

    // Basic validation (replace with more checks as needed)
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await pool.query('SELECT * FROM login WHERE email = $1', [email]);

    if (!user.rows[0]) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    

    const validPassword = await pool.query('SELECT * FROM login WHERE email = $1 AND password = $2', [email, password]);

   validPassword = validPassword.rows[0].password === password;
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful' } );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/quizzes', async (req, res) => {
  try {
    const query = 'SELECT MAX(GENERATION_CODE) FROM questions';
    const data = await pool.query(query);
    console.log(data);
    res.json(data.rows[0].generation_code +1);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }

}
);

app.post('/quizzes', async (req, res) => {
  
    let { questions  } = req.body;
   

    questions = questions.filter((question) => {
      return !(question.question  === '' || question.opt1  == ''|| question.opt2 == '' || question.opt3 == '' || !question.opt4 || question.ans == ''    || question.generation_code == '');
    }); 
      if(questions.length == 0) return res.status(400).json({ message: 'Please provide all fields' } );


    const query = 'INSERT INTO questions (question , opt1 ,opt2 , opt3 , opt4 , ans , user_name , generation_code ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
const values = questions.map(question => [
  question.question,
  question.opt1,
  question.opt2,
  question.opt3,
  question.opt4,
  question.ans,
  question.user_name,
  question.generation_code
]);
try{
const newQuiz = await Promise.all(values.map(value => pool.query(query, value)));
res.status(201).json({ newQuiz });










  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});








app.get('/', (req, res) => {
  res.send('Hello World!');
});





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
