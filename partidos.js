
const API_DEPORTIVA =
  "https://analizador-deportivo-api.etiennerodriguez29.workers.dev";

async function cargarPartidos() {
  const contenedor = document.getElementById("partidos");
  if (!contenedor) return;

  contenedor.textContent = "Cargando partidos NBA...";

  const fecha = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  try {
    const url = `${API_DEPORTIVA}/?sport=nba&date=${fecha}`;
    const respuesta = await fetch(url);
    const resultado = await respuesta.json();

    if (resultado.data?.errors?.rateLimit || resultado.rateLimited) {
  throw new Error(
    "API-Sports alcanzó su límite de consultas. Intenta nuevamente más tarde."
  );
}

if (
  !respuesta.ok ||
  Object.keys(resultado.data?.errors || {}).length > 0
) {
  throw new Error("No se pudieron consultar los partidos");
}
    if (!Array.isArray(resultado.data?.response)) {
  throw new Error("La API no entregó una lista válida de partidos.");
}
    const juegos = resultado.data?.response || [];
    contenedor.replaceChildren();

    if (!juegos.length) {
      contenedor.textContent = "No hay partidos NBA para esta fecha.";
      return;
    }

    for (const juego of juegos) {
      const local = juego.teams?.home?.name || "Local";
      const visita = juego.teams?.visitors?.name || "Visitante";
      const estado = juego.status?.long || "Programado";

      const tarjeta = document.createElement("div");
      tarjeta.className = "card";
      tarjeta.style.marginTop = "12px";

      const titulo = document.createElement("strong");
      titulo.textContent = `${visita} vs ${local}`;

      const detalle = document.createElement("p");
      detalle.textContent = `Estado: ${estado}`;

      tarjeta.append(titulo, detalle);
      contenedor.appendChild(tarjeta);
    }
  } catch (error) {
    contenedor.textContent =
      "No se pudieron cargar los partidos. Intenta nuevamente.";
  }
}

document.addEventListener("DOMContentLoaded", cargarPartidos);
