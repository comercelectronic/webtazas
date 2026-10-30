/* Agència Digital — dades generals i guió de les etapes 1 i 2 */
window.GD = window.GD || {};

GD.names = {
  pau: T('{nom}'), carme: T('Carme'), miquel: T('Miquel'), julia: T('Júlia'), berta: T('Berta'), quim: T('Quim'), laia: T('Laia Vidal'),
  jordi: T('Jordi'), nuria: T('Núria'), sergi: T('Sergi'), toni: T('Toni'), marta: T('Marta'), ramon: T('Ramon'), amelie: T('Amélie'), client: T('Client')
};

GD.profiles = {
  dades: { n: T('Perfil orientat a les dades') },
  creatiu: { n: T('Perfil creatiu') },
  comercial: { n: T('Perfil comercial') }
};

GD.stages = [
  { id: 1, title: T('Tornar a començar'), sub: T('Aprendre els fonaments i aconseguir el primer client'), levels: '1–3', minLevel: 1, color: '#ff7aa2', chapters: ['1.1', '1.2', '1.3', '1.4', '1.5'], outro: T('{En} ja té una cartera inicial, un historial de decisions i una reputació incipient.') },
  { id: 2, title: T('Fer-se un nom a Osona'), sub: T('Captar clients i dominar els canals digitals'), levels: '4–7', minLevel: 4, color: '#3fc1b0', chapters: ['2.1', '2.2', '2.3', '2.4', '2.5'], outro: T('L\'agència ja té clients de sectors diferents. L\'estratègia empresarial és tan important com la tècnica.') },
  { id: 3, title: T('La fira de les oportunitats'), sub: T('Competir, negociar i guanyar projectes'), levels: '8–11', minLevel: 7, color: '#f2b134', chapters: ['3.1', '3.2', '3.3', '3.4', '3.5'], outro: T('L\'agència passa de sobreviure amb encàrrecs a gestionar una cartera i un model de negoci.') },
  { id: 4, title: T('Ja no pots fer-ho tot {g:sol|sola|sol}'), sub: T('Contractar, delegar i crear processos'), levels: '12–15', minLevel: 11, color: '#7a8cff', chapters: ['4.1', '4.2', '4.3', '4.4', '4.5'], outro: T('L\'agència ja és una empresa amb equip, costos fixos, processos i obligacions de direcció.') },
  { id: 5, title: T('L\'agència sota pressió'), sub: T('Gestionar crisis, marges i clients difícils'), levels: '16–19', minLevel: 15, color: '#ff6a5a', chapters: ['5.1', '5.2', '5.3', '5.4', '5.5'], outro: T('Has demostrat que pots dirigir quan res no surt com estava previst.') },
  { id: 6, title: T('Créixer sense perdre el nord'), sub: T('Especialitzar-se o diversificar'), levels: '20–23', minLevel: 19, color: '#a066e0', chapters: ['6.1', '6.2', '6.3', '6.4', '6.5'], outro: T('L\'agència té una identitat definida. El futur dependrà de l\'especialització i la reputació.') },
  { id: 7, title: T('Més enllà de Catalunya'), sub: T('Internacionalització i direcció estratègica'), levels: '24–27', minLevel: 23, color: '#3aa0e8', chapters: ['7.1', '7.2', '7.3', '7.4', '7.5'], outro: T('La pregunta ja no és quin serà el pròxim client, sinó quina empresa vols ser.') },
  { id: 8, title: T('L\'empresa que has construït'), sub: T('Resolució de l\'arc principal i finals ramificats'), levels: '28–30', minLevel: 27, color: '#ffd24a', chapters: ['8.1', '8.2'], outro: T('La història {den} ha arribat a un final. Però l\'agència continua.') }
];

