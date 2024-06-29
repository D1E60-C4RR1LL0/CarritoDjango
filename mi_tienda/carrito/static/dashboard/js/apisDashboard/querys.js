
$(document).ready(function () {
    $.getJSON('https://mindicador.cl/api', function () {

        console.log("CARGANDO....");
    }).fail(function () {
        $("#spin").hide();
        $("#spintext").hide();

        $("#dolar").removeClass("h5");
        $("#dolar").css("font-size", "10px");
        $("#dolar").text("ERROR AL CARGAR LOS DATOS");

    }).done(function (data) {
        $("#spin").hide();
        $("#spintext").hide();
        $("#spinuf").hide();
        $("#spintextuf").hide();
        $("#spinutm").hide();
        $("#spintextutm").hide();
        $("#dolar").text("DOLAR: $" + data.dolar.valor);
        $("#uf").text("UF: $" + data.uf.valor);
        $("#utm").text("UTM: $" + data.utm.valor);
    });
});




