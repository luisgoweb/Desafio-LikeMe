const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Conexión a la base de datos PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'likeme',
  password: 'postgres',
  port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json()); // Para parsear json

app.get('/', (req, res) => {
  res.send('Servidor Express funcionando correctamente');
});

// Ruta GET para obtener todos los posts
app.get('/posts', async (req, res) => {
  try {
    const allPosts = await pool.query('SELECT * FROM posts');
    res.json(allPosts.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Ruta POST para crear un nuevo post
app.post('/posts', async (req, res) => {
  const post = { 
    titulo: req.body.titulo,
    img: req.body.url,
    descripcion: req.body.descripcion
   };

  try {
    const result = await agregarPost(post);
    return res.status(201).json({ok:true, message: 'Post agregado con exito', result});
  } catch (error) {
    const { status, message } = handleErrors(error.code);
    return res.status(status).json({ok:false, result: message});
  }
});




// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor andando en http://localhost:${port}`);
});