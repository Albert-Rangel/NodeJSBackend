const express = require("express")
const port = 8080
const app = express()
const ProductManager = require('./ProductManager.js')
const productManager = new ProductManager('./productos.json');
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/products', async function (req, res) {
  const limit = req.query.limit;
  const productObject = await productManager.getProducts();
  if (limit) {

    return res.send(productObject.slice(0, limit));
  }
  return res.send(productObject);
});

app.get('/products/:pid', async function (req, res) {
  const pid = parseInt(req.params.pid, 10)
  const productObject = await productManager.getProductById(pid);
  const isString = (value) => typeof value === 'string';
  if (isString(productObject)) {
    return res.status(404).send( {
      error: productObject
    })
  }

  if (productObject === undefined) {
    return res.status(404).send( {
      error: "El producto no existe"
    })
  }

  return res.send(productObject);
});

const server = app.listen(port, () =>
  console.log(`Port listening on port ${server.address().port}`)
);

server.on("error", (error) => console.log`Server error ${error}`)
