# Agència Digital — joc de màrqueting d'estètica anime

Un joc narratiu en català en què el jugador porta en Pau Riera, que torna a Vic i munta una agència de màrqueting digital. Segueix el guió de campanya «Agència Digital» (versió 1.0): 8 etapes, 37 capítols, 32 lliçons, 13 encàrrecs repetibles i 5 finals.

Es juga des del navegador i es pot instal·lar com a app (PWA) al mòbil o a l'ordinador. Funciona sense connexió un cop carregat.

- **URL:** `/joc/` del lloc web (Netlify publica l'arrel del repositori).
- **Instal·lar com a app:** a Android/Chrome/Edge surt el botó «📲 Instal·lar com a app». A l'iPhone/iPad: Safari → Compartir → «Afegeix a la pantalla d'inici».
- **Partida:** es desa automàticament al dispositiu. Per passar-la d'un dispositiu a un altre (web ↔ app), fes servir Empresa → Exportar / Importar partida.

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
