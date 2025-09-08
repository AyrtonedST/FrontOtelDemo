const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

// Servir archivos estáticos desde build
app.use(express.static(path.join(__dirname, 'build')));

// Para que funcione el enrutado del frontend (SPA)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
