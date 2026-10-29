// Los diez niveles del primer bloque (Capítulo 1 · Origen).
// Leyenda base (ver engine.js):
//   #  pared            .  suelo           ~  vacío          P  inicio
//   B  bloque           X  salida          L  palanca (solo responde en Fractura)
//   1  pared solo en Origen   2  pared solo en Eco   3  pared solo en Fractura
//   %  grieta: pared en Origen y Eco, transitable en Fractura
//   [  pared desplazable (presente con la estructura en estado 0)
//   ]  pared desplazable (presente con la estructura en estado 1)
// Las letras se definen en la leyenda de cada nivel.

export const LEVELS = [
  {
    id: 1,
    dims: ['O'],
    map: [
      '###########',
      '#P....#...#',
      '#.....#.X.#',
      '#..B..A...#',
      '#.....#...#',
      '#..a..#.t.#',
      '###########',
    ],
    legend: {
      a: { t: 'plate', id: 'a' },
      A: { t: 'door', req: ['a'] },
      t: { t: 'term', doc: 'aviso-seguridad' },
    },
  },
  {
    id: 2,
    dims: ['O'],
    map: [
      '##########',
      '#P...#...#',
      '#..B.#.X.#',
      '#....#...#',
      '##.#.##A##',
      '#a.....b.#',
      '##########',
    ],
    legend: {
      a: { t: 'plate', id: 'a' },
      b: { t: 'plate', id: 'b' },
      A: { t: 'door', req: ['a', 'b'] },
    },
  },
  {
    id: 3,
    dims: ['E'],
    echo: true,
    map: [
      '###########',
      '#a..#.....#',
      '#...#..X..#',
      '#.P.A.....#',
      '#...#.....#',
      '###########',
    ],
    legend: {
      a: { t: 'plate', id: 'a' },
      A: { t: 'door', req: ['a'] },
    },
  },
  {
    id: 4,
    dims: ['O', 'E'],
    map: [
      '############',
      '#....~~~~..#',
      '#.P.p====X.#',
      '#....~~~~.t#',
      '############',
    ],
    legend: {
      p: { t: 'plate', id: 'p', dims: ['O'], hold: 5 },
      '=': { t: 'bridge', dims: ['E'], req: ['p'] },
      t: { t: 'term', doc: 'puente-presupuesto' },
    },
  },
  {
    id: 5,
    dims: ['O', 'F'],
    map: [
      '###########',
      '#P..%..L..#',
      '#...#....t#',
      '##[########',
      '#....B..3a#',
      '#.]......A#',
      '#########X#',
      '###########',
    ],
    legend: {
      a: { t: 'plate', id: 'a' },
      A: { t: 'door', req: ['a'] },
      t: { t: 'term', doc: 'inscripcion' },
    },
  },
  {
    id: 6,
    dims: ['O', 'E', 'F'],
    echo: true,
    map: [
      '#############',
      '#P....#######',
      '#.....#######',
      '#.....A[2.3X#',
      '#.....#######',
      '#a....%Lt####',
      '#############',
    ],
    legend: {
      a: { t: 'plate', id: 'a' },
      A: { t: 'door', req: ['a'] },
      t: { t: 'term', doc: 'memo-08441' },
    },
  },
  {
    id: 7,
    dims: ['O', 'E', 'F'],
    echo: true,
    code: [3, 1, 4],
    map: [
      '#############',
      '######m######',
      '######3######',
      '####.....####',
      '#i==.....%.k#',
      '####..j..####',
      '####..P..####',
      '######Z######',
      '####.s.X#####',
      '#############',
    ],
    legend: {
      i: { t: 'console', n: 1 },
      j: { t: 'console', n: 2 },
      k: { t: 'console', n: 3 },
      m: { t: 'console', n: 4 },
      '=': { t: 'bridge', dims: ['E'] },
      Z: { t: 'door', req: ['code'] },
      s: { t: 'term', doc: 'frag-origen', secret: true },
    },
  },
  {
    id: 8,
    dims: ['O', 'E', 'F'],
    echo: true,
    map: [
      '#############',
      '#a]..########',
      '#t##.########',
      '#L%.P...[==X#',
      '#############',
    ],
    legend: {
      a: { t: 'plate', id: 'a' },
      '=': { t: 'bridge', dims: ['E'], req: ['a'] },
      t: { t: 'term', doc: 'custodios' },
    },
  },
  {
    id: 9,
    dims: ['O', 'F'],
    map: [
      '#############',
      '#P.......%L.#',
      '#..B.....####',
      '#.......b####',
      '#]##[########',
      '#.##.......X#',
      '#.s.Q.#######',
      '#############',
    ],
    legend: {
      b: { t: 'plate', id: 'b' },
      Q: { t: 'door', req: ['b'] },
      L: { t: 'lever', once: true },
      s: { t: 'term', doc: 'frag-fractura', secret: true },
    },
  },
  {
    id: 10,
    dims: ['O', 'E', 'F'],
    echo: true,
    map: [
      '###############',
      '#P....#......b#',
      '#..B..#.......#',
      '#.....A.......#',
      '#...a.#.......#',
      '#######Q#######',
      '#L%.....[13.2X#',
      '####1##########',
      '####s##########',
      '###############',
    ],
    legend: {
      a: { t: 'plate', id: 'a' },
      b: { t: 'plate', id: 'b' },
      A: { t: 'door', req: ['a'] },
      Q: { t: 'door', req: ['b'] },
      s: { t: 'term', doc: 'frag-eco', secret: true },
    },
  },
];