GD.chapters = {};
const CH = (id, o) => { GD.chapters[id] = Object.assign({ id, stage: +id.split('.')[0] }, o); };
const tbl = (rows, head) => `<table class="tbl">${head ? `<thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead>` : ''}<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
GD.tbl = tbl;

/* ============================================================
   ETAPA 1 — TORNAR A COMENÇAR
   ============================================================ */
CH('1.1', {
  title: T('Una clau, un portàtil i pocs diners'), who: 'pau', bg: 'vic', weeks: 1,
  blurb: T('{En} torna a Vic amb una idea: muntar una agència de màrqueting digital.'),
  steps: [
    { t: 'dlg', lines: [
      ['', T('Vic. Dissabte de mercat. La Plaça Major fa olor de fuet, de cafè i de pluja recent.')],
      ['pau.n', T('Tres anys fora i tot continua igual... Bé, gairebé tot. Ara jo tinc un pla.')],
      ['pau.h', T('Muntaré una agència de màrqueting digital. Aquí, a Osona.')],
      ['', T('{En} té un portàtil, pocs estalvis i una clau. La clau obre un despatx petit damunt d\'una merceria.')],
      ['bg', 'despatx'],
      ['', T('Una taula, dues cadires, una pissarra i una connexió que va i ve. El primer centre d\'operacions.')],
      ['pau.t', T('A veure els números... Compte bancari: 3.000 €. Lloguer: 350 € al mes. Eines i connexió: 50 €.')],
      ['pau.w', T('Si no entra cap client, això dura uns set mesos. Millor no pensar-hi gaire.')],
      ['pau.n', T('A la llibreta hi tinc idees. Però primer: quin és el meu punt fort?')]
    ] },
    { t: 'choice', key: 'profile', prompt: T('Quin és el punt fort {den}?'), sub: T('Dona una petita bonificació inicial. No determina la teva professió final.'), opts: [
      { t: T('📊 Perfil orientat a les dades'), d: T('T\'agraden els números i entendre què passa de veritat. +1 Analítica'), v: 'dades', fx: { skill: { analitica: 1 } } },
      { t: T('🎨 Perfil creatiu'), d: T('Tens ull per als missatges i les imatges. +1 Creativitat'), v: 'creatiu', fx: { skill: { creativitat: 1 } } },
      { t: T('🤝 Perfil comercial'), d: T('Saps escoltar i convèncer. +1 Comercial'), v: 'comercial', fx: { skill: { comercial: 1 } } }
    ] },
    { t: 'input', key: 'agency', prompt: T('Com es dirà l\'agència?'), help: T('El nom comercial apareixerà a tota la partida.'), def: T('Píxel d\'Osona'), sugg: [T('Píxel d\'Osona'), T('Brúixola Digital'), T('Estudi Mercadal'), T('Clic Plana'), T('Fil Digital')] },
    { t: 'dlg', lines: [['pau.h', T('{agencia}. Sona bé. Ara cal saber què ofereixo exactament... i què no.')]] },
    { t: 'lesson', id: 'L_mkt' },
    { t: 'choice', key: 'valor', prompt: T('Escriu la primera proposta de valor a la pissarra'), opts: [
      { t: T('«Fem màrqueting digital de tot tipus per a tota mena d\'empreses.»'), v: 'vague', say: [['pau.w', T('Mmm... això ho podria dir qualsevol. Ja ho afinaré.')]] },
      { t: T('«Gestionem les xarxes socials del teu negoci.»'), v: 'servei', say: [['pau.t', T('Ven un servei, no un resultat. Però és un començament.')]] },
      { t: T('«Ajudem els negocis d\'Osona a aconseguir més clients amb accions mesurables i pressupostos petits.»'), v: 'resultat', fx: { xp: 20, rep: 2 }, say: [['pau.h', T('Això sí! Per a qui, quin problema i com ho mesurarem.')]] }
    ] },
    { t: 'choice', key: 'serveis', prompt: T('Quins serveis oferiràs al principi?'), sub: T('Aquesta decisió determina quines oportunitats arriben amb més facilitat.'), opts: [
      { t: T('Tots: web, xarxes, anuncis, SEO, disseny i vídeo'), d: T('Més portes d\'entrada, però és difícil fer-ho tot bé tu {g:sol|sola|sol}.'), v: 'tots', fx: { log: T('Va decidir oferir tots els serveis des del primer dia.'), key: true } },
      { t: T('Especialitzar-me en 2 o 3: màrqueting local, Google i analítica'), d: T('Menys encàrrecs, però més fàcils de fer bé i de recomanar.'), v: 'espec', fx: { log: T('Va decidir especialitzar-se en màrqueting local, Google i analítica.'), key: true, skill: { estrategia: 0 } } },
      { t: T('Generalista que primer estudia cada cas i després proposa'), d: T('Atraus clients que valoren l\'anàlisi abans de l\'acció.'), v: 'diagnosi', fx: { log: T('Es va presentar com un professional que primer diagnostica i després proposa.'), key: true } }
    ] },
    { t: 'lesson', id: 'L_fin' },
    { t: 'choice', key: 'reserva', prompt: T('Quants diners reserves per a imprevistos?'), info: T('Tens 3.000 € al compte. La reserva no es fa servir en el dia a dia, però et pot salvar en una crisi.'), opts: [
      { t: T('Res: necessito tots els diners per arrencar'), v: 0, say: [['pau.w', T('Arriscat... però és el que hi ha.')]] },
      { t: T('500 € (més d\'un mes de despeses fixes)'), v: 500, fx: { reserve: 500, xp: 10 }, say: [['pau.n', T('Un petit coixí. Prudent.')]] },
      { t: T('1.000 € (més de dos mesos de despeses fixes)'), v: 1000, fx: { reserve: 1000, xp: 15, log: T('Va guardar una reserva de 1.000 € des del primer dia.') }, say: [['pau.t', T('Em quedarà poc marge per invertir, però dormiré més tranquil.')]] }
    ] },
    { t: 'dlg', lines: [
      ['pau.h', T('Doncs ja està. {agencia} existeix oficialment. Ara només falta... un client.')],
      ['', T('Toc, toc. Algú truca a la porta.')]
    ] }
  ]
});

CH('1.2', {
  title: T('La Carme no vol ser influencer'), who: 'carme', bg: 'despatx', weeks: 1,
  blurb: T('La propietària d\'un forn tradicional ven poc alguns dies i no vol llençar diners.'),
  steps: [
    { t: 'fx', silent: true, fx: { flags: { met_carme: true } } },
    { t: 'dlg', lines: [
      ['carme.n', T('Bon dia. {g:Ets el noi|Ets la noia|Ets tu qui fa coses} dels ordinadors? La Montse de la merceria diu que fas coses d\'internet.')],
      ['pau.s', T('Eh... sí! {nomc}, de {agencia}. Passi, passi.')],
      ['carme.n', T('Sóc la Carme, del forn de la cantonada. Fa trenta anys que pasto.')],
      ['carme.t', T('Et seré clara. Hi ha dies que ho venc tot, i d\'altres que a les set del vespre encara tinc mitja fornada a la lleixa.')],
      ['carme.a', T('Ara tothom em diu que m\'he de fer «influencer». Jo no vull pagar perquè algú faci fotos boniques del pa si no venc ni una barra més.')]
    ] },
    { t: 'choice', who: 'carme', prompt: T('Com respons a la Carme?'), opts: [
      { t: T('Li proposo obrir un Instagram amb fotos professionals cada dia.'), fx: { trust: { carme: -1 }, flags: { precipitat: true }, log: T('Va proposar una solució a la Carme abans d\'entendre el problema.') }, say: [
        ['carme.a', T('Veus? Això mateix és el que no vull. Ni m\'has preguntat res.')],
        ['pau.w', T('Té raó... Comencem de nou. Puc venir al forn a fer-li unes preguntes?')],
        ['carme.n', T('Això ja m\'agrada més. Demà a les quatre.')]] },
      { t: T('Abans de proposar res, vull entendre el negoci: puc anar al forn a fer-li preguntes?'), fx: { trust: { carme: 1 } }, say: [
        ['carme.h', T('Home, per fi algú que pregunta abans de vendre\'m res. Vine demà a les quatre.')]] },
      { t: T('Li pregunto què consideraria un èxit d\'aquí a un mes.'), req: { skill: 'comercial', min: 1 }, fx: { trust: { carme: 2 }, flags: { exitDefinit: true } }, say: [
        ['carme.t', T('Un èxit... Que no hagi de llençar pa els dimarts. I que torni a entrar gent a la tarda.')],
        ['pau.h', T('Doncs això és el que mesurarem. Puc venir al forn a veure-ho?')],
        ['carme.h', T('Vine demà a les quatre.')]] }
    ] },
    { t: 'dlg', bg: 'forn', lines: [
      ['', T('L\'endemà, a les quatre de la tarda. El forn fa una olor que fa venir ganes de quedar-s\'hi a viure.')],
      ['carme.n', T('Pregunta el que vulguis, però ves per feina, que a les cinc arriben els de l\'escola. O arribaven.')]
    ] },
    { t: 'invest', who: 'carme', time: 4, prompt: T('Entrevista la Carme'), info: T('Tens temps per a 4 preguntes. No totes són igual d\'útils.'), opts: [
      { t: T('Quins dies i hores us sobra més producte?'), flag: 'f_hores', note: T('Dimarts i dimecres, de 16 a 19 h.'), a: [['carme.t', T('Dimarts i dimecres a la tarda, de quatre a set. Al matí ho venc tot; a la tarda, la lleixa es queda plena.')]] },
      { t: T('Qui són els vostres clients i quan venen?'), flag: 'f_clients', note: T('Gent gran al matí; famílies de l\'escola a la tarda (cada cop menys).'), a: [['carme.n', T('Al matí, gent gran del barri. A la tarda venien moltes famílies a la sortida de l\'escola a buscar el berenar...')], ['carme.w', T('Però fa uns mesos que en venen molt menys.')]] },
      { t: T('Què ha canviat aquest darrer any?'), flag: 'f_canvi', note: T('Supermercat nou amb forn i l\'escola surt més d\'hora.'), a: [['carme.t', T('Van obrir un supermercat amb forn a la carretera. I l\'escola del costat ara surt a dos quarts de cinc; abans sortien a les cinc.')], ['pau.t', T('(Potser les famílies passen quan encara no hi ha la fornada de la tarda... o ja no passen per aquí.)')]] },
      { t: T('Teniu fitxa a Google? Què hi diu?'), flag: 'f_google', note: T('La fitxa diu que tanqueu a les 14 h!'), a: [['carme.s', T('Fitxa a Google? Algú en va fer una fa anys...')], ['', T('{En} ho mira al mòbil. La fitxa del forn diu: «Obert de 7 a 14 h». Hi ha dues ressenyes del 2019.')], ['pau.s', T('Carme... Google diu a tothom que a la tarda és tancat!')], ['carme.a', T('Què?! Però si obro fins a les vuit!')]] },
      { t: T('Quins productes es queden a la lleixa?'), flag: 'f_producte', note: T('Coca de vidre i pa de motlle a la tarda.'), a: [['carme.n', T('A la tarda, sobretot coca de vidre i pa de motlle. Les coques de llardons volen sempre.')]] },
      { t: T('Quin pressupost teniu per a això?'), flag: 'f_press', note: T('300 €, i vol saber on va cada cèntim.'), a: [['carme.n', T('Tres-cents euros, com a molt. I vull saber en què es gasten fins a l\'últim cèntim.')]] }
    ] },
    { t: 'dlg', lines: (S) => {
      const n = ['f_hores', 'f_clients', 'f_canvi', 'f_google', 'f_producte'].filter(k => S.f[k]).length;
      return n >= 3 ? [['pau.h', T('Tinc molta informació útil. Ara ja començo a veure el problema de debò.')]] :
        [['pau.t', T('Tinc alguna pista, però em falta informació. Hauré d\'anar amb compte amb les conclusions.')]];
    } },
    { t: 'lesson', id: 'L_recerca' },
    { t: 'choice', key: 'diag', prompt: T('Quin és el problema real del forn?'), opts: [
      { t: T('Que el forn no té Instagram.'), v: 'insta', say: [['carme.t', T('Instagram? Si la meitat de les meves clientes tenen setanta anys...')]] },
      { t: T('A la tarda entren menys clients perquè molta gent creu que és tancat i les famílies ja no hi passen a l\'hora de berenar.'), v: 'bo', hide: (S) => !(S.f.f_google || S.f.f_canvi), fx: { xp: 30, trust: { carme: 1 }, log: T('Va identificar la causa del problema del forn: informació incorrecta i canvi d\'hàbits.'), key: true }, say: [['carme.s', T('Ostres... té tot el sentit. Jo pensava que era culpa del supermercat i prou.')]] },
      { t: T('A la tarda hi ha menys clients, però encara no en sé ben bé el perquè.'), v: 'mig', say: [['pau.t', T('Hauré de proposar accions prudents i mesurar bé.')]] },
      { t: T('Els preus són massa alts.'), v: 'preu', fx: { trust: { carme: -1 } }, say: [['carme.a', T('Els meus preus són els mateixos de fa dos anys, {g:noi|noia|maco}.')]] }
    ] },
    { t: 'lesson', id: 'L_smart' },
    { t: 'choice', key: 'smart', prompt: T('Quin objectiu proposes per a les properes 4 setmanes?'), opts: [
      { t: T('Guanyar 500 seguidors a Instagram.'), v: 'seg', say: [['carme.a', T('I què en faig, de 500 seguidors? Els poso a la lleixa?')]] },
      { t: T('Vendre més.'), v: 'vague', say: [['pau.w', T('Massa vague... com sabrem si ho hem aconseguit?')]] },
      { t: T('Augmentar un 15 % les vendes de dimarts i dimecres de 16 a 19 h en 4 setmanes, comparant amb el mes anterior.'), v: 'smart', fx: { xp: 30, trust: { carme: 1 } }, say: [['carme.h', T('Això ho entenc. I ho podré comprovar amb la caixa.')]] }
    ] },
    { t: 'dlg', lines: [
      ['carme.n', T('Doncs prepara\'m aquest pla. Però que el pugui entendre jo, eh?')],
      ['pau.h', T('Tracte fet, Carme.')]
    ] }
  ]
});

CH('1.3', {
  title: T('El primer pla de màrqueting'), who: 'carme', bg: 'despatx:night', weeks: 1,
  blurb: T('Què farem, per què, quant costarà i com ho mesurarem.'),
  steps: [
    { t: 'dlg', lines: [
      ['', T('Aquella nit, al despatx. La pissarra s\'omple de fletxes.')],
      ['pau.t', T('No n\'hi ha prou amb una llista de tasques. He d\'explicar què farem, per què, quant costarà i com ho mesurarem.')]
    ] },
    { t: 'multi', key: 'accions', pick: 2, prompt: T('Accions sense cost (només temps): tria\'n dues'), info: T('Tens temps per fer bé dues accions abans de començar la campanya.'), opts: [
      { id: 'fitxa', t: T('Corregir la fitxa de Google: horaris, fotos reals i telèfon'), ok: true, why: (S) => S.f.f_google ? T('Has descobert que Google deia que tancava a les 14 h: és la causa principal!') : T('Tenir la informació local correcta sempre és bàsic.') },
      { id: 'berenar', t: T('Crear l\'oferta «Berenar de tarda»: coca + suc a preu tancat de 16 a 19 h'), ok: true, why: T('Dona un motiu per venir a la franja fluixa i aprofita el producte que sobra.') },
      { id: 'ressenyes', t: T('Demanar ressenyes als clients fidels'), ok: true, why: T('Ajuda, però l\'efecte és més lent que les altres dues.') },
      { id: 'insta', t: T('Publicar cada dia a Instagram'), ok: false, why: T('Consumeix molt temps i no ataca la causa. No és prioritari.') },
      { id: 'logo', t: T('Redissenyar el logo del forn'), ok: false, why: T('El problema no és d\'identitat visual: no mourà les vendes de la tarda.') }
    ], fx: (S, g) => ({ xp: g * 15 }) },
    { t: 'budget', key: 'bud', total: 300, step: 50, prompt: T('Reparteix els 300 € de la Carme'), info: T('Recorda: aquests diners són del client i es gasten en la campanya. No són ingressos de l\'agència.'), items: [
      { id: 'meta', t: T('📱 Anuncis a Instagram i Facebook (radi de 2 km)'), d: T('Arriben a molta gent del barri, però costa convertir-los en visites.') },
      { id: 'cupons', t: T('🎟️ Cupons «berenar» a la sortida de l\'escola'), d: T('Impressió i repartiment. Molt directe i fàcil de mesurar.') },
      { id: 'gads', t: T('🔎 Google Ads de cerca local'), d: T('Apareix quan algú busca «forn obert a prop» en aquell moment.') },
      { id: 'fotos', t: T('📸 Sessió de fotos professional'), d: T('Millora la imatge, però l\'efecte en vendes és indirecte.') },
      { id: 'reserva', t: T('🧰 Reserva per ajustar a mitja campanya'), d: T('Permet reaccionar si les dades ho demanen.') }
    ] },
    { t: 'lesson', id: 'L_metriques' },
    { t: 'multi', key: 'kpi', pick: 3, prompt: T('Tria els 3 indicadors que presentaràs a la Carme'), opts: [
      { t: T('Cupons «berenar» bescanviats a la caixa'), ok: true, why: T('Prova directa de visita i compra atribuïble a la campanya.') },
      { t: T('Vendes de dimarts i dimecres de 16 a 19 h, comparades amb el mes anterior'), ok: true, why: T('És exactament l\'objectiu SMART.') },
      { t: T('Trucades i peticions «com arribar» des de la fitxa de Google'), ok: true, why: T('Indica intenció de visita.') },
      { t: T('M\'agrada a les publicacions'), ok: false, why: T('Mètrica de vanitat: no diu si es ven més.') },
      { t: T('Impressions dels anuncis'), ok: false, why: T('Indica abast, no resultats.') },
      { t: T('Seguidors nous'), ok: false, why: T('No responen la pregunta del negoci.') }
    ], fx: (S, g) => ({ xp: g * 10, flags: { mesura: g >= 2 } }) },
    { t: 'dlg', bg: 'forn', lines: (S) => {
      const b = S.f.bud || {}; const L = [['', T('L\'endemà, {en} presenta el pla a la Carme amb un full imprès i un cafè.')]];
      if (S.f.accions && S.f.accions.ids.includes('fitxa')) L.push(['pau.n', T('Primer arreglarem la fitxa de Google: ha de dir que obres a la tarda.')]);
      if (S.f.accions && S.f.accions.ids.includes('berenar')) L.push(['pau.h', T('I crearem el «Berenar de tarda»: coca de vidre i suc a preu tancat. Aprofitem el que sobra!')], ['carme.h', T('Això els nens ho voldran, segur.')]);
      if (b.fotos >= 150) L.push(['carme.t', T('Tanta part per a fotos? Les meves coques ja són boniques, {g:noi|noia|maco}.')]);
      if (b.reserva > 0) L.push(['pau.n', T("He reservat {0} € per ajustar a mitja campanya si les dades ho demanen.", [b.reserva])], ['carme.n', T('Això és de persona prudent.')]);
      if (S.f.mesura) L.push(['carme.h', T('I això dels cupons ho podré comptar jo mateixa a la caixa. M\'agrada.')]);
      else L.push(['carme.w', T('I com sabré si ha funcionat?')], ['pau.w', T('Doncs... mirarem com va.')]);
      L.push(['carme.n', T('D\'acord. Endavant. I la teva feina, quant em costarà?')]);
      return L;
    } },
    { t: 'fx', silent: true, fx: (S) => ({ trust: { carme: ((S.f.bud || {}).reserva > 0 ? 1 : 0) + (S.f.mesura ? 1 : 0) - ((S.f.bud || {}).fotos >= 150 ? 1 : 0) } }) },
    { t: 'choice', key: 'feeCarme', who: 'carme', prompt: T('Quins honoraris demanes pel pla i el seguiment de 4 setmanes?'), opts: [
      { t: T('Res: és el primer client i vull referències.'), v: 0, fx: { log: T('Va treballar gratis per al primer client.') }, say: [['carme.t', T('Gratis? Res és gratis, {g:noi|noia|maco}. Bé... t\'ho pagaré en pa. I parlaré bé de tu.')]] },
      { t: T('450 €: pla, execució i informe final.'), v: 450, say: [['carme.n', T('És just. Si funciona, n\'estaré contenta.')]] },
      { t: T('900 €: és el preu habitual a Barcelona.'), v: 450, fx: { trust: { carme: -1 } }, say: [['carme.a', T('Aquí no som a Barcelona. Tres-cents de campanya i nou-cents per a tu? Ho deixem en 450 i gràcies.')]] }
    ] }
  ]
});

CH('1.4', {
  title: T('La primera campanya'), who: 'carme', bg: 'despatx', weeks: 4,
  blurb: T('Quatre setmanes, dades reals (simulades) i una clienta que ho mirarà tot amb lupa.'),
  steps: [
    { t: 'dlg', lines: (S) => {
      const ids = (S.f.accions && S.f.accions.ids) || [];
      const L = [['', T('Setmana 1 de la campanya. El mòbil {den} vibra.')]];
      if (ids.includes('fitxa')) L.push(['carme.h', T('{nom}! Una senyora m\'ha dit que ha vist a Google que obro a la tarda. Es pensava que tancava!')]);
      if (ids.includes('berenar')) L.push(['carme.n', T('I ja he venut dotze «berenars». Els nens demanen la coca de vidre, qui ho havia de dir.')]);
      if (!ids.includes('fitxa') && !ids.includes('berenar')) L.push(['carme.n', T('De moment no noto gaire res, eh.')]);
      return L;
    } },
    { t: 'choice', key: 'ajust', prompt: T('Setmana 2: arriben les primeres dades. Què fas?'), info: (S) => {
      const b = S.f.bud || {};
      return tbl([
        [T('📱 Xarxes'), `${b.meta / 2} €`, T("{0} impressions · {1} clics", [(b.meta * 22).toLocaleString(LOCALE), Math.round(b.meta * 0.25)])],
        [T('🎟️ Cupons'), `${b.cupons / 2} €`, T("{0} repartits · {1} bescanviats", [b.cupons * 2, Math.round(b.cupons * 0.2)])],
        [T('🔎 Google Ads'), `${b.gads / 2} €`, T("{0} clics · {1} trucades", [Math.round(b.gads * 0.4), Math.round(b.gads * 0.08)])],
        [T('📸 Fotos'), `${b.fotos} €`, b.fotos ? T('Fotos publicades') : '—'],
        [T('🧰 Reserva'), `${b.reserva} €`, T('Sense gastar')]
      ], [T('Canal'), T('Gastat'), T('Primeres dades')]);
    }, opts: [
      { t: T('Moure la reserva (i part dels anuncis de xarxes) cap al canal que genera més visites'), v: 'ajust', fx: { xp: 25 }, say: [['pau.t', T('Les dades diuen que els cupons i Google porten gent a la botiga. Hi reforço la inversió.')]] },
      { t: T('No tocar res: cal deixar treballar la campanya'), v: 'res', say: [['pau.n', T('Esperaré a tenir més dades.')]] },
      { t: T('Posar més diners en anuncis de xarxes: tenen moltes més impressions'), v: 'vanitat', say: [['pau.h', T('Milers d\'impressions! Això ha de funcionar...')]] }
    ] },
    { t: 'sim', calc: (S, H) => {
      const b = S.f.bud || { meta: 0, cupons: 0, gads: 0, fotos: 0, reserva: 0 };
      const ids = (S.f.accions && S.f.accions.ids) || [];
      let up = 1, F = [];
      if (ids.includes('fitxa')) { up += S.f.f_google ? 7 : 3; F.push([true, S.f.f_google ? T('Corregir la fitxa de Google ha estat clau: molta gent creia que el forn tancava a la tarda.') : T('La fitxa de Google actualitzada ha portat algunes visites.')]); }
      else if (S.f.f_google) F.push([false, T('Sabies que la fitxa deia que tancava a les 14 h, però no la vas corregir.')]);
      if (ids.includes('berenar')) { up += 4; F.push([true, T('L\'oferta «Berenar de tarda» ha donat un motiu per venir a la franja fluixa.')]); }
      if (ids.includes('ressenyes')) { up += 1.5; F.push([true, T('Les ressenyes noves han reforçat la confiança a Google.')]); }
      const kc = S.f.f_clients || S.f.f_canvi ? 3.2 : 2.2;
      up += b.cupons / 100 * kc; if (b.cupons) F.push([true, T("Els cupons a l'escola han arribat al públic que s'havia perdut{0}.", [kc > 3 ? T(' (sabies que les famílies havien deixat de venir)') : ''])]);
      up += b.gads / 100 * 2.2; if (b.gads) F.push([true, T('Google Ads ha captat gent que buscava un forn en aquell moment.')]);
      up += b.meta / 100 * 1.0; if (b.meta >= 150) F.push([null, T('Els anuncis a xarxes han generat moltes impressions, però poques visites reals.')]);
      up += b.fotos / 100 * 0.4; if (b.fotos >= 100) F.push([false, T('La sessió de fotos ha consumit pressupost sense efecte directe en les vendes de la tarda.')]);
      if (b.reserva) {
        if (S.f.ajust === 'ajust') { up += b.reserva / 100 * 2.6 + 1; F.push([true, T('Ajustar a mitja campanya segons les dades ha millorat el resultat.')]); }
        else if (S.f.ajust === 'vanitat') { up += b.reserva / 100 * 0.7; F.push([false, T('Vas reforçar el canal amb més impressions, no el que portava més clients.')]); }
        else F.push([null, T('La reserva no es va arribar a fer servir.')]);
      } else if (S.f.ajust === 'ajust') { up += 1; F.push([true, T('Vas moure pressupost cap al canal que funcionava.')]); }
      if (S.f.diag === 'bo') { up += 1.5; F.push([true, T('El diagnòstic encertat ha fet que totes les accions apuntessin a la causa.')]); }
      up *= 1 + 0.04 * (H.sk('estrategia') + H.sk('creativitat'));
      up = Math.round(H.clamp(up + H.rnd(-1.5, 1.5), 0, 40) * 10) / 10;
      const base = 360, extra = Math.round(base * 4 * up / 100);
      const verdict = up >= 15 ? 'good' : up >= 8 ? 'mid' : 'bad';
      const cupons = Math.round((b.cupons + (S.f.ajust === 'ajust' ? b.reserva : 0)) * 0.42);
      if (!S.f.mesura) F.push([false, T('Sense indicadors ben definits costa demostrar què ha funcionat.')]);
      if (S.f.smart !== 'smart') F.push([false, T('L\'objectiu no era mesurable: la valoració serà més subjectiva.')]);
      const w = [0.5, 0.9, 1.15, 1.45].map(x => Math.round(base * (1 + up / 100 * x)));
      return {
        title: T('Resultats de la campanya del forn'),
        metrics: [
          [T('Vendes 16–19 h (dt i dc)'), (up >= 0 ? '+' : '') + H.pct(up), verdict === 'good' ? 'good' : verdict === 'bad' ? 'bad' : ''],
          [T('Objectiu'), S.f.smart === 'smart' ? '+15 %' : T('Sense xifra')],
          [T('Vendes extra (4 setm.)'), H.eur(extra)],
          [T('Cupons bescanviats'), S.f.mesura ? String(cupons) : T('No mesurat')]
        ],
        chart: { labels: [T('Setm. 1'), T('Setm. 2'), T('Setm. 3'), T('Setm. 4')], series: [{ name: T('Abans (mitjana)'), values: [base, base, base, base], cls: 'gray' }, { name: T('Amb campanya'), values: w, cls: 'pink' }] },
        summary: verdict === 'good' ? T('Objectiu assolit! Les tardes del forn tornen a tenir vida.') : verdict === 'mid' ? T('Millora clara, però per sota de l\'objectiu del 15 %.') : T('L\'efecte ha estat petit. Cal entendre per què.'),
        verdict, factors: F,
        fx: { rep: verdict === 'good' ? 8 : verdict === 'mid' ? 4 : 1, trust: { carme: (S.f.mesura ? 1 : 0) + (verdict === 'good' ? 2 : verdict === 'mid' ? 1 : 0) }, know: { seo: 1 }, flags: { carmeResult: verdict, carmeUp: up }, log: T("Primera campanya del forn: {0}{1} % de vendes a la franja objectiu.", [up >= 0 ? '+' : '', up]), key: true }
      };
    } },
    { t: 'dlg', bg: 'forn', lines: (S) => {
      const v = S.f.carmeResult;
      if (v === 'good') return [['carme.h', T('{nom}, aquest dimarts he hagut de fer una segona fornada a la tarda! No passava des de fa anys.')], ['carme.n', T('I m\'has explicat cada euro. Això val més que tot.')], ['pau.h', T('Gràcies, Carme. Ho hem fet junts.')]];
      if (v === 'mid') return [['carme.n', T('Ha anat bé, eh. No és un miracle, però es nota.')], ...(S.f.mesura ? [['carme.h', T('I almenys sé què ha funcionat i què no. Això m\'agrada.')]] : [['carme.t', T('Tot i que no sé ben bé què ha funcionat...')]])];
      return [['carme.w', T('Doncs no he notat gaire diferència, {g:noi|noia|maco}.')], ...(S.f.mesura ? [['pau.n', T('Ho sé. Però tenim les dades: el que ha funcionat és clar i el que no també. La propera vegada ho farem millor.')], ['carme.n', T('Almenys {g:ets honest|ets honesta|has estat sincer}. Això compta.')]] : [['pau.w', T('Ho sento, Carme...')]])];
    } },
    { t: 'reward', money: (S) => S.f.feeCarme || 0, fx: (S) => (S.f.feeCarme === 0 ? { rep: 3 } : null), text: T('Has rebut la primera reputació, experiència en màrqueting local i una possible referència comercial.') }
  ]
});

CH('1.5', {
  title: T('El primer error'), who: 'toni', bg: 'despatx', weeks: 2,
  blurb: T('La pressió per facturar et tempta a acceptar una campanya que no domines.'),
  steps: [
    { t: 'dlg', lines: (S) => [
      ['', T('Ring, ring.')],
      ['toni.n', T('Ei, ets el {nom}? Sóc el Toni, del gimnàs Osona Fit.') + (S.f.carmeResult === 'good' ? T(' La Carme del forn diu que ets un crac.') : T(' M\'han dit que vas ajudar el forn de la Carme.'))],
      ['toni.n', T('Vull anuncis. Ja. Tinc 600 € per a la campanya i et pago 400 € per muntar-la. La vull activa aquest cap de setmana.')],
      ['pau.t', T('(400 € em vindrien molt bé... però de publicitat de pagament en sé poca cosa.)')]
    ] },
    { t: 'choice', key: 'toni', who: 'toni', prompt: T('Què li dius al Toni?'), opts: [
      { t: T('Acceptar i muntar-la de seguida, tal com ho demana.'), v: 'rapid', fx: { log: T('Va acceptar muntar una campanya d\'anuncis a corre-cuita.') }, say: [['pau.h', T('Fet! Divendres la tens activa.')], ['', T('{En} la munta divendres a la nit, a corre-cuita, copiant passos d\'un vídeo.')], ['', T('Una setmana després...')], ['toni.a', T('{nom}! He gastat 300 € i no s\'ha apuntat ningú. Ni un! Això sí, tinc 140 m\'agrada...')], ['pau.w', T('Deixa\'m revisar la configuració. Ara mateix.')]] },
      { t: T('Acceptar, però abans definir l\'objectiu i com mesurarem les inscripcions.'), v: 'pla', fx: { xp: 20, log: T('Va condicionar la campanya del gimnàs a definir objectiu i mesura.') }, say: [['toni.t', T('Uf, d\'acord, però ràpid. Ah, i ja en tinc una de prova que vaig activar jo mateix. Mira-la.')], ['pau.n', T('Perfecte: abans de fer res, la reviso.')]] },
      { t: T('Declinar: encara no domino prou la publicitat.'), v: 'no', say: [['toni.w', T('Bé, ja m\'ho farà el meu cosí.')], ['', T('Dues setmanes després...')], ['toni.a', T('{nom}, el meu cosí m\'ho ha muntat i no s\'ha apuntat ningú! Ho pots mirar? Et pago 300 €.')], ['pau.n', T('Això sí que ho puc fer: revisar-ho amb calma.')]] }
    ] },
    { t: 'fx', silent: true, fx: { flags: { met_toni: true } } },
    { t: 'lesson', id: 'L_ads1' },
    { t: 'multi', key: 'auditoria', pick: 4, prompt: T('Revisa la campanya del gimnàs: marca els 4 errors'), info: tbl([
      [T('Objectiu'), T('Interacció amb la publicació')], [T('Ubicació'), T('Tota Espanya')], [T('Edat'), T('18–65 anys')], [T('Pressupost'), T('90 % concentrat el dissabte')],
      [T('Conversió'), T('No configurada')], [T('Anunci'), T('Foto real del gimnàs + «Primera setmana gratis»')], [T('Destinació'), T('Formulari d\'inscripció de 3 camps')]
    ], [T('Paràmetre'), T('Configuració')]), opts: [
      { t: T('Objectiu: interacció amb la publicació'), ok: true, why: T('Ha d\'optimitzar per inscripcions (contactes), no per m\'agrada.') },
      { t: T('Ubicació: tota Espanya'), ok: true, why: T('El gimnàs és a Vic: cal un radi de 10–15 km.') },
      { t: T('Pressupost: 90 % el dissabte'), ok: true, why: T('Concentrar-ho en un dia impedeix aprendre i optimitzar.') },
      { t: T('Conversió no configurada'), ok: true, why: T('Sense mesurar inscripcions no saps què funciona ni què costen.') },
      { t: T('Anunci: foto real i «primera setmana gratis»'), ok: false, why: T('És una bona creativitat: real i amb una oferta clara.') },
      { t: T('Formulari d\'inscripció de 3 camps'), ok: false, why: T('Un formulari curt és bona pràctica.') },
      { t: T('Edat 18–65 anys'), ok: false, why: T('Ampli però raonable per a un gimnàs; no és el problema principal.') }
    ], fx: (S, g) => ({ xp: g * 12, flags: { auditOk: g } }) },
    { t: 'sim', calc: (S, H) => {
      const g = S.f.auditOk || 0;
      const insc = Math.round((g >= 4 ? 22 : g === 3 ? 13 : g === 2 ? 7 : 3) * (1 + 0.05 * H.sk('analitica')) + H.rnd(-1, 2));
      const spend = 300, cpa = Math.round(spend / Math.max(1, insc));
      const verdict = insc >= 18 ? 'good' : insc >= 10 ? 'mid' : 'bad';
      const F = [
        [g >= 1, T('Canviar l\'objectiu a «contactes» ha fet que la plataforma busqui gent disposada a inscriure\'s.')],
        [g >= 2, T('Limitar la ubicació a 12 km de Vic ha eliminat milers d\'impressions inútils.')],
        [g >= 3, T('Repartir el pressupost cada dia ha permès optimitzar la campanya.')],
        [g >= 4, T('Amb la conversió configurada, ara saps exactament què costa cada inscripció.')]
      ];
      if (S.f.toni === 'rapid') F.push([false, T('Els primers 300 € es van perdre per muntar-ho a corre-cuita. Error assumit i corregit.')]);
      if (S.f.toni === 'pla') F.push([true, T('Haver exigit definir l\'objectiu abans d\'invertir ha evitat perdre diners.')]);
      return {
        title: T('Campanya del gimnàs corregida'),
        metrics: [[T('Inscripcions noves'), String(insc), verdict === 'good' ? 'good' : ''], [T('Inversió'), H.eur(spend)], [T('Cost per inscripció'), H.eur(cpa)], [T('M\'agrada'), T('Irrellevant 😉')]],
        summary: verdict === 'good' ? T('La campanya corregida funciona. El Toni no s\'ho creu.') : verdict === 'mid' ? T('Millora, però encara hi havia errors a la configuració.') : T('Encara hi ha errors de base que no has detectat.'),
        verdict, factors: F,
        fx: { rep: verdict === 'good' ? 5 : verdict === 'mid' ? 2 : -1, know: { ads: 1 }, flags: { toniResult: verdict } }
      };
    } },
    { t: 'dlg', lines: (S) => [
      ...(S.f.toniResult === 'good' ? [['toni.h', T('Vint inscripcions! I ara sé quant em costa cada una. Ets un fenomen, {nom}.')]] : [['toni.n', T('Bé, ha millorat. Seguirem provant.')]]),
      ['clear', ''],
      ['bg', 'despatx:night'],
      ['pau.t', T('Primer client, primera campanya, primer error. I la primera lliçó: les dades no menteixen, però cal saber-les llegir.')],
      ['pau.h', T('Ja tinc una idea més clara dels serveis que puc oferir... i dels que encara he d\'aprendre.')]
    ] },
    { t: 'reward', money: (S) => S.f.toni === 'no' ? 300 : 400 }
  ]
});

/* ============================================================
   ETAPA 2 — FER-SE UN NOM A OSONA
   ============================================================ */
CH('2.1', {
  title: T('El restaurant que té taules buides'), who: 'jordi', bg: 'restaurant', weeks: 2,
  blurb: T('Bones opinions, però dilluns i dimarts el menjador és mig buit.'),
  steps: [
    { t: 'dlg', lines: (S) => [
      ['jordi.n', T('{nom}? Sóc el Jordi, de Can Jordi, a Tona.') + (S.trust.carme >= 2 ? T(' La Carme m\'ha parlat molt bé de tu.') : '')],
      ['jordi.t', T('Tenim bones ressenyes, el cap de setmana ho omplim. Però dilluns i dimarts... sembla un museu.')],
      ['jordi.n', T('He pensat que hauríem de publicar més a les xarxes. Cada dia un plat. Què et sembla?')]
    ] },
    { t: 'invest', who: 'jordi', time: 3, prompt: T('Investiga abans de respondre'), info: T('Tens temps per a 3 preguntes.'), opts: [
      { t: T('Què diu la fitxa de Google i com estan les ressenyes?'), flag: 'r_fitxa', note: T('No surt el menú de migdia ni hi ha botó de reserva; ressenyes sense resposta.'), a: [['', T('La fitxa té 4,6 estrelles i 210 ressenyes. Però no diu que hi ha menú de migdia entre setmana, no hi ha enllaç per reservar i cap ressenya té resposta.')]] },
      { t: T('Qui ve entre setmana i qui el cap de setmana?'), flag: 'r_public', note: T('Cap de setmana: famílies de Barcelona. Entre setmana: hi ha un polígon a 3 minuts.'), a: [['jordi.t', T('El cap de setmana, famílies que pugen de Barcelona. Entre setmana, quatre veïns.')], ['pau.t', T('I el polígon industrial que hi ha a tres minuts? Hi treballen centenars de persones...')], ['jordi.s', T('Ostres. No ho havia pensat. No crec que sàpiguen que fem menú.')]] },
      { t: T('Com es fan les reserves?'), flag: 'r_reserves', note: T('Només per telèfon, i al migdia ningú no l\'agafa.'), a: [['jordi.w', T('Per telèfon. Bé... al migdia som a la cuina i no l\'agafa ningú.')]] },
      { t: T('Què publiqueu a les xarxes i qui us segueix?'), flag: 'r_xarxes', note: T('1.900 seguidors, la majoria de Barcelona; fotos de plats de cap de setmana.'), a: [['jordi.n', T('Fotos dels plats del cap de setmana. Tenim 1.900 seguidors.')], ['pau.t', T('(La majoria són de Barcelona: no vindran a dinar un dilluns a Tona.)')]] }
    ] },
    { t: 'lesson', id: 'L_seolocal' },
    { t: 'choice', key: 'estr21', prompt: T('Quina estratègia proposes al Jordi?'), opts: [
      { t: T('Publicar més a les xarxes: cada dia un plat.'), v: 'xarxes', d: T('El que demana el client.') },
      { t: T('Menú de migdia per als treballadors del polígon + fitxa de Google amb menú i reserves en línia + respondre les ressenyes.'), v: 'local', fx: { xp: 20 } },
      { t: T('Descompte del 50 % dilluns i dimarts per a tothom.'), v: 'desc' },
      { t: T('Una prova de 2 setmanes del menú i mesurar les reserves per canal abans de decidir.'), v: 'prova', req: { skill: 'analitica', min: 2 }, fx: { xp: 30 } }
    ] },
    { t: 'sim', calc: (S, H) => {
      const v = S.f.estr21; const inv = ['r_fitxa', 'r_public', 'r_reserves'].filter(k => S.f[k]).length;
      const base = { xarxes: 0.25, local: 0.6 + inv * 0.1, desc: 0.55, prova: 0.75 + inv * 0.08 }[v];
      const q = H.q(base, ['estrategia'], ['seo']);
      const occ = Math.round(25 + q * 55);
      const F = [];
      if (v === 'xarxes') F.push([false, T('Els seguidors són de Barcelona: no vénen a dinar un dilluns a Tona.')]);
      if (v === 'local' || v === 'prova') { F.push([true, T('El menú de migdia respon a una necessitat real dels treballadors del polígon.')]); F.push([S.f.r_fitxa || null, S.f.r_fitxa ? T('La fitxa amb menú i botó de reserva converteix cerques en reserves.') : T('La fitxa millorada ajuda, tot i que no l\'havies revisat a fons.')]); }
      if (S.f.r_reserves && v !== 'xarxes' && v !== 'desc') F.push([true, T('Les reserves en línia eviten perdre clients quan ningú no pot agafar el telèfon.')]);
      if (v === 'desc') F.push([false, T('El descompte omple taules, però amb el 50 % cada menú deixa pèrdues.')]);
      if (v === 'prova') F.push([true, T('La prova amb mesura per canal permet saber què funciona abans d\'invertir més.')]);
      const marge = v === 'desc' ? -2.5 : 6;
      const verdict = v === 'desc' ? 'mid' : occ >= 55 ? 'good' : occ >= 40 ? 'mid' : 'bad';
      return {
        title: T('Dilluns i dimarts a Can Jordi'),
        metrics: [[T('Ocupació (dl i dt)'), occ + ' %', verdict], [T('Abans'), '25 %'], [T('Marge per menú'), H.eur(marge), marge < 0 ? 'bad' : 'good'], [T('Reserves en línia'), v === 'xarxes' || v === 'desc' ? '—' : String(Math.round(occ * 0.6))]],
        summary: verdict === 'good' ? T('Els dilluns han deixat de semblar un museu.') : v === 'desc' ? T('Taules plenes... però perdent diners amb cada taula.') : T('Poca millora: no s\'ha atacat el motiu real.'),
        verdict, factors: F,
        fx: { rep: verdict === 'good' ? 6 : verdict === 'mid' ? 2 : 0, know: { seo: 1 }, flags: { jordiResult: verdict }, client: verdict === 'good' ? { id: 'jordi', name: T('Can Jordi (manteniment local)'), fee: 300 } : null }
      };
    } },
    { t: 'dlg', lines: (S) => S.f.jordiResult === 'good' ? [['jordi.h', T('{nom}, dilluns vam fer quaranta menús! Quaranta! Vull que porteu la fitxa i les ressenyes cada mes.')]] :
      S.f.estr21 === 'desc' ? [['jordi.w', T('Ple de gent, sí... però a final de mes he perdut diners. No ho podem mantenir.')], ['pau.t', T('Lliçó apresa: omplir no és el mateix que guanyar.')]] :
        [['jordi.n', T('Ha anat una mica millor, però no gaire. Ja veurem.')]] },
    { t: 'reward', money: 600 }
  ]
});

CH('2.2', {
  title: T('La fàbrica de Miquel'), who: 'miquel', bg: 'fabrica', weeks: 3,
  blurb: T('Una empresa industrial que no vol seguidors: vol compradors.'),
  steps: [
    { t: 'fx', silent: true, fx: { flags: { met_miquel: true } } },
    { t: 'dlg', lines: [
      ['', T('Mecanitzats Bellmunt, polígon de Gurb. Soroll de màquines i olor d\'oli.')],
      ['miquel.n', T('Miquel Bellmunt. Tercera generació. Fem components de precisió per a maquinària.')],
      ['miquel.t', T('El web el va fer el meu nebot el 2011. Els comercials viuen de les fires i dels contactes de sempre.')],
      ['miquel.a', T('I t\'aviso: no vull seguidors ni m\'agrades. Vull que em truquin compradors d\'empreses que necessiten peces.')]
    ] },
    { t: 'choice', who: 'miquel', prompt: T('Què li preguntes primer?'), opts: [
      { t: T('Quantes visites té la web?'), say: [['miquel.t', T('Ni idea. Algunes, suposo.')]] },
      { t: T('Qui és el vostre client ideal i qui decideix la compra?'), fx: { trust: { miquel: 1 } }, say: [['miquel.n', T('Bona pregunta. Ara t\'ho explico.')]] },
      { t: T('Quant val per a vosaltres un client nou al llarg d\'un any?'), req: { skill: 'comercial', min: 2 }, fx: { trust: { miquel: 2 }, flags: { m_valor: true } }, say: [['miquel.h', T('Vaja, tu parles el meu idioma. Uns 25.000 € de facturació l\'any, amb un 20 % de marge.')]] }
    ] },
    { t: 'dlg', lines: [
      ['miquel.n', T('El client ideal: fabricants de maquinària agrícola i alimentària de Catalunya i l\'Aragó.')],
      ['miquel.t', T('Decideixen els enginyers de producte i els responsables de compres. I no compren d\'un dia per l\'altre: de tres a sis mesos.')]
    ] },
    { t: 'lesson', id: 'L_b2b' },
    { t: 'lesson', id: 'L_seo' },
    { t: 'choice', key: 'estr22', prompt: T('Quin pla presentes a Miquel?'), sub: T('Pressupost de campanya: 3.000 € en 3 mesos (diners del client).'), opts: [
      { t: T('Campanya a Instagram i Facebook per guanyar notorietat i seguidors.'), v: 'notorietat' },
      { t: T('Pàgines per família de producte amb fitxes tècniques descarregables, SEO industrial i LinkedIn segmentat a compres i enginyeria.'), v: 'b2b', fx: { xp: 25 } },
      { t: T('Anuncis massius a Google per a «peces metàl·liques».'), v: 'massiu' }
    ] },
    { t: 'choice', key: 'qual22', prompt: T('Com definiu un contacte qualificat amb l\'equip comercial?'), opts: [
      { t: T('Qualsevol persona que deixi el correu.'), v: 0 },
      { t: T('Empresa del sector objectiu, amb una necessitat concreta i volum mínim. El comercial truca en menys de 24 h.'), v: 1, fx: { trust: { miquel: 1 }, xp: 20 } },
      { t: T('Ja ho decidiran els comercials.'), v: 0 }
    ] },
    { t: 'sim', calc: (S, H) => {
      const v = S.f.estr22, qual = S.f.qual22;
      const q = H.q({ notorietat: 0.2, b2b: 0.75, massiu: 0.35 }[v] + (qual ? 0.12 : 0), ['estrategia', 'analitica'], ['seo', 'creixement']);
      const leads = v === 'massiu' ? 140 : v === 'notorietat' ? 35 : Math.round(30 + q * 20);
      const qualRate = v === 'b2b' ? 0.35 + q * 0.2 : 0.04;
      const ql = Math.round(leads * qualRate);
      const opp = Math.round(ql * (qual ? 0.5 : 0.3));
      const clients = Math.max(0, Math.round(opp * 0.35 + (q > 0.8 ? 1 : 0)));
      const cac = clients ? Math.round(3000 / clients) : null;
      const verdict = clients >= 3 ? 'good' : clients >= 1 ? 'mid' : 'bad';
      const F = [];
      if (v === 'b2b') F.push([true, T('Les fitxes tècniques responen el que busquen els enginyers.')]);
      if (v === 'notorietat') F.push([false, T('Els seguidors d\'Instagram no són compradors industrials.')]);
      if (v === 'massiu') F.push([false, T('Molts clics de particulars i estudiants: volum alt, qualitat baixa.')]);
      F.push([!!qual, qual ? T('Haver definit què és un contacte qualificat ha permès als comercials prioritzar.') : T('Sense criteri de qualificació, els comercials han perdut temps amb contactes inútils.')]);
      if (S.f.m_valor && cac) F.push([true, T("Saps que un client val ~5.000 € de marge l'any: un CAC de {0} és {1}.", [H.eur(cac), cac < 5000 ? T('molt rendible') : T('massa alt')])]);
      return {
        title: T('Captació B2B · 3 mesos'),
        metrics: [[T('Contactes'), String(leads)], [T('Qualificats'), String(ql), ql >= 10 ? 'good' : ''], [T('Oportunitats'), String(opp)], [T('Clients nous'), String(clients), verdict], [T('Cost per contacte'), H.eur(3000 / Math.max(1, leads))], [T('CAC'), cac ? H.eur(cac) : '—']],
        summary: verdict === 'good' ? T('Miquel té comandes noves de clients que no coneixia.') : verdict === 'mid' ? T('Algun client nou, però l\'embut es pot millorar molt.') : T('Molts números, cap comanda.'),
        verdict, factors: F,
        fx: { rep: verdict === 'good' ? 7 : verdict === 'mid' ? 3 : -1, trust: { miquel: verdict === 'good' ? 3 : verdict === 'mid' ? 1 : -2 }, know: { creixement: 1 }, flags: { miquelResult: verdict }, client: verdict !== 'bad' ? { id: 'miquel', name: T('Mecanitzats Bellmunt (B2B)'), fee: verdict === 'good' ? 900 : 600 } : null, log: T("Projecte B2B per a Miquel: {0} clients nous.", [clients]), key: verdict === 'good' }
      };
    } },
    { t: 'dlg', lines: (S) => S.f.miquelResult === 'good' ? [['miquel.h', T('Tres empreses noves a la cartera. Això són diners de debò, {nom}. Continuem treballant junts.')]] :
      S.f.miquelResult === 'mid' ? [['miquel.n', T('No està malament. Però vull més qualitat i menys soroll. Continuem uns mesos a veure.')]] :
        [['miquel.a', T('Si em portes un informe de m\'agrades, no cal que tornis. Els números que importen són comandes.')], ['pau.w', T('Entesos, Miquel. He après la lliçó.')]] },
    { t: 'reward', money: 1800 }
  ]
});

CH('2.3', {
  title: T('La botiga que vol vendre a tot Catalunya'), who: 'nuria', bg: 'botiga', weeks: 3,
  blurb: T('Una cansaladeria del Mercadal vol una botiga en línia. «Només una web amb fotos», diu.'),
  steps: [
    { t: 'dlg', lines: [
      ['nuria.h', T('Hola! Núria, de la Cansaladeria Núria, al Mercadal. El fuet de Vic de tota la vida.')],
      ['nuria.n', T('Els clients que se\'n van a viure a Barcelona o a Girona em diuen que el troben a faltar. Vull vendre per internet!')],
      ['nuria.t', T('Només necessito una web bonica amb fotos, oi? I ja està.')],
      ['pau.t', T('(Una botiga en línia de productes que s\'han de conservar en fred... això no és «només una web».)')]
    ] },
    { t: 'lesson', id: 'L_ecom' },
    { t: 'choice', key: 'estr23', prompt: T('Què prioritzes en el projecte?'), opts: [
      { t: T('Una web espectacular: vídeo a pantalla completa, animacions i música.'), v: 'bonica' },
      { t: T('Fitxes clares (pes, conservació, al·lèrgens), enviament refrigerat visible des del principi, compra sense registre i pagament amb targeta i Bizum.'), v: 'usable', fx: { xp: 25 } },
      { t: T('No fer web: vendre només en un gran marketplace.'), v: 'market' }
    ] },
    { t: 'multi', key: 'abandon', pick: 3, prompt: T('Prova amb 10 usuaris abans del llançament. Què els fa abandonar el carretó?'), info: tbl([
      [T('Usuaris que afegeixen producte'), T('9 de 10')], [T('Usuaris que acaben la compra'), T('3 de 10')], [T('Comentari més repetit'), T('«No sabia que l\'enviament costava 9,90 €»')],
      [T('Al mòbil'), T('La pàgina de pagament tarda 7 segons')], [T('Al pas 2'), T('Cal crear un compte amb contrasenya')]
    ]), opts: [
      { t: T('El cost d\'enviament apareix per sorpresa al final'), ok: true, why: T('Mostra\'l a la fitxa i ofereix enviament gratuït a partir d\'un import.') },
      { t: T('La pàgina de pagament és lenta al mòbil'), ok: true, why: T('La majoria de compres es fan des del mòbil.') },
      { t: T('L\'obligació de crear un compte'), ok: true, why: T('Permet comprar com a convidat.') },
      { t: T('El fuet és massa barat'), ok: false, why: T('Cap usuari no ho ha mencionat.') },
      { t: T('Hi ha massa informació a la fitxa'), ok: false, why: T('Al contrari: la informació dona confiança.') },
      { t: T('El logo és antic'), ok: false, why: T('No afecta el procés de compra.') }
    ], fx: (S, g) => ({ xp: g * 12, flags: { abandonOk: g } }) },
    { t: 'sim', calc: (S, H) => {
      const v = S.f.estr23, g = S.f.abandonOk || 0;
      const q = H.q({ bonica: 0.3, usable: 0.65, market: 0.5 }[v] + g * 0.07, ['estrategia', 'creativitat'], ['web']);
      const visits = v === 'market' ? 2600 : 1800;
      const conv = Math.round((0.4 + q * 2.4) * 10) / 10;
      const orders = Math.round(visits * conv / 100);
      const ticket = 38;
      const margin = v === 'market' ? 4.2 : v === 'bonica' ? 5 : 7.5;
      const verdict = conv >= 2 ? 'good' : conv >= 1.2 ? 'mid' : 'bad';
      const F = [];
      if (v === 'bonica') F.push([false, T('El vídeo a pantalla completa fa que la web trigui molt al mòbil.')]);
      if (v === 'usable') F.push([true, T('Les fitxes responen els dubtes clau: conservació, pes i data d\'entrega.')]);
      if (v === 'market') F.push([null, T('El marketplace porta més visites, però les comissions es mengen el marge i la marca queda diluïda.')]);
      F.push([g >= 3, g >= 3 ? T('Has corregit els tres motius d\'abandonament abans del llançament.') : T("Has detectat {0} dels 3 motius d'abandonament.", [g])]);
      return {
        title: T('Primer trimestre de la botiga en línia'),
        metrics: [[T('Visites'), visits.toLocaleString(LOCALE)], [T('Conversió'), H.pct(conv), verdict], [T('Comandes'), String(orders)], [T('Tiquet mitjà'), H.eur(ticket)], [T('Marge per comanda'), H.eur(margin)], [T('Marge total'), H.eur(orders * margin)]],
        summary: verdict === 'good' ? T('El fuet de la Núria ja arriba a tot Catalunya.') : verdict === 'mid' ? T('Ven, però encara hi ha fricció al procés de compra.') : T('La web és bonica, però ven poc.'),
        verdict, factors: F,
        fx: { rep: verdict === 'good' ? 6 : verdict === 'mid' ? 3 : 0, know: { web: 1 }, flags: { met_nuria: true, nuriaResult: verdict }, client: verdict !== 'bad' ? { id: 'nuria', name: T('Cansaladeria Núria (botiga en línia)'), fee: 600 } : null }
      };
    } },
    { t: 'dlg', lines: (S) => S.f.nuriaResult === 'good' ? [['nuria.h', T('{nom}! M\'ha arribat una comanda de Tarragona i una altra de Figueres! El fuet de Vic, a tot arreu!')]] : [['nuria.n', T('Va venent... però esperava més. Ho anirem millorant?')], ['pau.n', T('Sí. Ara tenim dades per saber on millorar.')]] },
    { t: 'reward', money: 1500 }
  ]
});

CH('2.4', {
  title: T('El client que només mira els seguidors'), who: 'sergi', bg: 'despatx', weeks: 2,
  blurb: T('8.000 seguidors nous. Quantes vendes? Ni idea.'),
  steps: [
    { t: 'dlg', lines: [
      ['sergi.h', T('{nom}, sóc el Sergi, de Cim Trail. Roba de muntanya feta a Osona. Necessito que em portis les xarxes.')],
      ['sergi.h', T('L\'última campanya va ser un èxit brutal: 8.000 seguidors nous en un mes!')],
      ['pau.n', T('Felicitats! I quantes vendes va generar?')],
      ['sergi.s', '...'],
      ['sergi.t', T('Doncs no ho sé. Però 8.000 seguidors són molts, no?')]
    ] },
    { t: 'lesson', id: 'L_xarxes' },
    { t: 'lesson', id: 'L_kpi' },
    { t: 'multi', key: 'dades24', pick: 3, prompt: T('Quines dades necessites per saber si va ser un èxit?'), opts: [
      { t: T('Vendes en línia del període comparades amb l\'any anterior'), ok: true, why: T('Resultat comercial amb punt de comparació (estacionalitat).') },
      { t: T('Visites a la web des d\'Instagram, amb enllaços etiquetats'), ok: true, why: T('Resultat de màrqueting atribuïble a la campanya.') },
      { t: T('Perfil dels nous seguidors: ubicació i interessos'), ok: true, why: T('Diu si són públic objectiu o caçadors de premis.') },
      { t: T('Nombre total de m\'agrada'), ok: false, why: T('Mètrica de vanitat.') },
      { t: T('Abast de les publicacions'), ok: false, why: T('Activitat i visibilitat, no resultat.') },
      { t: T('Nombre de publicacions fetes'), ok: false, why: T('És activitat, no resultat.') }
    ], fx: (S, g) => ({ xp: g * 12 }) },
    { t: 'dlg', lines: [
      ['', T('{En} demana accés a l\'analítica i a la botiga en línia. Tres dies després...')],
      ['pau.t', T('Dades: el 72 % dels nous seguidors són de fora de l\'Estat i van entrar pel sorteig d\'un mòbil.')],
      ['pau.t', T('Visites des d\'Instagram: 640. Vendes atribuïbles: 9. Vendes totals del mes: igual que l\'any passat.')],
      ['pau.w', T('Com li dic això al Sergi?')]
    ] },
    { t: 'choice', key: 'informe24', prompt: T('Com presentes l\'informe?'), opts: [
      { t: T('Informe honest: separar activitat, resultats de màrqueting i resultats comercials, i proposar un pla per vendre.'), v: 'honest', fx: { rep: 4, xp: 20, client: { id: 'sergi', name: T('Cim Trail (xarxes i analítica)'), fee: 400 }, log: T('Va presentar un informe honest al Sergi tot i que les dades no l\'afavorien.'), key: true }, say: [['sergi.w', T('Vaja... Em sap greu, però prefereixo saber la veritat. Fem-ho bé aquesta vegada.')]] },
      { t: T('Felicitar-lo: el client està content i paga.'), v: 'fals', fx: { rep: -3, client: { id: 'sergi', name: T('Cim Trail (xarxes)'), fee: 400 }, flags: { sergiEngany: true }, log: T('Va evitar explicar al Sergi que la campanya no havia generat vendes.'), key: true }, say: [['sergi.h', T('Ho sabia! Continuem així!')], ['pau.w', T('(Algun dia se n\'adonarà...)')]] },
      { t: T('Informe honest + prova: campanya a públic semblant als compradors amb un codi de descompte propi.'), v: 'prova', req: { skill: 'analitica', min: 2 }, fx: { rep: 6, xp: 40, client: { id: 'sergi', name: T('Cim Trail (xarxes i analítica)'), fee: 500 }, log: T('Va proposar al Sergi una prova mesurable amb codi de descompte.'), key: true }, say: [['sergi.h', T('Això és el que necessitava: saber de veritat què funciona. Endavant!')]] }
    ] },
    { t: 'fx', silent: true, fx: { flags: { met_sergi: true, moduloAnalitica: true }, know: { analitica: 1 } } },
    { t: 'dlg', lines: [['pau.h', T('He desbloquejat una manera nova de treballar: quadres de comandament i conversions ben definides. A partir d\'ara, tot es mesurarà.')]] },
    { t: 'reward', money: 700 }
  ]
});

CH('2.5', {
  title: T('La primera recomanació'), who: 'carme', bg: 'vic', weeks: 2,
  blurb: T('Les recomanacions arriben. Saps dir que no?'),
  steps: [
    { t: 'dlg', lines: (S) => {
      const L = [['', T('Mercat de dissabte. {En} compra pa al forn de la Carme.')]];
      if (S.trust.carme >= 2) L.push(['carme.h', T('{nom}! La Pilar de la cafeteria del costat vol que l\'ajudis. I el meu cunyat té una ferreteria a Manlleu.')]);
      else L.push(['carme.n', T('Ei, {nom}. La Pilar de la cafeteria m\'ha preguntat per tu. Li he dit que vas fer una feina... correcta.')]);
      if (S.trust.miquel >= 2) L.push(['', T('Al vespre, un correu de Miquel: «Et presento el meu proveïdor d\'acer. Necessita ajuda amb la web.»')]);
      L.push(['', T('A més, arriben dos encàrrecs més pel formulari de la web. De cop, {en} té més feina de la que pot fer.')]);
      L.push(['pau.w', T('Si ho accepto tot, no dormiré en tres mesos. Si no, potser no tornen a trucar...')]);
      return L;
    } },
    { t: 'choice', key: 'recom', prompt: T('Què fas amb tots els encàrrecs?'), opts: [
      { t: T('Acceptar-ho tot: és el moment de fer diners.'), v: 'tot', fx: { money: 1400, rep: -3, flags: { sobrecarrega: 1 }, log: T('Va acceptar tots els encàrrecs tot i no tenir capacitat.'), key: true }, say: [['', T('Tres setmanes de nits sense dormir. Dues entregues arriben tard i una amb errors.')], ['pau.w', T('He guanyat diners... però he perdut qualitat. I la gent ho nota.')]] },
      { t: T('Acceptar els que encaixen amb la meva especialitat i capacitat; derivar o ajornar la resta amb una data clara.'), v: 'filtre', fx: (S) => ({ money: 800, rep: 4, trust: { carme: S.trust.carme >= 2 ? 1 : 0, miquel: S.trust.miquel >= 2 ? 1 : 0 }, log: T('Va acceptar només els encàrrecs que podia fer bé.'), key: true }), say: [['pau.h', T('Menys diners ara, però feina ben feta. I els que he ajornat m\'esperen.')]] },
      { t: T('No acceptar-ne cap més fins a tenir equip.'), v: 'cap', fx: { trust: { carme: -1, miquel: -1 }, log: T('Va rebutjar totes les recomanacions.') }, say: [['carme.w', T('Ah... bé. La Pilar buscarà algú altre, doncs.')]] }
    ] },
    { t: 'fx', silent: true, fx: (S) => S.trust.carme >= 3 ? { client: { id: 'carme', name: T('Forn de la Carme (manteniment)'), fee: 150 } } : null },
    { t: 'dlg', lines: (S) => [
      ...(S.trust.carme >= 3 ? [['carme.h', T('I a mi porta\'m la fitxa i les ressenyes cada mes, eh. Et pagaré, no pateixis.')]] : []),
      ['pau.n', T('L\'agència ja té clients de sectors diferents: un forn, un restaurant, una fàbrica, una botiga en línia...')],
      ['pau.t', T('I començo a entendre que decidir què accepto i què no és tan important com saber fer anuncis.')]
    ] }
  ]
});
