/* Agència Digital — dades generals i guió de les etapes 1 i 2 */
window.GD = window.GD || {};

GD.names = {
  pau: '{nom}', carme: 'Carme', miquel: 'Miquel', julia: 'Júlia', berta: 'Berta', quim: 'Quim', laia: 'Laia Vidal',
  jordi: 'Jordi', nuria: 'Núria', sergi: 'Sergi', toni: 'Toni', marta: 'Marta', ramon: 'Ramon', amelie: 'Amélie', client: 'Client'
};

GD.profiles = {
  dades: { n: 'Perfil orientat a les dades' },
  creatiu: { n: 'Perfil creatiu' },
  comercial: { n: 'Perfil comercial' }
};

GD.stages = [
  { id: 1, title: 'Tornar a començar', sub: 'Aprendre els fonaments i aconseguir el primer client', levels: '1–3', minLevel: 1, color: '#ff7aa2', chapters: ['1.1', '1.2', '1.3', '1.4', '1.5'], outro: '{En} ja té una cartera inicial, un historial de decisions i una reputació incipient.' },
  { id: 2, title: 'Fer-se un nom a Osona', sub: 'Captar clients i dominar els canals digitals', levels: '4–7', minLevel: 4, color: '#3fc1b0', chapters: ['2.1', '2.2', '2.3', '2.4', '2.5'], outro: 'L\'agència ja té clients de sectors diferents. L\'estratègia empresarial és tan important com la tècnica.' },
  { id: 3, title: 'La fira de les oportunitats', sub: 'Competir, negociar i guanyar projectes', levels: '8–11', minLevel: 7, color: '#f2b134', chapters: ['3.1', '3.2', '3.3', '3.4', '3.5'], outro: 'L\'agència passa de sobreviure amb encàrrecs a gestionar una cartera i un model de negoci.' },
  { id: 4, title: 'Ja no pots fer-ho tot {g:sol|sola|sol}', sub: 'Contractar, delegar i crear processos', levels: '12–15', minLevel: 11, color: '#7a8cff', chapters: ['4.1', '4.2', '4.3', '4.4', '4.5'], outro: 'L\'agència ja és una empresa amb equip, costos fixos, processos i obligacions de direcció.' },
  { id: 5, title: 'L\'agència sota pressió', sub: 'Gestionar crisis, marges i clients difícils', levels: '16–19', minLevel: 15, color: '#ff6a5a', chapters: ['5.1', '5.2', '5.3', '5.4', '5.5'], outro: 'Has demostrat que pots dirigir quan res no surt com estava previst.' },
  { id: 6, title: 'Créixer sense perdre el nord', sub: 'Especialitzar-se o diversificar', levels: '20–23', minLevel: 19, color: '#a066e0', chapters: ['6.1', '6.2', '6.3', '6.4', '6.5'], outro: 'L\'agència té una identitat definida. El futur dependrà de l\'especialització i la reputació.' },
  { id: 7, title: 'Més enllà de Catalunya', sub: 'Internacionalització i direcció estratègica', levels: '24–27', minLevel: 23, color: '#3aa0e8', chapters: ['7.1', '7.2', '7.3', '7.4', '7.5'], outro: 'La pregunta ja no és quin serà el pròxim client, sinó quina empresa vols ser.' },
  { id: 8, title: 'L\'empresa que has construït', sub: 'Resolució de l\'arc principal i finals ramificats', levels: '28–30', minLevel: 27, color: '#ffd24a', chapters: ['8.1', '8.2'], outro: 'La història {den} ha arribat a un final. Però l\'agència continua.' }
];

