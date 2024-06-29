document.getElementById("registroForm").addEventListener("submit", function(event) {
    var pass1 = document.getElementById("pass").value;
    var pass2 = document.getElementById("pass2").value;
    var errorMsg = document.getElementById("error-msg");

    if (pass1 !== pass2) {
        errorMsg.style.display = "block";
        event.preventDefault(); // Evita que el formulario se envíe
    } else {
        errorMsg.style.display = "none";
    }
});