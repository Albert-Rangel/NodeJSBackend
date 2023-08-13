
class ProductManager {
   
    static id = 0;
    constructor() {
        this.product = []
    }
    
    addProduct(title, description, price, thumbnail, code, stock) {
        const found = this.product.find((element) => element.code === code);
        if (found === undefined) {
            let newProduct = {
                id: 0,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }
            if(!Object.values(newProduct).includes(undefined)){
                ProductManager.id++
                newProduct.id = ProductManager.id;
                this.product.push(newProduct);
                return console.log(`Producto Agregado con el id ${ProductManager.id}`)
            }else{

                return console.log(`Todos los valores del producto tienen que ser enviados.`)
            }
        }else{

            return console.log(`El producto con el codigo ${code} ya se encuentra previamente agregado.`);
        }
    }

    getProducts() {
        return console.log(this.product);
    }

    getProductbyid(id) {
        
        const productbyId = this.product.find((element) => element.id === id);

        if(productbyId === undefined){
            return console.log('Not found');
        }

        return console.log(productbyId);
    }
}

let product1 = new ProductManager();

//Verifico que no venga ningun valor undefined
product1.addProduct('Cellphone', 'IPhone Pro Black', '1000,00$', 'www.cellphones.com', undefined, 5);

//Agregado de productos
product1.addProduct('HeadSet', 'Pink HeadSet', '100,00$', 'www.HeadSet.com', 'cde', 10);
product1.addProduct('Monitor', 'Huge Monitor', '500,00$', 'www.Monitor.com', 'fgh', 1);
product1.addProduct('AC', 'White Ac', '250,00$', 'www.AC.com', 'ijk', 2);

//Validacion de no tener un code repetido
product1.addProduct('Book' , 'Lord of the rings', '30,00$', 'www.Books.com', 'ijk', 5);

//Obtener un arrreglo de todos los productos guardados
product1.getProducts()

//Obtener un producto en especifico por su id
product1.getProductbyid(1)
