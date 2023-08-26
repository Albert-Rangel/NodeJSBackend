import express from "express"
const port = 8080
const app = express()
import ProductRoutes from './router/product.routes.js'
import CartRoutes  from './router/cart.routes.js'

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api/products', ProductRoutes)
app.use('/api/carts', CartRoutes)

const server = app.listen(port, () =>
  console.log(`Port listening on port ${server.address().port}`)
);

server.on("error", (error) => console.log`Server error ${error}`)
