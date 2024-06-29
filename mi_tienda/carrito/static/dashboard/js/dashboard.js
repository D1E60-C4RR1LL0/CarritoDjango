document.addEventListener("DOMContentLoaded",function(){
const body = document.querySelector('body');
const tbody = document.querySelector('tbody');
const btnAdd = document.querySelector("#btnaddProduct");
const Nombre = document.querySelector("#Nombre");
const Categoria = document.querySelector("#Categoria");
const Unidades = document.querySelector("#Unidades");
const Precio = document.querySelector("#Precio");
const Descuento = document.querySelector("#Descuento");
const Proveedor = document.querySelector("#Proveedor");
const Modelo = document.querySelector("#Modelo");
const Marca = document.querySelector("#Marca");



btnAdd.onclick = btnAddProducto;

body.onload = () => {
    fillTable()
    
}

function createRow(p, i){
    const tr = document.createElement('tr')

        const tdNombre = document.createElement('td')
        tdNombre.textContent = p.nombre

        const tdCategoria = document.createElement('td')
        tdCategoria.textContent = p.categoria

        const tdUnidades = document.createElement('td')
        tdUnidades.textContent = p.unidades

        const tdPrecio = document.createElement('td')
        tdPrecio.textContent = p.precio

        const tdDescuento = document.createElement('td')
        tdDescuento.textContent = p.descuento

        const tdProveedor = document.createElement('td')
        tdProveedor.textContent = p.proveedor

        const tdModelo = document.createElement('td')
        tdModelo.textContent = p.modelo

        const tdMarca = document.createElement('td')
        tdMarca.textContent = p.marca

        const tdEditar = document.createElement('td')
        const iEditar = document.createElement('i')
        iEditar.className = 'fas fa-pen'
        iEditar.onclick = () => {
            btnAdd.textContent = 'ACTUALIZAR'
            Nombre.value = p.nombre
            Categoria.value = p.categoria
            Unidades.value = p.unidades
            Precio.value = p.precio
            Descuento.value = p.descuento
            Proveedor.value = p.proveedor
            Modelo.value = p.modelo
            Marca.value = p.marca
            btnAdd.onclick = (e) => btnUpdateProduct(e, i)

        }

        const tdEliminar = document.createElement('td')
        const iEliminar = document.createElement('i')
        iEliminar.className = 'fas fa-trash'
        iEliminar.onclick = () => {
            const isConfirm = confirm("¿Deseas eliminar el registro?")
            if(isConfirm){
                deleteProduct(i)
                clearTable()
                fillTable()
            }
        }

        //JOin
        tr.append(tdNombre, tdCategoria, tdUnidades, tdPrecio, tdDescuento, tdProveedor, tdModelo, tdMarca, tdEditar, tdEliminar)
        tdEditar.appendChild(iEditar)
        tdEliminar.appendChild(iEliminar)

        return tr;
}

function btnAddProducto(e){
    const i = getProducts().length;
    const newProduct = createProduct(Nombre.value, Categoria.value, Unidades.value, Precio.value, Descuento.value, Proveedor.value, Modelo.value, Marca.value)
    const tr = createRow(newProduct, i)
    tbody.appendChild(tr);
    e.preventDefault();
    alert("Producto guardado");
}

function btnUpdateProduct(e, i){
    updateProduct(i, Nombre.value, Categoria.value, Unidades.value, Precio.value, Descuento.value, Proveedor.value, Modelo.value, Marca.value)
    clearTable()
    fillTable()
    e.preventDefault()
    alert("Producto actualizado")
    /*Nombre.value = '' 
    Categoria.value = '' 
    Unidades.value = '' 
    Precio.value = ''
    Descuento.value = '' 
    Proveedor.value = '' 
    Modelo.value = ''
    Marca.value = ''
    btnAdd.textContent = 'Agregar'
    btnAdd.onclick = btnAddProducto*/
}

function clearTable(){
    tbody.innerHTML = ''
}

function fillTable(){
    let trs = [];
    const products = getProducts();
    products.forEach((p, i)=>{
            const tr = createRow(p, i)
            trs.push(tr)
        })
            //Join tbody
            tbody.append(...trs)
}
});