
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    const url = new URL(request.url);
    const sport = url.searchParams.get("sport");
    const date = url.searchParams.get("date");

    const apis = {
      football: "https://v3.football.api-sports.io",
      nba: "https://v2.nba.api-sports.io",
      nhl: "https://v1.hockey.api-sports.io",
      mlb: "https://v1.baseball.api-sports.io"
    };

    const json = (data, status = 200) =>
      Response.json(data, { status, headers: cors });

    if (!sport) {
      return json({
        status: "ok",
        message: "Analizador Deportivo conectado",
        sports: Object.keys(apis)
      });
    }

    if (!apis[sport]) {
      return json({ error: "Deporte no válido" }, 400);
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return json({ error: "Fecha inválida" }, 400);
    }

    if (!env.API_SPORTS_KEY) {
      return json({ error: "API key no configurada" }, 500);
    }
if (sport === "nba" && url.searchParams.has("team")) {
  const team = url.searchParams.get("team");

  if (!/^\d+$/.test(team)) {
    return json({ error: "ID de equipo inválido" }, 400);
  }

  try {
    const apiUrl = new URL("/games", apis.nba);
    apiUrl.searchParams.set("team", team);
    apiUrl.searchParams.set("season", "2024");

    const response = await fetch(apiUrl.toString(), {
      headers: {
        "x-apisports-key": env.API_SPORTS_KEY
      }
    });

    const data = await response.json();
    return json({ sport: "nba", team, data }, response.status);
  } catch {
    return json({ error: "Error al consultar NBA" }, 502);
  }
}
    const endpoint = sport === "football"
      ? "/fixtures"
      : "/games";

    try {
      const cache = caches.default;
const cacheKey = new Request(request.url);
const cached = await cache.match(cacheKey);
if (cached) return cached;
      const response = await fetch(
        `${apis[sport]}${endpoint}?date=${date}`,
        {
          headers: {
            "x-apisports-key": env.API_SPORTS_KEY
          }
        }
      );

      const data = await response.json();

      const resultado = json({ sport, date, data }, response.status);

if (response.ok && !Object.keys(data.errors || {}).length) {
  const guardado = new Response(resultado.body, resultado);
  guardado.headers.set("Cache-Control", "public, max-age=600");
  await cache.put(cacheKey, guardado.clone());
  return guardado;
}

return resultado;
    } catch {
      return json({
        error: "Error al consultar API-Sports"
      }, 502);
    }
  }
};
// Primera compilacion Cloudflare
