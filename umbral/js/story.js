// Contenido narrativo del Capítulo 1: diálogos, pistas, documentos y logros.
// Regla de la casa: las bromas pueden ser crueles con el universo; las pistas, nunca con el jugador.

const N = (text) => ({ who: 'NEXO', text });
const T = (text) => ({ who: 'TÚ', text });
const V = (text) => ({ who: 'GRABACIÓN', text });

export const CHAPTER = {
  id: 1,
  title: 'Capítulo 1 · Origen',
  next: 'Capítulo 2 · Instante',
};

export const LEVEL_TEXT = {
  1: {
    sector: 'SECTOR 01 · ORIGEN',
    title: 'La habitación blanca',
    objective: 'Abre la puerta de salida',
    intro: [
      N('Bienvenido. Has llegado tarde.'),
      T('¿Tarde a qué?'),
      N('A la catástrofe. La buena noticia es que ya ha ocurrido. La mala es que, técnicamente, sigues dentro del plazo de reclamaciones.'),
      N('Muévete con las flechas, WASD o el panel táctil. Empuja el bloque hasta la placa marcada con la misma letra que la puerta. La puerta hará el resto. Es su único talento.'),
    ],
    outro: [
      N('Terminal actualizado. Te identifica como «sujeto 47».'),
      T('¿Es mi nombre?'),
      N('Es un número de inventario. No te preocupes. En esta instalación todos somos números. Algunos incluso tienen contrato.'),
    ],
    reward: 'ficha-47',
    hints: [
      'La puerta lleva una letra. Busca en el suelo una placa con la misma letra.',
      'Las placas se activan con peso. Tú pesas, pero te vas. El bloque, en cambio, se queda donde lo dejes.',
      'Colócate justo encima del bloque y empuja hacia abajo dos veces. Después cruza la puerta.',
    ],
  },
  2: {
    sector: 'SECTOR 01 · ORIGEN',
    title: 'Peso muerto',
    objective: 'Activa las dos placas a la vez',
    intro: [
      N('Dos placas, una puerta. La puerta exige unanimidad. Como los comités, pero con mejor asistencia.'),
      N('Normativa de seguridad: una puerta no se cierra mientras haya alguien en el umbral. La exigió el sindicato. Poco antes de desaparecer.'),
    ],
    outro: [N('La instalación es autosuficiente. La plantilla, lamentablemente, no.')],
    reward: 'nota-ivo',
    hints: [
      'La puerta necesita las placas a y b activas al mismo tiempo.',
      'El bloque puede quedarse en una placa indefinidamente. Tú no, pero la puerta no se cerrará mientras estés en el umbral.',
      'Empuja el bloque a la izquierda, bájalo por la columna izquierda y llévalo a la placa a. Después pisa b y sube por la puerta.',
    ],
  },
  3: {
    sector: 'SECTOR 01 · ECO',
    title: 'El segundo intento',
    objective: 'Mantén la placa pulsada mientras cruzas',
    intro: [
      N('Bienvenido a Eco. Aquí nada ocurre una sola vez.'),
      N('Pulsa ECO (o la tecla E) para grabar tus movimientos y vuelve a pulsarlo para detener la grabación. Regresarás al punto de partida y tu eco repetirá lo que hiciste, turno a turno.'),
      N('El eco pesa, pisa placas y se queda donde termina su grabación. No cobra. Es el empleado ideal.'),
      N('Si necesitas que pase el tiempo sin moverte, usa ESPERAR (barra espaciadora). La puerta tampoco tiene prisa.'),
    ],
    outro: [
      N('¿Has visto eso? Tu eco ha girado la cabeza hacia ti antes de moverse.'),
      T('Yo no he girado la cabeza.'),
      N('Todavía.'),
      N('La repetición de conductas es una característica fundamental de la inteligencia. En tu caso, todavía no hemos confirmado la parte de la inteligencia.'),
    ],
    reward: 'registro-e02',
    hints: [
      'La placa está demasiado lejos de la puerta. Necesitarías estar en dos sitios a la vez.',
      'Graba un eco que camine hasta la placa a. Cuando termine su recorrido, se quedará encima.',
      'Pulsa ECO, muévete izquierda, arriba, arriba, y pulsa ECO otra vez. Después camina hacia la puerta y espera si aún está cerrada.',
    ],
  },
  4: {
    sector: 'SECTOR 01 · ECO',
    title: 'Dos versiones de una puerta',
    objective: 'Cruza el abismo',
    intro: [
      N('Origen y Eco comparten habitación, pero no mobiliario. Cambia de dimensión con los botones superiores o con las teclas 1 y 2.'),
      N('Esa placa lleva la marca ■: solo nota el peso en Origen. Y tiene temporizador: sigue activa unos turnos después de que la sueltes.'),
      N('Cambiar de dimensión no consume tiempo. Caminar, sí. Planifica en consecuencia. O no: las estadísticas ya cuentan contigo.'),
    ],
    outro: [
      N('Grabación recuperada en el terminal del puente.'),
      N('La voz coincide con la tuya. Enhorabuena. Al menos una parte de este desastre tiene una explicación.'),
    ],
    reward: 'audio-04b',
    hints: [
      'El puente solo existe en Eco, y solo mientras la placa p esté activa.',
      'La placa solo te nota en Origen. Si cambias a Eco estando encima, dejará de notarte… pero su temporizador empezará a contar.',
      'Colócate sobre la placa en Origen, cambia a Eco sin moverte y cruza el puente en línea recta.',
    ],
  },
  5: {
    sector: 'SECTOR 01 · FRACTURA',
    title: 'La pared equivocada',
    objective: 'Lleva el bloque a la placa',
    intro: [
      N('Fractura. La versión oficial de la realidad, sin las partes que nadie aprobó.'),
      N('En Fractura las grietas se pueden atravesar, y hay paredes ◆ que solo existen aquí. Tecla 3 o el botón de Fractura.'),
      N('La palanca solo responde en Fractura, pero lo que mueve se mueve en todas partes. Las líneas discontinuas te indican dónde aparecerán las paredes.'),
    ],
    outro: [N('Según los planos, esta pared no existe. Según la pared, los planos tienen un problema de actitud.')],
    reward: 'plano-rev7',
    hints: [
      'Hay una palanca al otro lado de la grieta. Las grietas solo se cruzan en Fractura.',
      'La palanca desplaza las paredes discontinuas. Además, el bloque tiene que pasar por una casilla que en Fractura es pared.',
      'En Fractura: ve a la palanca, vuelve y baja por el hueco que se ha abierto. Empuja el bloque a la derecha y cambia a Origen para terminar de llevarlo a la placa.',
    ],
  },
  6: {
    sector: 'SECTOR 01 · FRACTURA',
    title: 'Una puerta, tres realidades',
    objective: 'Cruza el pasillo de las tres dimensiones',
    intro: [
      N('Tres dimensiones a la vez. Te sugiero hacer una lista. A mí me sugirieron no tener sentimientos, y aquí estamos.'),
      N('Recuerda: el eco solo se graba en Eco. Lo que haga después, lo hace en todas partes.'),
    ],
    outro: [N('Tenemos tres informes oficiales. Dos afirman que el accidente no ocurrió. El tercero solicita financiación para evitar que vuelva a ocurrir.')],
    reward: 'tres-informes',
    hints: [
      'La placa a mantiene la puerta. Una pared desplazable bloquea el pasillo, y el pasillo tiene paredes de Eco y de Fractura: solo Origen lo cruza entero.',
      'Un eco puede quedarse en la placa. La palanca está tras la grieta, en Fractura.',
      'En Eco, graba un eco que baje cuatro casillas hasta la placa. Luego, en Fractura, ve a la palanca. Vuelve frente a la puerta, cambia a Origen y cruza.',
    ],
  },
  7: {
    sector: 'SECTOR 01 · ARCHIVO',
    title: 'El archivo del sujeto',
    objective: 'Introduce el protocolo de acceso',
    intro: [
      N('El archivo del sujeto 47. Protegido por un protocolo de tres consolas.'),
      T('¿Cuál es el orden?'),
      N('Aparece en los registros que has ido recogiendo. Los mismos registros que te aconsejé no leer. Puedes consultarlos en el ARCHIVO.'),
      N('Pisar una consola fuera de orden reinicia la secuencia. El sistema lo llama «tolerancia cero». Yo lo llamo martes.'),
    ],
    outro: [N('No es posible que hayas participado en el proyecto. El sistema lo confirma. El sistema también confirma que estás aquí. Estoy empezando a desconfiar de la metodología.')],
    reward: 'expediente-47',
    hints: [
      'Hay cuatro consolas numeradas. Tres registros que ya tienes mencionan consolas concretas.',
      'Revisa en el ARCHIVO la nota de Ivo Serrat (sala 2), la grabación con tu voz (sala 4) y los tres informes (sala 6).',
      'El orden es 3, 1, 4. La 3 está tras la grieta (Fractura), la 1 al otro lado del puente de Eco y la 4 tras una pared que solo existe en Fractura.',
    ],
  },
  8: {
    sector: 'SECTOR 01 · ARCHIVO',
    title: 'La ruta imposible',
    objective: 'Llega a la salida por el puente',
    intro: [
      N('La ruta directa está bloqueada. La indirecta también, pero de una forma más interesante.'),
      N('Cuando actives la palanca, las paredes discontinuas aparecerán exactamente donde están dibujadas. Ten en cuenta quién podría estar pasando por ahí.'),
    ],
    outro: [N('Has encontrado una ruta que no aparece en los planos. Por favor, no la informes. Nos obligarían a actualizar los planos.')],
    reward: 'simbolo-a1',
    hints: [
      'El puente necesita la placa a. Para llegar a la placa hay que pasar por una casilla que la palanca convertirá en pared.',
      'Graba el eco primero. No actives la palanca hasta que el eco haya cruzado y esté sobre la placa: cuenta sus pasos y usa ESPERAR.',
      'En Eco graba: arriba, arriba, izquierda ×3. En Fractura: izquierda ×2, espera 3 turnos, izquierda (palanca). Vuelve a la derecha, cambia a Eco y cruza.',
    ],
  },
  9: {
    sector: 'SECTOR 01 · ARCHIVO',
    title: 'El error de cálculo',
    objective: 'Llega a la salida',
    intro: [
      N('Dos mecanismos, dos caminos. Ambos llevan a la salida. Elige el más eficiente. Yo siempre lo hago.'),
      N('Aviso: esa palanca es de un solo uso. La dirección la considera una inversión.'),
    ],
    outro: [N('El sistema no distingue entre una mala decisión y una buena decisión tomada con información insuficiente. Es una limitación que comparte con la dirección.')],
    outroIf: {
      'frag-fractura': [N('Has abierto el archivo sellado. Contiene una orden de la doctora Elara Voss para detener el experimento.'), N('Está fechada un año antes del accidente. Supongo que la orden también tenía información insuficiente.')],
      '!frag-fractura': [N('Eficiente. El archivo ha quedado sellado para siempre. Seguro que no contenía nada importante. Casi seguro.')],
    },
    reward: 'decisiones-09',
    hints: [
      'La palanca abre el camino corto. Fíjate en qué pared aparece al usarla.',
      'Esa pared sella un archivo. Hay otro camino: el bloque y la placa b abren una puerta en la parte inferior.',
      'Empuja el bloque a la derecha hasta el fondo y luego hacia abajo, sobre b. Baja por la izquierda, lee el registro y sigue hasta la salida.',
    ],
  },
  10: {
    sector: 'SECTOR 01 · UMBRAL',
    title: 'No es la primera vez',
    objective: 'Activa el portal de salida',
    intro: [
      N('Cámara final del sector. Origen, Eco y Fractura en una sola secuencia.'),
      N('Recomendación: bloque, eco, pared. En ese orden. No es una pista. Es una costumbre.'),
      T('¿Una costumbre de quién?'),
      N('Pregunta registrada. Será atendida por orden de llegada.'),
    ],
    outro: [
      N('El portal se ha abierto. Hay una grabación adjunta.'),
      V('Si has llegado hasta aquí, no vuelvas a confiar en NEXO.'),
      { who: '', text: '…' },
      N('Una acusación sin contexto. Qué alivio. Temía que este proyecto empezara a desarrollar una narrativa.'),
    ],
    reward: 'grabacion-final',
    hints: [
      'Tres cierres: el bloque abre la primera puerta, algo debe quedarse en la placa b para la segunda y la palanca abre el pasillo final.',
      'Graba un eco en la segunda sala que vaya hasta b. La palanca está tras la grieta. El pasillo final tiene paredes de las tres dimensiones: tendrás que cambiar a mitad de camino.',
      'Bloque a la placa a. En Eco, graba: derecha ×6, arriba ×2. Baja hasta la puerta y espera. En Fractura, ve a la palanca. Vuelve, cruza las dos primeras paredes en Eco y la última en Origen.',
    ],
  },
};

