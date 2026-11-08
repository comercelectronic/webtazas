/* Agència Digital — Taller web (curs opcional de creació de webs per als clients) */
window.GD = window.GD || {};

GD.webPlatforms = {
  wix: { n: T('Wix'), i: '🟦', d: T('Editor visual d\'arrossegar i deixar anar. El més ràpid per començar.'), free: T('Pla gratuït amb l\'adreça usuari.wixsite.com/lloc.'), ideal: T('Comerços, restaurants i serveis locals.'), domains: ['wixsite.com', 'wixstudio.com', 'wix.com', 'editorx.io'] },
  wordpress: { n: T('WordPress'), i: '🟪', d: T('El gestor de continguts més utilitzat del món, amb l\'editor de blocs o Elementor.'), free: T('WordPress.com gratuït (lloc.wordpress.com). Per a Elementor o WooCommerce cal un allotjament (pots provar InstaWP).'), ideal: T('Webs amb blog, continguts i SEO.'), domains: ['wordpress.com', 'wpcomstaging.com', 'instawp', 'elementor.cloud', 'wp.'] },
  webflow: { n: T('Webflow'), i: '🔷', d: T('Disseny visual professional amb control del CSS i interaccions avançades.'), free: T('Pla gratuït amb l\'adreça lloc.webflow.io.'), ideal: T('Webs de marca amb animacions i disseny a mida.'), domains: ['webflow.io'] },
  shopify: { n: T('Shopify'), i: '🟩', d: T('La plataforma de referència per a botigues en línia.'), free: T('Botiga de desenvolupament gratuïta amb un compte de Shopify Partners (lloc.myshopify.com, amb contrasenya).'), ideal: T('Comerç electrònic i catàlegs.'), domains: ['myshopify.com', 'shopify.com'] },
  code: { n: T('Codi + IA'), i: '💻', d: T('HTML, CSS i JavaScript escrits amb l\'ajuda d\'un assistent d\'IA (Claude, ChatGPT, Copilot...). Màxim control i aprenentatge.'), free: T('Publicació gratuïta a Netlify, GitHub Pages o Vercel.'), ideal: T('Aprendre a fons i fer webs totalment a mida.'), domains: ['netlify.app', 'github.io', 'vercel.app', 'pages.dev', 'surge.sh'] }
};