GD.chapters = {};
const CH = (id, o) => { GD.chapters[id] = Object.assign({ id, stage: +id.split('.')[0] }, o); };
const tbl = (rows, head) => `<table class="tbl">${head ? `<thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead>` : ''}<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
GD.tbl = tbl;

/* ============================================================
   ETAPA 1 — TORNAR A COMENÇAR
   ============================================================ */
CH('1.1', {
  title: 'Una clau, un portàtil i pocs diners', who: 'pau', bg: 'vic', weeks: 1,
  blurb: '{En} torna a Vic amb una idea: muntar una agència de màrqueting digital.',
  steps: [
    { t: 'dlg', lines: [
      ['', 'Vic. Dissabte de mercat. La Plaça Major fa olor de fuet, de cafè i de pluja recent.'],
      ['pau.n', 'Tres anys fora i tot continua igual... Bé, gairebé tot. Ara jo tinc un pla.'],
      ['pau.h', 'Muntaré una agència de màrqueting digital. Aquí, a Osona.'],
      ['', '{En} té un portàtil, pocs estalvis i una clau. La clau obre un despatx petit damunt d\'una merceria.'],
      ['bg', 'despatx'],
      ['', 'Una taula, dues cadires, una pissarra i una connexió que va i ve. El primer centre d\'operacions.'],
      ['pau.t', 'A veure els números... Compte bancari: 3.000 €. Lloguer: 350 € al mes. Eines i connexió: 50 €.'],
      ['pau.w', 'Si no entra cap client, això dura uns set mesos. Millor no pensar-hi gaire.'],
      ['pau.n', 'A la llibreta hi tinc idees. Però primer: quin és el meu punt fort?']
    ] },
    { t: 'choice', key: 'profile', prompt: 'Quin és el punt fort {den}?', sub: 'Dona una petita bonificació inicial. No determina la teva professió final.', opts: [
      { t: '📊 Perfil orientat a les dades', d: 'T\'agraden els números i entendre què passa de veritat. +1 Analítica', v: 'dades', fx: { skill: { analitica: 1 } } },
      { t: '🎨 Perfil creatiu', d: 'Tens ull per als missatges i les imatges. +1 Creativitat', v: 'creatiu', fx: { skill: { creativitat: 1 } } },
      { t: '🤝 Perfil comercial', d: 'Saps escoltar i convèncer. +1 Comercial', v: 'comercial', fx: { skill: { comercial: 1 } } }
    ] },
    { t: 'input', key: 'agency', prompt: 'Com es dirà l\'agència?', help: 'El nom comercial apareixerà a tota la partida.', def: 'Píxel d\'Osona', sugg: ['Píxel d\'Osona', 'Brúixola Digital', 'Estudi Mercadal', 'Clic Plana', 'Fil Digital'] },
    { t: 'dlg', lines: [['pau.h', '{agencia}. Sona bé. Ara cal saber què ofereixo exactament... i què no.']] },
    { t: 'lesson', id: 'L_mkt' },
    { t: 'choice', key: 'valor', prompt: 'Escriu la primera proposta de valor a la pissarra', opts: [
      { t: '«Fem màrqueting digital de tot tipus per a tota mena d\'empreses.»', v: 'vague', say: [['pau.w', 'Mmm... això ho podria dir qualsevol. Ja ho afinaré.']] },
      { t: '«Gestionem les xarxes socials del teu negoci.»', v: 'servei', say: [['pau.t', 'Ven un servei, no un resultat. Però és un començament.']] },
      { t: '«Ajudem els negocis d\'Osona a aconseguir més clients amb accions mesurables i pressupostos petits.»', v: 'resultat', fx: { xp: 20, rep: 2 }, say: [['pau.h', 'Això sí! Per a qui, quin problema i com ho mesurarem.']] }
    ] },
    { t: 'choice', key: 'serveis', prompt: 'Quins serveis oferiràs al principi?', sub: 'Aquesta decisió determina quines oportunitats arriben amb més facilitat.', opts: [
      { t: 'Tots: web, xarxes, anuncis, SEO, disseny i vídeo', d: 'Més portes d\'entrada, però és difícil fer-ho tot bé tu {g:sol|sola|sol}.', v: 'tots', fx: { log: 'Va decidir oferir tots els serveis des del primer dia.', key: true } },
      { t: 'Especialitzar-me en 2 o 3: màrqueting local, Google i analítica', d: 'Menys encàrrecs, però més fàcils de fer bé i de recomanar.', v: 'espec', fx: { log: 'Va decidir especialitzar-se en màrqueting local, Google i analítica.', key: true, skill: { estrategia: 0 } } },
      { t: 'Generalista que primer estudia cada cas i després proposa', d: 'Atraus clients que valoren l\'anàlisi abans de l\'acció.', v: 'diagnosi', fx: { log: 'Es va presentar com un professional que primer diagnostica i després proposa.', key: true } }
    ] },
    { t: 'lesson', id: 'L_fin' },
    { t: 'choice', key: 'reserva', prompt: 'Quants diners reserves per a imprevistos?', info: 'Tens 3.000 € al compte. La reserva no es fa servir en el dia a dia, però et pot salvar en una crisi.', opts: [
      { t: 'Res: necessito tots els diners per arrencar', v: 0, say: [['pau.w', 'Arriscat... però és el que hi ha.']] },
      { t: '500 € (més d\'un mes de despeses fixes)', v: 500, fx: { reserve: 500, xp: 10 }, say: [['pau.n', 'Un petit coixí. Prudent.']] },
      { t: '1.000 € (més de dos mesos de despeses fixes)', v: 1000, fx: { reserve: 1000, xp: 15, log: 'Va guardar una reserva de 1.000 € des del primer dia.' }, say: [['pau.t', 'Em quedarà poc marge per invertir, però dormiré més tranquil.']] }
    ] },
    { t: 'dlg', lines: [
      ['pau.h', 'Doncs ja està. {agencia} existeix oficialment. Ara només falta... un client.'],
      ['', 'Toc, toc. Algú truca a la porta.']
    ] }
  ]
});

CH('1.2', {
  title: 'La Carme no vol ser influencer', who: 'carme', bg: 'despatx', weeks: 1,
  blurb: 'La propietària d\'un forn tradicional ven poc alguns dies i no vol llençar diners.',
  steps: [
    { t: 'fx', silent: true, fx: { flags: { met_carme: true } } },
    { t: 'dlg', lines: [
      ['carme.n', 'Bon dia. {g:Ets el noi|Ets la noia|Ets tu qui fa coses} dels ordinadors? La Montse de la merceria diu que fas coses d\'internet.'],
      ['pau.s', 'Eh... sí! {nomc}, de {agencia}. Passi, passi.'],
      ['carme.n', 'Sóc la Carme, del forn de la cantonada. Fa trenta anys que pasto.'],
      ['carme.t', 'Et seré clara. Hi ha dies que ho venc tot, i d\'altres que a les set del vespre encara tinc mitja fornada a la lleixa.'],
      ['carme.a', 'Ara tothom em diu que m\'he de fer «influencer». Jo no vull pagar perquè algú faci fotos boniques del pa si no venc ni una barra més.']
    ] },
    { t: 'choice', who: 'carme', prompt: 'Com respons a la Carme?', opts: [
      { t: 'Li proposo obrir un Instagram amb fotos professionals cada dia.', fx: { trust: { carme: -1 }, flags: { precipitat: true }, log: 'Va proposar una solució a la Carme abans d\'entendre el problema.' }, say: [
        ['carme.a', 'Veus? Això mateix és el que no vull. Ni m\'has preguntat res.'],
        ['pau.w', 'Té raó... Comencem de nou. Puc venir al forn a fer-li unes preguntes?'],
        ['carme.n', 'Això ja m\'agrada més. Demà a les quatre.']] },
      { t: 'Abans de proposar res, vull entendre el negoci: puc anar al forn a fer-li preguntes?', fx: { trust: { carme: 1 } }, say: [
        ['carme.h', 'Home, per fi algú que pregunta abans de vendre\'m res. Vine demà a les quatre.']] },
      { t: 'Li pregunto què consideraria un èxit d\'aquí a un mes.', req: { skill: 'comercial', min: 1 }, fx: { trust: { carme: 2 }, flags: { exitDefinit: true } }, say: [
        ['carme.t', 'Un èxit... Que no hagi de llençar pa els dimarts. I que torni a entrar gent a la tarda.'],
        ['pau.h', 'Doncs això és el que mesurarem. Puc venir al forn a veure-ho?'],
        ['carme.h', 'Vine demà a les quatre.']] }
    ] },
    { t: 'dlg', bg: 'forn', lines: [
      ['', 'L\'endemà, a les quatre de la tarda. El forn fa una olor que fa venir ganes de quedar-s\'hi a viure.'],
      ['carme.n', 'Pregunta el que vulguis, però ves per feina, que a les cinc arriben els de l\'escola. O arribaven.']
    ] },
    { t: 'invest', who: 'carme', time: 4, prompt: 'Entrevista la Carme', info: 'Tens temps per a 4 preguntes. No totes són igual d\'útils.', opts: [
      { t: 'Quins dies i hores us sobra més producte?', flag: 'f_hores', note: 'Dimarts i dimecres, de 16 a 19 h.', a: [['carme.t', 'Dimarts i dimecres a la tarda, de quatre a set. Al matí ho venc tot; a la tarda, la lleixa es queda plena.']] },
      { t: 'Qui són els vostres clients i quan venen?', flag: 'f_clients', note: 'Gent gran al matí; famílies de l\'escola a la tarda (cada cop menys).', a: [['carme.n', 'Al matí, gent gran del barri. A la tarda venien moltes famílies a la sortida de l\'escola a buscar el berenar...'], ['carme.w', 'Però fa uns mesos que en venen molt menys.']] },
      { t: 'Què ha canviat aquest darrer any?', flag: 'f_canvi', note: 'Supermercat nou amb forn i l\'escola surt més d\'hora.', a: [['carme.t', 'Van obrir un supermercat amb forn a la carretera. I l\'escola del costat ara surt a dos quarts de cinc; abans sortien a les cinc.'], ['pau.t', '(Potser les famílies passen quan encara no hi ha la fornada de la tarda... o ja no passen per aquí.)']] },
      { t: 'Teniu fitxa a Google? Què hi diu?', flag: 'f_google', note: 'La fitxa diu que tanqueu a les 14 h!', a: [['carme.s', 'Fitxa a Google? Algú en va fer una fa anys...'], ['', '{En} ho mira al mòbil. La fitxa del forn diu: «Obert de 7 a 14 h». Hi ha dues ressenyes del 2019.'], ['pau.s', 'Carme... Google diu a tothom que a la tarda és tancat!'], ['carme.a', 'Què?! Però si obro fins a les vuit!']] },
      { t: 'Quins productes es queden a la lleixa?', flag: 'f_producte', note: 'Coca de vidre i pa de motlle a la tarda.', a: [['carme.n', 'A la tarda, sobretot coca de vidre i pa de motlle. Les coques de llardons volen sempre.']] },
      { t: 'Quin pressupost teniu per a això?', flag: 'f_press', note: '300 €, i vol saber on va cada cèntim.', a: [['carme.n', 'Tres-cents euros, com a molt. I vull saber en què es gasten fins a l\'últim cèntim.']] }
    ] },
    { t: 'dlg', lines: (S) => {
      const n = ['f_hores', 'f_clients', 'f_canvi', 'f_google', 'f_producte'].filter(k => S.f[k]).length;
      return n >= 3 ? [['pau.h', 'Tinc molta informació útil. Ara ja començo a veure el problema de debò.']] :
        [['pau.t', 'Tinc alguna pista, però em falta informació. Hauré d\'anar amb compte amb les conclusions.']];
    } },
    { t: 'lesson', id: 'L_recerca' },
    { t: 'choice', key: 'diag', prompt: 'Quin és el problema real del forn?', opts: [
      { t: 'Que el forn no té Instagram.', v: 'insta', say: [['carme.t', 'Instagram? Si la meitat de les meves clientes tenen setanta anys...']] },
      { t: 'A la tarda entren menys clients perquè molta gent creu que és tancat i les famílies ja no hi passen a l\'hora de berenar.', v: 'bo', hide: (S) => !(S.f.f_google || S.f.f_canvi), fx: { xp: 30, trust: { carme: 1 }, log: 'Va identificar la causa del problema del forn: informació incorrecta i canvi d\'hàbits.', key: true }, say: [['carme.s', 'Ostres... té tot el sentit. Jo pensava que era culpa del supermercat i prou.']] },
      { t: 'A la tarda hi ha menys clients, però encara no en sé ben bé el perquè.', v: 'mig', say: [['pau.t', 'Hauré de proposar accions prudents i mesurar bé.']] },
      { t: 'Els preus són massa alts.', v: 'preu', fx: { trust: { carme: -1 } }, say: [['carme.a', 'Els meus preus són els mateixos de fa dos anys, {g:noi|noia|maco}.']] }
    ] },
    { t: 'lesson', id: 'L_smart' },
    { t: 'choice', key: 'smart', prompt: 'Quin objectiu proposes per a les properes 4 setmanes?', opts: [
      { t: 'Guanyar 500 seguidors a Instagram.', v: 'seg', say: [['carme.a', 'I què en faig, de 500 seguidors? Els poso a la lleixa?']] },
      { t: 'Vendre més.', v: 'vague', say: [['pau.w', 'Massa vague... com sabrem si ho hem aconseguit?']] },
      { t: 'Augmentar un 15 % les vendes de dimarts i dimecres de 16 a 19 h en 4 setmanes, comparant amb el mes anterior.', v: 'smart', fx: { xp: 30, trust: { carme: 1 } }, say: [['carme.h', 'Això ho entenc. I ho podré comprovar amb la caixa.']] }
    ] },
    { t: 'dlg', lines: [
      ['carme.n', 'Doncs prepara\'m aquest pla. Però que el pugui entendre jo, eh?'],
      ['pau.h', 'Tracte fet, Carme.']
    ] }
  ]
});

CH('1.3', {
  title: 'El primer pla de màrqueting', who: 'carme', bg: 'despatx:night', weeks: 1,
  blurb: 'Què farem, per què, quant costarà i com ho mesurarem.',
  steps: [
    { t: 'dlg', lines: [
      ['', 'Aquella nit, al despatx. La pissarra s\'omple de fletxes.'],
      ['pau.t', 'No n\'hi ha prou amb una llista de tasques. He d\'explicar què farem, per què, quant costarà i com ho mesurarem.']
    ] },
    { t: 'multi', key: 'accions', pick: 2, prompt: 'Accions sense cost (només temps): tria\'n dues', info: 'Tens temps per fer bé dues accions abans de començar la campanya.', opts: [
      { id: 'fitxa', t: 'Corregir la fitxa de Google: horaris, fotos reals i telèfon', ok: true, why: (S) => S.f.f_google ? 'Has descobert que Google deia que tancava a les 14 h: és la causa principal!' : 'Tenir la informació local correcta sempre és bàsic.' },
      { id: 'berenar', t: 'Crear l\'oferta «Berenar de tarda»: coca + suc a preu tancat de 16 a 19 h', ok: true, why: 'Dona un motiu per venir a la franja fluixa i aprofita el producte que sobra.' },
      { id: 'ressenyes', t: 'Demanar ressenyes als clients fidels', ok: true, why: 'Ajuda, però l\'efecte és més lent que les altres dues.' },
      { id: 'insta', t: 'Publicar cada dia a Instagram', ok: false, why: 'Consumeix molt temps i no ataca la causa. No és prioritari.' },
      { id: 'logo', t: 'Redissenyar el logo del forn', ok: false, why: 'El problema no és d\'identitat visual: no mourà les vendes de la tarda.' }
    ], fx: (S, g) => ({ xp: g * 15 }) },
    { t: 'budget', key: 'bud', total: 300, step: 50, prompt: 'Reparteix els 300 € de la Carme', info: 'Recorda: aquests diners són del client i es gasten en la campanya. No són ingressos de l\'agència.', items: [
      { id: 'meta', t: '📱 Anuncis a Instagram i Facebook (radi de 2 km)', d: 'Arriben a molta gent del barri, però costa convertir-los en visites.' },
      { id: 'cupons', t: '🎟️ Cupons «berenar» a la sortida de l\'escola', d: 'Impressió i repartiment. Molt directe i fàcil de mesurar.' },
      { id: 'gads', t: '🔎 Google Ads de cerca local', d: 'Apareix quan algú busca «forn obert a prop» en aquell moment.' },
      { id: 'fotos', t: '📸 Sessió de fotos professional', d: 'Millora la imatge, però l\'efecte en vendes és indirecte.' },
      { id: 'reserva', t: '🧰 Reserva per ajustar a mitja campanya', d: 'Permet reaccionar si les dades ho demanen.' }
    ] },
    { t: 'lesson', id: 'L_metriques' },
    { t: 'multi', key: 'kpi', pick: 3, prompt: 'Tria els 3 indicadors que presentaràs a la Carme', opts: [
      { t: 'Cupons «berenar» bescanviats a la caixa', ok: true, why: 'Prova directa de visita i compra atribuïble a la campanya.' },
      { t: 'Vendes de dimarts i dimecres de 16 a 19 h, comparades amb el mes anterior', ok: true, why: 'És exactament l\'objectiu SMART.' },
      { t: 'Trucades i peticions «com arribar» des de la fitxa de Google', ok: true, why: 'Indica intenció de visita.' },
      { t: 'M\'agrada a les publicacions', ok: false, why: 'Mètrica de vanitat: no diu si es ven més.' },
      { t: 'Impressions dels anuncis', ok: false, why: 'Indica abast, no resultats.' },
      { t: 'Seguidors nous', ok: false, why: 'No responen la pregunta del negoci.' }
    ], fx: (S, g) => ({ xp: g * 10, flags: { mesura: g >= 2 } }) },
    { t: 'dlg', bg: 'forn', lines: (S) => {
      const b = S.f.bud || {}; const L = [['', 'L\'endemà, {en} presenta el pla a la Carme amb un full imprès i un cafè.']];
      if (S.f.accions && S.f.accions.ids.includes('fitxa')) L.push(['pau.n', 'Primer arreglarem la fitxa de Google: ha de dir que obres a la tarda.']);
      if (S.f.accions && S.f.accions.ids.includes('berenar')) L.push(['pau.h', 'I crearem el «Berenar de tarda»: coca de vidre i suc a preu tancat. Aprofitem el que sobra!'], ['carme.h', 'Això els nens ho voldran, segur.']);
      if (b.fotos >= 150) L.push(['carme.t', 'Tanta part per a fotos? Les meves coques ja són boniques, {g:noi|noia|maco}.']);
      if (b.reserva > 0) L.push(['pau.n', `He reservat ${b.reserva} € per ajustar a mitja campanya si les dades ho demanen.`], ['carme.n', 'Això és de persona prudent.']);
      if (S.f.mesura) L.push(['carme.h', 'I això dels cupons ho podré comptar jo mateixa a la caixa. M\'agrada.']);
      else L.push(['carme.w', 'I com sabré si ha funcionat?'], ['pau.w', 'Doncs... mirarem com va.']);
      L.push(['carme.n', 'D\'acord. Endavant. I la teva feina, quant em costarà?']);
      return L;
    } },
    { t: 'fx', silent: true, fx: (S) => ({ trust: { carme: ((S.f.bud || {}).reserva > 0 ? 1 : 0) + (S.f.mesura ? 1 : 0) - ((S.f.bud || {}).fotos >= 150 ? 1 : 0) } }) },
    { t: 'choice', key: 'feeCarme', who: 'carme', prompt: 'Quins honoraris demanes pel pla i el seguiment de 4 setmanes?', opts: [
      { t: 'Res: és el primer client i vull referències.', v: 0, fx: { log: 'Va treballar gratis per al primer client.' }, say: [['carme.t', 'Gratis? Res és gratis, {g:noi|noia|maco}. Bé... t\'ho pagaré en pa. I parlaré bé de tu.']] },
      { t: '450 €: pla, execució i informe final.', v: 450, say: [['carme.n', 'És just. Si funciona, n\'estaré contenta.']] },
      { t: '900 €: és el preu habitual a Barcelona.', v: 450, fx: { trust: { carme: -1 } }, say: [['carme.a', 'Aquí no som a Barcelona. Tres-cents de campanya i nou-cents per a tu? Ho deixem en 450 i gràcies.']] }
    ] }
  ]
});

CH('1.4', {
  title: 'La primera campanya', who: 'carme', bg: 'despatx', weeks: 4,
  blurb: 'Quatre setmanes, dades reals (simulades) i una clienta que ho mirarà tot amb lupa.',
  steps: [
    { t: 'dlg', lines: (S) => {
      const ids = (S.f.accions && S.f.accions.ids) || [];
      const L = [['', 'Setmana 1 de la campanya. El mòbil {den} vibra.']];
      if (ids.includes('fitxa')) L.push(['carme.h', '{nom}! Una senyora m\'ha dit que ha vist a Google que obro a la tarda. Es pensava que tancava!']);
      if (ids.includes('berenar')) L.push(['carme.n', 'I ja he venut dotze «berenars». Els nens demanen la coca de vidre, qui ho havia de dir.']);
      if (!ids.includes('fitxa') && !ids.includes('berenar')) L.push(['carme.n', 'De moment no noto gaire res, eh.']);
      return L;
    } },
    { t: 'choice', key: 'ajust', prompt: 'Setmana 2: arriben les primeres dades. Què fas?', info: (S) => {
      const b = S.f.bud || {};
      return tbl([
        ['📱 Xarxes', `${b.meta / 2} €`, `${(b.meta * 22).toLocaleString('ca-ES')} impressions · ${Math.round(b.meta * 0.25)} clics`],
        ['🎟️ Cupons', `${b.cupons / 2} €`, `${b.cupons * 2} repartits · ${Math.round(b.cupons * 0.2)} bescanviats`],
        ['🔎 Google Ads', `${b.gads / 2} €`, `${Math.round(b.gads * 0.4)} clics · ${Math.round(b.gads * 0.08)} trucades`],
        ['📸 Fotos', `${b.fotos} €`, b.fotos ? 'Fotos publicades' : '—'],
        ['🧰 Reserva', `${b.reserva} €`, 'Sense gastar']
      ], ['Canal', 'Gastat', 'Primeres dades']);
    }, opts: [
      { t: 'Moure la reserva (i part dels anuncis de xarxes) cap al canal que genera més visites', v: 'ajust', fx: { xp: 25 }, say: [['pau.t', 'Les dades diuen que els cupons i Google porten gent a la botiga. Hi reforço la inversió.']] },
      { t: 'No tocar res: cal deixar treballar la campanya', v: 'res', say: [['pau.n', 'Esperaré a tenir més dades.']] },
      { t: 'Posar més diners en anuncis de xarxes: tenen moltes més impressions', v: 'vanitat', say: [['pau.h', 'Milers d\'impressions! Això ha de funcionar...']] }
    ] },
    { t: 'sim', calc: (S, H) => {
      const b = S.f.bud || { meta: 0, cupons: 0, gads: 0, fotos: 0, reserva: 0 };
      const ids = (S.f.accions && S.f.accions.ids) || [];
      let up = 1, F = [];
      if (ids.includes('fitxa')) { up += S.f.f_google ? 7 : 3; F.push([true, S.f.f_google ? 'Corregir la fitxa de Google ha estat clau: molta gent creia que el forn tancava a la tarda.' : 'La fitxa de Google actualitzada ha portat algunes visites.']); }
      else if (S.f.f_google) F.push([false, 'Sabies que la fitxa deia que tancava a les 14 h, però no la vas corregir.']);
      if (ids.includes('berenar')) { up += 4; F.push([true, 'L\'oferta «Berenar de tarda» ha donat un motiu per venir a la franja fluixa.']); }
      if (ids.includes('ressenyes')) { up += 1.5; F.push([true, 'Les ressenyes noves han reforçat la confiança a Google.']); }
      const kc = S.f.f_clients || S.f.f_canvi ? 3.2 : 2.2;
      up += b.cupons / 100 * kc; if (b.cupons) F.push([true, `Els cupons a l\'escola han arribat al públic que s\'havia perdut${kc > 3 ? ' (sabies que les famílies havien deixat de venir)' : ''}.`]);
      up += b.gads / 100 * 2.2; if (b.gads) F.push([true, 'Google Ads ha captat gent que buscava un forn en aquell moment.']);
      up += b.meta / 100 * 1.0; if (b.meta >= 150) F.push([null, 'Els anuncis a xarxes han generat moltes impressions, però poques visites reals.']);
      up += b.fotos / 100 * 0.4; if (b.fotos >= 100) F.push([false, 'La sessió de fotos ha consumit pressupost sense efecte directe en les vendes de la tarda.']);
      if (b.reserva) {
        if (S.f.ajust === 'ajust') { up += b.reserva / 100 * 2.6 + 1; F.push([true, 'Ajustar a mitja campanya segons les dades ha millorat el resultat.']); }
        else if (S.f.ajust === 'vanitat') { up += b.reserva / 100 * 0.7; F.push([false, 'Vas reforçar el canal amb més impressions, no el que portava més clients.']); }
        else F.push([null, 'La reserva no es va arribar a fer servir.']);
      } else if (S.f.ajust === 'ajust') { up += 1; F.push([true, 'Vas moure pressupost cap al canal que funcionava.']); }
      if (S.f.diag === 'bo') { up += 1.5; F.push([true, 'El diagnòstic encertat ha fet que totes les accions apuntessin a la causa.']); }
      up *= 1 + 0.04 * (H.sk('estrategia') + H.sk('creativitat'));
      up = Math.round(H.clamp(up + H.rnd(-1.5, 1.5), 0, 40) * 10) / 10;
      const base = 360, extra = Math.round(base * 4 * up / 100);
      const verdict = up >= 15 ? 'good' : up >= 8 ? 'mid' : 'bad';
      const cupons = Math.round((b.cupons + (S.f.ajust === 'ajust' ? b.reserva : 0)) * 0.42);
      if (!S.f.mesura) F.push([false, 'Sense indicadors ben definits costa demostrar què ha funcionat.']);
      if (S.f.smart !== 'smart') F.push([false, 'L\'objectiu no era mesurable: la valoració serà més subjectiva.']);
      const w = [0.5, 0.9, 1.15, 1.45].map(x => Math.round(base * (1 + up / 100 * x)));
      return {
        title: 'Resultats de la campanya del forn',
        metrics: [
          ['Vendes 16–19 h (dt i dc)', (up >= 0 ? '+' : '') + H.pct(up), verdict === 'good' ? 'good' : verdict === 'bad' ? 'bad' : ''],
          ['Objectiu', S.f.smart === 'smart' ? '+15 %' : 'Sense xifra'],
          ['Vendes extra (4 setm.)', H.eur(extra)],
          ['Cupons bescanviats', S.f.mesura ? String(cupons) : 'No mesurat']
        ],
        chart: { labels: ['Setm. 1', 'Setm. 2', 'Setm. 3', 'Setm. 4'], series: [{ name: 'Abans (mitjana)', values: [base, base, base, base], cls: 'gray' }, { name: 'Amb campanya', values: w, cls: 'pink' }] },
        summary: verdict === 'good' ? 'Objectiu assolit! Les tardes del forn tornen a tenir vida.' : verdict === 'mid' ? 'Millora clara, però per sota de l\'objectiu del 15 %.' : 'L\'efecte ha estat petit. Cal entendre per què.',
        verdict, factors: F,
        fx: { rep: verdict === 'good' ? 8 : verdict === 'mid' ? 4 : 1, trust: { carme: (S.f.mesura ? 1 : 0) + (verdict === 'good' ? 2 : verdict === 'mid' ? 1 : 0) }, know: { seo: 1 }, flags: { carmeResult: verdict, carmeUp: up }, log: `Primera campanya del forn: ${up >= 0 ? '+' : ''}${up} % de vendes a la franja objectiu.`, key: true }
      };
    } },
    { t: 'dlg', bg: 'forn', lines: (S) => {
      const v = S.f.carmeResult;
      if (v === 'good') return [['carme.h', '{nom}, aquest dimarts he hagut de fer una segona fornada a la tarda! No passava des de fa anys.'], ['carme.n', 'I m\'has explicat cada euro. Això val més que tot.'], ['pau.h', 'Gràcies, Carme. Ho hem fet junts.']];
      if (v === 'mid') return [['carme.n', 'Ha anat bé, eh. No és un miracle, però es nota.'], ...(S.f.mesura ? [['carme.h', 'I almenys sé què ha funcionat i què no. Això m\'agrada.']] : [['carme.t', 'Tot i que no sé ben bé què ha funcionat...']])];
      return [['carme.w', 'Doncs no he notat gaire diferència, {g:noi|noia|maco}.'], ...(S.f.mesura ? [['pau.n', 'Ho sé. Però tenim les dades: el que ha funcionat és clar i el que no també. La propera vegada ho farem millor.'], ['carme.n', 'Almenys {g:ets honest|ets honesta|has estat sincer}. Això compta.']] : [['pau.w', 'Ho sento, Carme...']])];
    } },
    { t: 'reward', money: (S) => S.f.feeCarme || 0, fx: (S) => (S.f.feeCarme === 0 ? { rep: 3 } : null), text: 'Has rebut la primera reputació, experiència en màrqueting local i una possible referència comercial.' }
  ]
});