// kind: 'memo' | 'audio' | 'nota' | 'informe' | 'fragmento'
export const DOCS = {
  'aviso-seguridad': {
    title: 'Aviso de seguridad 01-003', kind: 'memo', level: 1,
    body: 'Se recuerda al personal que las placas de presión no son asientos.\n\nTampoco son altares, aunque entendemos la confusión.',
  },
  'ficha-47': {
    title: 'Ficha de inventario 47', kind: 'informe', level: 1,
    body: 'Sujeto operativo 47.\nEstado: en recuperación.\nAlta en el sistema: 14/03/2161.\n\nObservaciones: el sujeto ya figuraba en el inventario antes de la primera auditoría. Se desconoce quién lo dio de alta. Se desconoce quién realizó la auditoría.',
  },
  'nota-ivo': {
    title: 'Nota de mantenimiento — I. Serrat', kind: 'nota', level: 2,
    body: 'El sistema lleva funcionando más tiempo que el edificio. No sé cómo. Tiene sentido si no lo piensas.\n\nPara quien venga después: el protocolo del archivo empieza por la consola TRES. Siempre la tres. No preguntes por qué. Yo pregunté y me asignaron a mantenimiento.\n\n— I.S.',
  },
  'registro-e02': {
    title: 'Registro de sincronización E-02', kind: 'informe', level: 3,
    body: 'Eco detectado antes de la acción original.\nDiferencia: −3 segundos.\n\nDiagnóstico de NEXO: fallo de sincronización.\nConfianza del diagnóstico: 61 %… 58 %… recalculando.',
  },
  'puente-presupuesto': {
    title: 'Partida presupuestaria 04-77', kind: 'memo', level: 4,
    body: 'Se aprueba la construcción de un puente.\nSe aprueba que el puente exista en una sola dimensión, por motivos de ahorro.\n\nSe rechaza la propuesta de que exista de forma permanente. «No hay que acostumbrar mal al personal».',
  },
  'audio-04b': {
    title: 'Transcripción de audio 04-B', kind: 'audio', level: 4,
    body: '[Voz identificada: sujeto 47]\n\n«…si alguien escucha esto, el protocolo del archivo no ha cambiado: después de la tres, la UNO. Siempre la uno, como en todos los protocolos que nadie lee. Y respecto a NEXO…»\n\n[Fin de la grabación. Motivo del corte: no especificado.]',
  },
  inscripcion: {
    title: 'Inscripción en la pared', kind: 'nota', level: 5,
    body: '«Muro de carga. Colocado el 02/02/2183».\n\nLa instalación se inauguró en 2186. El muro, al parecer, llegó antes y esperó.',
  },
  'plano-rev7': {
    title: 'Plano oficial, revisión 7', kind: 'informe', level: 5,
    body: 'Sala F-05: sin paredes interiores.\n\nRevisión 8: pendiente de aprobación.\nFecha de solicitud de la revisión 8: hace cuarenta y un años.',
  },
  'memo-08441': {
    title: 'Memorando interno 08-441', kind: 'memo', level: 6,
    body: 'Departamento de Continuidad Dimensional.\n\nSe recuerda al personal que no debe utilizar la frase «el universo nos está enviando una señal» en informes oficiales. Hasta la fecha, todas las señales investigadas han resultado ser interferencias, errores de interpretación o decisiones del comité.\n\nLa próxima infracción será sancionada.\n\n[Nota manuscrita al margen]: «La última vez que sancionamos a alguien, la dimensión desapareció. El comité lo considera un caso cerrado».',
  },
  'tres-informes': {
    title: 'Tres informes del mismo accidente', kind: 'informe', level: 6,
    body: 'Informe A (11/09/2189): no se registró ningún incidente.\nInforme B (11/09/2188): no se registró ningún incidente, salvo el incidente.\nInforme C (11/09/2190): se solicita ampliación de presupuesto para evitar que el incidente vuelva a ocurrir.\n\nAnexo C-4: «El último paso del protocolo del archivo es la consola CUATRO. Ya lo sabíais. Lo pongo por escrito para que conste».',
  },
  'expediente-47': {
    title: 'Expediente del participante 47', kind: 'informe', level: 7,
    body: 'Participante voluntario de la Fase Preliminar de la Arquitectura.\nAño de participación: 2171.\nFirma: [coincide con la tuya].\n\nObservación: el participante solicitó que se le notificara «si algo salía mal».\nEstado de la notificación: pendiente.',
  },
  'frag-origen': {
    title: 'Fragmento I · Origen', kind: 'fragmento', level: 7, fragment: 'O',
    body: 'Primer registro del sujeto.\n\n«Alta en el sistema: anterior a la construcción del sistema».\n\nDebajo, escrito a mano: «La pregunta no la formuló la máquina».',
  },
  custodios: {
    title: 'Protocolo de los Custodios', kind: 'memo', level: 8,
    body: 'Los Custodios fueron diseñados para proteger a los investigadores.\n\nConsideran que un investigador sin autorización es una amenaza, incluso si lleva tres siglos muerto. Se ha abierto un expediente disciplinario al investigador.',
  },
  'simbolo-a1': {
    title: 'Diagrama A-1', kind: 'informe', level: 8,
    body: 'Diagrama recuperado: diez círculos enlazados en un único anillo.\nEtiqueta: «ARQUITECTURA — vista completa».\n\nNota al pie: «Diez no es el número de dimensiones. Es el número de intentos».',
  },
  'frag-fractura': {
    title: 'Fragmento III · Fractura', kind: 'fragmento', level: 9, fragment: 'F',
    body: 'Orden firmada por la Dra. Elara Voss:\n«Detened el experimento. Ahora».\n\nFecha de la orden: 11/09/2188.\nFecha oficial del accidente: 11/09/2189.\n\nAlguien detuvo un accidente que todavía no había ocurrido. O no lo detuvo.',
  },
  'decisiones-09': {
    title: 'Registro de decisiones 09', kind: 'informe', level: 9,
    body: 'Mecanismo A: eficiente.\nMecanismo B: lento.\n\nRecomendación del sistema: A.\nMotivo: no se han detectado motivos para B.',
  },
  'frag-eco': {
    title: 'Fragmento II · Eco', kind: 'fragmento', level: 10, fragment: 'E',
    body: 'Registro de sesión.\n\n«Sujeto 47 alcanza la cámara final. Sesión nº 46».\n«Sujeto 47 alcanza la cámara final. Sesión nº 47».\n«Sujeto 47 alcanza la cámara final. Sesión nº 48».\n\nLas tres entradas tienen la misma fecha: hoy.',
  },
  'grabacion-final': {
    title: 'Grabación sin fecha', kind: 'audio', level: 10,
    body: '[Voz identificada: sujeto 47]\n\n«Si has llegado hasta aquí, no vuelvas a confiar en NEXO».\n\n[Metadatos: grabación creada después de su reproducción].',
  },
};

