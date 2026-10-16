
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Analizador Deportivo</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#101827;color:#f8fafc;font-family:Arial,sans-serif;padding:18px}
main{max-width:650px;margin:auto}
header{padding:22px 0}
h1{margin:0 0 8px;color:#6ee7b7}
p{color:#aebbd0;line-height:1.5}
.card{background:#1c293b;padding:18px;border-radius:16px;margin:14px 0}
label{display:block;margin:14px 0 6px;color:#dbeafe}
input,select{width:100%;padding:13px;border:1px solid #45556c;border-radius:9px;background:#101827;color:white;font-size:16px}
button{width:100%;padding:15px;margin-top:18px;border:0;border-radius:10px;background:#34d399;color:#06281c;font-size:17px;font-weight:bold}
.result{font-size:22px;font-weight:bold;color:#6ee7b7}
.small{font-size:13px;color:#aebbd0}
</style>
</head>
<body>
<main>
<header>
<h1>🏆 Analizador Deportivo</h1>
<p>NBA · NHL · MLB · Fútbol<br>Calculadora de apuestas en formato Betano</p>
</header>

<div class="card">
<h2>📊 Analizar una apuesta</h2>
<label>Deporte</label>
<select id="sport">
<option>NBA</option><option>NHL</option>
<option>MLB</option><option>Fútbol</option>
</select>

<label>Partido</label>
<input id="match" placeholder="Ej. Lakers vs Celtics">

<label>Selección</label>
<select id="market">
<option>Ganador</option>
<option>Hándicap -1.5</option>
<option>Hándicap +1.5</option>
<option>Más de (Over)</option>
<option>Menos de (Under)</option>
<option>Doble oportunidad</option>
</select>

<label>Línea de hándicap o total (opcional)</label>
<input id="line" type="number" step="0.5" placeholder="Ej. -1.5 o 220.5">

<label>Cuota decimal</label>
<input id="odds" type="number" min="1.01" step="0.01" placeholder="Ej. 1.85">

<label>Importe apostado (CLP)</label>
<input id="stake" type="number" min="1" step="100" value="1000">

<button onclick="analyze()">Calcular apuesta</button>
</div>

<div class="card" id="output" aria-live="polite">
<h2>📈 Resultado</h2>
<p>Introduce la cuota para calcular el retorno potencial y la probabilidad implícita.</p>
</div>

<div class="card">
<h2>🔗 Calculadora de combinadas</h2>
<p class="small">Introduce las cuotas decimales separadas por comas.</p>
<label>Cuotas de las selecciones</label>
<input id="combo" placeholder="Ej. 1.50, 1.80, 1.65">
<label>Importe de la combinada (CLP)</label>
<input id="comboStake" type="number" min="1" value="1000">
<button onclick="combine()">Calcular combinada</button>
<div id="comboOutput" aria-live="polite"></div>
</div>

<p class="small">Esta herramienta hace cálculos matemáticos con los datos que introduces. No dispone de cuotas, estadísticas ni resultados en vivo. Las probabilidades implícitas no garantizan que una apuesta gane. Apuesta responsablemente.</p>
</main>
<script>
function money(n){
 return new Intl.NumberFormat('es-CL',{
 style:'currency',currency:'CLP',
 maximumFractionDigits:0
 }).format(n);
}
function analyze(){
 const odds=Number(document.getElementById('odds').value);
 const stake=Number(document.getElementById('stake').value);
 const sport=document.getElementById('sport').value;
 const match=document.getElementById('match').value.trim();
 const market=document.getElementById('market').value;
 const line=document.getElementById('line').value;
 const out=document.getElementById('output');
 if(!Number.isFinite(odds)||odds<=1||!Number.isFinite(stake)||stake<=0){
  out.innerHTML='<h2>Revisa los datos</h2><p>Introduce una cuota superior a 1.00 y un importe mayor que cero.</p>';
  return;
 }
 const payout=stake*odds;
 const profit=payout-stake;
 const probability=100/odds;
 out.innerHTML=`
 <h2>📈 Resultado del análisis</h2>
 <p><b>Deporte:</b> ${escapeText(sport)}</p>
 <p><b>Partido:</b> ${escapeText(match||'No indicado')}</p>
 <p><b>Mercado:</b> ${escapeText(market)} ${line!==''?'('+escapeText(line)+')':''}</p>
 <p>Cuota: <span class="result">${odds.toFixed(2)}</span></p>
 <p>Probabilidad implícita: <span class="result">${probability.toFixed(1)}%</span></p>
 <p>Retorno total potencial: <span class="result">${money(payout)}</span></p>
 <p>Ganancia neta potencial: <span class="result">${money(profit)}</span></p>
 <p class="small">Cálculo teórico si la selección gana. No es una predicción del resultado.</p>`;
}
function combine(){
 const raw=document.getElementById('combo').value.trim();
 const stake=Number(document.getElementById('comboStake').value);
 const out=document.getElementById('comboOutput');
 const odds=raw.split(',').map(x=>Number(x.trim()));
 if(!raw||odds.some(x=>!Number.isFinite(x)||x<=1)||!Number.isFinite(stake)||stake<=0){
  out.innerHTML='<p>Introduce cuotas válidas, por ejemplo: 1.50, 1.80, 1.65.</p>';
  return;
 }
 const total=odds.reduce((a,b)=>a*b,1);
 out.innerHTML=`<p>Cuota combinada: <span class="result">${total.toFixed(2)}</span></p>
 <p>Probabilidad implícita aproximada: <span class="result">${(100/total).toFixed(2)}%</span></p>
 <p>Retorno potencial: <span class="result">${money(stake*total)}</span></p>
 <p>Ganancia neta potencial: <span class="result">${money(stake*(total-1))}</span></p>`;
}
function escapeText(value){
 return String(value).replace(/[&<>"']/g,c=>({
 '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
 })[c]);
}
</script>
</body>
</html>
