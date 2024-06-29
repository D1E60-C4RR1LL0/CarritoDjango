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