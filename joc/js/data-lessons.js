/* Agència Digital — biblioteca de lliçons */
window.GD = window.GD || {};
GD.areas = {
  fonaments: 'Fonaments del màrqueting',
  mercat: 'Investigació de mercat',
  marca: 'Marca i creativitat',
  seo: 'SEO',
  xarxes: 'Xarxes socials',
  ads: 'Publicitat digital',
  email: 'Correu i CRM',
  web: 'Web i comerç electrònic',
  analitica: 'Analítica',
  creixement: 'Creixement',
  direccio: 'Direcció empresarial',
  avancat: 'Nivell avançat'
};

GD.lessons = {
  /* ---------- ETAPA 1 ---------- */
  L_mkt: {
    area: 'fonaments', title: 'Què és (i què no és) el màrqueting',
    goal: 'Distingir el màrqueting de la simple publicitat i formular una proposta de valor.',
    body: [
      'El màrqueting és el procés d\'entendre què necessiten unes persones concretes, crear una oferta que hi respongui i fer que la coneguin, la triïn i hi tornin. <b>Publicar a xarxes o fer anuncis només és una part de la feina</b>: abans hi ha la investigació, el producte, el preu i la manera de distribuir-lo.',
      'Un client no compra hores de feina ni publicacions: compra un <b>resultat</b> (més clients, més vendes, menys temps perdut). Vendre un <b>servei</b> és dir «et gestiono l\'Instagram»; vendre un <b>resultat</b> és dir «t\'ajudaré a omplir les tardes del forn, i ho mesurarem».',
      'La <b>proposta de valor</b> resumeix per a qui treballes, quin problema resols i per què ets una opció millor que les alternatives. Ha de ser concreta i comprovable.'
    ],
    example: 'Proposta feble: «Fem màrqueting digital de qualitat». Proposta forta: «Ajudem els comerços d\'Osona a aconseguir més clients del barri amb accions mesurables i pressupostos petits».',
    errors: ['Confondre tenir presència a les xarxes amb aconseguir resultats comercials.', 'Prometre resultats sense haver estudiat el negoci.', 'Definir-se amb paraules buides que podria dir qualsevol competidor.'],
    quiz: [
      { q: 'Quina d\'aquestes frases descriu millor el màrqueting?', o: ['Fer anuncis a internet', 'Entendre necessitats, crear una oferta que hi respongui i fer que la triïn', 'Tenir molts seguidors'], c: 1, why: 'La publicitat és una eina dins del màrqueting, no el màrqueting sencer.' },
      { q: 'Quina proposta ven un resultat?', o: ['«Et fem 12 publicacions al mes»', '«T\'ajudem a augmentar les reserves dels dimarts i ho mesurem cada setmana»', '«Som experts en xarxes socials»'], c: 1, why: 'Parla del problema del client i de com es mesurarà l\'èxit.' },
      { q: 'Què ha d\'incloure una bona proposta de valor?', o: ['Per a qui, quin problema resol i per què és millor', 'Una llista llarga de serveis', 'Un eslògan enginyós'], c: 0, why: 'Una proposta de valor és concreta: públic, problema i diferència.' }
    ]
  },
  L_fin: {
    area: 'direccio', title: 'Ingressos, despeses, benefici i liquiditat',
    goal: 'Entendre per què una empresa amb vendes pot quedar-se sense diners.',
    body: [
      '<b>Ingressos</b>: el que factures. <b>Despeses</b>: el que et costa funcionar (lloguer, eines, sous, desplaçaments). <b>Benefici</b> = ingressos − despeses.',
      'La <b>liquiditat</b> són els diners que tens disponibles ara mateix per pagar. Pots tenir beneficis sobre el paper i no poder pagar el lloguer si els clients encara no t\'han pagat.',
      'Per això convé tenir una <b>reserva per a imprevistos</b>: uns quants mesos de despeses fixes que no toques si no és imprescindible.'
    ],
    example: 'Una agència factura 4.000 € al gener, però cobra a 60 dies. Si les despeses de gener són 2.500 €, té benefici, però el gener no ha entrat res al compte: necessita liquiditat per aguantar.',
    errors: ['Pensar que facturar és el mateix que cobrar.', 'Gastar tota la caixa inicial en eines abans de tenir clients.', 'No separar els diners de l\'empresa dels personals.'],
    quiz: [
      { q: 'Factures 3.000 € i les despeses són 2.200 €. Quin és el benefici?', o: ['5.200 €', '800 €', '3.000 €'], c: 1, why: '3.000 − 2.200 = 800 €.' },
      { q: 'Què és la liquiditat?', o: ['El benefici anual', 'Els diners disponibles ara per fer front als pagaments', 'El total facturat'], c: 1, why: 'La liquiditat és la caixa disponible, no el resultat comptable.' },
      { q: 'Per què serveix una reserva per a imprevistos?', o: ['Per gastar-la en publicitat pròpia', 'Per aguantar retards de cobrament o despeses inesperades', 'No serveix de res si tens clients'], c: 1, why: 'Protegeix l\'empresa davant de cobraments que s\'endarrereixen o de crisis.' }
    ]
  },
  L_recerca: {
    area: 'mercat', title: 'Investigar abans de proposar',
    goal: 'Distingir símptomes de causes i segmentar els clients.',
    body: [
      'Un <b>símptoma</b> és el que el client veu («venc menys a la tarda»). La <b>causa</b> és el que ho provoca (un horari mal publicat, un competidor nou, un canvi d\'hàbits del barri). Si ataques el símptoma sense conèixer la causa, pots gastar diners en la solució equivocada.',
      'Les eines bàsiques són l\'<b>entrevista</b> amb el client, l\'observació, les dades de vendes i l\'anàlisi dels <b>competidors</b>. Fes preguntes obertes: «què ha canviat?», «qui compra i quan?».',
      'La <b>segmentació</b> consisteix a dividir els clients en grups amb necessitats semblants (per exemple: gent gran del barri al matí, famílies a la sortida de l\'escola). Cada segment pot necessitar un missatge i un moment diferents.'
    ],
    example: 'Una perruqueria creu que necessita més anuncis. Entrevistant clientes descobreix que molts no saben que obre els dissabtes: el problema era d\'informació, no de visibilitat.',
    errors: ['Proposar la solució abans d\'escoltar.', 'Fer preguntes que només confirmen el que ja penses.', 'Tractar tots els clients com si fossin iguals.'],
    quiz: [
      { q: '«Les vendes de la tarda han baixat.» Això és…', o: ['Una causa', 'Un símptoma', 'Una solució'], c: 1, why: 'És el que s\'observa; encara cal descobrir per què passa.' },
      { q: 'Quina pregunta és millor en una primera entrevista?', o: ['«Voleu que us fem un Instagram?»', '«Què ha canviat aquest darrer any al barri i al negoci?»', '«Us sembla car el pa?»'], c: 1, why: 'Les preguntes obertes revelen causes que no coneixies.' },
      { q: 'Què és segmentar?', o: ['Fer descomptes a tothom', 'Dividir el públic en grups amb necessitats semblants', 'Publicar a moltes xarxes'], c: 1, why: 'Segmentar permet adaptar missatge, canal i moment a cada grup.' }
    ]
  },
  L_smart: {
    area: 'fonaments', title: 'Objectius SMART',
    goal: 'Escriure objectius que es puguin mesurar i avaluar.',
    body: [
      'Un objectiu <b>SMART</b> és: e<b>S</b>pecífic (què exactament), <b>M</b>esurable (amb quina xifra), <b>A</b>ssolible (realista amb els recursos), <b>R</b>ellevant (connectat amb el problema del negoci) i limitat en el <b>T</b>emps (per a quan).',
      '«Vendre més» no és un objectiu: no saps quan l\'has assolit. «Augmentar un 15 % les vendes de dimarts i dimecres de 16 a 19 h en quatre setmanes» sí que ho és.'
    ],
    example: 'Objectiu dolent: «Tenir més presència». Objectiu SMART: «Aconseguir 40 reserves noves per als dilluns de març mitjançant la web».',
    errors: ['Triar un objectiu que no té relació amb el problema (per exemple, seguidors quan el problema són vendes).', 'No definir el punt de partida per poder comparar.'],
    quiz: [
      { q: 'Quin objectiu és SMART?', o: ['Ser el forn més conegut de Vic', 'Augmentar un 15 % les vendes de la franja 16–19 h en 4 setmanes', 'Tenir més seguidors'], c: 1, why: 'És específic, mesurable, rellevant, assolible i té termini.' },
      { q: 'Què li falta a «Aconseguir 50 contactes comercials»?', o: ['Un termini', 'Un color corporatiu', 'Res'], c: 0, why: 'Sense data límit no pots avaluar si l\'has assolit.' },
      { q: 'Per què l\'objectiu ha de ser rellevant?', o: ['Perquè quedi bé a l\'informe', 'Perquè ha de respondre al problema real del negoci', 'Perquè sigui fàcil'], c: 1, why: 'Pots assolir un objectiu irrellevant i continuar tenint el mateix problema.' }
    ]
  },
  L_metriques: {
    area: 'analitica', title: 'Impressions, interaccions, visites i vendes',
    goal: 'Triar indicadors que responguin preguntes empresarials.',
    body: [
      'Les <b>impressions</b> són les vegades que es mostra un contingut. Les <b>interaccions</b> (m\'agrada, comentaris) indiquen interès. Les <b>visites</b> són persones que arriben a la web o a la botiga. Les <b>vendes</b> (o conversions) són el resultat que paga les factures.',
      'Cada pas és més petit que l\'anterior. Una campanya amb moltes impressions pot no generar cap venda. Un indicador és útil si t\'ajuda a <b>prendre una decisió</b> o a respondre una pregunta del negoci.',
      'Les <b>mètriques de vanitat</b> (seguidors, m\'agrada) fan bonic però no diuen si el negoci va millor.'
    ],
    example: 'Una cafeteria té 3.000 m\'agrada en un vídeo, però el nombre de cafès venuts no varia. En canvi, un cupó bescanviat a la caixa és una prova directa de visita.',
    errors: ['Presentar impressions com si fossin clients.', 'Mesurar només el que és fàcil de mesurar.', 'No tenir dades d\'abans per comparar.'],
    quiz: [
      { q: 'Quin indicador està més a prop de les vendes?', o: ['Impressions', 'M\'agrada', 'Cupons bescanviats a la botiga'], c: 2, why: 'Un cupó bescanviat implica una visita i, normalment, una compra.' },
      { q: 'Què és una mètrica de vanitat?', o: ['Una dada que fa bonic però no ajuda a decidir', 'El cost per venda', 'Les vendes per franja horària'], c: 0, why: 'Seguidors i m\'agrada poden créixer sense que el negoci millori.' },
      { q: 'Per què cal saber les vendes de les setmanes anteriors?', o: ['Per tenir un punt de comparació', 'No cal', 'Per fer gràfics'], c: 0, why: 'Sense punt de partida no pots saber si la campanya ha canviat res.' }
    ]
  },
  L_ads1: {
    area: 'ads', title: 'Com es munta una campanya d\'anuncis',
    goal: 'Configurar objectiu, segmentació, pressupost i conversions.',
    body: [
      'L\'<b>objectiu</b> de la campanya diu a la plataforma què ha d\'optimitzar. Si tries «interacció», et portarà gent que fa m\'agrada, no necessàriament gent que s\'inscriu o compra.',
      'La <b>segmentació</b> defineix qui veu l\'anunci. Un negoci local no guanya res mostrant anuncis a tot el país: paga impressions inútils.',
      'Cal repartir el <b>pressupost</b> de manera raonable al llarg del període i, sobretot, configurar la <b>conversió</b> (inscripció, compra, trucada). Sense conversió mesurada, no saps què et costa cada client.'
    ],
    example: 'Un gimnàs local que segmenta «18–65 anys, tota Espanya» i optimitza per interaccions gasta el pressupost en persones que mai no hi aniran.',
    errors: ['Triar l\'objectiu equivocat.', 'Segmentació massa àmplia.', 'No mesurar la conversió.', 'Gastar tot el pressupost en un sol dia.'],
    quiz: [
      { q: 'Un gimnàs de Vic vol inscripcions. Quin objectiu ha de triar?', o: ['Interacció amb la publicació', 'Conversions / contactes (inscripcions)', 'Visualitzacions de vídeo'], c: 1, why: 'La plataforma optimitza per allò que li demanes.' },
      { q: 'Quina segmentació té més sentit?', o: ['Tota Espanya, 18–65 anys', '10 km al voltant del gimnàs, 20–55 anys', 'Tot el món'], c: 1, why: 'Un servei presencial necessita gent que hi pugui anar.' },
      { q: 'Què passa si no configures la conversió?', o: ['Res, la plataforma ho endevina', 'No pots saber quantes inscripcions genera ni quant costen', 'Els anuncis són més barats'], c: 1, why: 'Sense mesura no hi ha optimització ni retiment de comptes.' }
    ]
  },

  /* ---------- ETAPA 2 ---------- */
  L_seolocal: {
    area: 'seo', title: 'SEO local i reputació',
    goal: 'Aparèixer quan algú busca a prop i convertir la cerca en visita.',
    body: [
      'Moltes cerques tenen <b>intenció de visita</b>: «restaurant obert dilluns Vic», «forn a prop». Per aparèixer-hi, la fitxa de <b>Google Business Profile</b> ha de tenir horaris correctes, categoria, fotos reals, carta o serveis i un enllaç per reservar o trucar.',
      'Les <b>ressenyes</b> influeixen en la decisió i en la visibilitat. Cal demanar-les als clients satisfets, respondre-les totes (també les negatives) amb educació i solucionar el que es critica.',
      'La <b>conversió</b> local és el pas de la cerca a l\'acció: trucar, demanar com arribar, reservar.'
    ],
    example: 'Un restaurant que publica el menú del dilluns a la fitxa i activa les reserves en línia passa de 2 a 9 reserves els dilluns (cas simulat).',
    errors: ['Horaris desactualitzats.', 'Respondre de manera defensiva a les crítiques.', 'Comprar ressenyes falses (és enganyós i pot ser sancionat).'],
    quiz: [
      { q: 'Quina cerca té intenció de visita?', o: ['«Història de la cuina catalana»', '«Restaurant obert dilluns a Vic»', '«Recepta de fricandó»'], c: 1, why: 'La persona vol anar a un lloc concret, ara.' },
      { q: 'Com respons una ressenya negativa justa?', o: ['L\'ignores', 'Agraeixes, expliques què canviaràs i ho fas', 'Discuteixes amb el client'], c: 1, why: 'Una resposta honesta i útil genera confiança en els futurs clients.' },
      { q: 'Què és prioritari en una fitxa local?', o: ['Horaris i informació correctes', 'Un logo nou', 'Moltes etiquetes'], c: 0, why: 'Si la informació és errònia, perds visites encara que siguis visible.' }
    ]
  },
  L_b2b: {
    area: 'creixement', title: 'Màrqueting B2B i l\'embut comercial',
    goal: 'Captar contactes empresarials de qualitat i coordinar-se amb vendes.',
    body: [
      'En el <b>B2B</b> (empresa a empresa) decideixen diverses persones (compres, enginyeria, direcció), les compres són grans i el <b>cicle de venda</b> pot durar mesos.',
      'L\'<b>embut</b> té etapes: descobriment → interès → contacte (lead) → oportunitat → venda. El màrqueting ha de portar contactes <b>qualificats</b> i vendes ha de fer-ne el seguiment ràpidament.',
      'Indicadors clau: <b>cost per contacte</b>, percentatge de contactes que es converteixen en oportunitats, i <b>cost d\'adquisició de client (CAC)</b> = inversió comercial ÷ clients nous.'
    ],
    example: 'Una campanya genera 200 contactes a 5 € cadascun, però cap no és una empresa compradora. Una altra en genera 20 a 40 €, i 4 acaben en comanda. La segona és molt millor.',
    errors: ['Mesurar només el volum de contactes.', 'No definir què és un contacte qualificat.', 'Deixar passar dies abans de trucar.'],
    quiz: [
      { q: 'Inverteixes 2.000 € i aconsegueixes 4 clients nous. Quin és el CAC?', o: ['500 €', '8.000 €', '2.000 €'], c: 0, why: '2.000 ÷ 4 = 500 € per client.' },
      { q: 'Què és un contacte qualificat?', o: ['Qualsevol correu', 'Algú amb necessitat, capacitat de compra i encaix amb el producte', 'Un seguidor de LinkedIn'], c: 1, why: 'La qualificació separa curiosos de compradors potencials.' },
      { q: 'Quin és un tret típic del B2B?', o: ['Compres impulsives', 'Diverses persones decideixen i el cicle és llarg', 'Preus molt baixos'], c: 1, why: 'Per això cal contingut tècnic i un seguiment comercial acurat.' }
    ]
  },
  L_seo: {
    area: 'seo', title: 'SEO: intenció de cerca i continguts',
    goal: 'Atraure visites amb intenció a través dels cercadors.',
    body: [
      'El <b>SEO</b> (optimització per a cercadors) consisteix a fer que una web aparegui quan algú busca allò que oferim. Cal saber <b>quines paraules</b> fa servir el client i <b>amb quina intenció</b> (informar-se, comparar, comprar).',
      'Tres pilars: <b>tècnic</b> (la web carrega ràpid, es pot indexar, funciona al mòbil), <b>contingut</b> (pàgines útils que responen preguntes reals) i <b>autoritat</b> (enllaços i mencions de webs fiables).',
      'En sectors industrials, les cerques són poques però molt valuoses: «fabricant engranatges a mida», «component inoxidable normativa X».'
    ],
    example: 'Una fàbrica crea una pàgina per a cada família de producte amb fitxa tècnica descarregable. En sis mesos rep consultes de compradors que abans no la trobaven (cas simulat).',
    errors: ['Escriure per a robots en lloc de persones.', 'Una sola pàgina genèrica per a tots els productes.', 'Esperar resultats en una setmana.'],
    quiz: [
      { q: 'Quina cerca indica intenció de compra B2B?', o: ['«Què és un engranatge»', '«Fabricant engranatges a mida pressupost»', '«Fotos de fàbriques»'], c: 1, why: 'Inclou paraules com «fabricant» i «pressupost».' },
      { q: 'Quin és un problema de SEO tècnic?', o: ['La web no funciona bé al mòbil', 'El logo és lleig', 'Hi ha massa productes'], c: 0, why: 'El rendiment i l\'accessibilitat tècnica afecten la indexació i l\'experiència.' },
      { q: 'Quant triga normalment el SEO a donar resultats?', o: ['Hores', 'Setmanes o mesos', 'Mai'], c: 1, why: 'És una inversió a mitjà termini.' }
    ]
  },
  L_ecom: {
    area: 'web', title: 'Botiga en línia: conversió i abandonament',
    goal: 'Dissenyar una botiga que vengui, no només que sigui bonica.',
    body: [
      'La <b>taxa de conversió</b> és el percentatge de visites que acaben comprant. Si 1.000 persones visiten la botiga i 15 compren, la conversió és de l\'1,5 %.',
      'Les causes habituals d\'<b>abandonament del carretó</b> són: costos d\'enviament inesperats al final, obligació de crear un compte, pocs mètodes de pagament, dubtes sobre l\'entrega i webs lentes al mòbil.',
      'Una bona <b>fitxa de producte</b> respon les preguntes del comprador: què és, quant pesa, com es conserva, quan arriba, què passa si no m\'agrada.',
      'Cal calcular el <b>marge per comanda</b>: preu − cost del producte − enviament − comissions − cost d\'adquisició.'
    ],
    example: 'Una botiga d\'embotits mostra el cost de l\'enviament refrigerat només al final. Quan el mostra a la fitxa i ofereix enviament gratuït a partir de 45 €, l\'abandonament baixa (cas simulat).',
    errors: ['Prioritzar l\'estètica per sobre de la usabilitat.', 'Amagar costos fins al darrer pas.', 'Oblidar la logística i l\'atenció al client.'],
    quiz: [
      { q: '2.000 visites i 30 comandes. Quina és la conversió?', o: ['15 %', '1,5 %', '0,15 %'], c: 1, why: '30 ÷ 2.000 = 0,015 → 1,5 %.' },
      { q: 'Quina és una causa típica d\'abandonament?', o: ['Costos d\'enviament que apareixen al final', 'Fotos massa clares', 'Massa informació sobre el producte'], c: 0, why: 'Les sorpreses de preu al final fan desconfiar.' },
      { q: 'Per què cal calcular el marge per comanda?', o: ['Per saber si cada venda deixa diners després de tots els costos', 'Per decidir el color de la web', 'No cal'], c: 0, why: 'Pots vendre molt i perdre diners en cada comanda.' }
    ]
  },
  L_xarxes: {
    area: 'xarxes', title: 'Estratègia a xarxes socials',
    goal: 'Fer servir les xarxes amb un propòsit i mesurar-ne l\'efecte real.',
    body: [
      'Les xarxes serveixen per crear <b>comunitat</b>, mantenir la marca present i portar trànsit cap a una acció. Una <b>estratègia editorial</b> defineix per a qui publiques, quins temes, amb quina freqüència i què vols que facin després.',
      'El creixement de seguidors pot venir de sortejos o de contingut viral que no té res a veure amb el teu client. Un seguidor que no comprarà mai no té valor comercial.',
      'Les col·laboracions amb <b>creadors</b> funcionen si el seu públic coincideix amb el teu i la relació comercial s\'indica clarament.'
    ],
    example: 'Una marca de roba guanya 8.000 seguidors amb un sorteig d\'un mòbil. Les vendes no es mouen: la majoria de nous seguidors només volien el mòbil.',
    errors: ['Publicar per publicar.', 'Mesurar l\'èxit només en seguidors.', 'No indicar que un contingut és publicitat.'],
    quiz: [
      { q: 'Un sorteig d\'un mòbil fa créixer molt els seguidors d\'una botiga de llana. Què és probable?', o: ['Que les vendes es tripliquin', 'Que molts seguidors no siguin clients potencials', 'Que el SEO millori'], c: 1, why: 'El premi atrau gent interessada en el premi, no en el producte.' },
      { q: 'Què ha d\'incloure una estratègia editorial?', o: ['Públic, temes, freqüència i acció desitjada', 'Només el calendari de publicacions', 'Els hashtags de moda'], c: 0, why: 'Sense propòsit, la freqüència no serveix de res.' },
      { q: 'Quan treballes amb un creador de contingut pagat…', o: ['No cal dir res', 'Cal indicar clarament que és publicitat', 'Només si ho demana'], c: 1, why: 'La transparència és una obligació i protegeix la confiança.' }
    ]
  },
  L_kpi: {
    area: 'analitica', title: 'KPI, etiquetatge i causalitat',
    goal: 'Construir un informe que separi activitat, resultats de màrqueting i resultats comercials.',
    body: [
      'Un <b>KPI</b> (indicador clau de rendiment) és la mètrica que diu si avances cap a l\'objectiu. Separa tres nivells: <b>activitat</b> (publicacions fetes), <b>resultats de màrqueting</b> (visites, contactes) i <b>resultats comercials</b> (vendes, ingressos).',
      'Per saber d\'on ve cada visita cal <b>etiquetar</b> els enllaços de les campanyes (paràmetres UTM) i definir <b>esdeveniments i conversions</b> a l\'analítica web.',
      '<b>Correlació no és causalitat</b>: que dues coses passin alhora no vol dir que una provoqui l\'altra. Les vendes poden pujar al desembre per Nadal, no per la campanya.'
    ],
    example: 'Un informe honest: «Hem publicat 20 vegades (activitat), han arribat 1.200 visites des d\'Instagram (màrqueting) i 18 han comprat, 540 € (comercial)».',
    errors: ['Barrejar activitat amb resultats.', 'Atribuir tot el canvi a la campanya.', 'Enllaços sense etiquetar.'],
    quiz: [
      { q: '«Hem publicat 30 vídeos.» Quin nivell és?', o: ['Activitat', 'Resultat comercial', 'Conversió'], c: 0, why: 'Descriu la feina feta, no el resultat obtingut.' },
      { q: 'Per a què serveixen els paràmetres UTM?', o: ['Per identificar de quina campanya ve cada visita', 'Per accelerar la web', 'Per evitar el correu brossa'], c: 0, why: 'Permeten atribuir visites i vendes a cada acció.' },
      { q: 'Les vendes pugen al desembre i la campanya també era al desembre. Què pots afirmar?', o: ['La campanya ha causat la pujada', 'Hi ha correlació, però cal descartar l\'estacionalitat', 'La campanya no ha servit'], c: 1, why: 'Cal comparar amb anys anteriors o un grup de control.' }
    ]
  },

  /* ---------- ETAPA 3 ---------- */
  L_prospeccio: {
    area: 'direccio', title: 'Prospecció i qualificació comercial',
    goal: 'Invertir el temps comercial en els contactes amb més potencial.',
    body: [
      'La <b>prospecció</b> és buscar clients potencials. A una fira parlaràs amb molta gent: el repte és identificar qui té un problema que pots resoldre, pressupost, capacitat de decisió i urgència.',
      'Un <b>argumentari</b> no és un monòleg: és una conversa preparada amb preguntes, exemples de resultats i respostes a objeccions habituals.',
      'El <b>retorn d\'una acció comercial</b> = (marge dels clients aconseguits − cost de l\'acció) ÷ cost de l\'acció. Inclou el teu temps!'
    ],
    example: 'Després d\'una fira, en lloc d\'enviar el mateix correu a 80 targetes, l\'agència prioritza les 8 empreses que han explicat un problema concret i tenen pressupost.',
    errors: ['Perseguir tothom per igual.', 'Parlar només dels teus serveis.', 'No fer seguiment en 48 hores.'],
    quiz: [
      { q: 'Quin contacte té més potencial?', o: ['Un estudiant curiós', 'Una gerent amb un problema concret, pressupost i data límit', 'Algú que només vol bolígrafs'], c: 1, why: 'Necessitat, capacitat de decisió, pressupost i urgència.' },
      { q: 'Una fira costa 600 € i et porta 2 clients amb 1.500 € de marge total. Quin és el retorn?', o: ['150 %', '250 %', '60 %'], c: 0, why: '(1.500 − 600) ÷ 600 = 1,5 → 150 %.' },
      { q: 'Què hauria d\'incloure un bon argumentari?', o: ['Preguntes, exemples i respostes a objeccions', 'Un discurs llarg sobre l\'agència', 'Només preus'], c: 0, why: 'Una conversa útil per al client ven més que un monòleg.' }
    ]
  },
  L_posicionament: {
    area: 'fonaments', title: 'Posicionament i diferenciació',
    goal: 'Triar on competir i on no.',
    body: [
      'El <b>posicionament</b> és el lloc que ocupes a la ment dels clients en comparació amb els competidors. No pots ser el més barat, el més gran i el més especialitzat alhora.',
      'Formes de diferenciar-se: <b>coneixement local</b>, <b>especialització</b> en un sector o servei, <b>servei personalitzat</b>, o una <b>estructura de costos</b> més eficient.',
      'De vegades un competidor és també un possible <b>aliat</b>: si les vostres habilitats són complementàries, podeu compartir projectes.'
    ],
    example: 'Una agència petita no pot igualar els recursos d\'una de Barcelona, però pot ser la que millor coneix els comerços i la indústria d\'Osona i respondre en el mateix dia.',
    errors: ['Competir només en preu.', 'Prometre més del que pots complir.', 'Copiar el discurs del competidor gran.'],
    quiz: [
      { q: 'Quina diferenciació és més creïble per a una agència petita de Vic?', o: ['Som els més grans', 'Coneixement local i servei proper amb resultats mesurables', 'Fem de tot'], c: 1, why: 'És veritat, és difícil de copiar i és valuós per al client.' },
      { q: 'Competir només amb preus baixos…', o: ['És sempre la millor estratègia', 'Redueix el marge i atrau clients que marxaran per un preu més baix', 'Augmenta la reputació'], c: 1, why: 'Sempre hi haurà algú més barat.' },
      { q: 'Quan té sentit aliar-se amb un competidor?', o: ['Mai', 'Quan les habilitats són complementàries i hi ha confiança', 'Només si et compra l\'empresa'], c: 1, why: 'La col·laboració permet accedir a projectes que sol no podries fer.' }
    ]
  },
  L_pressupost: {
    area: 'direccio', title: 'Abast, pressupost i marge',
    goal: 'Pressupostar un servei sense perdre diners.',
    body: [
      'L\'<b>abast</b> defineix exactament què inclou el servei: quines tasques, quantes peces, quantes <b>revisions</b>, quins terminis i què <b>no</b> inclou.',
      'Per pressupostar: estima les <b>hores</b>, multiplica-les pel teu cost per hora i afegeix-hi un marge. <b>Marge brut</b> = (preu − cost directe) ÷ preu.',
      'Pacta com es gestionen els <b>canvis</b>: «les modificacions fora d\'abast es pressuposten a part». Així protegeixes la rendibilitat i la relació.'
    ],
    example: 'Un projecte de 1.200 € que requereix 30 hores a un cost de 25 €/h té un cost directe de 750 €: marge brut del 37,5 %. Si el client demana 20 hores més sense pagar, el marge passa a ser negatiu.',
    errors: ['Acceptar «encarrega\'t de tot» sense límits.', 'No comptar el temps de reunions i correus.', 'Fer canvis gratis per por de perdre el client.'],
    quiz: [
      { q: 'Preu 2.000 €, cost directe 1.200 €. Quin és el marge brut?', o: ['40 %', '60 %', '800 %'], c: 0, why: '(2.000 − 1.200) ÷ 2.000 = 0,40.' },
      { q: 'Què ha de dir l\'abast d\'un projecte?', o: ['Què inclou, què no, revisions i terminis', 'Només el preu', 'El nom del client'], c: 0, why: 'Un abast clar evita conflictes.' },
      { q: 'El client demana una feina que no era al contracte. Què fas?', o: ['La fas gratis', 'L\'expliques i la pressuposteu a part o canvieu prioritats', 'T\'enfades'], c: 1, why: 'És professional i manté la confiança.' }
    ]
  },
  L_planificacio: {
    area: 'direccio', title: 'Planificació i priorització',
    goal: 'Repartir el temps quan tot arriba alhora.',
    body: [
      'Classifica les tasques per <b>urgència</b> i <b>impacte</b>. Primer el que és urgent i important; planifica el que és important però no urgent; delega o ajorna (avisant!) la resta.',
      'Estima recursos amb honestedat: una tasca sempre porta temps de coordinació. Afegeix-hi un marge.',
      'La <b>comunicació</b> és part de la planificació: un client que sap que rebrà la feina dijous està més tranquil que un que no sap res.'
    ],
    example: 'Tres clients demanen canvis la mateixa setmana. L\'agència resol primer l\'error que impedeix vendre a la botiga en línia, programa la campanya per dijous i avisa el tercer client que el redisseny arribarà dilluns.',
    errors: ['Treballar de nit sistemàticament: la qualitat cau.', 'Ajornar sense avisar.', 'Dir que sí a tot.'],
    quiz: [
      { q: 'Què resols primer?', o: ['Un canvi de color al logo', 'Un error que impedeix comprar a la botiga en línia d\'un client', 'Un informe trimestral que vencerà d\'aquí a un mes'], c: 1, why: 'És urgent i té un gran impacte en el negoci del client.' },
      { q: 'Si has d\'ajornar una tasca…', o: ['Ho fas sense dir res', 'Avises el client amb una data nova realista', 'Esperes que no se n\'adoni'], c: 1, why: 'La transparència preserva la confiança.' },
      { q: 'Subcontractar una tasca té sentit quan…', o: ['No tens capacitat i algú la pot fer bé amb un cost raonable', 'Mai', 'Vols estalviar-te la responsabilitat'], c: 0, why: 'Continues sent responsable del resultat davant del client.' }
    ]
  },

  /* ---------- ETAPA 4 ---------- */
  L_contractar: {
    area: 'direccio', title: 'Contractar i delegar',
    goal: 'Decidir quan i com incorporar persones a l\'equip.',
    body: [
      'El <b>cost total</b> d\'una persona contractada és més alt que el sou brut: cal sumar-hi la Seguretat Social a càrrec de l\'empresa, eines, formació i temps d\'incorporació.',
      'Contractar té sentit quan els <b>ingressos recurrents</b> poden cobrir-ne el cost i quan el temps que alliberes pots dedicar-lo a feina de més valor (vendre, dirigir).',
      '<b>Delegar</b> no és desentendre\'s: cal definir objectius, criteris de qualitat i revisions periòdiques.'
    ],
    example: 'Una analista amb un sou de 1.900 € bruts al mes costa a l\'empresa uns 2.500 € amb cotitzacions i eines. Si allibera 60 hores al mes del director per vendre, pot ser rendible (xifres orientatives i simplificades).',
    errors: ['Contractar amb ingressos puntuals, no recurrents.', 'Delegar sense instruccions clares.', 'No preveure el temps de formació.'],
    quiz: [
      { q: 'Què cal comparar abans de contractar?', o: ['El cost total amb el valor i el temps que aportarà', 'Només el sou', 'El nombre de seguidors de l\'agència'], c: 0, why: 'Una contractació és una inversió.' },
      { q: 'Quin ingrés és més segur per cobrir un sou?', o: ['Un projecte puntual', 'Quotes mensuals de clients recurrents', 'Un premi'], c: 1, why: 'Els sous es paguen cada mes.' },
      { q: 'Delegar bé vol dir…', o: ['Donar la tasca i oblidar-se\'n', 'Definir objectius, criteris i revisions', 'Fer-ho tot tu igualment'], c: 1, why: 'Així la persona té autonomia i tu tens control de qualitat.' }
    ]
  },
  L_brief: {
    area: 'marca', title: 'Marca, brief creatiu i proves de missatge',
    goal: 'Fer que la creativitat serveixi l\'objectiu.',
    body: [
      'La <b>identitat de marca</b> inclou valors, to de veu, estil visual i promesa. Ha de ser <b>coherent</b> en tots els punts de contacte.',
      'Un <b>brief creatiu</b> és el document que orienta la creativitat: objectiu, públic, missatge principal, proves que el sustenten, formats, to i com es mesurarà l\'èxit.',
      'Les <b>proves de missatge</b> (A/B) permeten comparar dues propostes amb dades en lloc d\'opinions. Una peça bonica no és necessàriament efectiva.'
    ],
    example: 'La Berta proposa un vídeo poètic per a una fàbrica. Amb el brief, adapta la idea: imatges espectaculars de la maquinària, però amb el missatge «entrega en 48 hores» que és el que valoren els compradors.',
    errors: ['Començar a dissenyar sense brief.', 'Decidir per gust personal.', 'Canviar de to a cada campanya.'],
    quiz: [
      { q: 'Què NO és part d\'un brief creatiu?', o: ['Públic objectiu', 'Missatge principal', 'El color preferit del director'], c: 2, why: 'El brief parteix de l\'objectiu i el públic, no de gustos personals.' },
      { q: 'Com decideixes entre dues propostes creatives?', o: ['Per votació de l\'equip', 'Amb una prova A/B davant del públic real', 'Tries la més cara'], c: 1, why: 'Les dades del públic són millors que les opinions internes.' },
      { q: 'Coherència de marca vol dir…', o: ['Fer sempre el mateix anunci', 'Mantenir valors, to i estil en tots els canals', 'Fer servir un sol color'], c: 1, why: 'Ajuda a reconèixer la marca i confiar-hi.' }
    ]
  },
  L_processos: {
    area: 'direccio', title: 'Processos, documentació i qualitat',
    goal: 'Treballar en equip sense perdre informació.',
    body: [
      'Quan hi ha diverses persones i clients, cal un <b>canal únic</b> per a les peticions, una <b>eina de gestió de tasques</b> amb responsables i dates, i <b>plantilles</b> per a informes i propostes.',
      'Un <b>control de qualitat</b> senzill (una llista de comprovació abans d\'enviar res) evita la majoria d\'errors.',
      'Una <b>rutina de revisió</b> setmanal permet detectar retards abans que siguin un problema.'
    ],
    example: 'Abans: peticions per WhatsApp, correu i trucades, i tres errors de coordinació al mes. Després: formulari de peticions + tauler de tasques + revisió dels dilluns.',
    errors: ['Massa processos: ningú no els segueix.', 'Tasques sense responsable.', 'No documentar les decisions del client.'],
    quiz: [
      { q: 'Quin és el primer pas per ordenar les peticions dels clients?', o: ['Un canal únic d\'entrada', 'Més reunions', 'Respondre més de pressa'], c: 0, why: 'Si les peticions entren per tot arreu, es perden.' },
      { q: 'Tota tasca hauria de tenir…', o: ['Un responsable i una data', 'Tres responsables', 'Cap data per no pressionar'], c: 0, why: 'Si és de tothom, no és de ningú.' },
      { q: 'Una llista de comprovació abans d\'enviar un informe serveix per…', o: ['Reduir errors evitables', 'Allargar la feina', 'Res'], c: 0, why: 'És el control de qualitat més barat que existeix.' }
    ]
  },
  L_crm: {
    area: 'email', title: 'CRM, automatització i protecció de dades',
    goal: 'Automatitzar el que és repetitiu respectant el consentiment.',
    body: [
      'Un <b>CRM</b> és una eina on es registren els contactes i les relacions comercials: qui és, què li interessa, en quina fase està, quan cal fer el seguiment.',
      'L\'<b>automatització</b> és útil per a tasques repetitives (enviar un correu de benvinguda, classificar contactes, generar informes). Les decisions de criteri (estratègia, respostes delicades) requereixen persones.',
      'Per enviar correus comercials cal el <b>consentiment</b> de la persona o una relació prèvia que ho permeti, informar de qui ets i oferir una manera fàcil de donar-se de baixa (RGPD i normativa de comunicacions comercials). Comprar bases de dades és mala pràctica i un risc legal.'
    ],
    example: 'Quan algú descarrega una fitxa tècnica (i accepta rebre informació), el CRM li envia un correu útil al cap de 3 dies i avisa el comercial si torna a visitar la pàgina de preus.',
    errors: ['Comprar llistes de correus.', 'Automatitzar respostes a queixes.', 'No segmentar: enviar el mateix a tothom.'],
    quiz: [
      { q: 'Quina tasca és millor automatitzar?', o: ['Respondre una crisi de reputació', 'Enviar un correu de benvinguda a qui s\'ha subscrit', 'Decidir l\'estratègia anual'], c: 1, why: 'És repetitiva i no necessita criteri humà en cada cas.' },
      { q: 'Pots enviar butlletins a una llista de correus comprada?', o: ['Sí, si és barata', 'No: cal consentiment o una base legal', 'Sí, si poses un logo'], c: 1, why: 'Sense consentiment vulneres la normativa i la confiança.' },
      { q: 'Què és un CRM?', o: ['Una xarxa social', 'Una eina per gestionar contactes i relacions comercials', 'Un tipus d\'anunci'], c: 1, why: 'Centralitza la informació dels clients i el seguiment.' }
    ]
  },
  L_rendibilitat: {
    area: 'direccio', title: 'Rendibilitat per client',
    goal: 'Saber quins clients fan créixer l\'empresa i quins la desgasten.',
    body: [
      'No tots els clients són igual de rendibles. Per a cada client: <b>ingressos</b> − <b>hores reals × cost per hora</b> − altres costos = <b>marge</b>.',
      'Un client que paga molt però consumeix el triple d\'hores de les pressupostades pot ser menys rendible que un de petit i ordenat.',
      'Opcions: <b>revisar preus</b>, <b>ajustar l\'abast</b>, <b>millorar processos</b> o, en darrer cas, <b>deixar el client</b> de manera professional.'
    ],
    example: 'Client A: 1.500 €/mes, 80 h reals × 25 € = 2.000 € de cost → −500 €. Client B: 600 €/mes, 12 h × 25 € = 300 € → +300 €.',
    errors: ['Mirar només la facturació.', 'No registrar les hores reals.', 'Rebaixar preus per por.'],
    quiz: [
      { q: 'Un client paga 1.000 €/mes i consumeix 50 h a 25 €/h. Quin marge deixa?', o: ['−250 €', '+250 €', '+1.000 €'], c: 0, why: '50 × 25 = 1.250 € de cost: 1.000 − 1.250 = −250 €.' },
      { q: 'Quina dada necessites per calcular la rendibilitat per client?', o: ['Les hores reals dedicades', 'Els seus seguidors', 'La mida de la seva empresa'], c: 0, why: 'Sense hores reals no saps el cost.' },
      { q: 'Davant d\'un client poc rendible, la primera opció hauria de ser…', o: ['Deixar-lo de cop', 'Parlar-hi per revisar abast o preu', 'Treballar menys sense dir-ho'], c: 1, why: 'Sovint es pot redreçar amb una conversa clara.' }
    ]
  },

  /* ---------- ETAPA 5 ---------- */
  L_ads2: {
    area: 'ads', title: 'Diagnosticar una campanya: CTR, CPC, CPA i ROAS',
    goal: 'Trobar on falla una campanya abans de tocar res.',
    body: [
      '<b>CTR</b> = clics ÷ impressions. Indica si l\'anunci crida l\'atenció del públic. <b>CPC</b> = cost ÷ clics. <b>CPA</b> = cost ÷ conversions (quant costa cada venda o contacte). <b>ROAS</b> = ingressos generats ÷ inversió publicitària.',
      'Llegeix l\'embut: si el CTR és bo però no hi ha conversions, el problema pot ser la <b>pàgina de destinació</b>, el procés de compra o el <b>seguiment</b> (la conversió no es registra).',
      'Abans d\'aturar una campanya, comprova que les dades són <b>fiables</b>.'
    ],
    example: 'CTR del 3 % (bo), 400 clics, 0 compres registrades. En revisar-ho, la pàgina de pagament no funcionava en mòbils Android (cas simulat).',
    errors: ['Canviar l\'anunci quan el problema és la web.', 'Mirar el ROAS sense restar el marge del producte.', 'Treure conclusions amb poques dades.'],
    quiz: [
      { q: '10.000 impressions i 200 clics. Quin és el CTR?', o: ['0,2 %', '2 %', '20 %'], c: 1, why: '200 ÷ 10.000 = 0,02 → 2 %.' },
      { q: 'Has gastat 600 € i has fet 20 vendes. Quin és el CPA?', o: ['30 €', '12.000 €', '620 €'], c: 0, why: '600 ÷ 20 = 30 €.' },
      { q: 'Molts clics, CTR alt, zero conversions. On mires primer?', o: ['La pàgina de destinació i el seguiment de conversions', 'El color de l\'anunci', 'L\'horari de l\'oficina'], c: 0, why: 'L\'anunci funciona; el problema és després del clic.' }
    ]
  },
  L_crisi: {
    area: 'xarxes', title: 'Comunicació de crisi i reputació',
    goal: 'Respondre a una crisi amb honestedat i accions reals.',
    body: [
      'En una crisi de reputació: 1) <b>escolta</b> i entén què ha passat; 2) <b>reconeix</b> el que és cert; 3) explica què faràs per <b>solucionar-ho</b>; 4) <b>fes-ho</b>; 5) informa del canvi.',
      'Esborrar crítiques legítimes o respondre de manera defensiva normalment amplifica el problema.',
      'No tornis a fer promoció fins que el problema de fons s\'hagi resolt: estaries portant gent a una mala experiència.'
    ],
    example: 'Un restaurant canvia el menú i apuja preus sense explicar-ho. Rep crítiques. Resposta efectiva: reconèixer-ho, recuperar el plat més demanat i explicar el perquè dels preus.',
    errors: ['Esborrar comentaris crítics.', 'Culpar els clients.', 'Prometre canvis que no es faran.'],
    quiz: [
      { q: 'Quin és el primer pas en una crisi?', o: ['Esborrar els comentaris', 'Entendre què ha passat', 'Fer un sorteig'], c: 1, why: 'Sense diagnòstic, la resposta pot empitjorar-ho.' },
      { q: 'Esborrar crítiques legítimes…', o: ['Resol la crisi', 'Sol amplificar-la i destrueix la confiança', 'És obligatori'], c: 1, why: 'Els clients ho noten i se sumen més veus.' },
      { q: 'Quan tornes a fer promoció?', o: ['Immediatament', 'Quan el problema de fons està resolt', 'Mai més'], c: 1, why: 'La promoció amplifica tant les bones com les males experiències.' }
    ]
  },
  L_atribucio: {
    area: 'analitica', title: 'Atribució i incrementalitat',
    goal: 'Interpretar amb prudència qui «s\'emporta» cada venda.',
    body: [
      'L\'<b>atribució</b> és la regla que decideix quin canal rep el mèrit d\'una venda. Cada plataforma fa servir el seu model i la seva <b>finestra de conversió</b> (per exemple, 7 dies després del clic), i sovint totes s\'atribueixen la mateixa venda.',
      'Per això la suma de les vendes que diuen les plataformes pot ser més gran que les vendes reals de la botiga.',
      'La <b>incrementalitat</b> respon una altra pregunta: quantes vendes <b>no</b> s\'haurien produït sense la campanya? Es mesura amb experiments: un grup que veu els anuncis i un altre que no (per exemple, per zones geogràfiques).'
    ],
    example: 'Meta diu 120 vendes, Google 90, el correu 40. La botiga n\'ha fet 160. No hi ha cap error greu: els models d\'atribució se solapen.',
    errors: ['Sumar les vendes de totes les plataformes.', 'Creure que atribuir és demostrar causalitat.', 'Canviar de model d\'atribució per fer quedar bé un canal.'],
    quiz: [
      { q: 'Les plataformes sumen 250 vendes però la botiga n\'ha fet 160. Per què?', o: ['Algú ha robat dades', 'Diversos canals s\'atribueixen la mateixa venda', 'La botiga menteix'], c: 1, why: 'Cada plataforma compta les vendes on ha participat.' },
      { q: 'Com mesures la incrementalitat?', o: ['Amb un experiment amb grup de control', 'Mirant el ROAS de la plataforma', 'Preguntant al client'], c: 0, why: 'Compara el que passa amb i sense la campanya.' },
      { q: 'Què és una finestra de conversió?', o: ['El període després d\'un clic o impressió en què una venda s\'atribueix a l\'anunci', 'Una finestra de la web', 'L\'horari de la botiga'], c: 0, why: 'Finestres més llargues atribueixen més vendes.' }
    ]
  },
  L_tresoreria: {
    area: 'direccio', title: 'Tresoreria i risc financer',
    goal: 'Preveure els diners que entraran i sortiran.',
    body: [
      'Un <b>pla de tresoreria</b> és una taula setmana a setmana amb els cobraments previstos i els pagaments (nòmines, lloguer, impostos, proveïdors).',
      'Per reduir el risc: factures clares amb <b>venciment</b>, cobrament per avançat d\'una part del projecte, seguiment dels impagaments i una <b>reserva</b>.',
      'La <b>concentració</b> és perillosa: si un client representa més del 30–40 % dels ingressos, el seu retard pot posar en perill l\'empresa.'
    ],
    example: 'Una agència cobra el 40 % a l\'inici de cada projecte. Quan un client retarda el pagament final, la bestreta i la reserva cobreixen les nòmines.',
    errors: ['Començar a treballar sense bestreta en projectes grans.', 'No reclamar les factures vençudes.', 'Dependre d\'un sol client.'],
    quiz: [
      { q: 'Què és la concentració de clients?', o: ['Molts clients petits', 'Dependre molt d\'un o pocs clients', 'Tenir clients a la mateixa ciutat'], c: 1, why: 'És un risc: si aquell client falla, l\'empresa trontolla.' },
      { q: 'Quina mesura redueix el risc de cobrament?', o: ['Cobrar una bestreta a l\'inici', 'Facturar més tard', 'No fer factures'], c: 0, why: 'Asseguren part dels ingressos abans de treballar.' },
      { q: 'Un client no paga i no tens reserva. Què és prioritari?', o: ['Fer un pla de tresoreria i parlar amb el client per pactar un calendari', 'Contractar una persona', 'Comprar eines noves'], c: 0, why: 'Cal saber quants diners necessites i quan, i negociar.' }
    ]
  },

  /* ---------- ETAPA 6 ---------- */
  L_financament: {
    area: 'direccio', title: 'Finançament i creixement',
    goal: 'Valorar quan val la pena accelerar amb diners de fora.',
    body: [
      'Es pot créixer amb <b>beneficis propis</b> (lent però amb control), amb <b>préstecs</b> (s\'han de tornar amb interessos) o amb <b>inversors</b> (aporten capital a canvi d\'una part de l\'empresa i d\'expectatives de creixement).',
      'Més capital permet contractar i captar clients grans, però augmenta les <b>despeses fixes</b> i la pressió. Si els ingressos no creixen al ritme previst, el risc és alt.',
      'Abans d\'acceptar, negocia: percentatge, control de decisions, objectius i què passa si no s\'assoleixen.'
    ],
    example: 'Un inversor ofereix 80.000 € pel 30 % de l\'agència i demana duplicar la facturació en dos anys. L\'agència ha de valorar si hi ha prou demanda i equip.',
    errors: ['Acceptar diners sense un pla d\'ús.', 'Augmentar costos fixos abans de tenir ingressos.', 'Cedir el control sense adonar-se\'n.'],
    quiz: [
      { q: 'Què implica acceptar un inversor?', o: ['Diners gratuïts', 'Cedir una part de l\'empresa i assumir expectatives de creixement', 'Pagar menys impostos'], c: 1, why: 'L\'inversor espera un retorn.' },
      { q: 'Quin és el principal risc de créixer massa de pressa?', o: ['Massa beneficis', 'Despeses fixes que superen els ingressos', 'Massa reputació'], c: 1, why: 'La tresoreria pot no aguantar.' },
      { q: 'Créixer amb beneficis propis és…', o: ['Més lent però dona més control', 'Impossible', 'Sempre millor'], c: 0, why: 'No hi ha una resposta universal: depèn del mercat i del risc que vols assumir.' }
    ]
  },
  L_marca: {
    area: 'marca', title: 'La marca de l\'agència',
    goal: 'Definir quins clients vols atraure i quins rebutges.',
    body: [
      'La <b>marca corporativa</b> és la promesa que fas al mercat. Una promesa clara atrau els clients adequats i n\'allunya d\'altres: això és bo.',
      'La coherència entre el que dius i el que fas és clau. Si dius «resultats mesurables», els teus informes han de ser rigorosos.',
      'Decidir quins projectes <b>rebutges</b> és tan important com decidir quins acceptes.'
    ],
    example: '«Fem créixer els negocis d\'Osona amb dades i proximitat» atrau comerços i pimes locals, i deixa clar que no és una agència de grans campanyes de televisió.',
    errors: ['Voler agradar a tothom.', 'Promeses que l\'equip no pot complir.', 'Canviar de posicionament cada any.'],
    quiz: [
      { q: 'Una marca clara…', o: ['Atrau tothom', 'Atrau els clients adequats i n\'allunya d\'altres', 'No serveix per a agències'], c: 1, why: 'Filtra i redueix el cost de captar clients que encaixen.' },
      { q: 'Si promets «resultats mesurables»…', o: ['Has de ser rigorós en els informes', 'Pots fer informes de seguidors', 'No cal mesurar'], c: 0, why: 'La marca es demostra amb fets.' },
      { q: 'Rebutjar projectes que no encaixen…', o: ['És un error sempre', 'Reforça el posicionament i protegeix l\'equip', 'És de mala educació'], c: 1, why: 'Focalitza recursos on aportes més valor.' }
    ]
  },
  L_ltv: {
    area: 'creixement', title: 'Retenció: LTV i CAC',
    goal: 'Entendre per què mantenir un client val més que captar-ne un de nou.',
    body: [
      'El <b>valor de vida del client (LTV)</b> és el marge total que deixa un client durant tota la relació: marge mensual × mesos que es queda.',
      'El <b>CAC</b> és el que costa aconseguir-lo. Un negoci sa té un LTV clarament superior al CAC (sovint s\'usa com a referència orientativa una relació de 3 a 1).',
      'Per retenir: revisar objectius periòdicament, demostrar valor amb dades, escoltar objeccions i ajustar el servei abans que el client decideixi marxar.'
    ],
    example: 'Un client deixa 400 €/mes de marge i es queda 24 mesos: LTV = 9.600 €. Si costa 1.200 € captar-lo, la relació LTV/CAC és 8.',
    errors: ['Dedicar tota l\'energia a captar i oblidar els clients actuals.', 'Esperar la renovació per parlar de resultats.'],
    quiz: [
      { q: 'Marge de 300 €/mes durant 20 mesos. Quin és el LTV?', o: ['6.000 €', '320 €', '15 €'], c: 0, why: '300 × 20 = 6.000 €.' },
      { q: 'LTV 2.000 €, CAC 2.500 €. Què passa?', o: ['Es perden diners amb cada client nou', 'És un negoci excel·lent', 'No es pot saber res'], c: 0, why: 'Costa més captar el client del que deixa.' },
      { q: 'Quan has de parlar de resultats amb un client?', o: ['Només quan amenaça de marxar', 'Periòdicament, amb objectius revisats', 'Mai'], c: 1, why: 'La retenció es construeix cada mes.' }
    ]
  },

  /* ---------- ETAPA 7 ---------- */
  L_internacional: {
    area: 'avancat', title: 'Màrqueting internacional i localització',
    goal: 'Adaptar una estratègia a un mercat nou.',
    body: [
      'Traduir no és <b>localitzar</b>. Cal adaptar missatges, referències culturals, preus, mètodes de pagament, logística i atenció al client.',
      'El <b>SEO multilingüe</b> requereix investigar les paraules que fa servir la gent de cada país (no les traduccions literals) i indicar als cercadors la versió de cada idioma.',
      'Abans d\'invertir fort: investiga la <b>demanda</b>, la <b>competència</b> local i la capacitat de servei (enviaments, devolucions, idioma).'
    ],
    example: 'Una marca de cosmètica descobreix que a França els compradors busquen «cosmétique naturelle certifiée bio» i valoren molt les certificacions, més que l\'origen.',
    errors: ['Traducció automàtica sense revisió.', 'Mateixos preus i missatges a tots els mercats.', 'Oblidar la logística i les devolucions.'],
    quiz: [
      { q: 'Localitzar vol dir…', o: ['Traduir literalment', 'Adaptar missatge, preus, pagament i servei al mercat', 'Posar la bandera del país'], c: 1, why: 'Cada mercat té hàbits i expectatives diferents.' },
      { q: 'Per al SEO en un altre idioma…', o: ['Tradueixes les paraules clau', 'Investigues com busca la gent d\'aquell país', 'No cal SEO'], c: 1, why: 'Les cerques reals no coincideixen amb les traduccions.' },
      { q: 'Què has de comprovar abans d\'una gran campanya internacional?', o: ['Demanda, competència i capacitat de servei', 'Només el pressupost', 'El clima'], c: 0, why: 'Sense capacitat de servei, l\'èxit es converteix en un problema.' }
    ]
  },
  L_experiments: {
    area: 'analitica', title: 'Proves de mercat i mostres petites',
    goal: 'No treure conclusions precipitades de poques dades.',
    body: [
      'Una <b>prova de mercat</b> és una inversió petita per aprendre abans d\'apostar fort. Defineix abans què mesuraràs i quin resultat et faria continuar.',
      'Amb <b>mostres petites</b> l\'atzar pesa molt: 3 vendes contra 1 no demostra que un mercat sigui el triple de bo. Cal un volum mínim de dades o repetir la prova.',
      'Compara mercats amb el mateix indicador i el mateix període.'
    ],
    example: 'França: 12 vendes amb 1.000 €. Bèlgica: 4 vendes amb 300 €. El CPA és semblant (83 € vs 75 €); no hi ha prou dades per dir que Bèlgica és millor.',
    errors: ['Declarar guanyador després de dos dies.', 'Canviar diverses variables alhora.', 'No definir el criteri d\'èxit abans.'],
    quiz: [
      { q: 'Anunci A: 2 vendes. Anunci B: 1 venda. Conclusió?', o: ['A és el doble de bo', 'No hi ha prou dades', 'B és millor'], c: 1, why: 'Amb tan poques dades, la diferència pot ser atzar.' },
      { q: 'Quan defineixes el criteri d\'èxit d\'una prova?', o: ['Abans de començar', 'Quan veus els resultats', 'No cal'], c: 0, why: 'Així evites interpretar les dades a conveniència.' },
      { q: 'Per comparar dos mercats…', o: ['Fes servir el mateix indicador i període', 'Compara vendes d\'un mes amb visites de l\'altre', 'Mira només el que ha gastat més'], c: 0, why: 'Només així la comparació és justa.' }
    ]
  },
  L_lideratge: {
    area: 'direccio', title: 'Lideratge i estructura',
    goal: 'Fer que l\'empresa funcioni sense que tot passi per tu.',
    body: [
      'Quan l\'equip creix, el director ha de passar de <b>fer</b> a <b>fer que es faci</b>: definir objectius compartits, rols clars i responsables per àrea.',
      'Els <b>objectius per equip</b> han d\'estar alineats amb l\'estratègia de l\'empresa i tenir indicadors.',
      'Gestionar talent inclou feedback periòdic, formació, reconeixement i càrregues de feina sostenibles.'
    ],
    example: 'L\'agència crea tres responsables (estratègia, analítica i creativitat) amb objectius trimestrals. {En} deixa de revisar cada peça i es dedica a clients grans i direcció.',
    errors: ['Microgestionar-ho tot.', 'Rols ambigus.', 'Sobrecarregar les persones més competents.'],
    quiz: [
      { q: 'Quin és el canvi principal del director quan l\'equip creix?', o: ['Treballar més hores', 'Passar de fer les tasques a dirigir i definir objectius', 'Fer totes les revisions'], c: 1, why: 'Si tot passa per tu, ets el coll d\'ampolla.' },
      { q: 'Un objectiu d\'equip ha de ser…', o: ['Alineat amb l\'estratègia i mesurable', 'Secret', 'Igual per a tothom'], c: 0, why: 'L\'equip ha de saber cap a on va i com es mesura.' },
      { q: 'Què és un risc en equips que creixen?', o: ['Sobrecarregar els més competents', 'Massa feedback', 'Rols massa clars'], c: 0, why: 'Porta a esgotament i a perdre talent.' }
    ]
  },
  L_ia: {
    area: 'avancat', title: 'IA responsable i governança de dades',
    goal: 'Fer servir la intel·ligència artificial amb qualitat, transparència i respecte.',
    body: [
      'La IA pot accelerar tasques: esborranys de textos, variacions d\'anuncis, resums d\'informes, classificació de dades. Però pot cometre errors, inventar dades o reproduir biaixos.',
      'Principis: <b>supervisió humana</b> de tot el que es publica, <b>no introduir dades personals</b> de clients en eines sense garanties, <b>transparència</b> quan el contingut ho requereixi, i respecte dels <b>drets d\'autor</b> i de la imatge de les persones.',
      'La IA no substitueix l\'estratègia ni el coneixement del client: és una eina per dedicar més temps a pensar.'
    ],
    example: 'L\'agència usa IA per generar 20 variants de títols, però una persona les revisa, en tria 4 i comprova que no fan promeses falses abans de provar-les.',
    errors: ['Publicar sense revisar.', 'Pujar dades de clients a eines públiques.', 'Fer servir la imatge o la veu d\'algú sense permís.'],
    quiz: [
      { q: 'Quin ús de la IA és responsable?', o: ['Publicar automàticament 100 textos sense revisió', 'Generar esborranys que una persona revisa i valida', 'Inventar ressenyes'], c: 1, why: 'La supervisió humana garanteix qualitat i veracitat.' },
      { q: 'Pots introduir la base de dades de clients en una eina d\'IA qualsevol?', o: ['Sí, és més ràpid', 'No sense garanties de protecció de dades i base legal', 'Només els dimarts'], c: 1, why: 'Les dades personals estan protegides.' },
      { q: 'Què NO hauria de delegar-se a la IA?', o: ['Variants de títols', 'La decisió estratègica i la responsabilitat davant del client', 'Resums d\'informes'], c: 1, why: 'L\'estratègia i la responsabilitat són humanes.' }
    ]
  }
};
