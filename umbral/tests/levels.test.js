// Verifica que cada nivel tiene una solución y que no se resuelve sin la mecánica que enseña.
// Uso: node umbral/tests/levels.test.js
import { LEVELS } from '../js/levels.js';
import { parseLevel, runScript, solveWithoutEcho } from '../js/engine.js';

const SOLUTIONS = {
  1: ['R R D D D U R R R R U R'],
  2: ['R R R D L U L D D D U R R D D L L R5 U U U'],
  3: ['echo L U U echo R W W R R R R U'],
  4: ['R R dim:E R5'],
  5: ['dim:F R6 L5 D D D R R R R dim:O R R D R D'],
  6: ['dim:E echo D4 echo dim:F R4 D4 R R L L U U dim:O R6'],
  7: ['dim:F R U U R R R R L7 dim:E L L L R R R R R U U U D7 L R R'],
  8: ['dim:E echo U U L L L echo dim:F L L W W W L R R R dim:E R7'],
  9: ['dim:F R9 L6 D4 R7', 'D R6 U R D L7 D4 R4 U R6'],
  10: ['D R R U R D D R R R dim:E echo R6 U U echo D W7 D D dim:F L L L D D U U L L L R6 R dim:E R R R dim:O R R'],
};

// Niveles que deben ser imposibles sin eco (la mecánica que enseñan).
const NEEDS_ECHO = [3, 6, 8, 10];
// Secretos que la solución de referencia debe recoger.
const SECRETS = { 7: 'frag-origen', 9: 'frag-fractura', 10: 'frag-eco' };

let failures = 0;
const check = (ok, msg) => {
  console.log(`${ok ? '✓' : '✗'} ${msg}`);
  if (!ok) failures++;
};

for (const def of LEVELS) {
  const lvl = parseLevel(def);
  for (const sol of SOLUTIONS[def.id] || []) {
    const { state } = runScript(lvl, sol);
    check(state.won, `nivel ${def.id}: la solución "${sol.slice(0, 40)}…" llega a la salida`);
  }
  if (SECRETS[def.id]) {
    const got = SOLUTIONS[def.id].some((sol) => runScript(lvl, sol).state.docs.includes(SECRETS[def.id]));
    check(got, `nivel ${def.id}: el fragmento secreto es alcanzable`);
  }
  if (NEEDS_ECHO.includes(def.id)) {
    const r = solveWithoutEcho(lvl);
    check(r === null, `nivel ${def.id}: imposible sin eco${Array.isArray(r) ? ` (atajo: ${r.join(' ')})` : r ? ' (límite de búsqueda)' : ''}`);
  } else {
    const r = solveWithoutEcho(lvl);
    check(Array.isArray(r), `nivel ${def.id}: solución mínima en ${Array.isArray(r) ? r.length : '?'} acciones`);
  }
}

// Reglas concretas que el diseño promete.
{
  const lvl = parseLevel(LEVELS[3]);
  const { state } = runScript(lvl, 'R R dim:E W W W W W W');
  check(!state.bridgeOn['5,2'], 'nivel 4: el puente desaparece al agotarse el temporizador');
}
{
  const lvl = parseLevel(LEVELS[4]);
  const { events } = runScript(lvl, 'dim:F R6 L5 D D D R R R R R');
  check(events.some((e) => e.type === 'blocked' && e.reason === 'block'), 'nivel 5: en Fractura el bloque no atraviesa la pared ◆');
}
{
  const lvl = parseLevel(LEVELS[7]);
  const { state } = runScript(lvl, 'dim:E echo U U L L L echo dim:F L L L');
  check(state.echo.x !== 1 || state.echo.y !== 1, 'nivel 8: activar la palanca demasiado pronto deja al eco atascado');
}
{
  const lvl = parseLevel(LEVELS[8]);
  const { state } = runScript(lvl, 'dim:F R9 L R');
  check(state.frac === 1 && state.leverUsed, 'nivel 9: la palanca es de un solo uso');
}

console.log(failures ? `\n${failures} comprobaciones fallidas` : '\nTodo correcto');
process.exit(failures ? 1 : 0);
