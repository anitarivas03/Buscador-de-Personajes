const input     = document.getElementById("busqueda");
const boton     = document.getElementById("btnBuscar");
const resultado = document.getElementById("resultado");


//armar y mostrar ka card

function mostrarCard(personaje) {

    // Determina la clase de estado para la card, el badge y el borde
    const statusClass = personaje.status === "Alive" ? "alive"
                      : personaje.status === "Dead"  ? "dead"
                      : "unknown";

    resultado.innerHTML = `
        <div class="personaje-card ${statusClass} mx-auto">

            <img
                src="${personaje.image}"
                alt="${personaje.name}"
                class="card-img-personaje"
            >

            <div class="card-body-rm">

                <h3 class="card-nombre">${personaje.name}</h3>

                <span class="badge-estado badge-${statusClass} mb-3">
                    ${personaje.status}
                </span>

                <div class="info-row">
                    <div class="info-label">Especie</div>
                    <div class="info-value">${personaje.species}</div>
                </div>

                <div class="info-row">
                    <div class="info-label">Última ubicación</div>
                    <div class="info-value">${personaje.location.name}</div>
                </div>

            </div>
        </div>
    `;
}




function mostrarMensaje(icono, texto, subtexto = "") {
    resultado.innerHTML = `
        <div class="msg-box">
            <span class="msg-icon">${icono}</span>
            <p class="msg-texto">${texto}</p>
            ${subtexto ? `<p class="msg-sub">${subtexto}</p>` : ""}
        </div>
    `;
}




boton.addEventListener("click", () => {

    const valor = input.value.trim();

    // Validación: campo vacío
    if (valor === "") {
        mostrarMensaje("Por favor, ingresá un nombre o un ID");
        return;
    }

    // Búsqueda por NOMBRE (texto)
    if (isNaN(valor)) {

        fetch(`https://rickandmortyapi.com/api/character/?name=${valor}`)
            .then(response => response.json())
            .then(data => {

                // La API devuelve { error: "..." } cuando no encuentra resultados
                if (!data.results) {
                    mostrarMensaje("Personaje no encontrado", `No existe ningún personaje llamado "${valor}"`);
                    return;
                }

                mostrarCard(data.results[0]);
            })
            .catch(() => {
                mostrarMensaje("Error de conexión", "No se pudo contactar la API. Intentá de nuevo.");
            });

    }

    // Búsqueda por ID (número)
    else {

        fetch(`https://rickandmortyapi.com/api/character/${valor}`)
            .then(response => {

                // La API devuelve 404 cuando el ID no existe
                if (!response.ok) {
                    throw new Error("not_found");
                }

                return response.json();
            })
            .then(personaje => {
                mostrarCard(personaje);
            })
            .catch(error => {

                if (error.message === "not_found") {
                    mostrarMensaje("Personaje no encontrado", `No existe ningún personaje con ID ${valor}`);
                } else {
                    mostrarMensaje("Error de conexión", "No se pudo contactar la API. Intentá de nuevo.");
                }
            });
    }

});


// ── Permitir buscar también con la tecla Enter ───────────────────────────────

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") boton.click();
});