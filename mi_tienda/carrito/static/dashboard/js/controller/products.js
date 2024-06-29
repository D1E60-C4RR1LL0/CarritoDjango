const products = [
    new Product('A24', 'Smartphone','2','10000', '0', 'proveedor 2', 'Smart', 'Samsung'),
    new Product('Iphone 13', 'Smartphone','1','13000', '0', 'proveedor 1', '13', 'Apple'),
    new Product('Mouse bacan', 'Mouse','5','12000', '0', 'proveedor 3', 'bacan', 'Fiddler')
]

function getProducts(){
    return products

}

function createProduct(nombre,categoria,unidades,precio,descuento,proveedor,modelo,marca){
    const newProduct = new Product(nombre,categoria,unidades,precio,descuento,proveedor,modelo,marca)
    products.push(newProduct)
    return newProduct
}

function updateProduct(i, newNombre,newCategoria,newUnidades,newPrecio,newDescuento,newProveedor,newModelo,newMarca){
    users[i].nombre = newNombre
    users[i].categoria = newCategoria
    users[i].unidades = newUnidades
    users[i].precio = newPrecio
    users[i].descuento = newDescuento
    users[i].proveedor = newProveedor
    users[i].modelo = newModelo
    users[i].marca = newMarca
}

function deleteProduct(i){
    products.splice(i,1)
}