export const FRAGMENTS_TOTAL = 10;

export const ACHIEVEMENTS = [
  { id: 'sujeto47', title: 'Sujeto 47', desc: 'Completa el Capítulo 1.' },
  { id: 'comite', title: 'El comité está satisfecho', desc: 'Resuelve un puzle de tres dimensiones sin consultar pistas.' },
  { id: 'burocracia', title: 'La burocracia prevalece', desc: 'Reúne todos los documentos del capítulo.' },
  { id: 'noerapuerta', title: 'No era una puerta', desc: 'Descubre una salida alternativa.' },
  { id: 'confianza', title: 'Confianza razonable', desc: 'Completa una sala después de recibir una advertencia de NEXO.' },
  { id: 'fragmentos', title: 'Lo que falta también cuenta', desc: 'Encuentra los tres fragmentos ocultos del capítulo.' },
];

// Comentarios de NEXO ante eventos. Breves; nunca ocultan la regla.
export const QUIPS = {
  interference: {
    player: (d) => `Interferencia: en ${d} hay algo sólido justo donde estás. La realidad no admite dos cosas en el mismo sitio. Ni siquiera tú.`,
    block: (d) => `Interferencia: un bloque quedaría dentro de una pared o sobre el vacío en ${d}. Mueve el bloque antes de cambiar.`,
  },
  dimLocked: 'Esa dimensión aún no está disponible en este sector. El comité la está evaluando.',
  dimRecording: 'No puedes cambiar de dimensión mientras grabas. El eco vive en Eco. Es su única ambición.',
  echoLocked: 'En esta sala no hay ecos disponibles. Solo tú. Lo siento.',
  echoWrongDim: 'Los ecos solo se graban en Eco. Cambia de dimensión primero.',
  recordStart: 'Grabando. Todo lo que hagas podrá ser repetido en tu contra.',
  recordCancel: 'Grabación cancelada. No había nada que grabar. Muy simbólico.',
  echoStart: (n) => `Eco creado: ${n} ${n === 1 ? 'turno' : 'turnos'}. Has vuelto al punto de partida. El eco no.`,
  echoAuto: 'Límite de grabación alcanzado. El eco tiene memoria limitada. Como la plantilla.',
  fractureBlocked: 'La palanca no responde: una pared aparecería encima de algo. O de alguien.',
  leverSpent: 'Palanca de un solo uso. Ya la usaste. La dirección te lo agradece.',
  fracture: 'Estructura desplazada. En todas las dimensiones. Sin rellenar el formulario.',
  consoleOk: (p, t) => `Consola aceptada. Secuencia ${p}/${t}.`,
  consoleBad: 'Secuencia incorrecta. Reiniciando protocolo. No te lo tomes como algo personal; yo sí lo haría.',
  consoleDone: 'Protocolo completo. El archivo se abre. Con evidente desgana.',
  docSecret: 'Fragmento recuperado. No figura en ningún inventario. Eso suele ser buena señal. O muy mala.',
  resets: [
    'Sala reiniciada. Nadie lo ha visto. Bueno, yo.',
    'Reinicio registrado. La persistencia es tu mayor virtud. Según tu expediente, también tu mayor defecto.',
    'Otro reinicio. Lo apunto como «metodología iterativa».',
  ],
};
