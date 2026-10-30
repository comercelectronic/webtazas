# Agència Digital — joc de màrqueting d'estètica anime

Un joc narratiu en català en què el jugador crea el seu personatge (nom, tractament i aspecte) i torna a Vic i munta una agència de màrqueting digital. Segueix el guió de campanya «Agència Digital» (versió 1.0): 8 etapes, 37 capítols, 32 lliçons, 13 encàrrecs repetibles i 5 finals.

Es juga des del navegador i es pot instal·lar com a app (PWA) al mòbil o a l'ordinador. Funciona sense connexió un cop carregat.

- **URL:** https://agenciadigital.netlify.app (lloc de Netlify propi, independent de qualsevol altra web).
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
- **Panell del professor:** `/professor.html`. Amb la contrasenya, mostra els alumnes (filtrables per classe), el detall de cada un (lliçons amb primer intent, millor resultat i intents; habilitats; decisions clau) i exporta-ho tot a un CSV per a Excel amb una columna per lliçó. També accepta els fitxers que hagin descarregat els alumnes.
- **Contrasenya:** variable d'entorn `TEACHER_PASSWORD` del lloc de Netlify (obligatòria perquè funcioni el panell).
- **Dades personals:** només s'envia el nom i cognom que escrigui l'alumne i els resultats del joc. No es demana correu ni cap altra dada.

## Taller web (opcional)

Pestanya 🛠️ **Taller**: un curs a part on l'alumne aprèn a crear webs professionals per als clients de l'agència. No és obligatori: la campanya avança igual sense fer-lo, però cada web entregada dona EXP, diners, reputació i confiança.

- **Plataformes:** Wix, WordPress, Webflow, Shopify i Codi + IA (HTML/CSS/JS publicat a Netlify, GitHub Pages o Vercel). L'alumne en tria una o diverses i ho pot canviar quan vulgui; cada nivell mostra la guia pas a pas de les plataformes triades.
- **8 nivells de complexitat creixent:** landing de la fleca → web del restaurant amb reserves i SEO → web corporativa B2B → botiga en línia → landing de conversió amb analítica i UTM → web de marca de l'agència (portafoli, accessibilitat, rendiment) → web multilingüe per a França (hreflang, galetes) → projecte final de scrollytelling. Cada nivell inclou conceptes, una pauta d'animació i un consell professional.
- **Entrega:** l'alumne enganxa l'enllaç públic de la web, marca els requisits del client, explica com l'ha feta (i opcionalment deixa una nota, p. ex. la contrasenya de la botiga). Entregar un nivell desbloqueja el següent. El joc comprova si l'enllaç respon; si no, l'alumne pot entregar igualment i el professor ho veu marcat amb ⚠️.
- **Professorat:** columna «Webs» a la taula, apartat «Taller web» al detall de cada alumne amb tots els enllaços clicables i les reflexions, i columnes per nivell (plataforma i enllaç) al CSV.
- Contingut a `js/data-web.js` (`GD.webPlatforms`, `GD.webLevels`).

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

## Publicació a Netlify

1. Netlify → **Add new project → Import an existing project → GitHub** → repositori `webtazas`.
2. **Branch to deploy:** `agenciadigital` (deixa la resta com està: `netlify.toml` ja diu que es publica l'arrel i on és la funció).
3. **Project name:** `agenciadigital` → l'adreça serà `https://agenciadigital.netlify.app`.
4. **Environment variables:** afegeix `TEACHER_PASSWORD` amb la contrasenya del professorat i torna a desplegar.

Netlify Blobs (on es desen els resultats) s'activa sol, no cal configurar res més.

## Desenvolupament

No hi ha cap pas de compilació: són fitxers estàtics. Per provar-lo en local:

```sh
python3 -m http.server 8000
# obre http://localhost:8000/ (el panell del professor necessita `netlify dev`)
```

Si canvies fitxers del joc, puja la versió de `CACHE` a `sw.js` perquè les apps instal·lades descarreguin la versió nova.