CH('1.5', {
  title: 'El primer error', who: 'toni', bg: 'despatx', weeks: 2,
  blurb: 'La pressió per facturar et tempta a acceptar una campanya que no domines.',
  steps: [
    { t: 'dlg', lines: (S) => [
      ['', 'Ring, ring.'],
      ['toni.n', 'Ei, ets el {nom}? Sóc el Toni, del gimnàs Osona Fit.' + (S.f.carmeResult === 'good' ? ' La Carme del forn diu que ets un crac.' : ' M\'han dit que vas ajudar el forn de la Carme.')],
      ['toni.n', 'Vull anuncis. Ja. Tinc 600 € per a la campanya i et pago 400 € per muntar-la. La vull activa aquest cap de setmana.'],
      ['pau.t', '(400 € em vindrien molt bé... però de publicitat de pagament en sé poca cosa.)']
    ] },
    { t: 'choice', key: 'toni', who: 'toni', prompt: 'Què li dius al Toni?', opts: [
      { t: 'Acceptar i muntar-la de seguida, tal com ho demana.', v: 'rapid', fx: { log: 'Va acceptar muntar una campanya d\'anuncis a corre-cuita.' }, say: [['pau.h', 'Fet! Divendres la tens activa.'], ['', '{En} la munta divendres a la nit, a corre-cuita, copiant passos d\'un vídeo.'], ['', 'Una setmana després...'], ['toni.a', '{nom}! He gastat 300 € i no s\'ha apuntat ningú. Ni un! Això sí, tinc 140 m\'agrada...'], ['pau.w', 'Deixa\'m revisar la configuració. Ara mateix.']] },
      { t: 'Acceptar, però abans definir l\'objectiu i com mesurarem les inscripcions.', v: 'pla', fx: { xp: 20, log: 'Va condicionar la campanya del gimnàs a definir objectiu i mesura.' }, say: [['toni.t', 'Uf, d\'acord, però ràpid. Ah, i ja en tinc una de prova que vaig activar jo mateix. Mira-la.'], ['pau.n', 'Perfecte: abans de fer res, la reviso.']] },
      { t: 'Declinar: encara no domino prou la publicitat.', v: 'no', say: [['toni.w', 'Bé, ja m\'ho farà el meu cosí.'], ['', 'Dues setmanes després...'], ['toni.a', '{nom}, el meu cosí m\'ho ha muntat i no s\'ha apuntat ningú! Ho pots mirar? Et pago 300 €.'], ['pau.n', 'Això sí que ho puc fer: revisar-ho amb calma.']] }
    ] },
    { t: 'fx', silent: true, fx: { flags: { met_toni: true } } },
    { t: 'lesson', id: 'L_ads1' },
    { t: 'multi', key: 'auditoria', pick: 4, prompt: 'Revisa la campanya del gimnàs: marca els 4 errors', info: tbl([
      ['Objectiu', 'Interacció amb la publicació'], ['Ubicació', 'Tota Espanya'], ['Edat', '18–65 anys'], ['Pressupost', '90 % concentrat el dissabte'],
      ['Conversió', 'No configurada'], ['Anunci', 'Foto real del gimnàs + «Primera setmana gratis»'], ['Destinació', 'Formulari d\'inscripció de 3 camps']
    ], ['Paràmetre', 'Configuració']), opts: [
      { t: 'Objectiu: interacció amb la publicació', ok: true, why: 'Ha d\'optimitzar per inscripcions (contactes), no per m\'agrada.' },
      { t: 'Ubicació: tota Espanya', ok: true, why: 'El gimnàs és a Vic: cal un radi de 10–15 km.' },
      { t: 'Pressupost: 90 % el dissabte', ok: true, why: 'Concentrar-ho en un dia impedeix aprendre i optimitzar.' },
      { t: 'Conversió no configurada', ok: true, why: 'Sense mesurar inscripcions no saps què funciona ni què costen.' },
      { t: 'Anunci: foto real i «primera setmana gratis»', ok: false, why: 'És una bona creativitat: real i amb una oferta clara.' },
      { t: 'Formulari d\'inscripció de 3 camps', ok: false, why: 'Un formulari curt és bona pràctica.' },
      { t: 'Edat 18–65 anys', ok: false, why: 'Ampli però raonable per a un gimnàs; no és el problema principal.' }
    ], fx: (S, g) => ({ xp: g * 12, flags: { auditOk: g } }) },
    { t: 'sim', calc: (S, H) => {
      const g = S.f.auditOk || 0;
      const insc = Math.round((g >= 4 ? 22 : g === 3 ? 13 : g === 2 ? 7 : 3) * (1 + 0.05 * H.sk('analitica')) + H.rnd(-1, 2));
      const spend = 300, cpa = Math.round(spend / Math.max(1, insc));
      const verdict = insc >= 18 ? 'good' : insc >= 10 ? 'mid' : 'bad';
      const F = [
        [g >= 1, 'Canviar l\'objectiu a «contactes» ha fet que la plataforma busqui gent disposada a inscriure\'s.'],
        [g >= 2, 'Limitar la ubicació a 12 km de Vic ha eliminat milers d\'impressions inútils.'],
        [g >= 3, 'Repartir el pressupost cada dia ha permès optimitzar la campanya.'],
        [g >= 4, 'Amb la conversió configurada, ara saps exactament què costa cada inscripció.']
      ];
      if (S.f.toni === 'rapid') F.push([false, 'Els primers 300 € es van perdre per muntar-ho a corre-cuita. Error assumit i corregit.']);
      if (S.f.toni === 'pla') F.push([true, 'Haver exigit definir l\'objectiu abans d\'invertir ha evitat perdre diners.']);
      return {
        title: 'Campanya del gimnàs corregida',
        metrics: [['Inscripcions noves', String(insc), verdict === 'good' ? 'good' : ''], ['Inversió', H.eur(spend)], ['Cost per inscripció', H.eur(cpa)], ['M\'agrada', 'Irrellevant 😉']],
        summary: verdict === 'good' ? 'La campanya corregida funciona. El Toni no s\'ho creu.' : verdict === 'mid' ? 'Millora, però encara hi havia errors a la configuració.' : 'Encara hi ha errors de base que no has detectat.',
        verdict, factors: F,
        fx: { rep: verdict === 'good' ? 5 : verdict === 'mid' ? 2 : -1, know: { ads: 1 }, flags: { toniResult: verdict } }
      };
    } },
    { t: 'dlg', lines: (S) => [
      ...(S.f.toniResult === 'good' ? [['toni.h', 'Vint inscripcions! I ara sé quant em costa cada una. Ets un fenomen, {nom}.']] : [['toni.n', 'Bé, ha millorat. Seguirem provant.']]),
      ['clear', ''],
      ['bg', 'despatx:night'],
      ['pau.t', 'Primer client, primera campanya, primer error. I la primera lliçó: les dades no menteixen, però cal saber-les llegir.'],
      ['pau.h', 'Ja tinc una idea més clara dels serveis que puc oferir... i dels que encara he d\'aprendre.']
    ] },
    { t: 'reward', money: (S) => S.f.toni === 'no' ? 300 : 400 }
  ]
});

