// Articles de la secció «Idees de regal» (/idees-de-regal/).
// Cada secció pot portar text (HTML) i una llista de tasses (slugs del catàleg),
// que es mostren amb la targeta de producte de la botiga.
// Els preus i els terminis surten de data/site.json: no s'escriuen a mà.
const { PRICE, DELIVERY } = require('./lib');

module.exports = [
  {
    slug: 'amic-invisible-en-catala',
    title: 'Idees per a l\'amic invisible en català (per menys de 12 €)',
    metaTitle: 'Amic invisible: idees de regal en català per menys de 12 €',
    description: 'Regals per a l\'amic invisible de la feina, dels amics o de la família: tasses amb paraules catalanes per a cada manera de ser, per menys de 12 €.',
    published: '2026-11-22',
    image: '/images/tasses/cagadubtes/verd-front.jpg',
    lead: `L'amic invisible té una regla d'or: un pressupost petit i un regal que faci somriure. Si a més és en català i diu alguna cosa de la persona que el rep, millor. Aquí tens idees per a cada mena de company, totes a ${PRICE} amb l'enviament gratuït.`,
    sections: [
      {
        h2: 'Per a qui no és persona fins al primer cafè',
        html: '<p>A tota feina hi ha algú a qui és millor no dir-li res abans de les nou. Un regal per a la tassa de cada matí no falla mai, i amb una frase en català encara fa més gràcia a la sala del cafè.</p>',
        products: ['sense-cafe-no-soc-persona', 'cafe-sol', 'tallat'],
      },
      {
        h2: 'Per a qui sempre arriba tard o no es decideix mai',
        html: '<p>El <em>baliga-balaga</em> diu «arribo en cinc minuts» i arriba en mitja hora. El <em>cagadubtes</em> tarda vint minuts a triar l\'entrepà i al final demana el de sempre. Tots en tenim un al grup, i segur que s\'hi reconeixerà.</p>',
        products: ['baliga-balaga', 'cagadubtes'],
      },
      {
        h2: 'Per al company que se les sap totes',
        html: '<p>El <em>bocamoll</em>, que explica la sorpresa abans d\'hora; la <em>manefla</em>, que s\'assabenta de tots els xafardeigs de l\'oficina; o l\'<em>escalfacadires</em>, amb un talent especial per semblar molt ocupat. Paraules catalanes de tota la vida que, a la feina, encaixen massa bé.</p>',
        products: ['bocamoll', 'manefla', 'escalfacadires'],
      },
      {
        h2: 'Per al de la colla que mai no paga',
        html: '<p>Si el teu amic invisible sempre es deixa la cartera a casa quan toca pagar els cafès, ja saps què li has de regalar.</p>',
        products: ['garrepa', 'llepafils'],
      },
      {
        h2: 'Si no el coneixes gaire: un insult d\'autor (amb afecte)',
        html: '<p>Quan et toca algú que coneixes poc, l\'humor és el camí més segur. Les comparacions catalanes clàssiques fan riure tothom i no ofenen ningú. I si no saps quina triar, l\'<em>Arsenal d\'insults</em> en porta setze en una sola tassa.</p>',
        products: ['mes-pesat-que-una-vaca-en-bracos', 'mes-cara-que-esquena', 'arsenal-insults'],
      },
      {
        h2: 'Si et toca algú que estimes',
        html: '<p>L\'amic invisible de la família o de la colla de sempre és l\'excusa perfecta per dir allò que no dius gaire. <em>Tros de pa</em>, per a la persona més bona que coneixes; <em>aixopluc</em>, per a qui sempre hi és quan plou.</p>',
        products: ['tros-de-pa', 'aixopluc'],
      },
      {
        h2: 'Si vols encertar segur: crea-la tu',
        html: '<p>Si coneixes la paraula que el defineix (o el renom que li diu tothom), la pots posar en una tassa: tries la frase, el dibuix, les emoticones i el color de l\'interior. <a href="/crea-la-teva-tassa/">Crea la teva tassa</a> i veuràs com queda abans de demanar-la.</p>',
      },
      {
        h2: 'Com demanar-la a temps',
        html: `<p>Totes les tasses costen ${PRICE} amb l'enviament inclòs, i triguen ${DELIVERY} a arribar. Si la vols per a un amic invisible amb data, demana-la amb temps i digues-nos quan la necessites: et confirmarem si hi arriba.</p>`,
      },
    ],
  },
  {
    slug: 'regals-de-nadal-en-catala',
    title: 'Regals de Nadal en català: idees per a tothom',
    metaTitle: 'Regals de Nadal en català: idees originals per a tothom',
    description: 'Idees de regal de Nadal en català per a la parella, la família, els amics i la feina: tasses amb paraules catalanes per al tió, el dia de Nadal o Reis.',
    published: '2026-11-22',
    image: '/images/tasses/caliu/taronja-front.jpg',
    lead: `Per al tió, per al dia de Nadal o per Reis: un regal en català té una cosa especial, perquè diu les coses amb les nostres paraules. Hem ordenat les tasses per a qui les vols regalar. Totes costen ${PRICE} amb l'enviament gratuït.`,
    sections: [
      {
        h2: 'Per a la parella',
        html: '<p>Hi ha paraules que diuen <em>t\'estimo</em> sense dir-ho. <em>Caliu</em> és l\'escalfor que no s\'apaga; <em>deler</em>, les ganes de tornar-te a veure encara que fa una estona que us heu dit adeu; <em>encís</em>, la persona que fa màgia de les coses petites. Al darrere de cada tassa hi ha la definició de diccionari i la nostra.</p>',
        products: ['caliu', 'deler', 'encis', 'aixopluc'],
      },
      {
        h2: 'Per a la mare, el pare o els avis',
        html: '<p>Per a qui ha fet de casa un lloc on tothom torna: <em>niu</em>, la casa on sempre hi ha lloc per a tu; <em>arrel</em>, d\'on véns i el que et sosté; <em>tros de pa</em>, per a la persona més bona que coneixes.</p>',
        products: ['niu', 'arrel', 'tros-de-pa'],
      },
      {
        h2: 'Per als amics',
        html: '<p>Els amics de veritat es poden riure de les manies dels altres. Una tassa per al <em>bocamoll</em> del grup, per al <em>cap de trons</em> que té les millors idees a les tres de la matinada o per al <em>corcó</em> que insisteix fins que se surt amb la seva.</p>',
        products: ['bocamoll', 'cap-de-trons', 'corco'],
      },
      {
        h2: 'Per a la feina',
        html: '<p>Per a l\'amic invisible de l\'oficina o per als companys de taula: humor en català per a la tassa de cada dia. També tens el <a href="/#packs">Pack Feina</a>, amb tres paraules de feina a millor preu.</p>',
        products: ['escalfacadires', 'pixatinters', 'pocatraca'],
      },
      {
        h2: 'Per a qui li agrada riure',
        html: '<p>Les nostres «Coses que…» són llistes enginyoses amb un final inesperat. I per als matins de mala lluna, un avís previ: <em>Compte, que avui tinc mala llet</em>.</p>',
        products: ['coses-que-es-veuen-millor-de-lluny', 'coses-que-s-escalfen-de-seguida', 'mala-llet'],
      },
      {
        h2: 'Per a qui ho té tot',
        html: '<p>Si la persona a qui vols regalar ja té de tot, fes-li una tassa única: amb el seu renom, una paraula que només entengueu vosaltres o una frase que digui sovint. <a href="/crea-la-teva-tassa/">Crea la teva tassa</a> amb la paraula, el dibuix i el color que vulguis.</p>',
      },
      {
        h2: 'Packs per regalar a més d\'una persona',
        html: '<p>Si en regales unes quantes, els packs surten a millor preu: el Pack Família, el Pack Parella, el Pack Feina i el Pack Cafè. Els trobaràs a la <a href="/#packs">pàgina d\'inici</a>.</p>',
      },
      {
        h2: 'Quan l\'he de demanar perquè arribi per Nadal?',
        html: `<p>L'enviament és gratuït i triga ${DELIVERY}. Com que les setmanes abans de Nadal van carregades, et recomanem demanar-la amb una mica de marge i dir-nos per a quin dia la vols. Si és personalitzada, compta un parell de dies més per preparar el disseny.</p>`,
      },
    ],
  },
];
