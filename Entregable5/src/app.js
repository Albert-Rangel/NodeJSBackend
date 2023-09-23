import express from "express"
import handlebars from "express-handlebars"
import { Server } from 'socket.io'
import __dirname from './utils.js'
import ProductRoutes from './router/product.routes.js'
import CartRoutes from './router/cart.routes.js'
import ViewsRouter from './router/views.routes.js'
import ProductManager from './ProductManager.js'

const productManager = new ProductManager('./src/models/productos.json');
const port = 8080
const app = express()

//Creacion del servidorHTTP
const HTTPserver = app.listen(port, () =>
  console.log(`Port listening on port ${HTTPserver.address().port}`)
);

//Creacion del servidor con Socketio
const Socketserverio = new Server(HTTPserver)

//Mi socketSServer a la escucha
Socketserverio.on('connection', async (socket) => {

  console.log(`client connected with id ${socket.id}`)

  const productList = await productManager.getProducts();

  Socketserverio.emit('AllProducts', productList)

  socket.on('sendNewProduct', async (newP) => {
    let description = newP.description;
    let title = newP.title;
    let price = parseInt(newP.price, 10);
    let thumbnail = newP.thumbnail;
    let code = newP.code;
    let stock = parseInt(newP.stock, 10);
    let status = newP.status.checked;
    let category = newP.category;

    const newProduct = {
      description: newP.description,
      title: newP.title,
      price: parseInt(newP.price, 10),
      thumbnail: newP.thumbnail,
      code: newP.code,
      stock: parseInt(newP.stock, 10),
      status: newP.status,
      category: newP.category,

    }
    await productManager.addProduct(newProduct);
    const productList = await productManager.getProducts();
    Socketserverio.emit('AllProducts', productList)
  })

  socket.on('functionDeleteProduct', async (idp) => {
    await productManager.deleteProduct(idp);
    const productList = await productManager.getProducts();
    Socketserverio.emit('AllProducts', productList)
  })

})



HTTPserver.on("error", (error) => console.log`Server error ${error}`)

//Seccion de handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

//Seccion de Static
app.use(express.static(__dirname + "/public"))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api/products', ProductRoutes)
app.use('/api/carts', CartRoutes)
app.use('/', ViewsRouter)

