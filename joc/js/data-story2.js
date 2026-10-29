/* Agència Digital — guió de les etapes 3, 4 i 5 */
(function () {
  const CH = (id, o) => { GD.chapters[id] = Object.assign({ id, stage: +id.split('.')[0] }, o); };
  const tbl = GD.tbl;
  const recurring = (S) => S.clients.reduce((a, c) => a + c.fee, 0);
  const has = (S, id) => S.clients.some(c => c.id === id);

  /* ============================================================
     ETAPA 3 — LA FIRA DE LES OPORTUNITATS
     ============================================================ */
  CH('3.1', {
    title: 'Una invitació inesperada', who: 'pau', bg: 'fira', weeks: 2,
    blurb: 'Una fira empresarial: oportunitats, costos i competència.',
    steps: [
      { t: 'dlg', bg: 'despatx', lines: [
        ['', 'Un sobre amb el logotip de la Fira Empresa Osona. «Us convidem a participar-hi com a expositors.»'],
        ['pau.t', 'Un estand costa 600 €. Més dos dies sense fer feina de clients. Però hi haurà centenars d\'empreses...']
      ] },
      { t: 'choice', key: 'fira', prompt: 'Com participes a la fira?', opts: [
        { t: 'Llogar un estand (600 €)', d: 'Més visibilitat i més contactes, però més cost.', v: 'estand', fx: { money: -600 } },
        { t: 'Anar-hi com a visitant i fer contactes', d: 'Gratuït. Menys visibilitat.', v: 'visitant' },
        { t: 'Oferir una xerrada gratuïta sobre màrqueting local (100 € de materials)', d: 'Et posiciona com a expert.', v: 'xerrada', req: { skill: 'comercial', min: 2 }, fx: { money: -100, rep: 3 } }
      ] },
      { t: 'lesson', id: 'L_prospeccio' },
      { t: 'dlg', bg: 'fira', lines: (S) => [
        ['', 'Fira Empresa Osona. Cafès, targetes, bosses de paper i molta conversa.'],
        ...(S.f.fira === 'xerrada' ? [['', 'La xerrada «Com omplir les tardes d\'un forn amb 300 €» omple la sala. Hi ha preguntes durant mitja hora.']] : []),
        ['pau.n', 'Al final del dia tinc una pila de targetes. No puc trucar a tothom demà. A qui prioritzo?']
      ] },
      { t: 'multi', key: 'leads31', pick: 3, prompt: 'Tria els 3 contactes a qui faràs seguiment primer', opts: [
        { id: 'marta', t: 'Marta, directora de màrqueting d\'una empresa làctia: «Busquem agència per a un llançament al gener. Tenim pressupost aprovat.»', ok: true, why: 'Necessitat, pressupost, termini i capacitat de decisió.' },
        { t: 'Un estudiant que vol fer pràctiques', ok: false, why: 'Pot ser interessant en un futur, però no és un client.' },
        { id: 'optica', t: 'Gerent de 4 òptiques: «Les botigues de Manlleu i Torelló venen poc. Decidim jo i el meu soci.»', ok: true, why: 'Problema concret i accés directe a qui decideix.' },
        { t: 'Algú que només volia el bolígraf de regal', ok: false, why: 'Cap senyal d\'interès real.' },
        { id: 'coop', t: 'Responsable d\'una cooperativa agrícola: «Necessitem botiga en línia abans de Nadal.»', ok: true, why: 'Urgència i necessitat clara.' },
        { t: 'Un comercial que et vol vendre un programari', ok: false, why: 'Ell vol vendre\'t a tu.' },
        { t: 'Una empresa «interessada en general», sense cap problema ni termini', ok: false, why: 'Sense necessitat ni urgència, el cicle serà llarg i incert.' }
      ], fx: (S, g) => ({ xp: g * 12 }) },
      { t: 'sim', calc: (S, H) => {
        const g = (S.f.leads31 || {}).good || 0;
        const mult = { estand: 1.4, visitant: 0.8, xerrada: 1.3 }[S.f.fira] || 1;
        const contacts = Math.round(({ estand: 46, visitant: 18, xerrada: 38 }[S.f.fira] || 20));
        const meetings = Math.round(g * 2 * mult * (1 + 0.08 * H.sk('comercial')));
        const clients = Math.max(0, Math.round(meetings * 0.35 + (g === 3 ? 0.5 : 0)));
        const marge = clients * 900;
        const cost = { estand: 600, visitant: 0, xerrada: 100 }[S.f.fira] + 400;
        const roi = Math.round((marge - cost) / cost * 100);
        const verdict = clients >= 2 ? 'good' : clients >= 1 ? 'mid' : 'bad';
        return {
          title: 'Retorn de la fira',
          metrics: [['Contactes', String(contacts)], ['Reunions', String(meetings)], ['Projectes nous', String(clients), verdict], ['Marge estimat', H.eur(marge)], ['Cost (inclou temps)', H.eur(cost)], ['Retorn', roi + ' %', roi > 0 ? 'good' : 'bad']],
          summary: verdict === 'good' ? 'La fira ha valgut la pena.' : verdict === 'mid' ? 'Un projecte nou: just per cobrir costos.' : 'Molts cafès, poques oportunitats.',
          verdict,
          factors: [[g >= 2, g >= 2 ? 'Has prioritzat contactes amb necessitat, pressupost i urgència.' : 'Has perdut temps amb contactes sense potencial.'], [S.f.fira !== 'visitant' || null, S.f.fira === 'estand' ? 'L\'estand ha atret més visites.' : S.f.fira === 'xerrada' ? 'La xerrada t\'ha posicionat com a expert.' : 'Com a visitant has fet menys contactes.'], [null, 'El temps dedicat a la fira també és un cost: l\'hem valorat en 400 €.']],
          fx: { money: marge, rep: verdict === 'good' ? 5 : 2, know: { direccio: 1 }, flags: { met_marta: ((S.f.leads31 || {}).ids || []).includes('marta') }, log: `A la fira va aconseguir ${clients} projectes nous.` }
        };
      } },
      { t: 'dlg', lines: [
        ['', 'Mentre recull l\'estand, en Pau veu una dona amb americana negra que parla amb tres empresaris alhora. Tothom l\'escolta.'],
        ['laia.n', 'Tu deus ser el de {agencia}. Laia Vidal, de Vidal & Co., Barcelona. He sentit parlar del forn.'],
        ['laia.t', 'Demà presentem una proposta a la cooperativa agrícola. Suposo que tu també. Que guanyi el millor.']
      ] },
      { t: 'fx', silent: true, fx: { flags: { met_laia: true } } }
    ]
  });

  CH('3.2', {
    title: 'La competència de Barcelona', who: 'laia', bg: 'fira', weeks: 1,
    blurb: 'No pots competir en tot alhora. On et diferencies?',
    steps: [
      { t: 'dlg', lines: [
        ['', 'Sala de reunions de la cooperativa. La Laia ha presentat abans: quaranta diapositives, vídeos i un equip de cinc persones.'],
        ['laia.n', 'Nosaltres tenim especialistes en tot: SEO, publicitat, vídeo, comerç electrònic. I clients a tot l\'Estat.'],
        ['pau.w', '(Jo tinc un portàtil i... ganes. Com competeixo amb això?)']
      ] },
      { t: 'lesson', id: 'L_posicionament' },
      { t: 'choice', key: 'posic', prompt: 'Com et diferencies davant la cooperativa?', opts: [
        { t: 'Coneixement local i servei proper: «Coneixem Osona, venim a la cooperativa i responem el mateix dia.»', v: 'local', fx: { money: 1200, fee: true, rep: 3, trust: { laia: 1 }, log: 'Es va diferenciar per coneixement local i proximitat.', key: true } },
        { t: 'Especialització tècnica: analítica i resultats mesurables setmana a setmana.', v: 'tecnic', fx: (S) => S.skills.analitica >= 2 ? { money: 1200, fee: true, rep: 3, trust: { laia: 1 }, log: 'Es va diferenciar per rigor analític.', key: true } : { rep: 1, trust: { laia: 1 }, flags: { perdutCoop: true } } },
        { t: 'Preu: fer-ho per la meitat que la Laia.', v: 'preu', fx: { money: 600, fee: true, rep: -1, flags: { preuBaix: true }, log: 'Va guanyar un projecte competint en preu.' } },
        { t: 'Prometre el que la Laia no s\'atreveix: «Doblarem les vendes en un mes.»', v: 'promesa', fx: { money: 1200, fee: true, trust: { laia: -2 }, flags: { promesa: true }, log: 'Va prometre doblar les vendes de la cooperativa en un mes.', key: true } }
      ] },
      { t: 'dlg', lines: (S) => {
        const v = S.f.posic;
        if (v === 'local') return [['', 'La cooperativa tria {agencia}. «Volem algú que conegui el territori i que puguem trucar.»'], ['laia.h', 'Ben jugat. Escolta: hi ha projectes on necessitaria algú d\'aquí. Si mai vols col·laborar, truca\'m.'], ['pau.h', 'Ho tindré en compte, Laia.']];
        if (v === 'tecnic' && S.skills.analitica >= 2) return [['', 'La cooperativa tria {agencia}: el pla de mesura setmanal els ha convençut.'], ['laia.t', 'Interessant. Tens un perfil més tècnic del que em pensava. Potser algun dia col·laborarem.']];
        if (v === 'tecnic') return [['', 'La cooperativa tria Vidal & Co. «La proposta tècnica era bona, però no ens ha quedat clar com ho faríeu.»'], ['pau.w', 'Em falta solidesa analítica per defensar-ho. Ho he d\'aprendre millor.'], ['laia.n', 'No t\'ho prenguis malament. Has fet una bona presentació.']];
        if (v === 'preu') return [['', 'La cooperativa tria {agencia}... pel preu.'], ['laia.t', 'Si competeixes en preu, sempre hi haurà algú més barat. Fins i tot nosaltres, si volem.'], ['pau.w', '(Guanyo el projecte, però amb aquest preu gairebé no hi guanyo res.)']];
        return [['', 'La cooperativa tria {agencia}: la promesa els ha enlluernat.'], ['laia.a', 'Doblar les vendes en un mes? Això és irresponsable. Quan no ho aconsegueixis, el sector sencer en pagarà les conseqüències.'], ['pau.w', '(Potser m\'he passat...)']];
      } },
      { t: 'fx', silent: true, fx: (S) => (S.f.posic === 'local' || (S.f.posic === 'tecnic' && S.skills.analitica >= 2)) ? { flags: { laiaAliada: true } } : null }
    ]
  });

  CH('3.3', {
    title: 'El contracte de Quim', who: 'quim', bg: 'despatx', weeks: 2,
    blurb: 'Un contracte atractiu amb una petició poc concreta: «Tot el digital».',
    steps: [
      { t: 'fx', silent: true, fx: { flags: { met_quim: true } } },
      { t: 'dlg', lines: [
        ['quim.h', 'Pau, nano! Quim Soler, de Soler Motor. Cotxes de segona mà i recanvis, tres naus a Manlleu.'],
        ['quim.n', 'Vull que porteu tot el digital. Tot. Web, xarxes, anuncis, vídeos, correus... el que calgui.'],
        ['quim.h', 'Et pago 1.500 € al mes. Comences demà. I si de cas sorgeix alguna coseta més, ja t\'ho aniré dient.'],
        ['pau.t', '(«Tot» i «alguna coseta més»... Això fa olor de problema.)']
      ] },
      { t: 'lesson', id: 'L_pressupost' },
      { t: 'choice', key: 'quimContracte', who: 'quim', prompt: 'Com respons a la proposta de Quim?', info: tbl([
        ['Quota proposada', '1.500 €/mes'], ['«Tot el digital», estimació', '≈ 70 h/mes'], ['Cost intern per hora', '25 €'], ['Cost estimat', '1.750 €/mes'], ['Marge brut', '<b class="neg">−17 %</b>']
      ]), opts: [
        { t: 'Acceptar tal com està: 1.500 €/mes per «tot el digital».', v: 'mal', fx: { client: { id: 'quim', name: 'Soler Motor', fee: 1500 }, flags: { quimMal: true }, log: 'Va acceptar el contracte de Quim sense definir l\'abast.', key: true }, say: [['quim.h', 'Així m\'agrada! Demà t\'envio la primera llista.']] },
        { t: 'Negociar l\'abast: 4 serveis definits, 2 revisions per peça i 40 h/mes. El que surti d\'aquí, a part. 1.500 €/mes.', v: 'be', fx: { client: { id: 'quim', name: 'Soler Motor', fee: 1500 }, trust: { quim: 1 }, xp: 30, log: 'Va negociar un contracte amb abast clar amb Quim.', key: true }, say: [['quim.t', 'Ets dur negociant, eh? Va, d\'acord. Però que es noti la feina.']] },
        { t: 'Abast complet però a preu just: 2.400 €/mes amb tot detallat al contracte.', v: 'premium', req: { skill: 'comercial', min: 2 }, fx: { client: { id: 'quim', name: 'Soler Motor', fee: 2400 }, xp: 30, log: 'Va negociar amb Quim un preu adequat a l\'abast real.', key: true }, say: [['quim.s', '2.400? Uf...'], ['quim.n', 'Bé. Si tot està per escrit i ho compleixes, val la pena. Tracte fet.']] },
        { t: 'Rebutjar el contracte.', v: 'no', fx: { trust: { quim: -1 } }, say: [['quim.a', 'Tu t\'ho perds, nano.']] }
      ] },
      { t: 'dlg', lines: (S) => ({
        mal: [['', 'Al cap de dues setmanes, Quim ha demanat tres canvis de logo, un vídeo per a TikTok i «una web nova per a la nau de recanvis».'], ['pau.w', 'I tot entra dins dels 1.500 €... No, això no pot continuar així.']],
        be: [['', 'Quim demana un vídeo extra. En Pau li envia un pressupost a part. Quim protesta... i l\'accepta.'], ['pau.h', 'L\'abast ben definit és la millor protecció.']],
        premium: [['', 'Quim és exigent, però paga puntualment i ho té tot per escrit.'], ['pau.h', 'Preu just, client clar.']],
        no: [['pau.n', 'He perdut un client potencial, però hauria perdut diners treballant-hi.']]
      })[S.f.quimContracte] }
    ]
  });

  CH('3.4', {
    title: 'Tres clients, una setmana', who: 'nuria', bg: 'despatx:night', weeks: 1,
    blurb: 'Tot arriba alhora. Qualitat, termini, pressupost i satisfacció.',
    steps: [
      { t: 'dlg', lines: (S) => [
        ['', 'Dilluns, 8.15 h. Tres missatges alhora.'],
        ['nuria.w', 'Pau, la botiga en línia no deixa pagar amb targeta! Tinc comandes penjades!'],
        ['miquel.n', 'Pau, necessito la presentació per a la fira de Saragossa dijous. Sense falta.'],
        has(S, 'quim') ? ['quim.a', 'Vull cinc vídeos per divendres. Cinc. Tinc una promoció.'] : ['jordi.n', 'Pau, voldria la carta nova a la web abans del cap de setmana.'],
        ['pau.w', 'No hi ha prou hores a la setmana per a tot això.']
      ] },
      { t: 'lesson', id: 'L_planificacio' },
      { t: 'choice', key: 'pla34', prompt: 'Com organitzes la setmana?', opts: [
        { t: 'Fer-ho tot jo, treballant de nit.', v: 'nit', fx: { rep: -2, flags: { cansament: 1 }, log: 'Va intentar fer-ho tot sol treballant de nit.' }, say: [['', 'Tres nits sense dormir. La presentació de Miquel arriba amb dues errades a les xifres.'], ['miquel.a', 'Pau, aquesta xifra està malament. Davant del client, quedo fatal.'], ['pau.w', 'El cansament es paga.']] },
        { t: 'Prioritzar per urgència i impacte: primer el pagament de la Núria, després la presentació de Miquel; parlar amb el tercer per moure el termini i subcontractar el disseny.', v: 'prio', fx: (S) => ({ money: -250, rep: 3, xp: 30, trust: { miquel: 1, quim: S.f.quimMal ? -1 : 0 }, log: 'Va prioritzar per urgència i impacte i va comunicar els nous terminis.', key: true }), say: (S) => [['', 'Dilluns a migdia, la botiga de la Núria torna a cobrar. Dijous, la presentació de Miquel és impecable.'], S.f.quimMal ? ['quim.a', 'Com que dilluns? Jo vull els vídeos ara! Pago per «tot», no?'] : has(S, 'quim') ? ['quim.n', 'Està al contracte: dos vídeos al mes. La resta a part? Bé, d\'acord, per dilluns.'] : ['jordi.h', 'Cap problema, Pau. Gràcies per avisar.'], ['pau.h', 'Planificar i comunicar. Sembla fàcil, però marca la diferència.']] },
        { t: 'Ajornar el client més petit sense avisar.', v: 'amagar', fx: { rep: -3, trust: { carme: -1 }, log: 'Va ajornar un client sense avisar.' }, say: [['', 'El client petit s\'assabenta per la Carme que en Pau «estava massa ocupat».'], ['carme.w', 'Pau, la gent parla. Si no pots, digues-ho, home.']] }
      ] }
    ]
  });

  CH('3.5', {
    title: 'La primera gran decisió empresarial', who: 'pau', bg: 'despatx', weeks: 2,
    blurb: 'De sobreviure amb encàrrecs a dirigir un model de negoci.',
    steps: [
      { t: 'dlg', lines: (S) => [
        ['pau.t', `Repassem. Ingressos recurrents: ${recurring(S).toLocaleString('ca-ES')} € al mes. Liquiditat: ${Math.round(S.money).toLocaleString('ca-ES')} €.`],
        ['pau.t', 'La fira ha generat oportunitats. Però si continuo igual, no podré atendre-les totes. Què faig?']
      ] },
      { t: 'choice', key: 'decisio35', prompt: 'La primera gran decisió empresarial', sub: 'No hi ha una resposta universalment correcta.', opts: [
        { t: 'Continuar com a professional independent', d: 'Costos baixos, però capacitat limitada.', v: 'indep', fx: { flags: { equilibri: (1) }, log: 'Va decidir continuar com a professional independent.', key: true } },
        { t: 'Treballar amb col·laboradors puntuals', d: 'Capacitat flexible sense costos fixos.', v: 'freelance', fx: { flags: { xarxaFreelance: true }, log: 'Va crear una xarxa de col·laboradors puntuals.', key: true } },
        { t: 'Llogar un espai més gran (750 €/mes)', d: 'Preparat per créixer, però el lloguer es dobla.', v: 'espai', req: { money: 2500 }, fx: { rent: 750, rep: 2, log: 'Va llogar un despatx més gran.', key: true } },
        { t: 'Invertir en una eina de gestió i automatització (+120 €/mes)', d: 'Menys temps perdut en tasques repetitives.', v: 'eina', fx: (S) => ({ tools: S.tools + 120, flags: { eina: true }, log: 'Va invertir en eines de gestió i automatització.', key: true }) },
        { t: 'Especialitzar-se en un sector descobert', d: 'Més fàcil de recomanar i de vendre.', v: 'espec', fx: { rep: 3, flags: { especialitzat: true }, log: 'Va decidir especialitzar l\'agència en un sector.', key: true } }
      ] },
      { t: 'dlg', lines: (S) => ({
        indep: [['pau.n', 'Petit, però meu. Triaré bé els projectes.']],
        freelance: [['pau.h', 'Una dissenyadora de Manlleu i un programador de Torelló. Equip a demanda.']],
        espai: [['', 'Un despatx nou a la Rambla, amb dues taules més i una sala de reunions.'], ['pau.h', 'Ara cal omplir-lo.']],
        eina: [['pau.h', 'Tauler de tasques, plantilles i informes automàtics. Recupero unes quantes hores cada setmana.']],
        espec: [['pau.h', 'Comerç i indústria d\'Osona. Això és el que sé fer millor.']]
      })[S.f.decisio35] }
    ]
  });

  /* ============================================================
     ETAPA 4 — JA NO POTS FER-HO TOT SOL
     ============================================================ */
  CH('4.1', {
    title: 'La primera contractació', who: 'julia', bg: 'despatx', weeks: 2,
    blurb: 'Vendes, estratègia, publicitat, informes, administració... i un sol Pau.',
    steps: [
      { t: 'fx', silent: true, fx: { flags: { met_julia: true } } },
      { t: 'dlg', lines: [
        ['', 'Una cafeteria del carrer de la Riera. En Pau ha quedat amb una candidata que li ha recomanat Miquel.'],
        ['julia.n', 'Júlia Serra. Analista de dades. Cinc anys en una consultora de Barcelona. Vull tornar a viure a Osona.'],
        ['julia.t', 'Abans de parlar de sou: ensenya\'m les dades de l\'agència. Com mesureu els resultats?'],
        ['pau.s', '(Està entrevistant-me ella a mi?)']
      ] },
      { t: 'choice', who: 'julia', prompt: 'Què li ensenyes a la Júlia?', opts: [
        { t: 'Els informes dels clients amb els KPI que vam definir.', fx: (S) => ({ trust: { julia: S.f.mesura ? 2 : 1 } }), say: (S) => [S.f.mesura ? ['julia.h', 'Cupons bescanviats, vendes per franja... Això és mesurar de debò. M\'agrada.'] : ['julia.t', 'Hi ha coses bones, però falta rigor en alguns informes. Hi puc ajudar.']] },
        { t: 'El nombre de seguidors de tots els clients.', fx: { trust: { julia: -1 } }, say: [['julia.a', 'Seguidors? Això no és una dada de negoci.']] }
      ] },
      { t: 'lesson', id: 'L_contractar' },
      { t: 'choice', key: 'hire41', prompt: 'Com incorpores la Júlia?', info: (S) => tbl([['Ingressos recurrents', recurring(S).toLocaleString('ca-ES') + ' €/mes'], ['Liquiditat', Math.round(S.money).toLocaleString('ca-ES') + ' €'], ['Cost total jornada completa', '2.500 €/mes'], ['Cost total mitja jornada', '1.250 €/mes']]), opts: [
        { t: 'Contractar-la a jornada completa (2.500 €/mes)', d: 'Màxima capacitat analítica i més temps per vendre.', v: 'full', req: { label: 'Necessites ≥ 1.800 €/mes recurrents o 8.000 € de caixa', fn: 1 }, fx: { hire: { id: 'julia', name: 'Júlia Serra (analista)', salary: 2500 }, trust: { julia: 2 }, log: 'Va contractar la Júlia a jornada completa.', key: true }, say: [['julia.h', 'Dilluns començo. Porta cafè.']] },
        { t: 'Contractar-la a mitja jornada (1.250 €/mes)', v: 'mitja', fx: { hire: { id: 'julia', name: 'Júlia Serra (analista, mitja jornada)', salary: 1250 }, trust: { julia: 1 }, log: 'Va contractar la Júlia a mitja jornada.', key: true }, say: [['julia.n', 'D\'acord. La resta del temps faré projectes propis. Ja veurem com evoluciona.']] },
        { t: 'Col·laboració per projecte, sense cost fix', v: 'projecte', fx: { flags: { juliaFree: true }, log: 'Va proposar a la Júlia col·laborar per projecte.' }, say: [['julia.t', 'Entenc el risc. Però així no puc comprometre\'m al cent per cent.']] }
      ] }
    ]
  });
  // Requisit de contractació a jornada completa
  GD.chapters['4.1'].steps[4].opts[0].req = (S) => recurring(S) >= 1800 || S.money >= 8000;
  GD.chapters['4.1'].steps[4].opts[0].req.label = 'Necessites ≥ 1.800 €/mes recurrents o 8.000 € de caixa';

  CH('4.2', {
    title: 'Arriba la Berta', who: 'berta', bg: 'despatx', weeks: 2,
    blurb: 'Creativitat i continguts de manera regular. Però amb quin procés?',
    steps: [
      { t: 'fx', silent: true, fx: { flags: { met_berta: true } } },
      { t: 'dlg', lines: [
        ['berta.h', 'Hola! Berta Puig, directora creativa. Abans era en una agència de publicitat de Barcelona. M\'encanta el que feu!'],
        ['berta.h', 'Per a la fàbrica de Miquel tinc una idea: un vídeo poètic de les màquines al capvespre, amb música de piano i cap paraula.'],
        ['pau.t', '(És preciós... però els compradors industrials volen saber terminis i toleràncies.)']
      ] },
      { t: 'choice', key: 'hire42', prompt: 'Com incorpores la Berta?', opts: [
        { t: 'A l\'equip, a jornada completa (2.300 €/mes)', v: 'full', fx: { hire: { id: 'berta', name: 'Berta Puig (directora creativa)', salary: 2300 }, trust: { berta: 2 }, log: 'Va incorporar la Berta a l\'equip.', key: true } },
        { t: 'Col·laboració per projecte', v: 'projecte', fx: { flags: { bertaFree: true }, trust: { berta: 0 } } }
      ] },
      { t: 'lesson', id: 'L_brief' },
      { t: 'choice', key: 'brief42', prompt: 'Com treballareu les campanyes creatives?', opts: [
        { t: 'Les decisions creatives les prenc jo, sempre.', v: 'centralitza', fx: { trust: { berta: -2 } }, say: [['berta.w', 'Doncs... per què m\'has contractat?']] },
        { t: 'Brief per a cada campanya (objectiu, públic, missatge, formats i criteri d\'èxit) i proves A/B quan hi hagi dubtes.', v: 'brief', fx: { trust: { berta: 2 }, xp: 30 }, say: [['berta.t', 'Mmm. Un marc clar... i dins del marc, llibertat. M\'agrada.']] },
        { t: 'Llibertat creativa total per a la Berta.', v: 'llibertat', fx: { trust: { berta: 1 } }, say: [['berta.h', 'Seràs el meu director preferit!']] }
      ] },
      { t: 'sim', calc: (S, H) => {
        const v = S.f.brief42;
        const q = H.q({ centralitza: 0.45, brief: 0.8, llibertat: 0.4 }[v], ['creativitat', 'estrategia'], ['marca']);
        const leads = Math.round(8 + q * 30);
        const vis = v === 'llibertat' ? 42000 : v === 'brief' ? 21000 : 12000;
        const verdict = leads >= 28 ? 'good' : leads >= 18 ? 'mid' : 'bad';
        const F = v === 'brief' ? [[true, 'El vídeo manté la bellesa de les màquines, però amb el missatge «Peces a mida en 48 hores».'], [true, 'La prova A/B va confirmar que el missatge de terminis funcionava millor.']] :
          v === 'llibertat' ? [[true, 'El vídeo és espectacular i es comparteix molt.'], [false, 'Però no diu què fa l\'empresa ni per què triar-la: pocs contactes de compradors.']] :
            [[false, 'Sense la mirada de la Berta, la peça és correcta però plana.'], [false, 'La Berta se sent poc valorada.']];
        return {
          title: 'Campanya de vídeo per a Mecanitzats Bellmunt',
          metrics: [['Visualitzacions', vis.toLocaleString('ca-ES')], ['Contactes B2B', String(leads), verdict], ['Missatge clar', v === 'brief' ? 'Sí' : 'No']],
          summary: verdict === 'good' ? 'Bonic i efectiu alhora. Així sí.' : 'Una campanya que fa bonic, però no ven tant com podria.',
          verdict, factors: F,
          fx: { rep: verdict === 'good' ? 5 : 1, trust: { miquel: verdict === 'good' ? 1 : 0 }, know: { marca: 1 } }
        };
      } },
      { t: 'dlg', lines: (S) => S.f.brief42 === 'brief' ? [['berta.h', 'Ho veus? La creativitat no està renyida amb els resultats.'], ['julia.h', 'I ara tenim dades per demostrar-ho.']] : [['berta.t', 'Potser cal trobar un equilibri entre el que és bonic i el que funciona...']] }
    ]
  });

  CH('4.3', {
    title: 'El primer sistema de treball', who: 'julia', bg: 'despatx', weeks: 2,
    blurb: 'Peticions per WhatsApp, correu i telèfon. Retards i errors.',
    steps: [
      { t: 'dlg', lines: (S) => [
        ['', 'Dimecres. Una factura s\'ha enviat amb el nom d\'un altre client. Una campanya s\'ha publicat amb el preu antic.'],
        ['julia.a', 'Pau, això no pot continuar. Els clients ens envien coses per WhatsApp, per correu, ens truquen... i ningú no sap qui fa què.'],
        S.f.quimMal ? ['julia.w', 'Només Quim ens ha canviat l\'encàrrec tres vegades aquesta setmana.'] : ['julia.t', 'Necessitem un sistema.']
      ] },
      { t: 'lesson', id: 'L_processos' },
      { t: 'multi', key: 'sist43', pick: 4, prompt: 'Tria 4 elements del nou sistema de treball', opts: [
        { t: 'Un canal únic per a les peticions dels clients', ok: true, why: 'Res no es perd entre missatges.' },
        { t: 'Tauler de tasques amb responsable i data', ok: true, why: 'Tothom sap qui fa què i quan.' },
        { t: 'Plantilles d\'informe i de proposta', ok: true, why: 'Estalvien temps i redueixen errors.' },
        { t: 'Revisió setmanal dels dilluns i llista de comprovació abans d\'enviar', ok: true, why: 'Detecta retards i errors abans que arribin al client.' },
        { t: 'Un grup de WhatsApp amb tots els clients', ok: false, why: 'Multiplica el soroll i barreja converses.' },
        { t: 'Una reunió diària de dues hores', ok: false, why: 'Massa temps de coordinació.' },
        { t: 'Que cadascú s\'organitzi com vulgui', ok: false, why: 'És el problema actual.' }
      ], fx: (S, g) => ({ xp: g * 12, flags: { sistema: g }, rep: g >= 3 ? 2 : 0 }) },
      { t: 'dlg', lines: (S) => [
        ...(S.f.eina ? [['julia.h', 'Sort que vas comprar l\'eina de gestió. La implantació serà rapidíssima.']] : []),
        (S.f.sistema || 0) >= 3 ? ['julia.h', 'Un mes després: cap error de facturació i les entregues arriben a temps.'] : ['julia.t', 'Ha millorat una mica, però encara hi ha forats.'],
        ['berta.n', 'I jo tinc més temps per crear, que és el que m\'agrada.']
      ] }
    ]
  });

  CH('4.4', {
    title: 'Automatitzar o continuar manualment', who: 'julia', bg: 'despatx', weeks: 2,
    blurb: 'Massa hores en informes, seguiments i classificació de contactes.',
    steps: [
      { t: 'dlg', lines: [
        ['julia.t', 'He comptat les hores: dediquem 30 hores al mes a preparar informes i 15 a classificar contactes a mà.'],
        ['pau.n', 'Doncs automatitzem-ho tot!'],
        ['julia.n', 'Tot no. Primer hem de saber què és repetitiu i què necessita criteri.']
      ] },
      { t: 'lesson', id: 'L_crm' },
      { t: 'multi', key: 'auto44', pick: 3, prompt: 'Quines 3 tasques automatitzes?', opts: [
        { t: 'Generar l\'informe mensual de dades (una persona el revisa i hi afegeix conclusions)', ok: true, why: 'Repetitiu, amb revisió humana.' },
        { t: 'Correu de benvinguda a qui se subscriu al butlletí', ok: true, why: 'Repetitiu i amb consentiment.' },
        { t: 'Classificar els contactes per sector al CRM', ok: true, why: 'Regles clares i repetitives.' },
        { t: 'Respondre les queixes dels clients', ok: false, why: 'Requereix empatia i criteri.' },
        { t: 'Decidir l\'estratègia de cada client', ok: false, why: 'És el valor principal de l\'agència.' },
        { t: 'Negociar preus', ok: false, why: 'Requereix judici i relació.' }
      ], fx: (S, g) => ({ xp: g * 12, tools: S.tools + 80, flags: { crm: true } }) },
      { t: 'dlg', lines: [['', 'Al cap d\'uns dies, un client proposa una «drecera».'], ['sergi.n', 'Pau, puc comprar una base de 20.000 correus d\'empreses per 200 €. Els enviem el butlletí i llestos!']] },
      { t: 'choice', key: 'dades44', prompt: 'Què li respons al Sergi?', opts: [
        { t: 'Comprar-la: és barata i ràpida.', v: 'comprar', fx: { rep: -4, flags: { rgpdRisk: true }, log: 'Va acceptar enviar correus a una base de dades comprada.', key: true }, say: [['', 'El 40 % dels correus reboten. Arriben queixes i el domini de correu queda marcat com a brossa.'], ['julia.a', 'T\'ho vaig dir. A més, sense consentiment és un risc legal.']] },
        { t: 'Rebutjar-la i proposar captació amb consentiment: fitxes descarregables i butlletí.', v: 'consent', fx: { rep: 2, xp: 30, log: 'Va rebutjar comprar una base de dades i va proposar captació amb consentiment.' }, say: [['sergi.t', 'Més lent... però si ho dius tu.'], ['julia.h', 'Tres mesos després, la llista pròpia té 900 contactes que obren els correus.']] }
      ] }
    ]
  });

  CH('4.5', {
    title: 'La reunió que ho canvia tot', who: 'julia', bg: 'despatx', weeks: 2,
    blurb: 'Els ingressos pugen. El benefici, no al mateix ritme.',
    steps: [
      { t: 'dlg', lines: [
        ['julia.n', 'Pau, he creuat les hores reals amb el que factura cada client. Has de veure això.']
      ] },
      { t: 'lesson', id: 'L_rendibilitat' },
      { t: 'choice', key: 'rend45', prompt: 'Què fas amb els clients poc rendibles?', info: (S) => {
        const rows = S.clients.map(c => {
          const h = c.id === 'quim' ? (S.f.quimMal ? 85 : S.f.quimContracte === 'premium' ? 70 : 45) : Math.round(c.fee / 25 * 0.6);
          const m = c.fee - h * 25;
          return [c.name, c.fee.toLocaleString('ca-ES') + ' €', h + ' h', `<b class="${m < 0 ? 'neg' : 'pos'}">${m.toLocaleString('ca-ES')} €</b>`];
        });
        return tbl(rows.length ? rows : [['—', '—', '—', '—']], ['Client', 'Quota', 'Hores reals', 'Marge']);
      }, opts: [
        { t: 'Revisar preus amb els clients poc rendibles', v: 'preus', fx: (S) => has(S, 'quim') && S.f.quimMal ? { clientFee: { quim: 700 }, trust: { quim: -1 }, xp: 25, log: 'Va renegociar a l\'alça la quota de Quim.' } : { xp: 25, rep: 1 }, say: (S) => has(S, 'quim') && S.f.quimMal ? [['quim.a', 'Ara em vols cobrar més? ... Bé. Però que no em falli res.']] : [['julia.h', 'Ajustaments petits, però el marge millora.']] },
        { t: 'Canviar processos per reduir hores (plantilles, automatització)', v: 'processos', fx: (S) => ({ xp: 25, rep: (S.f.sistema || 0) >= 3 ? 3 : 1 }), say: [['julia.n', 'Amb el sistema nou guanyem un 20 % d\'hores. Però al client que demana «tot» no n\'hi ha prou.']] },
        { t: 'Limitar l\'abast del contracte de Quim', v: 'abast', hide: (S) => !has(S, 'quim'), fx: (S) => ({ trust: { quim: S.f.quimMal ? -1 : 0 }, xp: 25, flags: { quimMal: false }, log: 'Va redefinir l\'abast del contracte de Quim.' }), say: [['quim.t', 'Abast, revisions, hores... D\'acord, signo. Però vull resultats.']] },
        { t: 'Deixar de treballar amb el client menys rendible', v: 'deixar', hide: (S) => !has(S, 'quim'), fx: { dropClient: 'quim', trust: { quim: -3 }, flags: { quimFora: true, quimMal: false }, log: 'Va deixar de treballar amb Quim.', key: true }, say: [['quim.a', 'Tu sabràs. Ja trobaré una altra agència.'], ['julia.n', 'Menys ingressos, però més marge i més calma a l\'equip.']] }
      ] },
      { t: 'dlg', lines: [['pau.t', 'L\'agència ja és una empresa: equip, costos fixos, processos... i obligacions de direcció.']] }
    ]
  });

  /* ============================================================
     ETAPA 5 — L'AGÈNCIA SOTA PRESSIÓ
     ============================================================ */
  CH('5.1', {
    title: 'La campanya que surt malament', who: 'nuria', bg: 'botiga', weeks: 2,
    blurb: 'Pressupost gastat, cap conversió. El client amenaça de cancel·lar.',
    steps: [
      { t: 'dlg', lines: [
        ['', 'Campanya de Nadal de la Cansaladeria Núria. 2.000 € d\'anuncis en deu dies.'],
        ['nuria.a', 'Pau, la plataforma diu zero vendes! Zero! Si això continua així, cancel·lo el contracte.'],
        ['pau.w', 'Calma, Núria. Abans de tocar res, he de saber què passa.']
      ] },
      { t: 'lesson', id: 'L_ads2' },
      { t: 'invest', time: 3, prompt: 'Diagnostica abans d\'actuar', info: 'Tens temps per a 3 comprovacions.', opts: [
        { t: 'Revisar el seguiment de conversions', flag: 'd_track', note: 'L\'etiqueta de compra es va esborrar en actualitzar la web.', a: [['julia.t', 'Ho tinc: en l\'última actualització de la web es va esborrar l\'etiqueta de compra. La plataforma no veu cap venda.']] },
        { t: 'Provar la compra des d\'un mòbil Android', flag: 'd_mobil', note: 'El botó de pagar no respon en Android.', a: [['pau.s', 'El botó «Pagar» no fa res en Android! El 60 % del trànsit ve d\'Android...']] },
        { t: 'Revisar la segmentació', flag: 'd_seg', note: 'Correcta.', a: [['pau.n', 'Catalunya, interessos en gastronomia i productes locals. Correcte.']] },
        { t: 'Revisar les creativitats', flag: 'd_crea', note: 'CTR del 2,8 %: bo.', a: [['pau.n', 'CTR del 2,8 %. Els anuncis funcionen: la gent hi clica.']] },
        { t: 'Consultar les vendes reals a la botiga', flag: 'd_real', note: '31 comandes, totes des d\'ordinador.', a: [['nuria.s', 'A la botiga en línia hi ha... 31 comandes. Totes des d\'ordinador. Cap des del mòbil!']] }
      ] },
      { t: 'choice', key: 'acc51', prompt: 'Què fas amb la campanya?', opts: [
        { t: 'Aturar-la definitivament: no funciona.', v: 'aturar' },
        { t: 'Canviar l\'anunci i la segmentació.', v: 'canviar' },
        { t: 'Pausar-la 48 h, arreglar el pagament en Android i l\'etiqueta de compra, i reprendre-la.', v: 'arreglar', hide: (S) => !(S.f.d_mobil || S.f.d_track), fx: { xp: 40 } },
        { t: 'Gastar més per compensar.', v: 'mes' }
      ] },
      { t: 'sim', calc: (S, H) => {
        const v = S.f.acc51;
        const fixedM = v === 'arreglar' && S.f.d_mobil, fixedT = v === 'arreglar' && S.f.d_track;
        const sales = v === 'aturar' ? 31 : v === 'canviar' || v === 'mes' ? 52 : Math.round(31 + (fixedM ? 95 : 25) + H.rnd(0, 12));
        const spend = v === 'aturar' ? 2000 : v === 'mes' ? 4500 : 3200;
        const rev = sales * 42, roas = Math.round(rev / spend * 100) / 100, cpa = Math.round(spend / sales);
        const verdict = roas >= 1.6 ? 'good' : roas >= 0.9 ? 'mid' : 'bad';
        const F = [];
        F.push([fixedM, fixedM ? 'Arreglar el pagament en Android ha desbloquejat el 60 % del trànsit.' : 'El pagament en Android continua sense funcionar.']);
        F.push([fixedT || null, fixedT ? 'Ara les vendes es registren i la plataforma pot optimitzar.' : 'Sense l\'etiqueta de compra, la plataforma no pot optimitzar.']);
        if (v === 'canviar') F.push([false, 'Canviar l\'anunci no servia: el CTR ja era bo. El problema era després del clic.']);
        if (v === 'mes') F.push([false, 'Més pressupost en una web que no cobra al mòbil = més diners perduts.']);
        if (v === 'aturar') F.push([false, 'Aturar la campanya ha evitat pèrdues, però també ha renunciat a la temporada de Nadal.']);
        return {
          title: 'Campanya de Nadal de la Núria',
          metrics: [['Vendes', String(sales), verdict], ['Inversió', H.eur(spend)], ['Ingressos', H.eur(rev)], ['ROAS', String(roas).replace('.', ','), verdict], ['CPA', H.eur(cpa)]],
          summary: verdict === 'good' ? 'Campanya recuperada a temps per Nadal.' : verdict === 'mid' ? 'Recuperació parcial.' : 'La campanya ha perdut diners.',
          verdict, factors: F,
          fx: { rep: verdict === 'good' ? 6 : verdict === 'mid' ? 1 : -4, know: { ads: 1 }, flags: { nuria51: verdict }, dropClient: verdict === 'bad' ? 'nuria' : null, log: `Crisi de la campanya de Nadal: resultat ${verdict === 'good' ? 'recuperat' : verdict === 'mid' ? 'parcial' : 'negatiu'}.`, key: true }
        };
      } },
      { t: 'dlg', lines: (S) => S.f.nuria51 === 'good' ? [['nuria.h', 'El millor Nadal de la història de la cansaladeria! I tot per un botó... Gràcies per no tornar-te boig.']] : S.f.nuria51 === 'mid' ? [['nuria.n', 'Bé, almenys hem salvat una part del Nadal.']] : [['nuria.a', 'Ho sento, Pau. Ho deixem aquí.']] }
    ]
  });

  CH('5.2', {
    title: 'La crisi de reputació', who: 'jordi', bg: 'restaurant', weeks: 2,
    blurb: 'Comentaris negatius que s\'estenen. El client vol esborrar-ho tot.',
    steps: [
      { t: 'dlg', lines: [
        ['', 'Can Jordi ha canviat la carta: ha tret els canelons de la iàia, ha apujat els preus un 20 % i hi ha un cambrer nou poc amable.'],
        ['', 'En una setmana, 23 ressenyes d\'una estrella. Un perfil local amb 30.000 seguidors en parla.'],
        ['jordi.a', 'Pau, esborra-ho tot! Denuncia aquestes ressenyes! Són uns desagraïts!']
      ] },
      { t: 'lesson', id: 'L_crisi' },
      { t: 'choice', key: 'crisi52', prompt: 'Com gestiones la crisi?', opts: [
        { t: 'Esborrar els comentaris de les xarxes i denunciar les ressenyes', v: 'esborrar', fx: { rep: -5, log: 'Va esborrar crítiques en una crisi de reputació.', key: true } },
        { t: 'Respondre defensant el restaurant: «Els clients no entenen la nova cuina»', v: 'defensa', fx: { rep: -3 } },
        { t: 'Fer un sorteig de sopars per tapar les crítiques', v: 'sorteig', fx: { rep: -2 } },
        { t: 'Escoltar, reconèixer el que és cert i actuar: recuperar els canelons, explicar els preus, formar la sala i pausar la promoció fins que estigui resolt', v: 'honest', fx: { rep: 5, xp: 40, log: 'Va gestionar una crisi de reputació amb transparència i mesures reals.', key: true } }
      ] },
      { t: 'sim', calc: (S, H) => {
        const v = S.f.crisi52;
        const after = { esborrar: 3.4, defensa: 3.7, sorteig: 3.9, honest: 4.4 }[v];
        const neg = { esborrar: 61, defensa: 44, sorteig: 35, honest: 9 }[v];
        const verdict = v === 'honest' ? 'good' : v === 'sorteig' ? 'mid' : 'bad';
        const F = {
          esborrar: [[false, 'Els usuaris noten que s\'esborren comentaris i fan captures: la crisi es multiplica.']],
          defensa: [[false, 'La resposta defensiva es comparteix com a exemple de mala atenció.']],
          sorteig: [[null, 'El sorteig desvia l\'atenció uns dies, però el problema de fons continua.']],
          honest: [[true, 'Reconèixer els errors desactiva la indignació.'], [true, 'El retorn dels canelons es converteix en notícia positiva.'], [true, 'No fer promoció fins a resoldre-ho evita portar gent a una mala experiència.']]
        }[v];
        return {
          title: 'Reputació de Can Jordi · 1 mes després',
          metrics: [['Valoració mitjana', String(after).replace('.', ',') + ' ★', verdict], ['Abans de la crisi', '4,6 ★'], ['Ressenyes negatives noves', String(neg)]],
          summary: verdict === 'good' ? 'La confiança es recupera. Hi ha qui hi torna només pels canelons.' : 'La crisi s\'ha allargat.',
          verdict, factors: F,
          fx: { know: { xarxes: 1 }, flags: { jordiCrisi: verdict } }
        };
      } }
    ]
  });

  CH('5.3', {
    title: 'Les dades no quadren', who: 'julia', bg: 'despatx', weeks: 2,
    blurb: 'Diverses plataformes s\'atribueixen la mateixa venda.',
    steps: [
      { t: 'dlg', lines: (S) => [
        [H.teamHas('julia') ? 'julia.t' : 'pau.t', 'Cim Trail: Meta diu que ha generat 120 vendes. Google, 90. El correu, 40. Total: 250.'],
        [H.teamHas('julia') ? 'julia.a' : 'pau.w', 'Però la botiga en línia n\'ha fet 160. Com pot ser?'],
        ['sergi.n', 'Pau, vull retallar el canal que funcioni pitjor. Quin és?']
      ] },
      { t: 'lesson', id: 'L_atribucio' },
      { t: 'choice', key: 'atr53', prompt: 'Què recomanes al Sergi?', opts: [
        { t: 'Retallar el canal amb pitjor ROAS segons les plataformes', v: 'retallar' },
        { t: 'Sumar-ho tot: «La campanya ha generat 250 vendes»', v: 'sumar', fx: { rep: -3 }, say: [['sergi.a', '250? Si a la botiga n\'hem fet 160! Pau, m\'estàs prenent el pèl?']] },
        { t: 'Explicar les limitacions de l\'atribució i fer servir les vendes reals com a referència', v: 'explicar', fx: { rep: 2, xp: 25 } },
        { t: 'Proposar un experiment geogràfic: pausar Meta tres setmanes a Lleida i Girona i comparar-les amb Barcelona i Tarragona', v: 'experiment', req: (S, H) => S.skills.analitica >= 2 || H.teamHas('julia'), fx: { rep: 4, xp: 50, log: 'Va proposar un experiment d\'incrementalitat per decidir la inversió.', key: true } }
      ] },
      { t: 'sim', calc: (S, H) => {
        const v = S.f.atr53;
        if (v === 'experiment') {
          return {
            title: 'Experiment d\'incrementalitat',
            metrics: [['Vendes atribuïdes per Meta', '120'], ['Vendes incrementals reals', '≈ 45', 'good'], ['Estalvi recomanat', H.eur(900) + '/mes']],
            summary: 'Meta aporta vendes reals, però menys de les que s\'atribueix. Es pot reduir una part de la inversió sense perdre vendes.',
            verdict: 'good',
            factors: [[true, 'Comparar zones amb i sense anuncis mostra l\'efecte real.'], [true, 'Decidir amb incrementalitat evita retallar un canal que sí que funciona.']],
            fx: { know: { analitica: 1 }, trust: { julia: 1 }, flags: { atribucio: 'bona' } }
          };
        }
        const verdict = v === 'explicar' ? 'mid' : 'bad';
        return {
          title: 'Decisió sobre canals', metrics: [['Vendes reals', '160'], ['Suma de plataformes', '250', 'bad']],
          summary: v === 'retallar' ? 'Has retallat el correu, que era el canal més barat i el que tenia més clients recurrents. Les vendes baixen.' : v === 'explicar' ? 'El Sergi entén el problema, però sense experiment la decisió continua sent incerta.' : 'Has perdut credibilitat.',
          verdict, factors: [[false, 'Les plataformes compten la mateixa venda diverses vegades.'], [v === 'explicar' || false, v === 'explicar' ? 'Explicar-ho amb honestedat manté la confiança.' : 'Atribuir no és demostrar causalitat.']],
          fx: { know: { analitica: 1 } }
        };
      } }
    ]
  });

  CH('5.4', {
    title: 'El client que no paga', who: 'quim', bg: 'despatx', weeks: 2,
    blurb: 'Nòmines, eines i factures pendents. I un client que no paga.',
    steps: [
      { t: 'dlg', lines: (S) => {
        const deb = has(S, 'quim') ? 'quim' : 'sergi';
        return [
          ['', 'Divendres. Les nòmines s\'han de pagar dilluns.'],
          [H.teamHas('julia') ? 'julia.w' : 'pau.w', deb === 'quim' ? 'Quim no ha pagat les dues últimes quotes. Són 3.000 €.' : 'Cim Trail no ha pagat les dues últimes quotes. Són 1.000 €, i amb els projectes pendents, 3.000 €.'],
          [deb + '.n', deb === 'quim' ? 'Tranquil, nano. Ja pagaré. Ara vaig una mica just.' : 'Ho sento, Pau. Hem tingut una mala temporada.']
        ];
      } },
      { t: 'fx', fx: { money: -3000, log: 'Un client va deixar de pagar 3.000 € en factures.' } },
      { t: 'lesson', id: 'L_tresoreria' },
      { t: 'choice', key: 'pag54', prompt: 'Com afrontes la crisi de tresoreria?', info: (S) => {
        const deb = S.clients.find(c => c.id === 'quim') || S.clients.find(c => c.id === 'sergi');
        const share = deb ? Math.round(deb.fee / Math.max(1, recurring(S)) * 100) : 0;
        return tbl([['Liquiditat', Math.round(S.money).toLocaleString('ca-ES') + ' €'], ['Reserva', S.reserve.toLocaleString('ca-ES') + ' €'], ['Nòmines i despeses del mes', Math.round(S.team.reduce((a, t) => a + t.salary, 0) + S.rent + S.tools).toLocaleString('ca-ES') + ' €'], ['Pes del client als ingressos', share + ' %' + (share > 35 ? ' ⚠️ concentració alta' : '')]]);
      }, opts: [
        { t: 'Fer servir la reserva i pactar amb el client un calendari de pagament', v: 'reserva', req: (S) => S.reserve >= 500, fx: (S) => ({ money: S.reserve + 3000, reserve: -0, xp: 40, log: 'La reserva per a imprevistos va salvar la tresoreria.', key: true }), say: [['pau.h', 'La reserva que vaig guardar fa temps ens salva. I el client pagarà en dos terminis.']] },
        { t: 'Pactar un calendari (50 % ara, 50 % en 30 dies) i aturar la feina nova fins que es compleixi', v: 'calendari', fx: { money: 3000, xp: 30, rep: 1 }, say: [['', 'Una conversa tensa però respectuosa. El client paga la meitat dilluns i la resta al cap d\'un mes.']] },
        { t: 'Amenaçar amb advocats el primer dia', v: 'advocats', fx: { money: 1500, trust: { quim: -3 }, dropClient: 'quim', rep: -1 }, say: [['quim.a', 'Advocats? Doncs adeu. T\'envio la meitat i no em tornis a trucar.']] },
        { t: 'Demanar un préstec ràpid amb interès alt', v: 'prestec', fx: { money: 3000, flags: { prestec: true }, log: 'Va demanar un préstec ràpid per pagar nòmines.' }, say: [['pau.w', 'Problema resolt... de moment. Caldrà tornar-lo amb interessos.']] }
      ] },
      { t: 'fx', silent: true, fx: (S) => S.f.pag54 === 'reserva' ? { flags: { usedReserve: true } } : null },
      { t: 'fx', silent: true, fx: (S) => { if (S.f.pag54 === 'reserva') { S.reserve = 0; } return null; } },
      { t: 'dlg', lines: (S) => [['pau.t', S.clients.length >= 5 ? 'Tenir molts clients diferents ha fet que aquest cop no fos una catàstrofe.' : 'Depenc massa de pocs clients. He de diversificar.']] }
    ]
  });

  CH('5.5', {
    title: 'Una decisió incòmoda', who: 'laia', bg: 'despatx', weeks: 2,
    blurb: 'Tres peticions alhora. Què prioritzes i com ho expliques?',
    steps: [
      { t: 'fx', silent: true, fx: (S) => S.f.prestec ? { money: -3400, log: 'Va tornar el préstec ràpid amb 400 € d\'interessos.' } : null },
      { t: 'dlg', lines: (S) => [
        ['laia.n', S.f.laiaAliada ? 'Pau, tinc un projecte per a una cadena de supermercats. Necessito un soci a Osona. 6.000 € per a vosaltres, però els terminis són estrictes: tres setmanes.' : 'Pau, tinc un projecte gran i em falta gent. 6.000 € per a vosaltres. Tres setmanes, sense excuses.'],
        has(S, 'quim') ? ['quim.n', 'Pau, vull ampliar el contracte: obro una nau a Vic. +800 € al mes, però ho vull ja.'] : ['miquel.n', 'Pau, voldria ampliar la feina: obrim línia d\'exportació. +800 € al mes, però ho necessito ja.'],
        ['carme.h', 'Pau, vull fer una cosa nova: vendre coques a les cafeteries de la comarca. M\'ajudes? No et puc pagar gaire...'],
        ['pau.w', 'No hi ha prou equip per a tot alhora.']
      ] },
      { t: 'choice', key: 'prio55', prompt: 'Què prioritzes?', sub: 'Cada opció té conseqüències amb cada persona.', opts: [
        { t: 'La col·laboració amb la Laia, i explicar a la resta els nous terminis', v: 'laia', fx: (S) => ({ money: 6000, fee: true, trust: { laia: 2, carme: -1, quim: -1, miquel: has(S, 'quim') ? 0 : -1 }, flags: { laiaCollab: true }, log: 'Va prioritzar la col·laboració amb la Laia.', key: true }) },
        { t: 'L\'ampliació del client recurrent', v: 'client', fx: (S) => ({ clientFee: has(S, 'quim') ? { quim: 800 } : { miquel: 800 }, trust: { laia: -1, carme: -1, quim: has(S, 'quim') ? 1 : 0, miquel: has(S, 'quim') ? 0 : 1 }, log: 'Va prioritzar l\'ampliació d\'un client recurrent.' }) },
        { t: 'La Carme: la lleialtat va abans que els diners', v: 'carme', fx: { money: 400, trust: { carme: 3, laia: -1 }, flags: { lleialtat: true }, rep: 2, log: 'Va prioritzar ajudar la Carme per lleialtat.', key: true } },
        { t: 'Acceptar-ho tot i fer hores extres amb l\'equip', v: 'tot', fx: (S) => ({ money: 6400, fee: true, clientFee: has(S, 'quim') ? { quim: 800 } : { miquel: 800 }, trust: { julia: -2, berta: -2 }, rep: -2, flags: { cremat: true }, log: 'Va acceptar-ho tot i va sobrecarregar l\'equip.', key: true }) },
        { t: 'Negociar: una setmana més de termini per a la Laia, una solució senzilla per a la Carme i l\'ampliació d\'aquí a un mes', v: 'negociar', req: { skill: 'gestio', min: 2 }, fx: (S) => ({ money: 5400, fee: true, clientFee: has(S, 'quim') ? { quim: 800 } : { miquel: 800 }, trust: { laia: 1, carme: 1, julia: 1 }, rep: 3, xp: 60, flags: { laiaCollab: true }, log: 'Va negociar terminis i va atendre les tres peticions sense cremar l\'equip.', key: true }) }
      ] },
      { t: 'dlg', lines: (S) => ({
        laia: [['laia.h', 'Feina impecable. Sabia que podia comptar amb vosaltres.'], ['carme.w', 'Ja ho entenc, Pau. Ets un home ocupat.']],
        client: [['laia.t', 'Entesos. Buscaré algú altre.'], ['carme.n', 'No passa res, ja m\'espavilaré.']],
        carme: [['carme.h', 'Sabia que no em fallaries. Les cafeteries ja em demanen coques!'], ['laia.n', 'Una decisió... sentimental. Respecte.']],
        tot: [['julia.a', 'Pau, fa tres setmanes que no veig la meva família.'], ['berta.w', 'Estic esgotada. Així no podem continuar.']],
        negociar: [['laia.h', 'Una setmana més? D\'acord: m\'has convençut amb el pla.'], ['carme.h', 'I la plantilla de comandes que m\'has fet és facilíssima!'], ['julia.h', 'Això és dirigir, Pau.']]
      })[S.f.prio55] }
    ]
  });
})();
