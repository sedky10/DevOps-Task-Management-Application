const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  user: 'postgres', 
  host: 'localhost',
  database: 'postgres_db', 
  password: 'password',
  port: 5432,
});

pool.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    completed BOOLEAN DEFAULT false
  )
`)
.then(() => console.log("Tasks table created"))
.catch(err => console.error("Error creating table", err));

app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  try {
    const result = await pool.query('INSERT INTO tasks (title) VALUES ($1) RETURNING *', [title]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  try {
    const result = await pool.query('UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 RETURNING *', [title, completed, id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(8000, () => {
  console.log('Server running on port 8000');
});
