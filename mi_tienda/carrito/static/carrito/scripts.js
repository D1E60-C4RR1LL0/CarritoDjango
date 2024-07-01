document.addEventListener('DOMContentLoaded', function() {
    var fechaVencimientoInput = document.querySelector('input[name="fecha_vencimiento"]');
    if (fechaVencimientoInput) {  // Verificar si el elemento existe
        fechaVencimientoInput.addEventListener('input', function(e) {
            var input = e.target.value.replace(/\D/g, '').substring(0, 4); // Obtener solo los primeros 4 dígitos
            var mes = input.substring(0, 2);
            var ano = input.substring(2, 4);

            if (input.length > 2) {
                e.target.value = mes + '/' + ano;
            } else {
                e.target.value = mes;
            }
        });
    } else {
        console.error('El campo de entrada para la fecha de vencimiento no se encontró en el DOM.');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.agregar-carrito').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); 
            const productoId = this.getAttribute('data-id');
            const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            fetch(`/agregar_ajax/${productoId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({})
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error en la respuesta del servidor:', data.error);
                } else {
                    document.querySelector('.badge.bg-primary').textContent = data.total_items;
                    mostrarMensaje(data.mensaje);
                }
            })
            .catch(error => console.error('Error en la solicitud fetch:', error));
        });
    });
});

function mostrarMensaje(mensaje) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.display = 'block';
    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 3000); 
}
