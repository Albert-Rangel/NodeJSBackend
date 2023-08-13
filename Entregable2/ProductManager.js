/*Implementar programa que contenga una clase llamada ProductManager que reciba el nombre del archivo con el que va a trabajar  */
const fs = require('fs');

class ProductManager {

  //La clase debe contar con una variable this.path.
  static id = 1;
  path;

  // La variable path se inicializara desde el constructor.
  constructor(path) {
    this.path = path,
      this.products = []
  }

  async readProducts() {
    const answer = await fs.promises.readFile(this.path, "utf-8");
    const ObjectAnswer = answer == '' ? [] : JSON.parse(answer);
    return ObjectAnswer;
  }

  /*Debe tener un metodo addProduct que recibe un OBJETO*/
  async addProduct(ObjectProduct) {

    try {

      if (!ObjectProduct.title || !ObjectProduct.description || !ObjectProduct.price || !ObjectProduct.thumbnail || !ObjectProduct.code || !ObjectProduct.stock) {
        return console.log('Todos los valores del producto tienen que ser enviados.');
      }

      /*Validar si existe o no el archivo, en caso de no existir se crea con el nuevo producto*/
      if (!fs.existsSync(this.path)) {

        /*Asignarle un id autoincrementable*/
        const object2 = Object.assign({ 'id': ProductManager.id++ }, ObjectProduct)

        this.products.push(object2);

        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.products, null, '\t')
        );

      } else {

        /*En caso de existir se leen los productos del archivo y se le agrega uno nuevo */
        const allProducts = await this.readProducts();

        if (allProducts.length == 0) {

          /*Asignarle un id autoincrementable*/
          const object2 = Object.assign({ 'id': ProductManager.id++ }, ObjectProduct)

          allProducts.push(object2);

        } else {

          //Validar que el code no se repita
          const found = allProducts.find((element) => element.code === ObjectProduct.code);

          if (found != undefined) {
            return console.log( `El producto con el codigo ${ObjectProduct.code} ya se encuentra previamente agregado.`);
          }

          let lastObjetid = allProducts[allProducts.length - 1].id

          lastObjetid++

          /*Asignarle con el id sumado 1 del ultimo registro guardado en el txt*/
          const object2 = await Object.assign({ 'id': lastObjetid }, ObjectProduct)

          allProducts.push(object2);
        }

        await fs.promises.writeFile(
          this.path,
          JSON.stringify(allProducts, null, '\t'))
      }

    } catch (error) {
      /*Manejo de errores */
      throw new Error(error);

    }

  }

  /*Debe tener un metodo getProducts que lee el archivo de productos y devuelve los mismos en formato de arreglo*/
  async getProducts() {
    try {
      if (!fs.existsSync(this.path)) {
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.products, null, '\t')
        );
      }
      const arrayProducts = await this.readProducts();

      return console.log(arrayProducts)

    } catch (error) {
      /*Manejo de errores */
      throw new Error(error);
    }
  }

  /*Debe tener un metodo getProductById que recibira un id */
  async getProductById(id) {

    try {

      if (typeof id !== "number") {
        return console.log("Solo numeros son aceptados como id, ingrese porfavor el id en el formato adecuado.");
      }

      /*Tras leer el archivo, buscara el producto con el id especificado*/
      const arrayProducts = await this.readProducts();

      //Validar que el txt no se encuentra vacio
      if (arrayProducts.length == 0) {
        return console.log("El txt se encuentra vacio.")
      }

      const objectProduct = arrayProducts.find(obj => obj.id === id);

      if (objectProduct == undefined) {
        return console.log(`El id ${id} no existe en nuestros registros.`);
      } else {
        /*Lo devolvera como objeto*/
        console.log(objectProduct)
      }
    } catch (error) {
      /*Manejo de errores */
      throw new Error (error);
    }

  }

  /*Debe tener un metodo updateProduct que recibira un id del producto a actualizar y el campo a actualizar*/
  async updateProduct(id, ...product) {
    try {

      if (typeof id !== "number") {
        return console.log("Solo numeros son aceptados como id, ingrese porfavor el id en el formato adecuado.");
      }

      /*Tras leer el archivo, buscara el producto con el id especificado*/
      const arrayProducts = await this.readProducts();

      //Validar que el txt no se encuentra vacio
      if (arrayProducts.length == 0) {
        return console.log("El txt se encuentra vacio.")
      }

      const objectProduct = arrayProducts.find(obj => obj.id === id);

      if (objectProduct == undefined) {
        return console.log(`El id ${id} no existe en nuestros registros.`);
      } else {
        /*Elimino el producto con ese id */
        await this.deleteProduct(id)

        /*Leo nuevamente el archivo, este va a estar sin el producto especificado*/
        const arrayProducts2 = await this.readProducts();

        /*Creo un nuevo objeto y le asigno el id que pasaron sumado 1 */
        const object2 = await Object.assign({ 'id': id }, ...product)

        //A los objetos previos le agrego el objeto con el mismo id pero modificando los demas valores
        arrayProducts2.push(object2)

        //Escribo el nuevo txt
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(arrayProducts2, null, '\t'))

        return console.log(`El producto con el id : ${id} fue actualizado.`);

      }
    } catch (error) {
      /*Manejo de errores */
      throw new Error(error);
    }

  }


  /*Debe tener un metodo deleteProduct que recibira un id del producto a eliminar*/
  async deleteProduct(id) {
    try {
      if (typeof id !== "number") {
       return console.log("Solo numeros son aceptados como id, ingrese porfavor el id en el formato adecuado.");
      }

      /*Tras leer el archivo, buscara el producto con el id especificado*/
      const arrayProducts = await this.readProducts();

      //Validar que el txt no se encuentra vacio
      if (arrayProducts.length == 0) {
        return console.log("El txt se encuentra vacio.")
      }

      const Productbyid = arrayProducts.find(obj => obj.id === id);

      //Validar que exista el id en el txt
      if (Productbyid == undefined) {
        return console.log(`El id ${id} no existe en nuestros registros.`)
      }

      const objectProduct = arrayProducts.filter(obj => obj.id != id);

      //Escribir el archivo
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(objectProduct, null, '\t')
      );
    }
    catch (error) {
      /*Manejo de errores */
      throw new Error (error)
    }
  }
}

const funcionAsync = async () => {
  const Product = new ProductManager('./productos.txt');
  // await Product.getProducts();
  // await Product.addProduct({ title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 });
  // await Product.addProduct({ title: 'producto prueba2', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc124', stock: 25 });
  // await Product.addProduct({ title: 'producto prueba3', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc124', stock: 25 });
  // await Product.getProducts();
  // await Product.getProductById(3);
  // await Product.updateProduct(1, { title: 'actualizado prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 })
  // await Product.getProductById(1);
  // await Product.deleteProduct(2);
  // await Product.getProducts();
};

funcionAsync()