/* ============================================================
   ETAPA 2 — FER-SE UN NOM A OSONA
   ============================================================ */
CH('2.1', {
  title: 'El restaurant que té taules buides', who: 'jordi', bg: 'restaurant', weeks: 2,
  blurb: 'Bones opinions, però dilluns i dimarts el menjador és mig buit.',
  steps: [
    { t: 'dlg', lines: (S) => [
      ['jordi.n', '{nom}? Sóc el Jordi, de Can Jordi, a Tona.' + (S.trust.carme >= 2 ? ' La Carme m\'ha parlat molt bé de tu.' : '')],
      ['jordi.t', 'Tenim bones ressenyes, el cap de setmana ho omplim. Però dilluns i dimarts... sembla un museu.'],
      ['jordi.n', 'He pensat que hauríem de publicar més a les xarxes. Cada dia un plat. Què et sembla?']
    ] },
    { t: 'invest', who: 'jordi', time: 3, prompt: 'Investiga abans de respondre', info: 'Tens temps per a 3 preguntes.', opts: [
      { t: 'Què diu la fitxa de Google i com estan les ressenyes?', flag: 'r_fitxa', note: 'No surt el menú de migdia ni hi ha botó de reserva; ressenyes sense resposta.', a: [['', 'La fitxa té 4,6 estrelles i 210 ressenyes. Però no diu que hi ha menú de migdia entre setmana, no hi ha enllaç per reservar i cap ressenya té resposta.']] },
      { t: 'Qui ve entre setmana i qui el cap de setmana?', flag: 'r_public', note: 'Cap de setmana: famílies de Barcelona. Entre setmana: hi ha un polígon a 3 minuts.', a: [['jordi.t', 'El cap de setmana, famílies que pugen de Barcelona. Entre setmana, quatre veïns.'], ['pau.t', 'I el polígon industrial que hi ha a tres minuts? Hi treballen centenars de persones...'], ['jordi.s', 'Ostres. No ho havia pensat. No crec que sàpiguen que fem menú.']] },
      { t: 'Com es fan les reserves?', flag: 'r_reserves', note: 'Només per telèfon, i al migdia ningú no l\'agafa.', a: [['jordi.w', 'Per telèfon. Bé... al migdia som a la cuina i no l\'agafa ningú.']] },
      { t: 'Què publiqueu a les xarxes i qui us segueix?', flag: 'r_xarxes', note: '1.900 seguidors, la majoria de Barcelona; fotos de plats de cap de setmana.', a: [['jordi.n', 'Fotos dels plats del cap de setmana. Tenim 1.900 seguidors.'], ['pau.t', '(La majoria són de Barcelona: no vindran a dinar un dilluns a Tona.)']] }
    ] },
    { t: 'lesson', id: 'L_seolocal' },
    { t: 'choice', key: 'estr21', prompt: 'Quina estratègia proposes al Jordi?', opts: [
      { t: 'Publicar més a les xarxes: cada dia un plat.', v: 'xarxes', d: 'El que demana el client.' },
      { t: 'Menú de migdia per als treballadors del polígon + fitxa de Google amb menú i reserves en línia + respondre les ressenyes.', v: 'local', fx: { xp: 20 } },
      { t: 'Descompte del 50 % dilluns i dimarts per a tothom.', v: 'desc' },
      { t: 'Una prova de 2 setmanes del menú i mesurar les reserves per canal abans de decidir.', v: 'prova', req: { skill: 'analitica', min: 2 }, fx: { xp: 30 } }
    ] },
    { t: 'sim', calc: (S, H) => {
      const v = S.f.estr21; const inv = ['r_fitxa', 'r_public', 'r_reserves'].filter(k => S.f[k]).length;
      const base = { xarxes: 0.25, local: 0.6 + inv * 0.1, desc: 0.55, prova: 0.75 + inv * 0.08 }[v];
      const q = H.q(base, ['estrategia'], ['seo']);
      const occ = Math.round(25 + q * 55);
      const F = [];
      if (v === 'xarxes') F.push([false, 'Els seguidors són de Barcelona: no vénen a dinar un dilluns a Tona.']);
      if (v === 'local' || v === 'prova') { F.push([true, 'El menú de migdia respon a una necessitat real dels treballadors del polígon.']); F.push([S.f.r_fitxa || null, S.f.r_fitxa ? 'La fitxa amb menú i botó de reserva converteix cerques en reserves.' : 'La fitxa millorada ajuda, tot i que no l\'havies revisat a fons.']); }
      if (S.f.r_reserves && v !== 'xarxes' && v !== 'desc') F.push([true, 'Les reserves en línia eviten perdre clients quan ningú no pot agafar el telèfon.']);
      if (v === 'desc') F.push([false, 'El descompte omple taules, però amb el 50 % cada menú deixa pèrdues.']);
      if (v === 'prova') F.push([true, 'La prova amb mesura per canal permet saber què funciona abans d\'invertir més.']);
      const marge = v === 'desc' ? -2.5 : 6;
      const verdict = v === 'desc' ? 'mid' : occ >= 55 ? 'good' : occ >= 40 ? 'mid' : 'bad';
      return {
        title: 'Dilluns i dimarts a Can Jordi',
        metrics: [['Ocupació (dl i dt)', occ + ' %', verdict], ['Abans', '25 %'], ['Marge per menú', H.eur(marge), marge < 0 ? 'bad' : 'good'], ['Reserves en línia', v === 'xarxes' || v === 'desc' ? '—' : String(Math.round(occ * 0.6))]],
        summary: verdict === 'good' ? 'Els dilluns han deixat de semblar un museu.' : v === 'desc' ? 'Taules plenes... però perdent diners amb cada taula.' : 'Poca millora: no s\'ha atacat el motiu real.',
        verdict, factors: F,
        fx: { rep: verdict === 'good' ? 6 : verdict === 'mid' ? 2 : 0, know: { seo: 1 }, flags: { jordiResult: verdict }, client: verdict === 'good' ? { id: 'jordi', name: 'Can Jordi (manteniment local)', fee: 300 } : null }
      };
    } },
    { t: 'dlg', lines: (S) => S.f.jordiResult === 'good' ? [['jordi.h', '{nom}, dilluns vam fer quaranta menús! Quaranta! Vull que porteu la fitxa i les ressenyes cada mes.']] :
      S.f.estr21 === 'desc' ? [['jordi.w', 'Ple de gent, sí... però a final de mes he perdut diners. No ho podem mantenir.'], ['pau.t', 'Lliçó apresa: omplir no és el mateix que guanyar.']] :
        [['jordi.n', 'Ha anat una mica millor, però no gaire. Ja veurem.']] },
    { t: 'reward', money: 600 }
  ]
});

