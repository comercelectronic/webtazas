# Tassa de Mots — botiga en línia

Tasses amb paraules catalanes poc habituals. Web estàtica generada a partir de
dades + Netlify Functions per al pagament (Stripe), l'estoc, les valoracions i
la newsletter.

## Com està organitzat

| Carpeta / fitxer | Què hi ha |
| --- | --- |
| `data/catalog.json` | Les tasses: nom, categoria, definicions, imatges i relacionades. |
| `data/site.json` | **Preu únic (`unitPriceCents`)**, enviament, packs, categories, dades legals del titular i fitxa tècnica. |
| `scripts/` | Generador de pàgines (`npm run build`). |
| `assets/` | Estils, JavaScript, icones i tipografies (allotjades al propi web, sense Google Fonts). |
| `netlify/functions/` | Pagament, webhook de Stripe, estoc, valoracions, newsletter i administració. |
| `tests/` | Proves de les funcions (`npm test`). |
| `index.html`, `tasses/`, `newsletter/`, etc. | **Generats.** No els editis a mà: es tornen a crear a cada build. |
| `joc/` | Projecte independent (joc «Agència Digital»). |

El preu que es mostra a la web, el de la cistella i el que es cobra a Stripe
surten del mateix valor (`data/site.json → unitPriceCents`, en cèntims).

## Ordres

```bash
npm install
npm run build   # genera les pàgines i avisa de les dades pendents
npm test        # proves de pagament, estoc, valoracions i newsletter
```

Netlify executa `npm run build` a cada desplegament.

## Configuració a Netlify

Variables d'entorn (Site settings → Environment variables):

| Variable | Per a què |
| --- | --- |
| `STRIPE_SECRET_KEY` | Pagaments. Comença per `sk_test_` (proves) o `sk_live_` (real). |
| `STRIPE_WEBHOOK_SECRET` | Webhook de Stripe (`whsec_...`). Endpoint: `/.netlify/functions/stripe-webhook`, esdeveniments `checkout.session.completed` i `checkout.session.async_payment_succeeded`. |
| `ADMIN_PASSWORD` | Contrasenya de `/admin/` (valoracions, newsletter i estoc). |
| `RESEND_API_KEY` | Enviament de correus de la newsletter ([resend.com](https://resend.com)). |
| `NEWSLETTER_FROM` | Remitent verificat a Resend, p. ex. `Tassa de Mots <hola@tassademots.cat>`. |
| `SITE_URL` | Adreça pública, p. ex. `https://tassademots.cat` (per als enllaços dels correus). |
| `HASH_SALT` | Text aleatori llarg per xifrar els identificadors anti-abús. |

Altres passos:
- **Formulari de contacte:** activa *Forms → Form detection* a Netlify. Els missatges hi apareixen i pots activar-ne l'avís per correu.
- **Resend:** cal verificar el domini del remitent (registres DNS) abans d'enviar.
- **Stripe:** activa els rebuts per correu als clients (Settings → Customer emails) si vols que en rebin.
- **Netlify Blobs** (estoc, valoracions, newsletter) no necessita configuració.

## Administració (`/admin/`)

- **Valoracions:** cap es publica sense aprovació. Les sospitoses arriben marcades.
- **Newsletter:** llistat amb data i origen del consentiment, exportació CSV, esborrat i enviament de correus (amb prova prèvia). Cada correu inclou la baixa amb un clic.
- **Estoc i vendes:** buit = sense límit; amb un número, la tassa deixa de vendre's a 0. Les vendes compten només pagaments confirmats.

## Abans de publicar

`npm run build` llista les dades que falten a `data/site.json` (titular, NIF,
domicili, IVA, transportista i fitxa tècnica de les tasses). Mentre falten, es
veuen marcades com a `[Pendent: ...]` a les pàgines legals.

Els textos legals són una base de treball: cal que els revisi un professional
(els comentaris `REVISIÓ JURÍDICA` dins de `scripts/legal.js` indiquen on).
