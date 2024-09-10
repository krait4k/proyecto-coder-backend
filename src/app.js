const express = require('express');
const app = express();

app.use(express.json());

const productsRouter = require('./routes/productos.js');
const cartsRouter = require('./routes/carrito.js');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


const fs = require('fs').promises;
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productos.json');
const cartsFilePath = path.join(__dirname, '../data/carrito.json');

const readFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error al leer el archivo ${filePath}:`, error);
    return [];
  }
};

const writeFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error al escribir en el archivo ${filePath}:`, error);
  }
};

module.exports = {
  productsFilePath,
  cartsFilePath,
  readFile,
  writeFile,
};