CH('2.2', {
  title: 'La fàbrica de Miquel', who: 'miquel', bg: 'fabrica', weeks: 3,
  blurb: 'Una empresa industrial que no vol seguidors: vol compradors.',
  steps: [
    { t: 'fx', silent: true, fx: { flags: { met_miquel: true } } },
    { t: 'dlg', lines: [
      ['', 'Mecanitzats Bellmunt, polígon de Gurb. Soroll de màquines i olor d\'oli.'],
      ['miquel.n', 'Miquel Bellmunt. Tercera generació. Fem components de precisió per a maquinària.'],
      ['miquel.t', 'El web el va fer el meu nebot el 2011. Els comercials viuen de les fires i dels contactes de sempre.'],
      ['miquel.a', 'I t\'aviso: no vull seguidors ni m\'agrades. Vull que em truquin compradors d\'empreses que necessiten peces.']
    ] },
    { t: 'choice', who: 'miquel', prompt: 'Què li preguntes primer?', opts: [
      { t: 'Quantes visites té la web?', say: [['miquel.t', 'Ni idea. Algunes, suposo.']] },
      { t: 'Qui és el vostre client ideal i qui decideix la compra?', fx: { trust: { miquel: 1 } }, say: [['miquel.n', 'Bona pregunta. Ara t\'ho explico.']] },
      { t: 'Quant val per a vosaltres un client nou al llarg d\'un any?', req: { skill: 'comercial', min: 2 }, fx: { trust: { miquel: 2 }, flags: { m_valor: true } }, say: [['miquel.h', 'Vaja, tu parles el meu idioma. Uns 25.000 € de facturació l\'any, amb un 20 % de marge.']] }
    ] },
    { t: 'dlg', lines: [
      ['miquel.n', 'El client ideal: fabricants de maquinària agrícola i alimentària de Catalunya i l\'Aragó.'],
      ['miquel.t', 'Decideixen els enginyers de producte i els responsables de compres. I no compren d\'un dia per l\'altre: de tres a sis mesos.']
    ] },
    { t: 'lesson', id: 'L_b2b' },
    { t: 'lesson', id: 'L_seo' },
    { t: 'choice', key: 'estr22', prompt: 'Quin pla presentes a Miquel?', sub: 'Pressupost de campanya: 3.000 € en 3 mesos (diners del client).', opts: [
      { t: 'Campanya a Instagram i Facebook per guanyar notorietat i seguidors.', v: 'notorietat' },
      { t: 'Pàgines per família de producte amb fitxes tècniques descarregables, SEO industrial i LinkedIn segmentat a compres i enginyeria.', v: 'b2b', fx: { xp: 25 } },
      { t: 'Anuncis massius a Google per a «peces metàl·liques».', v: 'massiu' }
    ] },
    { t: 'choice', key: 'qual22', prompt: 'Com definiu un contacte qualificat amb l\'equip comercial?', opts: [
      { t: 'Qualsevol persona que deixi el correu.', v: 0 },
      { t: 'Empresa del sector objectiu, amb una necessitat concreta i volum mínim. El comercial truca en menys de 24 h.', v: 1, fx: { trust: { miquel: 1 }, xp: 20 } },
      { t: 'Ja ho decidiran els comercials.', v: 0 }
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
      if (v === 'b2b') F.push([true, 'Les fitxes tècniques responen el que busquen els enginyers.']);
      if (v === 'notorietat') F.push([false, 'Els seguidors d\'Instagram no són compradors industrials.']);
      if (v === 'massiu') F.push([false, 'Molts clics de particulars i estudiants: volum alt, qualitat baixa.']);
      F.push([!!qual, qual ? 'Haver definit què és un contacte qualificat ha permès als comercials prioritzar.' : 'Sense criteri de qualificació, els comercials han perdut temps amb contactes inútils.']);
      if (S.f.m_valor && cac) F.push([true, `Saps que un client val ~5.000 € de marge l\'any: un CAC de ${H.eur(cac)} és ${cac < 5000 ? 'molt rendible' : 'massa alt'}.`]);
      return {
        title: 'Captació B2B · 3 mesos',
        metrics: [['Contactes', String(leads)], ['Qualificats', String(ql), ql >= 10 ? 'good' : ''], ['Oportunitats', String(opp)], ['Clients nous', String(clients), verdict], ['Cost per contacte', H.eur(3000 / Math.max(1, leads))], ['CAC', cac ? H.eur(cac) : '—']],
        summary: verdict === 'good' ? 'Miquel té comandes noves de clients que no coneixia.' : verdict === 'mid' ? 'Algun client nou, però l\'embut es pot millorar molt.' : 'Molts números, cap comanda.',
        verdict, factors: F,
        fx: { rep: verdict === 'good' ? 7 : verdict === 'mid' ? 3 : -1, trust: { miquel: verdict === 'good' ? 3 : verdict === 'mid' ? 1 : -2 }, know: { creixement: 1 }, flags: { miquelResult: verdict }, client: verdict !== 'bad' ? { id: 'miquel', name: 'Mecanitzats Bellmunt (B2B)', fee: verdict === 'good' ? 900 : 600 } : null, log: `Projecte B2B per a Miquel: ${clients} clients nous.`, key: verdict === 'good' }
      };
    } },
    { t: 'dlg', lines: (S) => S.f.miquelResult === 'good' ? [['miquel.h', 'Tres empreses noves a la cartera. Això són diners de debò, {nom}. Continuem treballant junts.']] :
      S.f.miquelResult === 'mid' ? [['miquel.n', 'No està malament. Però vull més qualitat i menys soroll. Continuem uns mesos a veure.']] :
        [['miquel.a', 'Si em portes un informe de m\'agrades, no cal que tornis. Els números que importen són comandes.'], ['pau.w', 'Entesos, Miquel. He après la lliçó.']] },
    { t: 'reward', money: 1800 }
  ]
});

