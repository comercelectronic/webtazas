# Agència Digital — joc de màrqueting d'estètica anime

Un joc narratiu en català en què el jugador crea el seu personatge (nom, tractament i aspecte) i torna a Vic i munta una agència de màrqueting digital. Segueix el guió de campanya «Agència Digital» (versió 1.0): 8 etapes, 37 capítols, 32 lliçons, 13 encàrrecs repetibles i 5 finals.

Es juga des del navegador i es pot instal·lar com a app (PWA) al mòbil o a l'ordinador. Funciona sense connexió un cop carregat.

- **URL:** `/joc/` del lloc web (Netlify publica l'arrel del repositori).
- **Instal·lar com a app:** a Android/Chrome/Edge surt el botó «📲 Instal·lar com a app». A l'iPhone/iPad: Safari → Compartir → «Afegeix a la pantalla d'inici».
- **Partida:** es desa automàticament al dispositiu. Per passar-la d'un dispositiu a un altre (web ↔ app), fes servir Empresa → Exportar / Importar partida.

## Idiomes

El joc i el panell del professor es poden fer servir en **català, castellà i anglès** (selector a la pantalla inicial, a la pestanya Empresa i al panell del professor). Per defecte s'usa l'idioma del navegador.

- El text original és en català dins dels fitxers de dades i de la interfície, embolcallat amb `T('…')`.
- `js/i18n.js` busca la traducció pel hash del text català als diccionaris `js/i18n-es.js` i `js/i18n-en.js`. Si una frase no té traducció, es mostra en català.
- Si canvies o afegeixes un text en català, cal afegir-ne la traducció als diccionaris (la clau és `T.hash('text català')`).

## Personatge i resultats per al professorat

- **Creació del personatge:** en començar, l'alumne tria nom, cognom, tractament (masculí «en», femení «la» o neutre sense article), pentinat, colors, to de pell i complement. El nom i el tractament substitueixen «Pau» a tot el guió (marcadors `{nom}`, `{nomc}`, `{en}`, `{En}`, `{den}` i `{g:masculí|femení|neutre}` als fitxers de dades). Es pot canviar després des de la pestanya del personatge.
- **Codi de classe:** si l'alumne escriu el codi que li dona el professor, els resultats s'envien automàticament cada vegada que acaba un capítol, un encàrrec o una lliçó (funció `netlify/functions/joc-resultats.js`, desada a Netlify Blobs). Sense connexió, pot descarregar un fitxer de resultats des de la pestanya Empresa.
- **Panell del professor:** `/joc/professor.html`. Amb la contrasenya, mostra els alumnes (filtrables per classe), el detall de cada un (lliçons amb primer intent, millor resultat i intents; habilitats; decisions clau) i exporta-ho tot a un CSV per a Excel amb una columna per lliçó. També accepta els fitxers que hagin descarregat els alumnes.
- **Contrasenya:** variable d'entorn `TEACHER_PASSWORD` a Netlify. Si no existeix, es fa servir `ADMIN_PASSWORD` (la de la pàgina d'estoc).
- **Dades personals:** només s'envia el nom i cognom que escrigui l'alumne i els resultats del joc. No es demana correu ni cap altra dada.

## Què hi ha al joc

| Sistema | On és |
|---|---|
| Campanya de 8 etapes amb gating per nivell (1, 4, 7, 11, 15, 19, 23, 27) | `js/data-story1.js` (etapes 1–2), `js/data-story2.js` (3–5), `js/data-story3.js` (6–8) |
| Estructura de missió: narració → investigació → lliçó → decisió → resultats simulats → recompensa | Tipus de pas `dlg`, `invest`, `lesson`, `choice`/`budget`/`multi`, `sim`, `reward` a `js/game.js` |
| Biblioteca de lliçons amb exercicis, retroacció i repàs | `js/data-lessons.js` |
| Millora del personatge: nivells 1–30, EXP, punts d'habilitat (5 habilitats × 5 nivells), rangs i vestuari que evoluciona | `js/game.js` (SKILLS, RANKS) i `js/art.js` (PAU_OUTFITS) |
| Variables persistents: reputació, confiança per personatge, coneixement per àrea, liquiditat, reserva, clients recurrents, equip, historial de decisions | estat `S` a `js/game.js` |
| Economia setmanal: quotes recurrents, lloguer, eines i sous; els pressupostos dels clients no compten com a ingressos | `advanceWeeks()` a `js/game.js` |
| Encàrrecs lliures repetibles (EXP i diners extra, amb preguntes de repàs) | `GD.gigs` a `js/data-story3.js` |
| 5 finals segons la decisió final i l'estat de l'empresa | `GD.computeEnding` i `GD.endings` a `js/data-story3.js` |
| Retrats anime i escenaris generats en SVG (sense imatges externes) | `js/art.js` |

Totes les empreses, els personatges i els resultats de les campanyes són ficticis i simulats.

## Desenvolupament

No hi ha cap pas de compilació: són fitxers estàtics. Per provar-lo en local:

```sh
python3 -m http.server 8000
# obre http://localhost:8000/joc/
```

Si canvies fitxers del joc, puja la versió de `CACHE` a `sw.js` perquè les apps instal·lades descarreguin la versió nova.
