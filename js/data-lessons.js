/* Agència Digital — biblioteca de lliçons */
window.GD = window.GD || {};
GD.areas = {
  fonaments: T('Fonaments del màrqueting'),
  mercat: T('Investigació de mercat'),
  marca: T('Marca i creativitat'),
  seo: T('SEO'),
  xarxes: T('Xarxes socials'),
  ads: T('Publicitat digital'),
  email: T('Correu i CRM'),
  web: T('Web i comerç electrònic'),
  analitica: T('Analítica'),
  creixement: T('Creixement'),
  direccio: T('Direcció empresarial'),
  avancat: T('Nivell avançat')
};

GD.lessons = {
  /* ---------- ETAPA 1 ---------- */
  L_mkt: {
    area: 'fonaments', title: T('Què és (i què no és) el màrqueting'),
    goal: T('Distingir el màrqueting de la simple publicitat i formular una proposta de valor.'),
    body: [
      T('El màrqueting és el procés d\'entendre què necessiten unes persones concretes, crear una oferta que hi respongui i fer que la coneguin, la triïn i hi tornin. <b>Publicar a xarxes o fer anuncis només és una part de la feina</b>: abans hi ha la investigació, el producte, el preu i la manera de distribuir-lo.'),
      T('Un client no compra hores de feina ni publicacions: compra un <b>resultat</b> (més clients, més vendes, menys temps perdut). Vendre un <b>servei</b> és dir «et gestiono l\'Instagram»; vendre un <b>resultat</b> és dir «t\'ajudaré a omplir les tardes del forn, i ho mesurarem».'),
      T('La <b>proposta de valor</b> resumeix per a qui treballes, quin problema resols i per què ets una opció millor que les alternatives. Ha de ser concreta i comprovable.')
    ],
    example: T('Proposta feble: «Fem màrqueting digital de qualitat». Proposta forta: «Ajudem els comerços d\'Osona a aconseguir més clients del barri amb accions mesurables i pressupostos petits».'),
    errors: [T('Confondre tenir presència a les xarxes amb aconseguir resultats comercials.'), T('Prometre resultats sense haver estudiat el negoci.'), T('Definir-se amb paraules buides que podria dir qualsevol competidor.')],
    quiz: [
      { q: T('Quina d\'aquestes frases descriu millor el màrqueting?'), o: [T('Fer anuncis a internet'), T('Entendre necessitats, crear una oferta que hi respongui i fer que la triïn'), T('Tenir molts seguidors')], c: 1, why: T('La publicitat és una eina dins del màrqueting, no el màrqueting sencer.') },
      { q: T('Quina proposta ven un resultat?'), o: [T('«Et fem 12 publicacions al mes»'), T('«T\'ajudem a augmentar les reserves dels dimarts i ho mesurem cada setmana»'), T('«Som experts en xarxes socials»')], c: 1, why: T('Parla del problema del client i de com es mesurarà l\'èxit.') },
      { q: T('Què ha d\'incloure una bona proposta de valor?'), o: [T('Per a qui, quin problema resol i per què és millor'), T('Una llista llarga de serveis'), T('Un eslògan enginyós')], c: 0, why: T('Una proposta de valor és concreta: públic, problema i diferència.') }
    ]
  },
  L_fin: {
    area: 'direccio', title: T('Ingressos, despeses, benefici i liquiditat'),
    goal: T('Entendre per què una empresa amb vendes pot quedar-se sense diners.'),
    body: [
      T('<b>Ingressos</b>: el que factures. <b>Despeses</b>: el que et costa funcionar (lloguer, eines, sous, desplaçaments). <b>Benefici</b> = ingressos − despeses.'),
      T('La <b>liquiditat</b> són els diners que tens disponibles ara mateix per pagar. Pots tenir beneficis sobre el paper i no poder pagar el lloguer si els clients encara no t\'han pagat.'),
      T('Per això convé tenir una <b>reserva per a imprevistos</b>: uns quants mesos de despeses fixes que no toques si no és imprescindible.')
    ],
    example: T('Una agència factura 4.000 € al gener, però cobra a 60 dies. Si les despeses de gener són 2.500 €, té benefici, però el gener no ha entrat res al compte: necessita liquiditat per aguantar.'),
    errors: [T('Pensar que facturar és el mateix que cobrar.'), T('Gastar tota la caixa inicial en eines abans de tenir clients.'), T('No separar els diners de l\'empresa dels personals.')],
    quiz: [
      { q: T('Factures 3.000 € i les despeses són 2.200 €. Quin és el benefici?'), o: ['5.200 €', '800 €', '3.000 €'], c: 1, why: '3.000 − 2.200 = 800 €.' },
      { q: T('Què és la liquiditat?'), o: [T('El benefici anual'), T('Els diners disponibles ara per fer front als pagaments'), T('El total facturat')], c: 1, why: T('La liquiditat és la caixa disponible, no el resultat comptable.') },
      { q: T('Per què serveix una reserva per a imprevistos?'), o: [T('Per gastar-la en publicitat pròpia'), T('Per aguantar retards de cobrament o despeses inesperades'), T('No serveix de res si tens clients')], c: 1, why: T('Protegeix l\'empresa davant de cobraments que s\'endarrereixen o de crisis.') }
    ]
  },
  L_recerca: {
    area: 'mercat', title: T('Investigar abans de proposar'),
    goal: T('Distingir símptomes de causes i segmentar els clients.'),
    body: [
      T('Un <b>símptoma</b> és el que el client veu («venc menys a la tarda»). La <b>causa</b> és el que ho provoca (un horari mal publicat, un competidor nou, un canvi d\'hàbits del barri). Si ataques el símptoma sense conèixer la causa, pots gastar diners en la solució equivocada.'),
      T('Les eines bàsiques són l\'<b>entrevista</b> amb el client, l\'observació, les dades de vendes i l\'anàlisi dels <b>competidors</b>. Fes preguntes obertes: «què ha canviat?», «qui compra i quan?».'),
      T('La <b>segmentació</b> consisteix a dividir els clients en grups amb necessitats semblants (per exemple: gent gran del barri al matí, famílies a la sortida de l\'escola). Cada segment pot necessitar un missatge i un moment diferents.')
    ],
    example: T('Una perruqueria creu que necessita més anuncis. Entrevistant clientes descobreix que molts no saben que obre els dissabtes: el problema era d\'informació, no de visibilitat.'),
    errors: [T('Proposar la solució abans d\'escoltar.'), T('Fer preguntes que només confirmen el que ja penses.'), T('Tractar tots els clients com si fossin iguals.')],
    quiz: [
      { q: T('«Les vendes de la tarda han baixat.» Això és…'), o: [T('Una causa'), T('Un símptoma'), T('Una solució')], c: 1, why: T('És el que s\'observa; encara cal descobrir per què passa.') },
      { q: T('Quina pregunta és millor en una primera entrevista?'), o: [T('«Voleu que us fem un Instagram?»'), T('«Què ha canviat aquest darrer any al barri i al negoci?»'), T('«Us sembla car el pa?»')], c: 1, why: T('Les preguntes obertes revelen causes que no coneixies.') },
      { q: T('Què és segmentar?'), o: [T('Fer descomptes a tothom'), T('Dividir el públic en grups amb necessitats semblants'), T('Publicar a moltes xarxes')], c: 1, why: T('Segmentar permet adaptar missatge, canal i moment a cada grup.') }
    ]
  },
  L_smart: {
    area: 'fonaments', title: T('Objectius SMART'),
    goal: T('Escriure objectius que es puguin mesurar i avaluar.'),
    body: [
      T('Un objectiu <b>SMART</b> és: e<b>S</b>pecífic (què exactament), <b>M</b>esurable (amb quina xifra), <b>A</b>ssolible (realista amb els recursos), <b>R</b>ellevant (connectat amb el problema del negoci) i limitat en el <b>T</b>emps (per a quan).'),
      T('«Vendre més» no és un objectiu: no saps quan l\'has assolit. «Augmentar un 15 % les vendes de dimarts i dimecres de 16 a 19 h en quatre setmanes» sí que ho és.')
    ],
    example: T('Objectiu dolent: «Tenir més presència». Objectiu SMART: «Aconseguir 40 reserves noves per als dilluns de març mitjançant la web».'),
    errors: [T('Triar un objectiu que no té relació amb el problema (per exemple, seguidors quan el problema són vendes).'), T('No definir el punt de partida per poder comparar.')],
    quiz: [
      { q: T('Quin objectiu és SMART?'), o: [T('Ser el forn més conegut de Vic'), T('Augmentar un 15 % les vendes de la franja 16–19 h en 4 setmanes'), T('Tenir més seguidors')], c: 1, why: T('És específic, mesurable, rellevant, assolible i té termini.') },
      { q: T('Què li falta a «Aconseguir 50 contactes comercials»?'), o: [T('Un termini'), T('Un color corporatiu'), T('Res')], c: 0, why: T('Sense data límit no pots avaluar si l\'has assolit.') },
      { q: T('Per què l\'objectiu ha de ser rellevant?'), o: [T('Perquè quedi bé a l\'informe'), T('Perquè ha de respondre al problema real del negoci'), T('Perquè sigui fàcil')], c: 1, why: T('Pots assolir un objectiu irrellevant i continuar tenint el mateix problema.') }
    ]
  },
  L_metriques: {
    area: 'analitica', title: T('Impressions, interaccions, visites i vendes'),
    goal: T('Triar indicadors que responguin preguntes empresarials.'),
    body: [
      T('Les <b>impressions</b> són les vegades que es mostra un contingut. Les <b>interaccions</b> (m\'agrada, comentaris) indiquen interès. Les <b>visites</b> són persones que arriben a la web o a la botiga. Les <b>vendes</b> (o conversions) són el resultat que paga les factures.'),
      T('Cada pas és més petit que l\'anterior. Una campanya amb moltes impressions pot no generar cap venda. Un indicador és útil si t\'ajuda a <b>prendre una decisió</b> o a respondre una pregunta del negoci.'),
      T('Les <b>mètriques de vanitat</b> (seguidors, m\'agrada) fan bonic però no diuen si el negoci va millor.')
    ],
    example: T('Una cafeteria té 3.000 m\'agrada en un vídeo, però el nombre de cafès venuts no varia. En canvi, un cupó bescanviat a la caixa és una prova directa de visita.'),
    errors: [T('Presentar impressions com si fossin clients.'), T('Mesurar només el que és fàcil de mesurar.'), T('No tenir dades d\'abans per comparar.')],
    quiz: [
      { q: T('Quin indicador està més a prop de les vendes?'), o: [T('Impressions'), T('M\'agrada'), T('Cupons bescanviats a la botiga')], c: 2, why: T('Un cupó bescanviat implica una visita i, normalment, una compra.') },
      { q: T('Què és una mètrica de vanitat?'), o: [T('Una dada que fa bonic però no ajuda a decidir'), T('El cost per venda'), T('Les vendes per franja horària')], c: 0, why: T('Seguidors i m\'agrada poden créixer sense que el negoci millori.') },
      { q: T('Per què cal saber les vendes de les setmanes anteriors?'), o: [T('Per tenir un punt de comparació'), T('No cal'), T('Per fer gràfics')], c: 0, why: T('Sense punt de partida no pots saber si la campanya ha canviat res.') }
    ]
  },
  L_ads1: {
    area: 'ads', title: T('Com es munta una campanya d\'anuncis'),
    goal: T('Configurar objectiu, segmentació, pressupost i conversions.'),
    body: [
      T('L\'<b>objectiu</b> de la campanya diu a la plataforma què ha d\'optimitzar. Si tries «interacció», et portarà gent que fa m\'agrada, no necessàriament gent que s\'inscriu o compra.'),
      T('La <b>segmentació</b> defineix qui veu l\'anunci. Un negoci local no guanya res mostrant anuncis a tot el país: paga impressions inútils.'),
      T('Cal repartir el <b>pressupost</b> de manera raonable al llarg del període i, sobretot, configurar la <b>conversió</b> (inscripció, compra, trucada). Sense conversió mesurada, no saps què et costa cada client.')
    ],
    example: T('Un gimnàs local que segmenta «18–65 anys, tota Espanya» i optimitza per interaccions gasta el pressupost en persones que mai no hi aniran.'),
    errors: [T('Triar l\'objectiu equivocat.'), T('Segmentació massa àmplia.'), T('No mesurar la conversió.'), T('Gastar tot el pressupost en un sol dia.')],
    quiz: [
      { q: T('Un gimnàs de Vic vol inscripcions. Quin objectiu ha de triar?'), o: [T('Interacció amb la publicació'), T('Conversions / contactes (inscripcions)'), T('Visualitzacions de vídeo')], c: 1, why: T('La plataforma optimitza per allò que li demanes.') },
      { q: T('Quina segmentació té més sentit?'), o: [T('Tota Espanya, 18–65 anys'), T('10 km al voltant del gimnàs, 20–55 anys'), T('Tot el món')], c: 1, why: T('Un servei presencial necessita gent que hi pugui anar.') },
      { q: T('Què passa si no configures la conversió?'), o: [T('Res, la plataforma ho endevina'), T('No pots saber quantes inscripcions genera ni quant costen'), T('Els anuncis són més barats')], c: 1, why: T('Sense mesura no hi ha optimització ni retiment de comptes.') }
    ]
  },

  /* ---------- ETAPA 2 ---------- */
  L_seolocal: {
    area: 'seo', title: T('SEO local i reputació'),
    goal: T('Aparèixer quan algú busca a prop i convertir la cerca en visita.'),
    body: [
      T('Moltes cerques tenen <b>intenció de visita</b>: «restaurant obert dilluns Vic», «forn a prop». Per aparèixer-hi, la fitxa de <b>Google Business Profile</b> ha de tenir horaris correctes, categoria, fotos reals, carta o serveis i un enllaç per reservar o trucar.'),
      T('Les <b>ressenyes</b> influeixen en la decisió i en la visibilitat. Cal demanar-les als clients satisfets, respondre-les totes (també les negatives) amb educació i solucionar el que es critica.'),
      T('La <b>conversió</b> local és el pas de la cerca a l\'acció: trucar, demanar com arribar, reservar.')
    ],
    example: T('Un restaurant que publica el menú del dilluns a la fitxa i activa les reserves en línia passa de 2 a 9 reserves els dilluns (cas simulat).'),
    errors: [T('Horaris desactualitzats.'), T('Respondre de manera defensiva a les crítiques.'), T('Comprar ressenyes falses (és enganyós i pot ser sancionat).')],
    quiz: [
      { q: T('Quina cerca té intenció de visita?'), o: [T('«Història de la cuina catalana»'), T('«Restaurant obert dilluns a Vic»'), T('«Recepta de fricandó»')], c: 1, why: T('La persona vol anar a un lloc concret, ara.') },
      { q: T('Com respons una ressenya negativa justa?'), o: [T('L\'ignores'), T('Agraeixes, expliques què canviaràs i ho fas'), T('Discuteixes amb el client')], c: 1, why: T('Una resposta honesta i útil genera confiança en els futurs clients.') },
      { q: T('Què és prioritari en una fitxa local?'), o: [T('Horaris i informació correctes'), T('Un logo nou'), T('Moltes etiquetes')], c: 0, why: T('Si la informació és errònia, perds visites encara que siguis visible.') }
    ]
  },
  L_b2b: {
    area: 'creixement', title: T('Màrqueting B2B i l\'embut comercial'),
    goal: T('Captar contactes empresarials de qualitat i coordinar-se amb vendes.'),
    body: [
      T('En el <b>B2B</b> (empresa a empresa) decideixen diverses persones (compres, enginyeria, direcció), les compres són grans i el <b>cicle de venda</b> pot durar mesos.'),
      T('L\'<b>embut</b> té etapes: descobriment → interès → contacte (lead) → oportunitat → venda. El màrqueting ha de portar contactes <b>qualificats</b> i vendes ha de fer-ne el seguiment ràpidament.'),
      T('Indicadors clau: <b>cost per contacte</b>, percentatge de contactes que es converteixen en oportunitats, i <b>cost d\'adquisició de client (CAC)</b> = inversió comercial ÷ clients nous.')
    ],
    example: T('Una campanya genera 200 contactes a 5 € cadascun, però cap no és una empresa compradora. Una altra en genera 20 a 40 €, i 4 acaben en comanda. La segona és molt millor.'),
    errors: [T('Mesurar només el volum de contactes.'), T('No definir què és un contacte qualificat.'), T('Deixar passar dies abans de trucar.')],
    quiz: [
      { q: T('Inverteixes 2.000 € i aconsegueixes 4 clients nous. Quin és el CAC?'), o: ['500 €', '8.000 €', '2.000 €'], c: 0, why: T('2.000 ÷ 4 = 500 € per client.') },
      { q: T('Què és un contacte qualificat?'), o: [T('Qualsevol correu'), T('Algú amb necessitat, capacitat de compra i encaix amb el producte'), T('Un seguidor de LinkedIn')], c: 1, why: T('La qualificació separa curiosos de compradors potencials.') },
      { q: T('Quin és un tret típic del B2B?'), o: [T('Compres impulsives'), T('Diverses persones decideixen i el cicle és llarg'), T('Preus molt baixos')], c: 1, why: T('Per això cal contingut tècnic i un seguiment comercial acurat.') }
    ]
  },
  L_seo: {
    area: 'seo', title: T('SEO: intenció de cerca i continguts'),
    goal: T('Atraure visites amb intenció a través dels cercadors.'),
    body: [
      T('El <b>SEO</b> (optimització per a cercadors) consisteix a fer que una web aparegui quan algú busca allò que oferim. Cal saber <b>quines paraules</b> fa servir el client i <b>amb quina intenció</b> (informar-se, comparar, comprar).'),
      T('Tres pilars: <b>tècnic</b> (la web carrega ràpid, es pot indexar, funciona al mòbil), <b>contingut</b> (pàgines útils que responen preguntes reals) i <b>autoritat</b> (enllaços i mencions de webs fiables).'),
      T('En sectors industrials, les cerques són poques però molt valuoses: «fabricant engranatges a mida», «component inoxidable normativa X».')
    ],
    example: T('Una fàbrica crea una pàgina per a cada família de producte amb fitxa tècnica descarregable. En sis mesos rep consultes de compradors que abans no la trobaven (cas simulat).'),
    errors: [T('Escriure per a robots en lloc de persones.'), T('Una sola pàgina genèrica per a tots els productes.'), T('Esperar resultats en una setmana.')],
    quiz: [
      { q: T('Quina cerca indica intenció de compra B2B?'), o: [T('«Què és un engranatge»'), T('«Fabricant engranatges a mida pressupost»'), T('«Fotos de fàbriques»')], c: 1, why: T('Inclou paraules com «fabricant» i «pressupost».') },
      { q: T('Quin és un problema de SEO tècnic?'), o: [T('La web no funciona bé al mòbil'), T('El logo és lleig'), T('Hi ha massa productes')], c: 0, why: T('El rendiment i l\'accessibilitat tècnica afecten la indexació i l\'experiència.') },
      { q: T('Quant triga normalment el SEO a donar resultats?'), o: [T('Hores'), T('Setmanes o mesos'), T('Mai')], c: 1, why: T('És una inversió a mitjà termini.') }
    ]
  },
  L_ecom: {
    area: 'web', title: T('Botiga en línia: conversió i abandonament'),
    goal: T('Dissenyar una botiga que vengui, no només que sigui bonica.'),
    body: [
      T('La <b>taxa de conversió</b> és el percentatge de visites que acaben comprant. Si 1.000 persones visiten la botiga i 15 compren, la conversió és de l\'1,5 %.'),
      T('Les causes habituals d\'<b>abandonament del carretó</b> són: costos d\'enviament inesperats al final, obligació de crear un compte, pocs mètodes de pagament, dubtes sobre l\'entrega i webs lentes al mòbil.'),
      T('Una bona <b>fitxa de producte</b> respon les preguntes del comprador: què és, quant pesa, com es conserva, quan arriba, què passa si no m\'agrada.'),
      T('Cal calcular el <b>marge per comanda</b>: preu − cost del producte − enviament − comissions − cost d\'adquisició.')
    ],
    example: T('Una botiga d\'embotits mostra el cost de l\'enviament refrigerat només al final. Quan el mostra a la fitxa i ofereix enviament gratuït a partir de 45 €, l\'abandonament baixa (cas simulat).'),
    errors: [T('Prioritzar l\'estètica per sobre de la usabilitat.'), T('Amagar costos fins al darrer pas.'), T('Oblidar la logística i l\'atenció al client.')],
    quiz: [
      { q: T('2.000 visites i 30 comandes. Quina és la conversió?'), o: ['15 %', '1,5 %', '0,15 %'], c: 1, why: '30 ÷ 2.000 = 0,015 → 1,5 %.' },
      { q: T('Quina és una causa típica d\'abandonament?'), o: [T('Costos d\'enviament que apareixen al final'), T('Fotos massa clares'), T('Massa informació sobre el producte')], c: 0, why: T('Les sorpreses de preu al final fan desconfiar.') },
      { q: T('Per què cal calcular el marge per comanda?'), o: [T('Per saber si cada venda deixa diners després de tots els costos'), T('Per decidir el color de la web'), T('No cal')], c: 0, why: T('Pots vendre molt i perdre diners en cada comanda.') }
    ]
  },
  L_xarxes: {
    area: 'xarxes', title: T('Estratègia a xarxes socials'),
    goal: T('Fer servir les xarxes amb un propòsit i mesurar-ne l\'efecte real.'),
    body: [
      T('Les xarxes serveixen per crear <b>comunitat</b>, mantenir la marca present i portar trànsit cap a una acció. Una <b>estratègia editorial</b> defineix per a qui publiques, quins temes, amb quina freqüència i què vols que facin després.'),
      T('El creixement de seguidors pot venir de sortejos o de contingut viral que no té res a veure amb el teu client. Un seguidor que no comprarà mai no té valor comercial.'),
      T('Les col·laboracions amb <b>creadors</b> funcionen si el seu públic coincideix amb el teu i la relació comercial s\'indica clarament.')
    ],
    example: T('Una marca de roba guanya 8.000 seguidors amb un sorteig d\'un mòbil. Les vendes no es mouen: la majoria de nous seguidors només volien el mòbil.'),
    errors: [T('Publicar per publicar.'), T('Mesurar l\'èxit només en seguidors.'), T('No indicar que un contingut és publicitat.')],
    quiz: [
      { q: T('Un sorteig d\'un mòbil fa créixer molt els seguidors d\'una botiga de llana. Què és probable?'), o: [T('Que les vendes es tripliquin'), T('Que molts seguidors no siguin clients potencials'), T('Que el SEO millori')], c: 1, why: T('El premi atrau gent interessada en el premi, no en el producte.') },
      { q: T('Què ha d\'incloure una estratègia editorial?'), o: [T('Públic, temes, freqüència i acció desitjada'), T('Només el calendari de publicacions'), T('Els hashtags de moda')], c: 0, why: T('Sense propòsit, la freqüència no serveix de res.') },
      { q: T('Quan treballes amb un creador de contingut pagat…'), o: [T('No cal dir res'), T('Cal indicar clarament que és publicitat'), T('Només si ho demana')], c: 1, why: T('La transparència és una obligació i protegeix la confiança.') }
    ]
  },
  L_kpi: {
    area: 'analitica', title: T('KPI, etiquetatge i causalitat'),
    goal: T('Construir un informe que separi activitat, resultats de màrqueting i resultats comercials.'),
    body: [
      T('Un <b>KPI</b> (indicador clau de rendiment) és la mètrica que diu si avances cap a l\'objectiu. Separa tres nivells: <b>activitat</b> (publicacions fetes), <b>resultats de màrqueting</b> (visites, contactes) i <b>resultats comercials</b> (vendes, ingressos).'),
      T('Per saber d\'on ve cada visita cal <b>etiquetar</b> els enllaços de les campanyes (paràmetres UTM) i definir <b>esdeveniments i conversions</b> a l\'analítica web.'),
      T('<b>Correlació no és causalitat</b>: que dues coses passin alhora no vol dir que una provoqui l\'altra. Les vendes poden pujar al desembre per Nadal, no per la campanya.')
    ],
    example: T('Un informe honest: «Hem publicat 20 vegades (activitat), han arribat 1.200 visites des d\'Instagram (màrqueting) i 18 han comprat, 540 € (comercial)».'),
    errors: [T('Barrejar activitat amb resultats.'), T('Atribuir tot el canvi a la campanya.'), T('Enllaços sense etiquetar.')],
    quiz: [
      { q: T('«Hem publicat 30 vídeos.» Quin nivell és?'), o: [T('Activitat'), T('Resultat comercial'), T('Conversió')], c: 0, why: T('Descriu la feina feta, no el resultat obtingut.') },
      { q: T('Per a què serveixen els paràmetres UTM?'), o: [T('Per identificar de quina campanya ve cada visita'), T('Per accelerar la web'), T('Per evitar el correu brossa')], c: 0, why: T('Permeten atribuir visites i vendes a cada acció.') },
      { q: T('Les vendes pugen al desembre i la campanya també era al desembre. Què pots afirmar?'), o: [T('La campanya ha causat la pujada'), T('Hi ha correlació, però cal descartar l\'estacionalitat'), T('La campanya no ha servit')], c: 1, why: T('Cal comparar amb anys anteriors o un grup de control.') }
    ]
  },

  /* ---------- ETAPA 3 ---------- */
  L_prospeccio: {
    area: 'direccio', title: T('Prospecció i qualificació comercial'),
    goal: T('Invertir el temps comercial en els contactes amb més potencial.'),
    body: [
      T('La <b>prospecció</b> és buscar clients potencials. A una fira parlaràs amb molta gent: el repte és identificar qui té un problema que pots resoldre, pressupost, capacitat de decisió i urgència.'),
      T('Un <b>argumentari</b> no és un monòleg: és una conversa preparada amb preguntes, exemples de resultats i respostes a objeccions habituals.'),
      T('El <b>retorn d\'una acció comercial</b> = (marge dels clients aconseguits − cost de l\'acció) ÷ cost de l\'acció. Inclou el teu temps!')
    ],
    example: T('Després d\'una fira, en lloc d\'enviar el mateix correu a 80 targetes, l\'agència prioritza les 8 empreses que han explicat un problema concret i tenen pressupost.'),
    errors: [T('Perseguir tothom per igual.'), T('Parlar només dels teus serveis.'), T('No fer seguiment en 48 hores.')],
    quiz: [
      { q: T('Quin contacte té més potencial?'), o: [T('Un estudiant curiós'), T('Una gerent amb un problema concret, pressupost i data límit'), T('Algú que només vol bolígrafs')], c: 1, why: T('Necessitat, capacitat de decisió, pressupost i urgència.') },
      { q: T('Una fira costa 600 € i et porta 2 clients amb 1.500 € de marge total. Quin és el retorn?'), o: ['150 %', '250 %', '60 %'], c: 0, why: '(1.500 − 600) ÷ 600 = 1,5 → 150 %.' },
      { q: T('Què hauria d\'incloure un bon argumentari?'), o: [T('Preguntes, exemples i respostes a objeccions'), T('Un discurs llarg sobre l\'agència'), T('Només preus')], c: 0, why: T('Una conversa útil per al client ven més que un monòleg.') }
    ]
  },
  L_posicionament: {
    area: 'fonaments', title: T('Posicionament i diferenciació'),
    goal: T('Triar on competir i on no.'),
    body: [
      T('El <b>posicionament</b> és el lloc que ocupes a la ment dels clients en comparació amb els competidors. No pots ser el més barat, el més gran i el més especialitzat alhora.'),
      T('Formes de diferenciar-se: <b>coneixement local</b>, <b>especialització</b> en un sector o servei, <b>servei personalitzat</b>, o una <b>estructura de costos</b> més eficient.'),
      T('De vegades un competidor és també un possible <b>aliat</b>: si les vostres habilitats són complementàries, podeu compartir projectes.')
    ],
    example: T('Una agència petita no pot igualar els recursos d\'una de Barcelona, però pot ser la que millor coneix els comerços i la indústria d\'Osona i respondre en el mateix dia.'),
    errors: [T('Competir només en preu.'), T('Prometre més del que pots complir.'), T('Copiar el discurs del competidor gran.')],
    quiz: [
      { q: T('Quina diferenciació és més creïble per a una agència petita de Vic?'), o: [T('Som els més grans'), T('Coneixement local i servei proper amb resultats mesurables'), T('Fem de tot')], c: 1, why: T('És veritat, és difícil de copiar i és valuós per al client.') },
      { q: T('Competir només amb preus baixos…'), o: [T('És sempre la millor estratègia'), T('Redueix el marge i atrau clients que marxaran per un preu més baix'), T('Augmenta la reputació')], c: 1, why: T('Sempre hi haurà algú més barat.') },
      { q: T('Quan té sentit aliar-se amb un competidor?'), o: [T('Mai'), T('Quan les habilitats són complementàries i hi ha confiança'), T('Només si et compra l\'empresa')], c: 1, why: T('La col·laboració permet accedir a projectes que sol no podries fer.') }
    ]
  },
  L_pressupost: {
    area: 'direccio', title: T('Abast, pressupost i marge'),
    goal: T('Pressupostar un servei sense perdre diners.'),
    body: [
      T('L\'<b>abast</b> defineix exactament què inclou el servei: quines tasques, quantes peces, quantes <b>revisions</b>, quins terminis i què <b>no</b> inclou.'),
      T('Per pressupostar: estima les <b>hores</b>, multiplica-les pel teu cost per hora i afegeix-hi un marge. <b>Marge brut</b> = (preu − cost directe) ÷ preu.'),
      T('Pacta com es gestionen els <b>canvis</b>: «les modificacions fora d\'abast es pressuposten a part». Així protegeixes la rendibilitat i la relació.')
    ],
    example: T('Un projecte de 1.200 € que requereix 30 hores a un cost de 25 €/h té un cost directe de 750 €: marge brut del 37,5 %. Si el client demana 20 hores més sense pagar, el marge passa a ser negatiu.'),
    errors: [T('Acceptar «encarrega\'t de tot» sense límits.'), T('No comptar el temps de reunions i correus.'), T('Fer canvis gratis per por de perdre el client.')],
    quiz: [
      { q: T('Preu 2.000 €, cost directe 1.200 €. Quin és el marge brut?'), o: ['40 %', '60 %', '800 %'], c: 0, why: '(2.000 − 1.200) ÷ 2.000 = 0,40.' },
      { q: T('Què ha de dir l\'abast d\'un projecte?'), o: [T('Què inclou, què no, revisions i terminis'), T('Només el preu'), T('El nom del client')], c: 0, why: T('Un abast clar evita conflictes.') },
      { q: T('El client demana una feina que no era al contracte. Què fas?'), o: [T('La fas gratis'), T('L\'expliques i la pressuposteu a part o canvieu prioritats'), T('T\'enfades')], c: 1, why: T('És professional i manté la confiança.') }
    ]
  },
  L_planificacio: {
    area: 'direccio', title: T('Planificació i priorització'),
    goal: T('Repartir el temps quan tot arriba alhora.'),
    body: [
      T('Classifica les tasques per <b>urgència</b> i <b>impacte</b>. Primer el que és urgent i important; planifica el que és important però no urgent; delega o ajorna (avisant!) la resta.'),
      T('Estima recursos amb honestedat: una tasca sempre porta temps de coordinació. Afegeix-hi un marge.'),
      T('La <b>comunicació</b> és part de la planificació: un client que sap que rebrà la feina dijous està més tranquil que un que no sap res.')
    ],
    example: T('Tres clients demanen canvis la mateixa setmana. L\'agència resol primer l\'error que impedeix vendre a la botiga en línia, programa la campanya per dijous i avisa el tercer client que el redisseny arribarà dilluns.'),
    errors: [T('Treballar de nit sistemàticament: la qualitat cau.'), T('Ajornar sense avisar.'), T('Dir que sí a tot.')],
    quiz: [
      { q: T('Què resols primer?'), o: [T('Un canvi de color al logo'), T('Un error que impedeix comprar a la botiga en línia d\'un client'), T('Un informe trimestral que vencerà d\'aquí a un mes')], c: 1, why: T('És urgent i té un gran impacte en el negoci del client.') },
      { q: T('Si has d\'ajornar una tasca…'), o: [T('Ho fas sense dir res'), T('Avises el client amb una data nova realista'), T('Esperes que no se n\'adoni')], c: 1, why: T('La transparència preserva la confiança.') },
      { q: T('Subcontractar una tasca té sentit quan…'), o: [T('No tens capacitat i algú la pot fer bé amb un cost raonable'), T('Mai'), T('Vols estalviar-te la responsabilitat')], c: 0, why: T('Continues sent responsable del resultat davant del client.') }
    ]
  },

  /* ---------- ETAPA 4 ---------- */
  L_contractar: {
    area: 'direccio', title: T('Contractar i delegar'),
    goal: T('Decidir quan i com incorporar persones a l\'equip.'),
    body: [
      T('El <b>cost total</b> d\'una persona contractada és més alt que el sou brut: cal sumar-hi la Seguretat Social a càrrec de l\'empresa, eines, formació i temps d\'incorporació.'),
      T('Contractar té sentit quan els <b>ingressos recurrents</b> poden cobrir-ne el cost i quan el temps que alliberes pots dedicar-lo a feina de més valor (vendre, dirigir).'),
      T('<b>Delegar</b> no és desentendre\'s: cal definir objectius, criteris de qualitat i revisions periòdiques.')
    ],
    example: T('Una analista amb un sou de 1.900 € bruts al mes costa a l\'empresa uns 2.500 € amb cotitzacions i eines. Si allibera 60 hores al mes del director per vendre, pot ser rendible (xifres orientatives i simplificades).'),
    errors: [T('Contractar amb ingressos puntuals, no recurrents.'), T('Delegar sense instruccions clares.'), T('No preveure el temps de formació.')],
    quiz: [
      { q: T('Què cal comparar abans de contractar?'), o: [T('El cost total amb el valor i el temps que aportarà'), T('Només el sou'), T('El nombre de seguidors de l\'agència')], c: 0, why: T('Una contractació és una inversió.') },
      { q: T('Quin ingrés és més segur per cobrir un sou?'), o: [T('Un projecte puntual'), T('Quotes mensuals de clients recurrents'), T('Un premi')], c: 1, why: T('Els sous es paguen cada mes.') },
      { q: T('Delegar bé vol dir…'), o: [T('Donar la tasca i oblidar-se\'n'), T('Definir objectius, criteris i revisions'), T('Fer-ho tot tu igualment')], c: 1, why: T('Així la persona té autonomia i tu tens control de qualitat.') }
    ]
  },
  L_brief: {
    area: 'marca', title: T('Marca, brief creatiu i proves de missatge'),
    goal: T('Fer que la creativitat serveixi l\'objectiu.'),
    body: [
      T('La <b>identitat de marca</b> inclou valors, to de veu, estil visual i promesa. Ha de ser <b>coherent</b> en tots els punts de contacte.'),
      T('Un <b>brief creatiu</b> és el document que orienta la creativitat: objectiu, públic, missatge principal, proves que el sustenten, formats, to i com es mesurarà l\'èxit.'),
      T('Les <b>proves de missatge</b> (A/B) permeten comparar dues propostes amb dades en lloc d\'opinions. Una peça bonica no és necessàriament efectiva.')
    ],
    example: T('La Berta proposa un vídeo poètic per a una fàbrica. Amb el brief, adapta la idea: imatges espectaculars de la maquinària, però amb el missatge «entrega en 48 hores» que és el que valoren els compradors.'),
    errors: [T('Començar a dissenyar sense brief.'), T('Decidir per gust personal.'), T('Canviar de to a cada campanya.')],
    quiz: [
      { q: T('Què NO és part d\'un brief creatiu?'), o: [T('Públic objectiu'), T('Missatge principal'), T('El color preferit del director')], c: 2, why: T('El brief parteix de l\'objectiu i el públic, no de gustos personals.') },
      { q: T('Com decideixes entre dues propostes creatives?'), o: [T('Per votació de l\'equip'), T('Amb una prova A/B davant del públic real'), T('Tries la més cara')], c: 1, why: T('Les dades del públic són millors que les opinions internes.') },
      { q: T('Coherència de marca vol dir…'), o: [T('Fer sempre el mateix anunci'), T('Mantenir valors, to i estil en tots els canals'), T('Fer servir un sol color')], c: 1, why: T('Ajuda a reconèixer la marca i confiar-hi.') }
    ]
  },
  L_processos: {
    area: 'direccio', title: T('Processos, documentació i qualitat'),
    goal: T('Treballar en equip sense perdre informació.'),
    body: [
      T('Quan hi ha diverses persones i clients, cal un <b>canal únic</b> per a les peticions, una <b>eina de gestió de tasques</b> amb responsables i dates, i <b>plantilles</b> per a informes i propostes.'),
      T('Un <b>control de qualitat</b> senzill (una llista de comprovació abans d\'enviar res) evita la majoria d\'errors.'),
      T('Una <b>rutina de revisió</b> setmanal permet detectar retards abans que siguin un problema.')
    ],
    example: T('Abans: peticions per WhatsApp, correu i trucades, i tres errors de coordinació al mes. Després: formulari de peticions + tauler de tasques + revisió dels dilluns.'),
    errors: [T('Massa processos: ningú no els segueix.'), T('Tasques sense responsable.'), T('No documentar les decisions del client.')],
    quiz: [
      { q: T('Quin és el primer pas per ordenar les peticions dels clients?'), o: [T('Un canal únic d\'entrada'), T('Més reunions'), T('Respondre més de pressa')], c: 0, why: T('Si les peticions entren per tot arreu, es perden.') },
      { q: T('Tota tasca hauria de tenir…'), o: [T('Un responsable i una data'), T('Tres responsables'), T('Cap data per no pressionar')], c: 0, why: T('Si és de tothom, no és de ningú.') },
      { q: T('Una llista de comprovació abans d\'enviar un informe serveix per…'), o: [T('Reduir errors evitables'), T('Allargar la feina'), T('Res')], c: 0, why: T('És el control de qualitat més barat que existeix.') }
    ]
  },
  L_crm: {
    area: 'email', title: T('CRM, automatització i protecció de dades'),
    goal: T('Automatitzar el que és repetitiu respectant el consentiment.'),
    body: [
      T('Un <b>CRM</b> és una eina on es registren els contactes i les relacions comercials: qui és, què li interessa, en quina fase està, quan cal fer el seguiment.'),
      T('L\'<b>automatització</b> és útil per a tasques repetitives (enviar un correu de benvinguda, classificar contactes, generar informes). Les decisions de criteri (estratègia, respostes delicades) requereixen persones.'),
      T('Per enviar correus comercials cal el <b>consentiment</b> de la persona o una relació prèvia que ho permeti, informar de qui ets i oferir una manera fàcil de donar-se de baixa (RGPD i normativa de comunicacions comercials). Comprar bases de dades és mala pràctica i un risc legal.')
    ],
    example: T('Quan algú descarrega una fitxa tècnica (i accepta rebre informació), el CRM li envia un correu útil al cap de 3 dies i avisa el comercial si torna a visitar la pàgina de preus.'),
    errors: [T('Comprar llistes de correus.'), T('Automatitzar respostes a queixes.'), T('No segmentar: enviar el mateix a tothom.')],
    quiz: [
      { q: T('Quina tasca és millor automatitzar?'), o: [T('Respondre una crisi de reputació'), T('Enviar un correu de benvinguda a qui s\'ha subscrit'), T('Decidir l\'estratègia anual')], c: 1, why: T('És repetitiva i no necessita criteri humà en cada cas.') },
      { q: T('Pots enviar butlletins a una llista de correus comprada?'), o: [T('Sí, si és barata'), T('No: cal consentiment o una base legal'), T('Sí, si poses un logo')], c: 1, why: T('Sense consentiment vulneres la normativa i la confiança.') },
      { q: T('Què és un CRM?'), o: [T('Una xarxa social'), T('Una eina per gestionar contactes i relacions comercials'), T('Un tipus d\'anunci')], c: 1, why: T('Centralitza la informació dels clients i el seguiment.') }
    ]
  },
  L_rendibilitat: {
    area: 'direccio', title: T('Rendibilitat per client'),
    goal: T('Saber quins clients fan créixer l\'empresa i quins la desgasten.'),
    body: [
      T('No tots els clients són igual de rendibles. Per a cada client: <b>ingressos</b> − <b>hores reals × cost per hora</b> − altres costos = <b>marge</b>.'),
      T('Un client que paga molt però consumeix el triple d\'hores de les pressupostades pot ser menys rendible que un de petit i ordenat.'),
      T('Opcions: <b>revisar preus</b>, <b>ajustar l\'abast</b>, <b>millorar processos</b> o, en darrer cas, <b>deixar el client</b> de manera professional.')
    ],
    example: T('Client A: 1.500 €/mes, 80 h reals × 25 € = 2.000 € de cost → −500 €. Client B: 600 €/mes, 12 h × 25 € = 300 € → +300 €.'),
    errors: [T('Mirar només la facturació.'), T('No registrar les hores reals.'), T('Rebaixar preus per por.')],
    quiz: [
      { q: T('Un client paga 1.000 €/mes i consumeix 50 h a 25 €/h. Quin marge deixa?'), o: ['−250 €', '+250 €', '+1.000 €'], c: 0, why: T('50 × 25 = 1.250 € de cost: 1.000 − 1.250 = −250 €.') },
      { q: T('Quina dada necessites per calcular la rendibilitat per client?'), o: [T('Les hores reals dedicades'), T('Els seus seguidors'), T('La mida de la seva empresa')], c: 0, why: T('Sense hores reals no saps el cost.') },
      { q: T('Davant d\'un client poc rendible, la primera opció hauria de ser…'), o: [T('Deixar-lo de cop'), T('Parlar-hi per revisar abast o preu'), T('Treballar menys sense dir-ho')], c: 1, why: T('Sovint es pot redreçar amb una conversa clara.') }
    ]
  },

  /* ---------- ETAPA 5 ---------- */
  L_ads2: {
    area: 'ads', title: T('Diagnosticar una campanya: CTR, CPC, CPA i ROAS'),
    goal: T('Trobar on falla una campanya abans de tocar res.'),
    body: [
      T('<b>CTR</b> = clics ÷ impressions. Indica si l\'anunci crida l\'atenció del públic. <b>CPC</b> = cost ÷ clics. <b>CPA</b> = cost ÷ conversions (quant costa cada venda o contacte). <b>ROAS</b> = ingressos generats ÷ inversió publicitària.'),
      T('Llegeix l\'embut: si el CTR és bo però no hi ha conversions, el problema pot ser la <b>pàgina de destinació</b>, el procés de compra o el <b>seguiment</b> (la conversió no es registra).'),
      T('Abans d\'aturar una campanya, comprova que les dades són <b>fiables</b>.')
    ],
    example: T('CTR del 3 % (bo), 400 clics, 0 compres registrades. En revisar-ho, la pàgina de pagament no funcionava en mòbils Android (cas simulat).'),
    errors: [T('Canviar l\'anunci quan el problema és la web.'), T('Mirar el ROAS sense restar el marge del producte.'), T('Treure conclusions amb poques dades.')],
    quiz: [
      { q: T('10.000 impressions i 200 clics. Quin és el CTR?'), o: ['0,2 %', '2 %', '20 %'], c: 1, why: '200 ÷ 10.000 = 0,02 → 2 %.' },
      { q: T('Has gastat 600 € i has fet 20 vendes. Quin és el CPA?'), o: ['30 €', '12.000 €', '620 €'], c: 0, why: '600 ÷ 20 = 30 €.' },
      { q: T('Molts clics, CTR alt, zero conversions. On mires primer?'), o: [T('La pàgina de destinació i el seguiment de conversions'), T('El color de l\'anunci'), T('L\'horari de l\'oficina')], c: 0, why: T('L\'anunci funciona; el problema és després del clic.') }
    ]
  },
  L_crisi: {
    area: 'xarxes', title: T('Comunicació de crisi i reputació'),
    goal: T('Respondre a una crisi amb honestedat i accions reals.'),
    body: [
      T('En una crisi de reputació: 1) <b>escolta</b> i entén què ha passat; 2) <b>reconeix</b> el que és cert; 3) explica què faràs per <b>solucionar-ho</b>; 4) <b>fes-ho</b>; 5) informa del canvi.'),
      T('Esborrar crítiques legítimes o respondre de manera defensiva normalment amplifica el problema.'),
      T('No tornis a fer promoció fins que el problema de fons s\'hagi resolt: estaries portant gent a una mala experiència.')
    ],
    example: T('Un restaurant canvia el menú i apuja preus sense explicar-ho. Rep crítiques. Resposta efectiva: reconèixer-ho, recuperar el plat més demanat i explicar el perquè dels preus.'),
    errors: [T('Esborrar comentaris crítics.'), T('Culpar els clients.'), T('Prometre canvis que no es faran.')],
    quiz: [
      { q: T('Quin és el primer pas en una crisi?'), o: [T('Esborrar els comentaris'), T('Entendre què ha passat'), T('Fer un sorteig')], c: 1, why: T('Sense diagnòstic, la resposta pot empitjorar-ho.') },
      { q: T('Esborrar crítiques legítimes…'), o: [T('Resol la crisi'), T('Sol amplificar-la i destrueix la confiança'), T('És obligatori')], c: 1, why: T('Els clients ho noten i se sumen més veus.') },
      { q: T('Quan tornes a fer promoció?'), o: [T('Immediatament'), T('Quan el problema de fons està resolt'), T('Mai més')], c: 1, why: T('La promoció amplifica tant les bones com les males experiències.') }
    ]
  },
  L_atribucio: {
    area: 'analitica', title: T('Atribució i incrementalitat'),
    goal: T('Interpretar amb prudència qui «s\'emporta» cada venda.'),
    body: [
      T('L\'<b>atribució</b> és la regla que decideix quin canal rep el mèrit d\'una venda. Cada plataforma fa servir el seu model i la seva <b>finestra de conversió</b> (per exemple, 7 dies després del clic), i sovint totes s\'atribueixen la mateixa venda.'),
      T('Per això la suma de les vendes que diuen les plataformes pot ser més gran que les vendes reals de la botiga.'),
      T('La <b>incrementalitat</b> respon una altra pregunta: quantes vendes <b>no</b> s\'haurien produït sense la campanya? Es mesura amb experiments: un grup que veu els anuncis i un altre que no (per exemple, per zones geogràfiques).')
    ],
    example: T('Meta diu 120 vendes, Google 90, el correu 40. La botiga n\'ha fet 160. No hi ha cap error greu: els models d\'atribució se solapen.'),
    errors: [T('Sumar les vendes de totes les plataformes.'), T('Creure que atribuir és demostrar causalitat.'), T('Canviar de model d\'atribució per fer quedar bé un canal.')],
    quiz: [
      { q: T('Les plataformes sumen 250 vendes però la botiga n\'ha fet 160. Per què?'), o: [T('Algú ha robat dades'), T('Diversos canals s\'atribueixen la mateixa venda'), T('La botiga menteix')], c: 1, why: T('Cada plataforma compta les vendes on ha participat.') },
      { q: T('Com mesures la incrementalitat?'), o: [T('Amb un experiment amb grup de control'), T('Mirant el ROAS de la plataforma'), T('Preguntant al client')], c: 0, why: T('Compara el que passa amb i sense la campanya.') },
      { q: T('Què és una finestra de conversió?'), o: [T('El període després d\'un clic o impressió en què una venda s\'atribueix a l\'anunci'), T('Una finestra de la web'), T('L\'horari de la botiga')], c: 0, why: T('Finestres més llargues atribueixen més vendes.') }
    ]
  },
  L_tresoreria: {
    area: 'direccio', title: T('Tresoreria i risc financer'),
    goal: T('Preveure els diners que entraran i sortiran.'),
    body: [
      T('Un <b>pla de tresoreria</b> és una taula setmana a setmana amb els cobraments previstos i els pagaments (nòmines, lloguer, impostos, proveïdors).'),
      T('Per reduir el risc: factures clares amb <b>venciment</b>, cobrament per avançat d\'una part del projecte, seguiment dels impagaments i una <b>reserva</b>.'),
      T('La <b>concentració</b> és perillosa: si un client representa més del 30–40 % dels ingressos, el seu retard pot posar en perill l\'empresa.')
    ],
    example: T('Una agència cobra el 40 % a l\'inici de cada projecte. Quan un client retarda el pagament final, la bestreta i la reserva cobreixen les nòmines.'),
    errors: [T('Començar a treballar sense bestreta en projectes grans.'), T('No reclamar les factures vençudes.'), T('Dependre d\'un sol client.')],
    quiz: [
      { q: T('Què és la concentració de clients?'), o: [T('Molts clients petits'), T('Dependre molt d\'un o pocs clients'), T('Tenir clients a la mateixa ciutat')], c: 1, why: T('És un risc: si aquell client falla, l\'empresa trontolla.') },
      { q: T('Quina mesura redueix el risc de cobrament?'), o: [T('Cobrar una bestreta a l\'inici'), T('Facturar més tard'), T('No fer factures')], c: 0, why: T('Asseguren part dels ingressos abans de treballar.') },
      { q: T('Un client no paga i no tens reserva. Què és prioritari?'), o: [T('Fer un pla de tresoreria i parlar amb el client per pactar un calendari'), T('Contractar una persona'), T('Comprar eines noves')], c: 0, why: T('Cal saber quants diners necessites i quan, i negociar.') }
    ]
  },

  /* ---------- ETAPA 6 ---------- */
  L_financament: {
    area: 'direccio', title: T('Finançament i creixement'),
    goal: T('Valorar quan val la pena accelerar amb diners de fora.'),
    body: [
      T('Es pot créixer amb <b>beneficis propis</b> (lent però amb control), amb <b>préstecs</b> (s\'han de tornar amb interessos) o amb <b>inversors</b> (aporten capital a canvi d\'una part de l\'empresa i d\'expectatives de creixement).'),
      T('Més capital permet contractar i captar clients grans, però augmenta les <b>despeses fixes</b> i la pressió. Si els ingressos no creixen al ritme previst, el risc és alt.'),
      T('Abans d\'acceptar, negocia: percentatge, control de decisions, objectius i què passa si no s\'assoleixen.')
    ],
    example: T('Un inversor ofereix 80.000 € pel 30 % de l\'agència i demana duplicar la facturació en dos anys. L\'agència ha de valorar si hi ha prou demanda i equip.'),
    errors: [T('Acceptar diners sense un pla d\'ús.'), T('Augmentar costos fixos abans de tenir ingressos.'), T('Cedir el control sense adonar-se\'n.')],
    quiz: [
      { q: T('Què implica acceptar un inversor?'), o: [T('Diners gratuïts'), T('Cedir una part de l\'empresa i assumir expectatives de creixement'), T('Pagar menys impostos')], c: 1, why: T('L\'inversor espera un retorn.') },
      { q: T('Quin és el principal risc de créixer massa de pressa?'), o: [T('Massa beneficis'), T('Despeses fixes que superen els ingressos'), T('Massa reputació')], c: 1, why: T('La tresoreria pot no aguantar.') },
      { q: T('Créixer amb beneficis propis és…'), o: [T('Més lent però dona més control'), T('Impossible'), T('Sempre millor')], c: 0, why: T('No hi ha una resposta universal: depèn del mercat i del risc que vols assumir.') }
    ]
  },
  L_marca: {
    area: 'marca', title: T('La marca de l\'agència'),
    goal: T('Definir quins clients vols atraure i quins rebutges.'),
    body: [
      T('La <b>marca corporativa</b> és la promesa que fas al mercat. Una promesa clara atrau els clients adequats i n\'allunya d\'altres: això és bo.'),
      T('La coherència entre el que dius i el que fas és clau. Si dius «resultats mesurables», els teus informes han de ser rigorosos.'),
      T('Decidir quins projectes <b>rebutges</b> és tan important com decidir quins acceptes.')
    ],
    example: T('«Fem créixer els negocis d\'Osona amb dades i proximitat» atrau comerços i pimes locals, i deixa clar que no és una agència de grans campanyes de televisió.'),
    errors: [T('Voler agradar a tothom.'), T('Promeses que l\'equip no pot complir.'), T('Canviar de posicionament cada any.')],
    quiz: [
      { q: T('Una marca clara…'), o: [T('Atrau tothom'), T('Atrau els clients adequats i n\'allunya d\'altres'), T('No serveix per a agències')], c: 1, why: T('Filtra i redueix el cost de captar clients que encaixen.') },
      { q: T('Si promets «resultats mesurables»…'), o: [T('Has de ser rigorós en els informes'), T('Pots fer informes de seguidors'), T('No cal mesurar')], c: 0, why: T('La marca es demostra amb fets.') },
      { q: T('Rebutjar projectes que no encaixen…'), o: [T('És un error sempre'), T('Reforça el posicionament i protegeix l\'equip'), T('És de mala educació')], c: 1, why: T('Focalitza recursos on aportes més valor.') }
    ]
  },
  L_ltv: {
    area: 'creixement', title: T('Retenció: LTV i CAC'),
    goal: T('Entendre per què mantenir un client val més que captar-ne un de nou.'),
    body: [
      T('El <b>valor de vida del client (LTV)</b> és el marge total que deixa un client durant tota la relació: marge mensual × mesos que es queda.'),
      T('El <b>CAC</b> és el que costa aconseguir-lo. Un negoci sa té un LTV clarament superior al CAC (sovint s\'usa com a referència orientativa una relació de 3 a 1).'),
      T('Per retenir: revisar objectius periòdicament, demostrar valor amb dades, escoltar objeccions i ajustar el servei abans que el client decideixi marxar.')
    ],
    example: T('Un client deixa 400 €/mes de marge i es queda 24 mesos: LTV = 9.600 €. Si costa 1.200 € captar-lo, la relació LTV/CAC és 8.'),
    errors: [T('Dedicar tota l\'energia a captar i oblidar els clients actuals.'), T('Esperar la renovació per parlar de resultats.')],
    quiz: [
      { q: T('Marge de 300 €/mes durant 20 mesos. Quin és el LTV?'), o: ['6.000 €', '320 €', '15 €'], c: 0, why: '300 × 20 = 6.000 €.' },
      { q: T('LTV 2.000 €, CAC 2.500 €. Què passa?'), o: [T('Es perden diners amb cada client nou'), T('És un negoci excel·lent'), T('No es pot saber res')], c: 0, why: T('Costa més captar el client del que deixa.') },
      { q: T('Quan has de parlar de resultats amb un client?'), o: [T('Només quan amenaça de marxar'), T('Periòdicament, amb objectius revisats'), T('Mai')], c: 1, why: T('La retenció es construeix cada mes.') }
    ]
  },

  /* ---------- ETAPA 7 ---------- */
  L_internacional: {
    area: 'avancat', title: T('Màrqueting internacional i localització'),
    goal: T('Adaptar una estratègia a un mercat nou.'),
    body: [
      T('Traduir no és <b>localitzar</b>. Cal adaptar missatges, referències culturals, preus, mètodes de pagament, logística i atenció al client.'),
      T('El <b>SEO multilingüe</b> requereix investigar les paraules que fa servir la gent de cada país (no les traduccions literals) i indicar als cercadors la versió de cada idioma.'),
      T('Abans d\'invertir fort: investiga la <b>demanda</b>, la <b>competència</b> local i la capacitat de servei (enviaments, devolucions, idioma).')
    ],
    example: T('Una marca de cosmètica descobreix que a França els compradors busquen «cosmétique naturelle certifiée bio» i valoren molt les certificacions, més que l\'origen.'),
    errors: [T('Traducció automàtica sense revisió.'), T('Mateixos preus i missatges a tots els mercats.'), T('Oblidar la logística i les devolucions.')],
    quiz: [
      { q: T('Localitzar vol dir…'), o: [T('Traduir literalment'), T('Adaptar missatge, preus, pagament i servei al mercat'), T('Posar la bandera del país')], c: 1, why: T('Cada mercat té hàbits i expectatives diferents.') },
      { q: T('Per al SEO en un altre idioma…'), o: [T('Tradueixes les paraules clau'), T('Investigues com busca la gent d\'aquell país'), T('No cal SEO')], c: 1, why: T('Les cerques reals no coincideixen amb les traduccions.') },
      { q: T('Què has de comprovar abans d\'una gran campanya internacional?'), o: [T('Demanda, competència i capacitat de servei'), T('Només el pressupost'), T('El clima')], c: 0, why: T('Sense capacitat de servei, l\'èxit es converteix en un problema.') }
    ]
  },
  L_experiments: {
    area: 'analitica', title: T('Proves de mercat i mostres petites'),
    goal: T('No treure conclusions precipitades de poques dades.'),
    body: [
      T('Una <b>prova de mercat</b> és una inversió petita per aprendre abans d\'apostar fort. Defineix abans què mesuraràs i quin resultat et faria continuar.'),
      T('Amb <b>mostres petites</b> l\'atzar pesa molt: 3 vendes contra 1 no demostra que un mercat sigui el triple de bo. Cal un volum mínim de dades o repetir la prova.'),
      T('Compara mercats amb el mateix indicador i el mateix període.')
    ],
    example: T('França: 12 vendes amb 1.000 €. Bèlgica: 4 vendes amb 300 €. El CPA és semblant (83 € vs 75 €); no hi ha prou dades per dir que Bèlgica és millor.'),
    errors: [T('Declarar guanyador després de dos dies.'), T('Canviar diverses variables alhora.'), T('No definir el criteri d\'èxit abans.')],
    quiz: [
      { q: T('Anunci A: 2 vendes. Anunci B: 1 venda. Conclusió?'), o: [T('A és el doble de bo'), T('No hi ha prou dades'), T('B és millor')], c: 1, why: T('Amb tan poques dades, la diferència pot ser atzar.') },
      { q: T('Quan defineixes el criteri d\'èxit d\'una prova?'), o: [T('Abans de començar'), T('Quan veus els resultats'), T('No cal')], c: 0, why: T('Així evites interpretar les dades a conveniència.') },
      { q: T('Per comparar dos mercats…'), o: [T('Fes servir el mateix indicador i període'), T('Compara vendes d\'un mes amb visites de l\'altre'), T('Mira només el que ha gastat més')], c: 0, why: T('Només així la comparació és justa.') }
    ]
  },
  L_lideratge: {
    area: 'direccio', title: T('Lideratge i estructura'),
    goal: T('Fer que l\'empresa funcioni sense que tot passi per tu.'),
    body: [
      T('Quan l\'equip creix, el director ha de passar de <b>fer</b> a <b>fer que es faci</b>: definir objectius compartits, rols clars i responsables per àrea.'),
      T('Els <b>objectius per equip</b> han d\'estar alineats amb l\'estratègia de l\'empresa i tenir indicadors.'),
      T('Gestionar talent inclou feedback periòdic, formació, reconeixement i càrregues de feina sostenibles.')
    ],
    example: T('L\'agència crea tres responsables (estratègia, analítica i creativitat) amb objectius trimestrals. {En} deixa de revisar cada peça i es dedica a clients grans i direcció.'),
    errors: [T('Microgestionar-ho tot.'), T('Rols ambigus.'), T('Sobrecarregar les persones més competents.')],
    quiz: [
      { q: T('Quin és el canvi principal del director quan l\'equip creix?'), o: [T('Treballar més hores'), T('Passar de fer les tasques a dirigir i definir objectius'), T('Fer totes les revisions')], c: 1, why: T('Si tot passa per tu, ets el coll d\'ampolla.') },
      { q: T('Un objectiu d\'equip ha de ser…'), o: [T('Alineat amb l\'estratègia i mesurable'), T('Secret'), T('Igual per a tothom')], c: 0, why: T('L\'equip ha de saber cap a on va i com es mesura.') },
      { q: T('Què és un risc en equips que creixen?'), o: [T('Sobrecarregar els més competents'), T('Massa feedback'), T('Rols massa clars')], c: 0, why: T('Porta a esgotament i a perdre talent.') }
    ]
  },
  L_ia: {
    area: 'avancat', title: T('IA responsable i governança de dades'),
    goal: T('Fer servir la intel·ligència artificial amb qualitat, transparència i respecte.'),
    body: [
      T('La IA pot accelerar tasques: esborranys de textos, variacions d\'anuncis, resums d\'informes, classificació de dades. Però pot cometre errors, inventar dades o reproduir biaixos.'),
      T('Principis: <b>supervisió humana</b> de tot el que es publica, <b>no introduir dades personals</b> de clients en eines sense garanties, <b>transparència</b> quan el contingut ho requereixi, i respecte dels <b>drets d\'autor</b> i de la imatge de les persones.'),
      T('La IA no substitueix l\'estratègia ni el coneixement del client: és una eina per dedicar més temps a pensar.')
    ],
    example: T('L\'agència usa IA per generar 20 variants de títols, però una persona les revisa, en tria 4 i comprova que no fan promeses falses abans de provar-les.'),
    errors: [T('Publicar sense revisar.'), T('Pujar dades de clients a eines públiques.'), T('Fer servir la imatge o la veu d\'algú sense permís.')],
    quiz: [
      { q: T('Quin ús de la IA és responsable?'), o: [T('Publicar automàticament 100 textos sense revisió'), T('Generar esborranys que una persona revisa i valida'), T('Inventar ressenyes')], c: 1, why: T('La supervisió humana garanteix qualitat i veracitat.') },
      { q: T('Pots introduir la base de dades de clients en una eina d\'IA qualsevol?'), o: [T('Sí, és més ràpid'), T('No sense garanties de protecció de dades i base legal'), T('Només els dimarts')], c: 1, why: T('Les dades personals estan protegides.') },
      { q: T('Què NO hauria de delegar-se a la IA?'), o: [T('Variants de títols'), T('La decisió estratègica i la responsabilitat davant del client'), T('Resums d\'informes')], c: 1, why: T('L\'estratègia i la responsabilitat són humanes.') }
    ]
  }
};