CH('2.3', {
  title: 'La botiga que vol vendre a tot Catalunya', who: 'nuria', bg: 'botiga', weeks: 3,
  blurb: 'Una cansaladeria del Mercadal vol una botiga en línia. «Només una web amb fotos», diu.',
  steps: [
    { t: 'dlg', lines: [
      ['nuria.h', 'Hola! Núria, de la Cansaladeria Núria, al Mercadal. El fuet de Vic de tota la vida.'],
      ['nuria.n', 'Els clients que se\'n van a viure a Barcelona o a Girona em diuen que el troben a faltar. Vull vendre per internet!'],
      ['nuria.t', 'Només necessito una web bonica amb fotos, oi? I ja està.'],
      ['pau.t', '(Una botiga en línia de productes que s\'han de conservar en fred... això no és «només una web».)']
    ] },
    { t: 'lesson', id: 'L_ecom' },
    { t: 'choice', key: 'estr23', prompt: 'Què prioritzes en el projecte?', opts: [
      { t: 'Una web espectacular: vídeo a pantalla completa, animacions i música.', v: 'bonica' },
      { t: 'Fitxes clares (pes, conservació, al·lèrgens), enviament refrigerat visible des del principi, compra sense registre i pagament amb targeta i Bizum.', v: 'usable', fx: { xp: 25 } },
      { t: 'No fer web: vendre només en un gran marketplace.', v: 'market' }
    ] },
    { t: 'multi', key: 'abandon', pick: 3, prompt: 'Prova amb 10 usuaris abans del llançament. Què els fa abandonar el carretó?', info: tbl([
      ['Usuaris que afegeixen producte', '9 de 10'], ['Usuaris que acaben la compra', '3 de 10'], ['Comentari més repetit', '«No sabia que l\'enviament costava 9,90 €»'],
      ['Al mòbil', 'La pàgina de pagament tarda 7 segons'], ['Al pas 2', 'Cal crear un compte amb contrasenya']
    ]), opts: [
      { t: 'El cost d\'enviament apareix per sorpresa al final', ok: true, why: 'Mostra\'l a la fitxa i ofereix enviament gratuït a partir d\'un import.' },
      { t: 'La pàgina de pagament és lenta al mòbil', ok: true, why: 'La majoria de compres es fan des del mòbil.' },
      { t: 'L\'obligació de crear un compte', ok: true, why: 'Permet comprar com a convidat.' },
      { t: 'El fuet és massa barat', ok: false, why: 'Cap usuari no ho ha mencionat.' },
      { t: 'Hi ha massa informació a la fitxa', ok: false, why: 'Al contrari: la informació dona confiança.' },
      { t: 'El logo és antic', ok: false, why: 'No afecta el procés de compra.' }
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
      if (v === 'bonica') F.push([false, 'El vídeo a pantalla completa fa que la web trigui molt al mòbil.']);
      if (v === 'usable') F.push([true, 'Les fitxes responen els dubtes clau: conservació, pes i data d\'entrega.']);
      if (v === 'market') F.push([null, 'El marketplace porta més visites, però les comissions es mengen el marge i la marca queda diluïda.']);
      F.push([g >= 3, g >= 3 ? 'Has corregit els tres motius d\'abandonament abans del llançament.' : `Has detectat ${g} dels 3 motius d\'abandonament.`]);
      return {
        title: 'Primer trimestre de la botiga en línia',
        metrics: [['Visites', visits.toLocaleString('ca-ES')], ['Conversió', H.pct(conv), verdict], ['Comandes', String(orders)], ['Tiquet mitjà', H.eur(ticket)], ['Marge per comanda', H.eur(margin)], ['Marge total', H.eur(orders * margin)]],
        summary: verdict === 'good' ? 'El fuet de la Núria ja arriba a tot Catalunya.' : verdict === 'mid' ? 'Ven, però encara hi ha fricció al procés de compra.' : 'La web és bonica, però ven poc.',
        verdict, factors: F,
        fx: { rep: verdict === 'good' ? 6 : verdict === 'mid' ? 3 : 0, know: { web: 1 }, flags: { met_nuria: true, nuriaResult: verdict }, client: verdict !== 'bad' ? { id: 'nuria', name: 'Cansaladeria Núria (botiga en línia)', fee: 600 } : null }
      };
    } },
    { t: 'dlg', lines: (S) => S.f.nuriaResult === 'good' ? [['nuria.h', '{nom}! M\'ha arribat una comanda de Tarragona i una altra de Figueres! El fuet de Vic, a tot arreu!']] : [['nuria.n', 'Va venent... però esperava més. Ho anirem millorant?'], ['pau.n', 'Sí. Ara tenim dades per saber on millorar.']] },
    { t: 'reward', money: 1500 }
  ]
});