GD.webLevels = [
  {
    n: 1, who: 'carme', bg: 'forn', title: T('Una pàgina per al forn'), sub: T('Pàgina d\'aterratge d\'una sola pàgina'),
    brief: [
      ['carme.n', T('{nom}, ara que la fitxa de Google funciona, la gent em pregunta si tinc web. No vull res complicat.')],
      ['carme.h', T('Que surti l\'horari, on som, que es pugui trucar i que es vegi el pa. I l\'oferta del berenar!')],
      ['pau.t', T('Una pàgina d\'aterratge senzilla, ràpida i que funcioni bé al mòbil.')]
    ],
    reqs: [
      T('Capçalera amb el nom del forn i una frase que digui què el fa especial'),
      T('Horari complet (també el de la tarda!) i adreça'),
      T('Mapa o enllaç «Com arribar» i botó per trucar'),
      T('Almenys 3 fotos de productes amb text alternatiu'),
      T('Secció de l\'oferta «Berenar de tarda»'),
      T('Es veu bé al mòbil (comprovat en vista mòbil)'),
      T('Animació d\'entrada suau: els blocs apareixen en fer scroll')
    ],
    concepts: [
      T('Una <b>pàgina d\'aterratge</b> (landing page) té un sol objectiu. Per al forn: que la gent sàpiga que és obert i hi vagi. Tot el que no ajudi a aquest objectiu sobra.'),
      T('<b>Jerarquia visual</b>: el més important, gran i a dalt (nom, horari, botó). Fes servir com a molt dues tipografies i una paleta de 2 o 3 colors que encaixi amb la marca.'),
      T('Més de la meitat de les visites arriben des del mòbil: dissenya pensant primer en la pantalla petita (<b>mobile first</b>) i fes que els botons es puguin tocar amb el dit.')
    ],
    anim: T('Les animacions han d\'ajudar a llegir, no distreure: aparicions suaus (fade o slide) de 0,3 a 0,6 segons quan el bloc entra a la pantalla.'),
    guides: {
      wix: [
        T('Crea un compte a wix.com i tria una plantilla en blanc o de restauració. Revisa la vista mòbil des del principi (icona del mòbil a dalt).'),
        T('Afegeix seccions amb «Afegeix elements → Secció»: capçalera, horari, productes, oferta i contacte.'),
        T('Botó de trucar: afegeix un botó i, a «Enllaç», tria «Telèfon». Mapa: «Afegeix → Contacte i formularis → Google Maps».'),
        T('Selecciona cada imatge → «Configuració» → escriu el text alternatiu (què es veu a la foto).'),
        T('Animació: selecciona una secció o element → icona «Animació» → tria «Fade In» o «Slide In» i ajusta la durada.'),
        T('Publica (botó «Publica») i copia l\'adreça usuari.wixsite.com/nom-del-lloc.')
      ],
      wordpress: [
        T('Crea un lloc gratuït a wordpress.com i tria un tema basat en blocs (per exemple, Twenty Twenty-Four).'),
        T('Edita la pàgina d\'inici amb l\'editor de blocs: bloc «Portada» per a la capçalera, «Columnes» per a l\'horari i «Galeria» per als productes.'),
        T('Botó de trucar: bloc «Botons» amb l\'enllaç tel:+34XXXXXXXXX. Mapa: bloc «Incrusta» o un botó «Com arribar» amb l\'enllaç de Google Maps.'),
        T('A cada imatge, omple el camp «Text alternatiu» de la barra lateral.'),
        T('Animació: alguns temes porten patrons amb efectes; si tens Elementor, a cada element ves a «Avançat → Efectes de moviment → Animació d\'entrada».'),
        T('Previsualitza en mode mòbil i publica. Copia l\'adreça nom.wordpress.com.')
      ],
      webflow: [
        T('Crea un compte a webflow.com i un projecte en blanc. Treballa els punts de ruptura d\'escriptori i de mòbil.'),
        T('Construeix l\'estructura amb «Section → Container → Div Block» i fes servir classes reutilitzables (per exemple, «boto-principal»).'),
        T('Botó de trucar: element «Button» amb enllaç de tipus telèfon. Mapa: element «Map» o un enllaç a Google Maps.'),
        T('A cada imatge: «Settings» → «Alt text».'),
        T('Animació: selecciona el bloc → panell «Interactions» → «Scroll into view» → acció «Fade in» o «Slide in».'),
        T('Publica a l\'adreça gratuïta nom.webflow.io.')
      ],
      shopify: [
        T('Shopify serveix per vendre, però també hi pots fer una pàgina de presentació. Crea una botiga de desenvolupament gratuïta des de partners.shopify.com.'),
        T('A «Online Store → Themes → Customize», treu les seccions de productes que no calguin i afegeix «Image banner», «Rich text» i «Multicolumn» per a l\'horari i l\'oferta.'),
        T('Botó de trucar dins d\'una secció de text amb l\'enllaç tel:. Mapa: secció «Custom Liquid» amb l\'iframe de Google Maps.'),
        T('Afegeix el text alternatiu de cada imatge des de l\'editor de la secció o des de «Content → Files».'),
        T('Animació: a «Theme settings → Animations» activa l\'aparició de seccions en fer scroll (temes com Dawn).'),
        T('La botiga de desenvolupament té contrasenya: escriu-la a la nota de l\'entrega perquè el client (i el professor) la pugui veure.')
      ],
      code: [
        T('Demana a l\'assistent d\'IA: «Crea una landing page en HTML i CSS per a un forn tradicional de Vic amb capçalera, horari, galeria de 3 productes, oferta de berenar i contacte. Mobile first, sense llibreries.» Llegeix el codi i entén cada part.'),
        T('Adapta-la: textos reals, un enllaç <code>tel:</code> per trucar i un iframe de Google Maps.'),
        T('Posa l\'atribut <code>alt</code> a totes les imatges i comprova la vista mòbil amb les eines de desenvolupador del navegador.'),
        T('Animació: demana una aparició amb <code>IntersectionObserver</code> i <code>transition</code> de CSS, que respecti <code>prefers-reduced-motion</code>.'),
        T('Publica gratis arrossegant la carpeta a app.netlify.com/drop (o amb GitHub Pages) i copia l\'adreça .netlify.app.'),
        T('No publiquis mai codi que no entens: pregunta a la IA què fa cada línia que et sembli estranya.')
      ]
    },
    pro: T('Abans d\'entregar, obre la web des d\'un mòbil real i prova tots els botons.'),
    reward: { xp: 120, money: 250, rep: 2, trust: 'carme' }
  },
  {
    n: 2, who: 'jordi', bg: 'restaurant', title: T('La web del restaurant amb reserves'), sub: T('Web de diverses seccions, reserves i SEO bàsic'),
    brief: [
      ['jordi.h', T('{nom}, el menú de migdia ha funcionat! Ara vull una web de veritat.')],
      ['jordi.n', T('Carta, menú del dia, fotos... i que la gent pugui reservar sense trucar, que al migdia no despengem.')],
      ['pau.t', T('Diverses seccions, reserves en línia i SEO bàsic perquè surti a Google.')]
    ],
    reqs: [
      T('Menú de navegació amb enllaços a les seccions (Carta, Menú del dia, Galeria, Reserves, Contacte)'),
      T('Carta amb categories i preus, i menú del dia fàcil d\'actualitzar'),
      T('Formulari o sistema de reserves (data, hora, persones i telèfon)'),
      T('Galeria de fotos optimitzades (poc pes)'),
      T('Bloc de ressenyes o testimonis'),
      T('Títol i meta descripció pensats per a una cerca com «restaurant Tona menú migdia»'),
      T('Animacions: efecte en passar per sobre dels botons (hover) i aparició de seccions en fer scroll')
    ],
    concepts: [
      T('Una web amb diverses seccions necessita una <b>navegació</b> clara: qualsevol informació important ha d\'estar a un o dos clics.'),
      T('El <b>SEO bàsic</b> comença a cada pàgina: un títol únic (fins a uns 60 caràcters), una meta descripció atractiva (unes 150) i encapçalaments ordenats (un H1 i després H2).'),
      T('Les imatges pesades són la primera causa de webs lentes. Redueix-les abans de pujar-les (WebP o JPG comprimit, menys de 300 KB).')
    ],
    anim: T('Els estats <b>hover</b> (en passar el ratolí) i <b>focus</b> (amb el teclat) indiquen que un element és clicable: canvi de color, ombra o un petit desplaçament.'),
    guides: {
      wix: [
        T('Crea les seccions i enllaça-les des del menú amb àncores («Afegeix → Menú i àncores»).'),
        T('Reserves: afegeix l\'app «Wix Table Reservations» o un formulari de «Wix Forms» amb data, hora i persones.'),
        T('Carta: fes servir l\'app de menús de restaurant de Wix o una llista; així el menú del dia s\'actualitza sense tocar el disseny.'),
        T('SEO: a la configuració SEO de la pàgina (o a la llista de comprovació SEO de Wix) escriu el títol i la descripció.'),
        T('Hover: selecciona el botó → «Disseny» → estat «Hover» i canvia color o ombra. Aparició: panell «Animació» a cada secció.'),
        T('Comprimeix les imatges abans de pujar-les (per exemple, amb squoosh.app).')
      ],
      wordpress: [
        T('Crea el menú de navegació a l\'editor del lloc (bloc «Navegació») amb enllaços a cada secció o pàgina.'),
        T('Reserves: el bloc de formulari de Jetpack (a WordPress.com) o un connector de reserves si tens allotjament propi.'),
        T('Carta: blocs «Taula» o «Llista», o un patró de menú del tema.'),
        T('SEO: omple l\'extracte de la pàgina i, si pots, instal·la Yoast SEO o Rank Math per al títol i la meta descripció.'),
        T('Hover i aparicions: a Elementor, «Estil → Hover» als botons i «Efectes de moviment» a les seccions. Amb blocs, fes servir els estils de botó del tema.'),
        T('Puja imatges ja optimitzades: WordPress en crea còpies petites, però l\'original ha de ser lleuger.')
      ],
      webflow: [
        T('Navegació amb el component «Navbar» (fixa amb «Position: Sticky») i enllaços a l\'ID de cada secció.'),
        T('Reserves: «Form Block» amb camps de data, hora i persones; Webflow t\'envia les respostes per correu.'),
        T('Carta: una «CMS Collection» de plats per actualitzar-la sense tocar el disseny (el pla gratuït té un límit d\'elements).'),
        T('SEO: «Page settings → SEO Settings» per al títol i la meta descripció.'),
        T('Hover: estat «Hover» al panell d\'estil. Aparició: «Interactions → Scroll into view» a cada secció.'),
        T('Webflow genera imatges responsives, però puja-les ja comprimides.')
      ],
      shopify: [
        T('Crea les pàgines «Carta» i «Reserves» a «Online Store → Pages» i afegeix-les al menú de navegació.'),
        T('Reserves: una app de reserves de taula de la Shopify App Store o un formulari de contacte amb camps personalitzats.'),
        T('Carta: seccions «Multicolumn» o «Collapsible content» amb categories i preus.'),
        T('SEO: a cada pàgina, apartat de vista prèvia del motor de cerca per al títol i la descripció.'),
        T('Hover i aparicions: «Theme settings → Animations» (en els temes que ho permeten).'),
        T('Recorda posar la contrasenya de la botiga a la nota de l\'entrega.')
      ],
      code: [
        T('Demana a la IA una web amb navegació fixa i àncores (#carta, #reserves...) i un menú hamburguesa per al mòbil. Comprova que funciona.'),
        T('Reserves: formulari HTML enviat amb Netlify Forms (atribut <code>data-netlify="true"</code>) o amb Formspree.'),
        T('Carta: guarda els plats en un fitxer JSON o un array de JavaScript i genera la llista; així el menú del dia s\'actualitza fàcilment.'),
        T('SEO: <code>&lt;title&gt;</code>, <code>&lt;meta name="description"&gt;</code> i un sol <code>&lt;h1&gt;</code>.'),
        T('Hover amb <code>:hover</code> i <code>:focus-visible</code>; aparició de seccions amb IntersectionObserver.'),
        T('Imatges en WebP i <code>loading="lazy"</code>.')
      ]
    },
    pro: T('Prova el formulari de reserva amb el teu correu: un formulari que no arriba és pitjor que no tenir-ne.'),
    reward: { xp: 160, money: 400, rep: 2 }
  },
  {
    n: 3, who: 'miquel', bg: 'fabrica', title: T('La web corporativa industrial'), sub: T('Web de diverses pàgines per a compradors B2B'),
    brief: [
      ['miquel.a', T('La web del 2011 fa vergonya. Necessito una web seriosa.')],
      ['miquel.n', T('Pàgines de productes amb fitxes tècniques, i un formulari que em digui si qui escriu és un comprador de debò.')],
      ['pau.t', T('Una web de diverses pàgines, pensada per a compradors i per al SEO industrial.')]
    ],
    reqs: [
      T('Almenys 4 pàgines: Inici, Productes, Empresa i Contacte'),
      T('Pàgina de producte amb especificacions i una fitxa tècnica descarregable (PDF)'),
      T('Formulari de contacte qualificat: empresa, sector, necessitat i volum aproximat'),
      T('Títol i meta descripció diferents a cada pàgina'),
      T('Peu de pàgina amb dades de contacte i enllaços legals'),
      T('Animació professional a la capçalera: vídeo de fons, parallax suau o comptadors animats')
    ],
    concepts: [
      T('Una <b>web corporativa B2B</b> ha de transmetre confiança: dades concretes, certificacions, clients i fotos reals de la fàbrica.'),
      T('L\'<b>arquitectura de la informació</b> organitza les pàgines segons el que busca l\'usuari (per família de producte, per sector...). Dibuixa el mapa del lloc abans de dissenyar.'),
      T('Cada pàgina és una porta d\'entrada des de Google: necessita el seu títol, la seva descripció i contingut útil propi.')
    ],
    anim: T('En una web corporativa, les animacions han de ser sòbries: un vídeo de fons curt i lleuger, un parallax subtil o comptadors (anys, clients, peces) que s\'animen una sola vegada.'),
    guides: {
      wix: [
        T('Crea les pàgines a «Pàgines i menú» amb la mateixa capçalera i peu a totes.'),
        T('Fitxa tècnica: puja el PDF i enllaça-hi des d\'un botó (tipus d\'enllaç «Document»).'),
        T('Formulari: «Wix Forms» amb camps desplegables per al sector i el volum.'),
        T('SEO per pàgina: menú de cada pàgina → configuració SEO.'),
        T('Capçalera: franja amb vídeo de fons, o efecte de desplaçament «Parallax» a la imatge de fons de la franja.'),
        T('Comptadors: un número gran amb animació d\'entrada o una app de comptadors del mercat d\'apps.')
      ],
      wordpress: [
        T('Crea les pàgines i un menú amb un submenú de productes.'),
        T('Fitxa tècnica: bloc «Fitxer» per pujar el PDF amb botó de descàrrega.'),
        T('Formulari: bloc de formulari de Jetpack, Contact Form 7 o WPForms amb camps de selecció.'),
        T('SEO per pàgina amb Yoast o Rank Math.'),
        T('Capçalera: bloc «Portada» amb vídeo de fons i l\'opció de fons fix per a un efecte parallax. Amb Elementor, widget «Comptador».')
      ],
      webflow: [
        T('Crea pàgines estàtiques i, per als productes, una «CMS Collection» amb una plantilla de pàgina de producte.'),
        T('Fitxa tècnica: camp de fitxer a la col·lecció i un botó que hi enllaci.'),
        T('Formulari: «Form Block» amb camps «Select» per al sector i el volum.'),
        T('SEO: a la plantilla CMS, fes servir camps dinàmics per al títol i la descripció.'),
        T('Capçalera: «Background Video» i una interacció «While scrolling in view» per al parallax. Comptadors: una interacció o un fragment de codi personalitzat.')
      ],
      shopify: [
        T('Crea els productes (amb el preu ocult o «sota pressupost») i col·leccions per família.'),
        T('Fitxa tècnica: puja el PDF a «Content → Files» i enllaça-hi des de la descripció del producte.'),
        T('Formulari: pàgina de contacte amb camps personalitzats o una app per demanar pressupost.'),
        T('SEO per pàgina i per producte a la vista prèvia del motor de cerca.'),
        T('Capçalera: secció «Video» o «Image banner» amb les animacions del tema activades.')
      ],
      code: [
        T('Demana a la IA una estructura de diverses pàgines (index.html, productes.html, empresa.html, contacte.html) amb un CSS compartit.'),
        T('Fitxa tècnica: enllaç <code>&lt;a href="fitxa.pdf" download&gt;</code>.'),
        T('Formulari amb <code>&lt;select&gt;</code> per al sector i el volum, enviat amb Netlify Forms o Formspree.'),
        T('Títol i descripció propis a cada fitxer HTML.'),
        T('Capçalera: <code>&lt;video autoplay muted loop playsinline&gt;</code> amb imatge de pòster, i comptadors animats amb JavaScript que s\'activen amb IntersectionObserver.')
      ]
    },
    pro: T('Pensa en l\'enginyer que entra des del mòbil a peu de màquina: la fitxa tècnica ha d\'estar a dos tocs.'),
    reward: { xp: 200, money: 600, rep: 3, trust: 'miquel' }
  },
  {
    n: 4, who: 'nuria', bg: 'botiga', title: T('La botiga en línia'), sub: T('Comerç electrònic amb carretó i pagament de prova'),
    brief: [
      ['nuria.h', T('Ja tenim clients de tot Catalunya! Ara vull una botiga en línia de veritat.')],
      ['nuria.n', T('Amb carretó, pagament i que quedi molt clar com funciona l\'enviament en fred.')],
      ['pau.t', T('Comerç electrònic: catàleg, fitxes, carretó, pagament de prova i pàgines legals.')]
    ],
    reqs: [
      T('Catàleg amb almenys 6 productes i categories'),
      T('Fitxa de producte completa: fotos, pes, conservació, al·lèrgens i preu'),
      T('Cost i condicions d\'enviament visibles abans del pagament'),
      T('Carretó i pagament funcionant en mode de prova'),
      T('Pàgines legals: avís legal, privacitat, cookies i condicions de venda'),
      T('Microinteraccions: animació en afegir al carretó i en passar per sobre de les fotos')
    ],
    concepts: [
      T('Una botiga en línia és un <b>embut</b>: catàleg → fitxa → carretó → pagament. Cada pas ha de ser clar i ràpid.'),
      T('Una botiga ha de mostrar les dades de l\'empresa, les condicions de venda, la política de devolucions, la privacitat i les cookies.'),
      T('Prova sempre en <b>mode de prova</b> (sandbox) abans de cobrar de veritat: ningú no ha de pagar res per revisar la teva entrega.')
    ],
    anim: T('Les <b>microinteraccions</b> confirmen accions: el botó canvia a «Afegit ✓», la icona del carretó fa un petit bot, la foto s\'amplia en passar-hi per sobre.'),
    guides: {
      wix: [
        T('Afegeix «Wix Stores» i crea els productes amb fotos, descripció i variants (pes).'),
        T('Enviament: configuració d\'enviament i lliurament amb regles per zones i enviament gratuït a partir d\'un import.'),
        T('Pagament: configura un mètode de pagament en mode de prova.'),
        T('Pàgines legals: crea-les i enllaça-les al peu. Activa el bàner de cookies a la configuració de privadesa.'),
        T('Microinteraccions: a la galeria de productes, activa l\'efecte en passar per sobre (zoom o segona imatge) i un efecte al botó «Afegeix al carretó».')
      ],
      wordpress: [
        T('Per a una botiga amb WordPress cal WooCommerce, que necessita allotjament propi o un pla de WordPress.com que el permeti (pots provar amb InstaWP).'),
        T('Crea els productes a WooCommerce amb atributs (pes) i categories.'),
        T('Enviament: «WooCommerce → Configuració → Enviament» amb zones i enviament gratuït a partir d\'un import.'),
        T('Pagament: Stripe en mode de prova, o un mètode de pagament fora de línia per provar el flux.'),
        T('Pàgines legals: WooCommerce et proposa la de privacitat; afegeix la resta i un connector de cookies.'),
        T('Microinteraccions: amb Elementor o amb CSS addicional al personalitzador del tema.')
      ],
      webflow: [
        T('Activa «Ecommerce» al projecte (per publicar el pagament cal un pla d\'Ecommerce; per aprendre, pots construir el catàleg i el carretó).'),
        T('Crea els productes i categories, amb camps personalitzats per a conservació i al·lèrgens.'),
        T('Enviament: a la configuració d\'Ecommerce, zones i tarifes d\'enviament.'),
        T('Pagament: connecta Stripe en mode de prova.'),
        T('Microinteraccions: interacció al botó d\'afegir al carretó i escala en passar per sobre de les imatges.'),
        T('Si el pla gratuït no et deixa publicar el pagament, explica-ho a la nota i entrega el lloc webflow.io amb el flux fins al carretó.')
      ],
      shopify: [
        T('És la plataforma ideal per a aquest nivell. Crea els productes amb fotos, variants i metacamps (conservació, al·lèrgens).'),
        T('Enviament: «Settings → Shipping and delivery» amb zones i enviament gratuït a partir d\'un import.'),
        T('Pagament: a la botiga de desenvolupament, activa la passarel·la de proves («Bogus Gateway») o el mode de prova de Shopify Payments.'),
        T('Pàgines legals: «Settings → Policies» genera plantilles de privacitat, devolucions i condicions; revisa-les.'),
        T('Microinteraccions: «Theme settings → Animations» i l\'efecte de segona imatge en passar per sobre.'),
        T('Escriu la contrasenya de la botiga a la nota de l\'entrega.')
      ],
      code: [
        T('Demana a la IA un catàleg amb fitxes de producte generades des d\'un fitxer JSON i un carretó desat a <code>localStorage</code>.'),
        T('Pagament: «Payment Links» de Stripe en mode de prova o Snipcart. No programis mai tu el cobrament amb targeta.'),
        T('Mostra el cost d\'enviament a la fitxa i al carretó abans de pagar.'),
        T('Pàgines legals: un fitxer HTML per a cadascuna, enllaçades al peu.'),
        T('Microinteraccions: animació amb <code>@keyframes</code> a la icona del carretó i <code>transform: scale()</code> a les fotos.')
      ]
    },
    pro: T('Fes una comanda de prova completa, de principi a fi, com si fossis un client.'),
    reward: { xp: 250, money: 800, rep: 3 }
  },
  {
    n: 5, who: 'sergi', bg: 'despatx', title: T('Landing de campanya que converteix'), sub: T('Conversió, analítica i formulari amb consentiment'),
    brief: [
      ['sergi.h', T('Llancem la col·lecció d\'hivern de Cim Trail! Vull una pàgina per a la campanya amb un codi de descompte.')],
      ['sergi.n', T('I aquest cop vull saber exactament quanta gent compra des d\'Instagram.')],
      ['pau.t', T('Una landing de conversió amb analítica i un formulari amb consentiment.')]
    ],
    reqs: [
      T('Capçalera amb una proposta clara i un sol botó d\'acció principal'),
      T('Beneficis, testimonis i preguntes freqüents'),
      T('Codi de descompte visible i un botó d\'acció que es manté visible al mòbil'),
      T('Formulari de newsletter amb casella de consentiment sense marcar i enllaç a la privacitat'),
      T('Analítica instal·lada (Google Analytics 4 o similar) i un enllaç de campanya amb paràmetres UTM'),
      T('Animacions lligades al scroll (seccions que apareixen, imatge del producte que es mou)')
    ],
    concepts: [
      T('Una <b>landing de conversió</b> té un sol objectiu i elimina distraccions: sense menú complet i amb la crida a l\'acció repetida.'),
      T('Estructura clàssica: promesa → beneficis → prova social → objeccions (preguntes freqüents) → acció. Cada bloc respon un dubte del comprador.'),
      T('Sense <b>mesura</b> no hi ha aprenentatge: instal·la l\'analítica, defineix la conversió i etiqueta els enllaços amb UTM.')
    ],
    anim: T('Les animacions lligades al <b>scroll</b> guien la mirada cap a l\'acció. No han de retardar el contingut: el text s\'ha de poder llegir encara que l\'animació no es faci.'),
    guides: {
      wix: [
        T('Crea una pàgina nova i amaga-hi la capçalera i el menú generals.'),
        T('Botó sempre visible: selecciona el botó i fixa\'l a la pantalla (a la part inferior en mòbil).'),
        T('Newsletter: «Wix Forms» amb una casella de consentiment obligatòria i l\'enllaç a la privacitat.'),
        T('Analítica: integracions de màrqueting de la configuració → Google Analytics.'),
        T('Animacions de scroll: panell «Animació» a cada element; amb Wix Studio també tens efectes de desplaçament.')
      ],
      wordpress: [
        T('Crea una pàgina amb una plantilla sense capçalera ni peu (o la plantilla de llenç d\'Elementor).'),
        T('Botó sempre visible: a Elementor, «Efectes de moviment → Sticky»; sense Elementor, una mica de CSS addicional.'),
        T('Newsletter: formulari de Jetpack o MailPoet, o el formulari incrustat de Mailchimp, amb casella de consentiment.'),
        T('Analítica: el connector Site Kit de Google o la integració de Google Analytics de WordPress.com (segons el pla).'),
        T('Animacions de scroll: «Efectes de moviment → Efectes de desplaçament» a Elementor.')
      ],
      webflow: [
        T('Crea una pàgina amb un disseny propi, sense la navbar general.'),
        T('Botó sempre visible: «Position: Fixed» a la part inferior, només al punt de ruptura de mòbil.'),
        T('Newsletter: «Form Block» amb una casella de consentiment obligatòria (o integració amb Mailchimp).'),
        T('Analítica: integració de Google Analytics a la configuració del lloc o codi a «Custom code».'),
        T('Animacions de scroll: «Interactions → While scrolling in view» per moure la imatge del producte (parallax).')
      ],
      shopify: [
        T('Crea una pàgina amb una plantilla pròpia per a la campanya i treu les seccions que distreguin.'),
        T('Codi de descompte: «Discounts → Create discount» i mostra el codi a la pàgina.'),
        T('Newsletter: secció «Email signup» amb text de consentiment i enllaç a la privacitat.'),
        T('Analítica: app «Google & YouTube» per connectar GA4; Shopify ja té informes de vendes per origen.'),
        T('Animacions: «Theme settings → Animations» i seccions de vídeo o imatge.')
      ],
      code: [
        T('Demana a la IA una landing amb l\'estructura promesa → beneficis → testimonis → preguntes freqüents → acció, sense menú.'),
        T('Botó sempre visible amb <code>position: sticky</code> o <code>fixed</code> només en pantalles petites (media query).'),
        T('Formulari amb casella de consentiment <code>required</code> i sense marcar per defecte.'),
        T('Analítica: etiqueta de GA4 a la capçalera i enllaç de campanya amb <code>?utm_source=instagram&amp;utm_medium=social&amp;utm_campaign=hivern</code>.'),
        T('Animacions de scroll amb IntersectionObserver, o amb GSAP i ScrollTrigger (demana-ho a la IA i revisa el codi).')
      ]
    },
    pro: T('Obre l\'enllaç amb UTM des d\'un altre dispositiu i comprova a l\'analítica en temps real que la visita apareix amb l\'origen correcte.'),
    reward: { xp: 300, money: 1000, rep: 3 }
  },
  {
    n: 6, who: 'berta', bg: 'oficina', title: T('La web de la teva agència'), sub: T('Web de marca: portfolio, blog, accessibilitat i rendiment'),
    brief: [
      ['julia.t', T('{nom}, som una agència de màrqueting i la nostra web és una plantilla de fa anys.')],
      ['berta.h', T('Si volem clients grans, ha de ser la millor carta de presentació. I amb personalitat: animacions amb gust, no de fira!')],
      ['pau.t', T('Web de marca: portfolio, blog, accessibilitat i rendiment.')]
    ],
    reqs: [
      T('Identitat visual coherent: logotip, paleta de colors i tipografies definides'),
      T('Portfolio amb almenys 3 casos (problema, solució i resultats dels clients del joc)'),
      T('Blog o secció de recursos amb almenys 2 articles'),
      T('Accessibilitat: contrast suficient, textos alternatius i navegació amb teclat'),
      T('Rendiment: puntuació de PageSpeed Insights en mòbil (indica-la a la nota)'),
      T('Animacions de marca (transicions o una animació Lottie) sense perjudicar el rendiment')
    ],
    concepts: [
      T('La web d\'una agència és el seu <b>portfolio</b>: mostra casos amb dades (problema → solució → resultat), no només fotos boniques.'),
      T('L\'<b>accessibilitat</b> no és opcional: contrast mínim de 4,5:1 per al text, textos alternatius, títols ordenats i que tot es pugui fer amb el teclat.'),
      T('El <b>rendiment</b> afecta el SEO i les vendes. Mesura\'l amb PageSpeed Insights (pagespeed.web.dev) i corregeix el que indiqui.')
    ],
    anim: T('Les animacions de marca han de ser coherents amb la personalitat (dinàmica, elegant...), curtes, i s\'han de reduir si l\'usuari prefereix menys moviment.'),
    guides: {
      wix: [
        T('Defineix els colors i les tipografies del lloc al tema del lloc perquè siguin coherents a tot arreu.'),
        T('Portfolio: l\'app de portfolio de Wix o una pàgina dinàmica amb una col·lecció de casos (CMS).'),
        T('Blog: app «Wix Blog».'),
        T('Accessibilitat: l\'assistent d\'accessibilitat de Wix; revisa contrastos i textos alternatius.'),
        T('Animacions de marca: Wix Studio té animacions i efectes de desplaçament més avançats; també pots incrustar una animació Lottie.'),
        T('Rendiment: comprimeix imatges, treu apps innecessàries i mesura amb PageSpeed Insights.')
      ],
      wordpress: [
        T('Defineix colors i tipografies als estils globals de l\'editor del lloc.'),
        T('Portfolio: una categoria o tipus de contingut «Casos» amb una plantilla de pàgina.'),
        T('Blog: és la funció nativa de WordPress; crea 2 entrades amb categories.'),
        T('Accessibilitat: tria un tema accessible i revisa\'l amb WAVE (wave.webaim.org).'),
        T('Animacions: widget Lottie d\'Elementor o un bloc d\'HTML personalitzat.'),
        T('Rendiment: connector de memòria cau i optimització d\'imatges si tens allotjament propi.')
      ],
      webflow: [
        T('Crea un sistema de disseny: variables de color, classes de tipografia i components reutilitzables.'),
        T('Portfolio i blog: dues «CMS Collections» amb pàgines de plantilla.'),
        T('Accessibilitat: el panell d\'auditoria de Webflow detecta errors (alt, contrast, etiquetes).'),
        T('Animacions de marca: «Page load» per a les transicions d\'entrada i integració de Lottie.'),
        T('Rendiment: imatges responsives i poques fonts; mesura amb PageSpeed Insights.')
      ],
      shopify: [
        T('Shopify no és la plataforma natural per a una agència, però pots fer servir les pàgines i el blog integrat.'),
        T('Portfolio: pàgines o metaobjectes per als casos.'),
        T('Accessibilitat: tria un tema accessible (com Dawn) i revisa els contrastos dels colors del tema.'),
        T('Animacions: «Theme settings → Animations» i seccions de vídeo.'),
        T('Rendiment: revisa l\'informe de velocitat de la botiga i treu les apps que no facis servir.')
      ],
      code: [
        T('Defineix variables CSS (colors, tipografies, espais) i demana a la IA components coherents (targetes de casos, capçalera, peu).'),
        T('Portfolio i blog: pàgines HTML o un generador estàtic com Astro o Eleventy (demana a la IA que t\'ajudi a començar).'),
        T('Accessibilitat: HTML semàntic, <code>alt</code>, <code>:focus-visible</code>, i revisió amb Lighthouse.'),
        T('Animacions: View Transitions o una animació Lottie, sempre amb <code>prefers-reduced-motion</code>.'),
        T('Rendiment: imatges WebP, càrrega diferida i Lighthouse a les eines del navegador.')
      ]
    },
    pro: T('Demana a algú que no et conegui que miri la web 10 segons i et digui què fa la teva agència. Si no ho sap, canvia la capçalera.'),
    reward: { xp: 350, money: 0, rep: 5, trust: 'berta' }
  },
  {
    n: 7, who: 'amelie', bg: 'franca', title: T('Web multilingüe per a França'), sub: T('Català i francès, SEO internacional i cookies'),
    brief: [
      ['amelie.h', T('Bonjour {nom}! La campanya francesa ha d\'aterrar en una web en francès de veritat, no en una traducció automàtica.')],
      ['amelie.n', T('I ha de complir les normes europees de cookies, és clar.')],
      ['pau.t', T('Web multilingüe (català i francès) amb SEO internacional.')]
    ],
    reqs: [
      T('Dues versions d\'idioma (català i francès) amb un selector d\'idioma visible'),
      T('Textos localitzats, no traduïts literalment: certificacions, preus i enviament per a França'),
      T('URL o etiquetes d\'idioma correctes (hreflang o la funció multilingüe de la plataforma)'),
      T('Bàner de cookies que permeti rebutjar tan fàcilment com acceptar'),
      T('Catàleg o pàgina de productes amb la informació de la certificació bio'),
      T('Animació elegant a la galeria de productes (carrusel suau i controlable)')
    ],
    concepts: [
      T('Una web <b>multilingüe</b> necessita una estructura clara (per exemple, /ca/ i /fr/) i que els cercadors sàpiguen quina versió és per a cada idioma (<b>hreflang</b>).'),
      T('Localitzar és adaptar: el comprador francès busca «certifié bio», preus amb impostos inclosos i devolució gratuïta.'),
      T('A la UE, el consentiment de cookies ha de ser lliure: rebutjar ha de ser tan fàcil com acceptar, i les cookies no necessàries no es carreguen abans del consentiment.')
    ],
    anim: T('Un carrusel ha de ser controlable (fletxes, pausa) i no passar massa ràpid: l\'usuari ha de tenir temps de llegir.'),
    guides: {
      wix: [
        T('Activa «Wix Multilingual» i afegeix el francès: Wix crea les adreces per idioma i les etiquetes hreflang.'),
        T('Localitza cada pàgina al gestor de traduccions i revisa-la tu: no et quedis la traducció automàtica sense més.'),
        T('Cookies: activa el bàner de cookies de la configuració de privadesa, amb les opcions d\'acceptar i rebutjar.'),
        T('Carrusel: una galeria en mode presentació amb transició suau i controls.')
      ],
      wordpress: [
        T('Instal·la un connector multilingüe (WPML, Polylang o TranslatePress) si tens allotjament propi; a WordPress.com, segons el pla.'),
        T('Crea la versió francesa de cada pàgina i el selector d\'idioma al menú.'),
        T('Cookies: un connector de consentiment (Complianz, CookieYes...) configurat amb el botó «Rebutjar».'),
        T('Carrusel: bloc o widget de carrusel amb transició suau i fletxes.')
      ],
      webflow: [
        T('Fes servir Webflow Localization (segons el pla) o crea una carpeta /fr/ amb pàgines duplicades i etiquetes hreflang a «Custom code».'),
        T('Selector d\'idioma a la navbar amb enllaços a cada versió.'),
        T('Cookies: integra un gestor de consentiment (per exemple, CookieYes o el de Finsweet).'),
        T('Carrusel: element «Slider» amb animació de lliscament o fosa i controls.')
      ],
      shopify: [
        T('Afegeix el francès a «Settings → Languages» i tradueix amb l\'app «Translate & Adapt» (revisant els textos).'),
        T('Fes servir «Markets» per a França: moneda, preus i enviament específics.'),
        T('Cookies: «Settings → Customer privacy» per activar el bàner de cookies.'),
        T('Carrusel: secció «Slideshow» del tema amb pausa automàtica.')
      ],
      code: [
        T('Carpetes /ca/ i /fr/ amb l\'atribut <code>lang</code> correcte i etiquetes <code>&lt;link rel="alternate" hreflang&gt;</code>.'),
        T('Demana a la IA que t\'ajudi a localitzar, però revisa-ho amb algú que parli francès si pots.'),
        T('Cookies: si no fas servir cookies d\'analítica, no cal bàner; si en fas servir, una solució de consentiment que bloquegi els scripts fins que s\'acceptin.'),
        T('Carrusel accessible amb botons i <code>aria-live</code>, amb una transició CSS suau.')
      ]
    },
    pro: T('Demana a algú que parli francès que llegeixi la pàgina en veu alta: si sona a traducció, encara no està localitzada.'),
    reward: { xp: 400, money: 1200, rep: 3 }
  },
  {
    n: 8, who: 'marta', bg: 'oficina', title: T('Llançament premium amb storytelling'), sub: T('Projecte final: animacions avançades, rendiment i analítica'),
    brief: [
      ['marta.n', T('{nom}, llancem el nou iogurt de la Plana a tot Catalunya.')],
      ['marta.h', T('Vull una web de llançament espectacular, que expliqui la història del producte mentre fas scroll, i que mesuri cada pas de l\'embut.')],
      ['pau.t', T('El projecte final: animacions avançades, rendiment, accessibilitat i analítica de conversió.')]
    ],
    reqs: [
      T('Storytelling amb scroll: la història del producte s\'explica en almenys 4 escenes'),
      T('Animacions avançades (parallax, elements fixats mentre es fa scroll, microinteraccions) que funcionen bé al mòbil'),
      T('Formulari de captació connectat a una eina de correu o CRM, amb consentiment'),
      T('Analítica amb esdeveniments: clic al botó principal i enviament del formulari'),
      T('Accessibilitat i rendiment revisats (indica la puntuació de Lighthouse o PageSpeed a la nota)'),
      T('Presentació del projecte a la nota: què has fet, com es mesura i què milloraries')
    ],
    concepts: [
      T('El <b>scrollytelling</b> explica una història a mesura que l\'usuari fa scroll: cada escena té un missatge i una imatge clau.'),
      T('Les animacions avançades han de tenir un propòsit, carregar ràpid i respectar <code>prefers-reduced-motion</code>. Prova-les en un mòbil normal, no només a l\'ordinador.'),
      T('Un projecte professional es documenta: què s\'ha fet, com es mesura i què es pot millorar.')
    ],
    anim: T('Combina tècniques: elements fixats mentre canvia el contingut, parallax en capes, comptadors i una microinteracció al botó final.'),
    guides: {
      wix: [
        T('Fes servir Wix Studio per a animacions avançades: efectes de desplaçament i interaccions per element.'),
        T('Escenes: franges a pantalla completa amb fons fix i text que apareix.'),
        T('Formulari connectat a l\'eina de correu de Wix o a un CRM.'),
        T('Esdeveniments: integració de Google Analytics o Google Tag Manager.'),
        T('Revisa la vista mòbil escena per escena.')
      ],
      wordpress: [
        T('Elementor amb efectes de desplaçament, posició fixa i animacions d\'entrada, o blocs amb un connector d\'animacions.'),
        T('Formulari connectat a Mailchimp o a un CRM (HubSpot té connector gratuït).'),
        T('Esdeveniments amb Google Tag Manager (connector o codi a la capçalera).'),
        T('Memòria cau i optimització d\'imatges per mantenir el rendiment amb tantes animacions.')
      ],
      webflow: [
        T('És la plataforma ideal: interaccions «While scrolling in view», elements fixats i animacions d\'escena; Webflow també integra GSAP.'),
        T('Formulari connectat a Mailchimp o HubSpot (integracions o webhook).'),
        T('Esdeveniments amb Google Tag Manager a «Custom code».'),
        T('Revisa el rendiment de les interaccions al mòbil i redueix-les si cal.')
      ],
      shopify: [
        T('Crea una pàgina de llançament amb seccions de vídeo, imatge amb text i «Custom Liquid» per als efectes avançats.'),
        T('Formulari connectat a Shopify Email o a Klaviyo.'),
        T('Esdeveniments amb els píxels personalitzats de «Customer events» i GA4.'),
        T('Mantén el tema lleuger: menys apps, més rendiment.')
      ],
      code: [
        T('Demana a la IA una pàgina d\'scrollytelling amb GSAP i ScrollTrigger (escenes fixades i parallax) i entén cada animació abans de publicar-la.'),
        T('Formulari connectat a Mailchimp o Brevo amb una funció serverless (Netlify Functions) o amb el seu formulari incrustat.'),
        T('Esdeveniments: <code>gtag("event", …)</code> al clic del botó i a l\'enviament del formulari.'),
        T('Lighthouse: objectiu de 90 o més en accessibilitat i bones pràctiques; documenta-ho a la nota.'),
        T('Opcional: domini propi a Netlify o Vercel.')
      ]
    },
    pro: T('Grava un vídeo curt de pantalla del recorregut al mòbil: és la millor manera de presentar el projecte al client.'),
    reward: { xp: 500, money: 2000, rep: 5 }
  }
];
