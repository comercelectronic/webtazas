# El Último Umbral — prototipo jugable (Capítulo 1 · Origen)

Aventura de puzles dimensionales. Esta carpeta contiene las fases 01 (prototipo mecánico) y 02 (vertical slice) del documento de diseño: las diez salas del primer bloque, con Origen, Eco y Fractura, NEXO, archivo de investigación, pistas graduadas, logros, guardado y controles táctiles.

## Jugar

Es una web estática; Three.js va incluido en `vendor/`. En Ajustes se elige 3D (alta o ligera) o 2D clásico; si el dispositivo no tiene WebGL, se usa 2D automáticamente. Desde esta carpeta:

```sh
python3 -m http.server 8000   # y abre http://localhost:8000
```

Se instala como app (PWA) desde el navegador del móvil («Añadir a pantalla de inicio») y funciona sin conexión.

Controles: flechas/WASD o cruceta táctil (también deslizar o tocar el tablero) · `Espacio` esperar · `1` `2` `3` dimensión · `E` grabar/parar eco · `Z` deshacer · `R` reiniciar · `H` pista.

## Pruebas

```sh
node tests/levels.test.js
```

Comprueba que cada sala tiene solución, que los fragmentos secretos son alcanzables y, con una búsqueda exhaustiva, que las salas de Eco (3, 6, 8 y 10) no se pueden resolver sin eco.

## Estructura

| Archivo | Contenido |
| --- | --- |
| `js/engine.js` | Reglas puras, sin DOM. Todas las dimensiones comparten una única función `passable()`. |
| `js/levels.js` | Mapas ASCII y leyendas de las diez salas. |
| `js/story.js` | Diálogos de NEXO, pistas (3 niveles), documentos, fragmentos y logros. |
| `js/renderer3d.js` | Escena 3D de estilo anime con Three.js: sombreado por bandas, contornos de tinta, formas redondeadas, protagonista con pelo de punta y bufanda, círculos mágicos, cielos con rayos, hologramas y animaciones. |
| `js/game.js` | Interfaz, renderizador 2D de respaldo, audio (Web Audio), guardado y métricas locales. |
| `vendor/three/` | Three.js r160 (MIT), copia local para jugar sin conexión. |
| `fonts/` | Tipografía Bangers (SIL OFL) para la interfaz y las onomatopeyas. |
| `tests/levels.test.js` | Verificación automática de las salas. |

## Reglas implementadas

- **Por turnos.** El tiempo solo avanza al moverse o esperar; cambiar de dimensión es instantáneo. Nada de cronómetros.
- **Origen ■**: bloques, placas, puertas. Las placas con símbolo solo notan el peso en esa dimensión; algunas tienen temporizador (⧗).
- **Eco ◎**: se graba en Eco (máx. 16 turnos). Al parar vuelves al inicio de la grabación y el eco repite tus acciones turno a turno; después se queda quieto, pesando sobre lo que pise.
- **Fractura ◆**: las grietas se atraviesan; hay paredes exclusivas; la palanca solo responde aquí, pero desplaza las paredes A/B en todas las dimensiones.
- **Interferencia**: no se puede cambiar a una dimensión donde tú o un bloque quedaríais dentro de algo sólido. Las puertas y los puentes no se cierran con algo encima.
- Deshacer ilimitado y reinicio instantáneo.

## Pendiente (fases 03–05)

Ampliar a 15–25 salas, arte y música definitivos, Instante e Inverso, capítulos de pago y pruebas con jugadores externos (los ajustes incluyen una exportación de métricas locales para eso). Si el proyecto pasa a Godot, `engine.js` y `levels.js` son la referencia de reglas y contenido.