CH('2.4', {
  title: 'El client que només mira els seguidors', who: 'sergi', bg: 'despatx', weeks: 2,
  blurb: '8.000 seguidors nous. Quantes vendes? Ni idea.',
  steps: [
    { t: 'dlg', lines: [
      ['sergi.h', '{nom}, sóc el Sergi, de Cim Trail. Roba de muntanya feta a Osona. Necessito que em portis les xarxes.'],
      ['sergi.h', 'L\'última campanya va ser un èxit brutal: 8.000 seguidors nous en un mes!'],
      ['pau.n', 'Felicitats! I quantes vendes va generar?'],
      ['sergi.s', '...'],
      ['sergi.t', 'Doncs no ho sé. Però 8.000 seguidors són molts, no?']
    ] },
    { t: 'lesson', id: 'L_xarxes' },
    { t: 'lesson', id: 'L_kpi' },
    { t: 'multi', key: 'dades24', pick: 3, prompt: 'Quines dades necessites per saber si va ser un èxit?', opts: [
      { t: 'Vendes en línia del període comparades amb l\'any anterior', ok: true, why: 'Resultat comercial amb punt de comparació (estacionalitat).' },
      { t: 'Visites a la web des d\'Instagram, amb enllaços etiquetats', ok: true, why: 'Resultat de màrqueting atribuïble a la campanya.' },
      { t: 'Perfil dels nous seguidors: ubicació i interessos', ok: true, why: 'Diu si són públic objectiu o caçadors de premis.' },
      { t: 'Nombre total de m\'agrada', ok: false, why: 'Mètrica de vanitat.' },
      { t: 'Abast de les publicacions', ok: false, why: 'Activitat i visibilitat, no resultat.' },
      { t: 'Nombre de publicacions fetes', ok: false, why: 'És activitat, no resultat.' }
    ], fx: (S, g) => ({ xp: g * 12 }) },
    { t: 'dlg', lines: [
      ['', '{En} demana accés a l\'analítica i a la botiga en línia. Tres dies després...'],
      ['pau.t', 'Dades: el 72 % dels nous seguidors són de fora de l\'Estat i van entrar pel sorteig d\'un mòbil.'],
      ['pau.t', 'Visites des d\'Instagram: 640. Vendes atribuïbles: 9. Vendes totals del mes: igual que l\'any passat.'],
      ['pau.w', 'Com li dic això al Sergi?']
    ] },
    { t: 'choice', key: 'informe24', prompt: 'Com presentes l\'informe?', opts: [
      { t: 'Informe honest: separar activitat, resultats de màrqueting i resultats comercials, i proposar un pla per vendre.', v: 'honest', fx: { rep: 4, xp: 20, client: { id: 'sergi', name: 'Cim Trail (xarxes i analítica)', fee: 400 }, log: 'Va presentar un informe honest al Sergi tot i que les dades no l\'afavorien.', key: true }, say: [['sergi.w', 'Vaja... Em sap greu, però prefereixo saber la veritat. Fem-ho bé aquesta vegada.']] },
      { t: 'Felicitar-lo: el client està content i paga.', v: 'fals', fx: { rep: -3, client: { id: 'sergi', name: 'Cim Trail (xarxes)', fee: 400 }, flags: { sergiEngany: true }, log: 'Va evitar explicar al Sergi que la campanya no havia generat vendes.', key: true }, say: [['sergi.h', 'Ho sabia! Continuem així!'], ['pau.w', '(Algun dia se n\'adonarà...)']] },
      { t: 'Informe honest + prova: campanya a públic semblant als compradors amb un codi de descompte propi.', v: 'prova', req: { skill: 'analitica', min: 2 }, fx: { rep: 6, xp: 40, client: { id: 'sergi', name: 'Cim Trail (xarxes i analítica)', fee: 500 }, log: 'Va proposar al Sergi una prova mesurable amb codi de descompte.', key: true }, say: [['sergi.h', 'Això és el que necessitava: saber de veritat què funciona. Endavant!']] }
    ] },
    { t: 'fx', silent: true, fx: { flags: { met_sergi: true, moduloAnalitica: true }, know: { analitica: 1 } } },
    { t: 'dlg', lines: [['pau.h', 'He desbloquejat una manera nova de treballar: quadres de comandament i conversions ben definides. A partir d\'ara, tot es mesurarà.']] },
    { t: 'reward', money: 700 }
  ]
});

