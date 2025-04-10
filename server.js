const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const TOMBS_FILE = path.join(__dirname, 'tombs.json');

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Ruta principal → devuelve el HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Obtener todas las tumbas
app.get('/api/tombs', (req, res) => {
  const data = fs.existsSync(TOMBS_FILE) ? fs.readFileSync(TOMBS_FILE, 'utf8') : '[]';
  res.json(JSON.parse(data));
});

// Añadir una nueva tumba
app.post('/api/tombs', (req, res) => {
  const tombs = fs.existsSync(TOMBS_FILE) ? JSON.parse(fs.readFileSync(TOMBS_FILE)) : [];
  tombs.push(req.body);
  fs.writeFileSync(TOMBS_FILE, JSON.stringify(tombs, null, 2));
  res.status(201).json({ message: 'Tumba añadida correctamente.' });
});

// Eliminar una tumba
app.delete('/api/tombs/:id', (req, res) => {
  const id = req.params.id;
  let tombs = fs.existsSync(TOMBS_FILE) ? JSON.parse(fs.readFileSync(TOMBS_FILE)) : [];
  tombs = tombs.filter(t => t.id !== id);
  fs.writeFileSync(TOMBS_FILE, JSON.stringify(tombs, null, 2));
  res.json({ message: 'Tumba eliminada correctamente.' });
});

// Editar una tumba
app.put('/api/tombs/:id', (req, res) => {
  const id = req.params.id;
  let tombs = fs.existsSync(TOMBS_FILE) ? JSON.parse(fs.readFileSync(TOMBS_FILE)) : [];
  tombs = tombs.map(t => (t.id === id ? req.body : t));
  fs.writeFileSync(TOMBS_FILE, JSON.stringify(tombs, null, 2));
  res.json({ message: 'Tumba actualizada correctamente.' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