CH('2.5', {
  title: 'La primera recomanació', who: 'carme', bg: 'vic', weeks: 2,
  blurb: 'Les recomanacions arriben. Saps dir que no?',
  steps: [
    { t: 'dlg', lines: (S) => {
      const L = [['', 'Mercat de dissabte. {En} compra pa al forn de la Carme.']];
      if (S.trust.carme >= 2) L.push(['carme.h', '{nom}! La Pilar de la cafeteria del costat vol que l\'ajudis. I el meu cunyat té una ferreteria a Manlleu.']);
      else L.push(['carme.n', 'Ei, {nom}. La Pilar de la cafeteria m\'ha preguntat per tu. Li he dit que vas fer una feina... correcta.']);
      if (S.trust.miquel >= 2) L.push(['', 'Al vespre, un correu de Miquel: «Et presento el meu proveïdor d\'acer. Necessita ajuda amb la web.»']);
      L.push(['', 'A més, arriben dos encàrrecs més pel formulari de la web. De cop, {en} té més feina de la que pot fer.']);
      L.push(['pau.w', 'Si ho accepto tot, no dormiré en tres mesos. Si no, potser no tornen a trucar...']);
      return L;
    } },
    { t: 'choice', key: 'recom', prompt: 'Què fas amb tots els encàrrecs?', opts: [
      { t: 'Acceptar-ho tot: és el moment de fer diners.', v: 'tot', fx: { money: 1400, rep: -3, flags: { sobrecarrega: 1 }, log: 'Va acceptar tots els encàrrecs tot i no tenir capacitat.', key: true }, say: [['', 'Tres setmanes de nits sense dormir. Dues entregues arriben tard i una amb errors.'], ['pau.w', 'He guanyat diners... però he perdut qualitat. I la gent ho nota.']] },
      { t: 'Acceptar els que encaixen amb la meva especialitat i capacitat; derivar o ajornar la resta amb una data clara.', v: 'filtre', fx: (S) => ({ money: 800, rep: 4, trust: { carme: S.trust.carme >= 2 ? 1 : 0, miquel: S.trust.miquel >= 2 ? 1 : 0 }, log: 'Va acceptar només els encàrrecs que podia fer bé.', key: true }), say: [['pau.h', 'Menys diners ara, però feina ben feta. I els que he ajornat m\'esperen.']] },
      { t: 'No acceptar-ne cap més fins a tenir equip.', v: 'cap', fx: { trust: { carme: -1, miquel: -1 }, log: 'Va rebutjar totes les recomanacions.' }, say: [['carme.w', 'Ah... bé. La Pilar buscarà algú altre, doncs.']] }
    ] },
    { t: 'fx', silent: true, fx: (S) => S.trust.carme >= 3 ? { client: { id: 'carme', name: 'Forn de la Carme (manteniment)', fee: 150 } } : null },
    { t: 'dlg', lines: (S) => [
      ...(S.trust.carme >= 3 ? [['carme.h', 'I a mi porta\'m la fitxa i les ressenyes cada mes, eh. Et pagaré, no pateixis.']] : []),
      ['pau.n', 'L\'agència ja té clients de sectors diferents: un forn, un restaurant, una fàbrica, una botiga en línia...'],
      ['pau.t', 'I començo a entendre que decidir què accepto i què no és tan important com saber fer anuncis.']
    ] }
  ]
});
