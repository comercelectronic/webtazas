/* Agència Digital — guió de les etapes 6, 7 i 8, encàrrecs i finals */
(function () {
  const CH = (id, o) => { GD.chapters[id] = Object.assign({ id, stage: +id.split('.')[0] }, o); };
  const tbl = GD.tbl;
  const has = (S, id) => S.clients.some(c => c.id === id);
  const recurring = (S) => S.clients.reduce((a, c) => a + c.fee, 0);
  const PATHS = { A: T('Especialista en negocis locals'), B: T('Agència de rendiment'), C: T('Estudi de marca i comerç electrònic') };

  /* ============================================================
     ETAPA 6 — CRÉIXER SENSE PERDRE EL NORD
     ============================================================ */
  CH('6.1', {
    title: T('Tres camins de creixement'), who: 'julia', bg: 'oficina', weeks: 1,
    blurb: T('Quin tipus d\'agència vols construir?'),
    steps: [
      { t: 'dlg', lines: (S) => [
        ['julia.n', T('He preparat les dades de l\'any. Els projectes locals són els que tenen més marge i fidelitat.')],
        ['julia.t', T('Els de rendiment (anuncis i analítica) creixen més de pressa, però els clients exigeixen proves constants.')],
        ['berta.h', T('I els projectes de marca i botiga en línia són els que ens fan més feliços... i els que guanyen premis!')],
        ['pau.t', T("Ingressos recurrents: {0} €/mes. Equip: {1} persones. Ara toca triar.", [recurring(S).toLocaleString(LOCALE), S.team.length + 1])]
      ] },
      { t: 'choice', key: 'path', prompt: T('Quina línia principal tries per a l\'agència?'), sub: T('Pots combinar especialitats més endavant, però cada línia requereix recursos.'), opts: [
        { t: T('🏘️ Camí A — Especialista en negocis locals'), d: T('Comerços, restaurants, serveis i empreses de proximitat. Relació personal i reputació local.'), v: 'A', fx: { know: { seo: 1, mercat: 1 }, trust: { carme: 1 }, rep: 3, log: T('Va triar el camí A: especialista en negocis locals.'), key: true } },
        { t: T('📈 Camí B — Agència de rendiment'), d: T('Publicitat, analítica, conversió i creixement mesurable. Informes rigorosos.'), v: 'B', fx: { know: { ads: 1, analitica: 1 }, trust: { julia: 1 }, rep: 3, log: T('Va triar el camí B: agència de rendiment.'), key: true } },
        { t: T('🛍️ Camí C — Estudi de marca i comerç electrònic'), d: T('Identitat, continguts, experiència de compra i llançaments.'), v: 'C', fx: { know: { marca: 1, web: 1 }, trust: { berta: 1 }, rep: 3, log: T('Va triar el camí C: estudi de marca i comerç electrònic.'), key: true } }
      ] },
      { t: 'dlg', lines: (S) => ({
        A: [['julia.h', T('Arrelats al territori. Té sentit amb el que hem construït.')], ['berta.n', T('Faré que els comerços d\'Osona siguin els més macos de Catalunya.')]],
        B: [['julia.h', T('Per fi! Experiments, atribució, incrementalitat... Em poso a dissenyar els quadres de comandament.')], ['berta.t', T('Doncs jo faré que els anuncis siguin efectius i bonics alhora.')]],
        C: [['berta.h', T('Síííí! Marques amb ànima i botigues que venen.')], ['julia.n', T('Sempre que puguem mesurar-ho, compto amb vosaltres.')]]
      })[S.f.path] }
    ]
  });

  CH('6.2', {
    title: T('El primer client gran'), who: 'marta', bg: 'oficina', weeks: 3,
    blurb: T('Un pressupost molt superior, processos d\'aprovació i informes rigorosos.'),
    steps: [
      { t: 'fx', silent: true, fx: { flags: { met_marta2: true } } },
      { t: 'dlg', lines: (S) => [
        ['marta.n', (S.f.met_marta ? T('{nom}, ens vam conèixer a la fira, recordes? ') : '') + T('Marta Coll, directora de màrqueting de Làctics de la Plana.')],
        ['marta.n', T('Volem una agència per a tot l\'any: llançament de iogurts, botiga en línia i campanyes. Uns 6.000 € al mes d\'honoraris.')],
        ['marta.t', T('Però us aviso: informes mensuals al comitè, tres nivells d\'aprovació i coordinació amb el nostre equip de vendes i el de qualitat.')],
        ['pau.t', T('(És més del doble del que factura qualsevol altre client. Podem assumir-ho sense descuidar la resta?)')]
      ] },
      { t: 'choice', key: 'gran62', prompt: T('Com respons a la Marta?'), opts: [
        { t: T('Acceptar i adaptar l\'agència: responsable de compte, una persona de suport, KPI pactats i calendari d\'aprovacions'), v: 'preparat', req: { money: 4000 }, fx: { client: { id: 'marta', name: T('Làctics de la Plana'), fee: 6000 }, hire: { id: 'suport', name: T('Arnau (suport de comptes)'), salary: 2200 }, rep: 6, xp: 50, log: T('Va guanyar el primer client gran amb un pla de recursos.'), key: true }, say: [['marta.h', T('Això és professionalitat. Signem.')]] },
        { t: T('Acceptar sense canviar res: ja ens en sortirem'), v: 'sensepla', fx: { client: { id: 'marta', name: T('Làctics de la Plana'), fee: 6000 }, trust: { carme: -1, miquel: -1, julia: -1 }, rep: -2, flags: { sobrecarrega: 2 }, log: T('Va acceptar un client gran sense capacitat.'), key: true }, say: [['', T('Dos mesos després: la Carme espera una resposta des de fa tres setmanes i Miquel ha rebut un informe amb errors.')], ['julia.a', T('{nom}, no arribem. Els altres clients ho noten.')]] },
        { t: T('Proposar una fase pilot de 3 mesos per demostrar valor i ajustar recursos'), v: 'pilot', fx: { client: { id: 'marta', name: T('Làctics de la Plana (pilot)'), fee: 3000 }, rep: 4, xp: 40, flags: { martaPilot: true }, log: T('Va proposar una fase pilot al client gran.') }, say: [['marta.t', T('Prudent. M\'agrada. Si el pilot funciona, ampliem.')]] },
        { t: T('Declinar: ara no tenim capacitat'), v: 'no', say: [['marta.n', T('Ho entenc. Potser més endavant.')]] }
      ] }
    ]
  });

  CH('6.3', {
    title: T('La temptació del creixement ràpid'), who: 'ramon', bg: 'oficina', weeks: 2,
    blurb: T('Un inversor vol finançar l\'expansió. Diners... i expectatives.'),
    steps: [
      { t: 'dlg', lines: [
        ['ramon.n', T('Ramon Ferrer. Inverteixo en empreses de serveis. He seguit la vostra trajectòria.')],
        ['ramon.h', T('Us ofereixo 80.000 € a canvi del 30 % de l\'agència. Amb això podeu contractar cinc persones i anar a buscar clients grans.')],
        ['ramon.t', T('A canvi, vull duplicar la facturació en dos anys i un seient al consell.')]
      ] },
      { t: 'lesson', id: 'L_financament' },
      { t: 'choice', key: 'inv63', prompt: T('Què fas amb l\'oferta de Ramon?'), opts: [
        { t: T('Acceptar: 80.000 € pel 30 %'), v: 'acceptar', fx: (S) => ({ money: 80000, hire: { id: 'nous', name: T('Equip nou (4 persones)'), salary: 9600 }, rent: Math.max(S.rent, 1600), flags: { creixementRapid: true, inversor: true }, log: T('Va acceptar 80.000 € d\'un inversor pel 30 % de l\'agència.'), key: true }), say: [['ramon.h', T('Excel·lent. Ara, a créixer!')], ['julia.w', T('{nom}... amb cinc persones més, les despeses fixes es tripliquen.')]] },
        { t: T('Negociar: 50.000 € pel 15 %, sense seient al consell i amb objectius realistes'), v: 'negociar', req: { skill: 'comercial', min: 3 }, fx: { money: 50000, hire: { id: 'nous', name: T('Equip nou (2 persones)'), salary: 4800 }, flags: { inversor: true }, xp: 60, log: T('Va negociar una entrada d\'inversor moderada i amb control.'), key: true }, say: [['ramon.t', T('Negocies bé. D\'acord.')]] },
        { t: T('Rebutjar l\'oferta'), v: 'rebutjar', fx: { log: T('Va rebutjar l\'oferta de l\'inversor.') }, say: [['ramon.n', T('Respecto la decisió. Si canvies d\'opinió, ja saps on sóc.')]] },
        { t: T('Créixer amb beneficis propis, pas a pas'), v: 'propis', fx: { rep: 1, flags: { autofinancat: true, equilibri: 2 }, log: T('Va decidir créixer amb beneficis propis.'), key: true }, say: [['pau.h', T('Més lent, però l\'empresa continua sent nostra.')]] }
      ] }
    ]
  });

  CH('6.4', {
    title: T('La marca de l\'agència'), who: 'berta', bg: 'despatx', weeks: 1,
    blurb: T('Com es presenta l\'agència al mercat? Quins projectes rebutja?'),
    steps: [
      { t: 'dlg', lines: [['berta.h', T('{nom}, és hora que l\'agència tingui una marca pròpia de veritat. Una promesa. Quina és la nostra?')]] },
      { t: 'lesson', id: 'L_marca' },
      { t: 'choice', key: 'marca64', prompt: T('Quina promesa farà l\'agència?'), opts: (S) => [
        { t: ({ A: T('«Fem créixer els negocis d\'Osona amb dades i proximitat.»'), B: T('«Creixement mesurable: si no es pot demostrar, no ho venem.»'), C: T('«Marques amb ànima que venen.»') })[S.f.path || 'A'], v: 'coherent', d: T('Coherent amb el camí triat.'), fx: { rep: 5, xp: 40, log: T('Va definir una promesa de marca coherent amb la seva especialitat.') } },
        { t: T('«Fem tot el que necessitis, quan ho necessitis.»'), v: 'generic', d: T('Agrada a tothom... i a ningú.'), fx: { rep: -1 } },
        { t: T('«Resultats garantits o et tornem els diners.»'), v: 'promesa', d: T('Impactant, però arriscada.'), fx: { rep: 2, flags: { garantia: true } } }
      ] },
      { t: 'dlg', lines: (S) => ({
        coherent: [['berta.h', T('Clara, creïble i difícil de copiar. Ara tot el que fem ha d\'estar a l\'altura.')], ['', T('Al cap d\'un mes, arriben contactes que encaixen molt millor amb l\'agència. Rebutgeu dos projectes que no hi encaixen.')]],
        generic: [['berta.w', T('Això ho diu tothom...')], ['', T('Els contactes nous demanen de tot i a preus baixos.')]],
        promesa: [['julia.a', T('Garantits? I si una campanya falla per culpa del client? Això ens portarà problemes.')]]
      })[S.f.marca64] }
    ]
  });

  CH('6.5', {
    title: T('El repte de la retenció'), who: 'miquel', bg: 'fabrica', weeks: 2,
    blurb: T('Un client important amenaça de marxar.'),
    steps: [
      { t: 'dlg', lines: [
        ['miquel.a', T('{nom}, et seré franc. Fa mesos que tinc la sensació que ja no m\'aporteu gaire. Els informes són iguals cada mes.')],
        ['miquel.t', T('M\'han trucat de Vidal & Co. M\'ho estic pensant.')]
      ] },
      { t: 'lesson', id: 'L_ltv' },
      { t: 'choice', key: 'ret65', prompt: T('Com respons a Miquel?'), opts: [
        { t: T('Analitzar resultats, escoltar les objeccions i presentar un pla de millora amb objectius nous'), v: 'pla', fx: { trust: { miquel: 2 }, rep: 2, xp: 40 }, say: [['miquel.n', T('Això ja és una altra cosa. Tens tres mesos.')]] },
        { t: T('Rebaixar la quota un 30 % perquè no marxi'), v: 'rebaixa', fx: { clientFee: { miquel: -270 }, trust: { miquel: 0 } }, say: [['miquel.t', T('Més barat... però el problema no era el preu.')]] },
        { t: T('Deixar-lo marxar'), v: 'marxa', fx: { dropClient: 'miquel', trust: { miquel: -2 }, log: T('Va perdre Miquel com a client.'), key: true }, say: [['miquel.n', T('Una llàstima. Hem fet coses bones junts.')]] },
        { t: T('Presentar el valor de vida dels clients que l\'agència li ha portat i proposar una nova fase centrada en exportació'), v: 'ltv', req: (S, H) => S.skills.analitica >= 3 || H.teamHas('julia'), fx: { trust: { miquel: 3 }, rep: 4, xp: 60, clientFee: { miquel: 400 }, log: T('Va retenir Miquel demostrant el valor de vida dels clients aconseguits.'), key: true }, say: [['', T('Els 9 clients que l\'agència ha portat a Mecanitzats Bellmunt sumen 210.000 € de marge previst. El CAC mitjà ha estat de 1.300 €.')], ['miquel.h', T('Mai no ho havia vist així. Fem l\'exportació. I amplia el contracte.')]] }
      ] }
    ]
  });

  /* ============================================================
     ETAPA 7 — MÉS ENLLÀ DE CATALUNYA
     ============================================================ */
  CH('7.1', {
    title: T('Un client de fora'), who: 'amelie', bg: 'franca', weeks: 2,
    blurb: T('Una empresa vol vendre a França. No n\'hi ha prou amb traduir.'),
    steps: [
      { t: 'dlg', lines: [
        ['amelie.h', T('Bonjour! Sóc l\'Amélie, responsable de mercat francès de Cosmètica del Montseny.')],
        ['amelie.n', T('Volem vendre els nostres sabons i cremes a França. La idea de la direcció és traduir la web i els anuncis i llestos.')],
        ['pau.t', T('(Traduir no és localitzar...)')]
      ] },
      { t: 'lesson', id: 'L_internacional' },
      { t: 'invest', who: 'amelie', time: 3, prompt: T('Investiga el mercat francès'), opts: [
        { t: T('Quines paraules fan servir els compradors francesos?'), flag: 'fr_kw', note: T('«cosmétique naturelle certifiée bio», «savon saponifié à froid».'), a: [['amelie.n', T('Busquen «cosmétique naturelle certifiée bio» i «savon saponifié à froid». La traducció literal del català gairebé no té cerques.')]] },
        { t: T('Qui és la competència?'), flag: 'fr_comp', note: T('Moltes marques locals amb certificació; preus 10–15 % més alts.'), a: [['amelie.t', T('Moltes marques franceses petites, totes amb certificació. Preus entre un 10 i un 15 % més alts que els nostres.')]] },
        { t: T('Com són la logística i les devolucions?'), flag: 'fr_log', note: T('Esperen entrega en 48–72 h i devolució gratuïta.'), a: [['amelie.w', T('Esperen entrega en 48–72 hores i devolució gratuïta. Ara trigaríem 6 dies.')]] },
        { t: T('Què valoren culturalment?'), flag: 'fr_cult', note: T('Certificacions i ingredients, més que l\'origen.'), a: [['amelie.n', T('Valoren molt les certificacions i la llista d\'ingredients. Que siguem del Montseny els importa menys.')]] }
      ] },
      { t: 'choice', key: 'fr71', prompt: T('Quina estratègia proposes?'), opts: [
        { t: T('Traduir automàticament la web i els anuncis'), v: 'traduir' },
        { t: T('Copiar la campanya que funciona a Catalunya'), v: 'copiar' },
        { t: T('Localitzar: paraules clau franceses, missatge centrat en la certificació, preus adaptats i logística de 72 h amb un operador local'), v: 'localitzar', fx: { xp: 40 } }
      ] },
      { t: 'fx', silent: true, fx: (S) => ({ flags: { franca: true, frQual: (S.f.fr71 === 'localitzar' ? 0.5 : 0.15) + ['fr_kw', 'fr_comp', 'fr_log', 'fr_cult'].filter(k => S.f[k]).length * 0.1 }, know: { avancat: 1 } }) },
      { t: 'dlg', lines: (S) => S.f.fr71 === 'localitzar' ? [['amelie.h', T('Parfait! La direcció volia anar de pressa, però això té molt més sentit.')]] : [['amelie.w', T('D\'acord... però tinc dubtes que funcioni.')]] }
    ]
  });

  CH('7.2', {
    title: T('La campanya internacional'), who: 'amelie', bg: 'franca', weeks: 3,
    blurb: T('Prova petita, campanya completa o soci local?'),
    steps: [
      { t: 'lesson', id: 'L_experiments' },
      { t: 'choice', key: 'test72', prompt: T('Com llances la campanya?'), opts: (S) => [
        { t: T('Prova petita: 3.000 € entre França i Bèlgica amb criteri d\'èxit definit'), v: 'prova', fx: { xp: 30 } },
        { t: T('Campanya completa: 25.000 € a tot França'), v: 'completa' },
        { t: S.f.laiaAliada || S.trust.laia >= 2 ? T('Soci local: la Laia et presenta una agència de Lió amb qui col·labora') : T('Buscar un soci local a França'), v: 'soci', fx: { trust: { laia: S.f.laiaAliada ? 1 : 0 } } }
      ] },
      { t: 'sim', calc: (S, H) => {
        const v = S.f.test72, base = S.f.frQual || 0.3;
        const q = H.q(base + (v === 'soci' ? 0.15 : 0), ['estrategia', 'analitica'], ['avancat']);
        const spend = v === 'completa' ? 25000 : v === 'soci' ? 8000 : 3000;
        const cpa = Math.round(140 - q * 90);
        const sales = Math.round(spend / cpa);
        const fr = Math.round(sales * 0.75), be = sales - fr;
        const roas = Math.round(sales * 58 / spend * 100) / 100;
        const verdict = roas >= 1.3 ? 'good' : roas >= 0.8 ? 'mid' : 'bad';
        const F = [[(S.f.fr71 === 'localitzar') || false, S.f.fr71 === 'localitzar' ? T('La localització (certificació, paraules clau, logística) connecta amb el comprador francès.') : T('Sense localitzar, el missatge no connecta.')]];
        if (v === 'completa') F.push([verdict === 'good' || false, verdict === 'good' ? T('L\'aposta forta ha sortit bé.') : T('Invertir 25.000 € sense provar abans ha amplificat les pèrdues.')]);
        if (v === 'prova') F.push([true, T('La prova petita limita el risc i permet aprendre.')]);
        if (v === 'soci') F.push([true, T('El soci local aporta coneixement del mercat i contactes amb distribuïdors.')]);
        return {
          title: T('Campanya a França i Bèlgica'),
          metrics: [[T('Inversió'), H.eur(spend)], [T('Vendes França'), String(fr)], [T('Vendes Bèlgica'), String(be)], [T('CPA'), H.eur(cpa)], [T('ROAS'), String(roas).replace('.', DEC), verdict]],
          summary: verdict === 'good' ? T('Cosmètica del Montseny ja ven a França.') : verdict === 'mid' ? T('Resultats prometedors però insuficients.') : T('El mercat francès no respon... encara.'),
          verdict, factors: F,
          fx: { rep: verdict === 'good' ? 6 : verdict === 'mid' ? 2 : -2, money: v === 'completa' && verdict === 'bad' ? -2000 : 0, client: verdict !== 'bad' ? { id: 'amelie', name: T('Cosmètica del Montseny (França)'), fee: 2500 } : null, flags: { frResult: verdict, frBe: be, frFr: fr }, log: T("Campanya internacional a França: {0}.", [verdict === 'good' ? T('èxit') : verdict === 'mid' ? T('resultat parcial') : T('fracàs')]), key: true }
        };
      } },
      { t: 'choice', key: 'interp72', prompt: (S) => T("L'Amélie pregunta: «Bèlgica té {0} vendes amb molt menys pressupost. Hi posem tots els diners?»", [S.f.frBe || 4]), opts: [
        { t: T('Sí: Bèlgica és millor perquè té un CPA més baix.'), v: 'precipitat', fx: { rep: -1 }, say: [['julia.a', T('Amb tan poques vendes, la diferència pot ser atzar. No és una conclusió fiable.')]] },
        { t: T('No hi ha prou dades: ampliem la prova a Bèlgica amb el mateix criteri i continuem a França.'), v: 'prudent', fx: { xp: 40, trust: { julia: 1 } }, say: [['amelie.h', T('Té sentit. Prudència i dades.')]] }
      ] }
    ]
  });

  CH('7.3', {
    title: T('L\'equip creix'), who: 'julia', bg: 'oficina', weeks: 2,
    blurb: T('L\'empresa ja no pot dependre de la supervisió directa {den}.'),
    steps: [
      { t: 'dlg', lines: (S) => [
        ['julia.w', T('{nom}, tot passa per tu. Si estàs malalt una setmana, l\'agència s\'atura.')],
        S.f.cremat ? ['berta.w', T('I l\'equip encara arrossega el cansament dels mesos d\'hores extres.')] : ['berta.n', T('Necessitem rols clars i objectius per equips.')]
      ] },
      { t: 'lesson', id: 'L_lideratge' },
      { t: 'choice', key: 'equip73', prompt: T('Com organitzes l\'equip?'), opts: [
        { t: T('Responsables per àrea (analítica, creativitat, comptes) amb objectius trimestrals; {en} es dedica a direcció i clients clau'), v: 'responsables', fx: (S) => ({ hire: { id: 'comptes', name: T('Responsable de comptes'), salary: 2800 }, trust: { julia: 2, berta: 2 }, rep: 3, xp: 50, flags: { cremat: false }, log: T('Va crear una estructura amb responsables per àrea.'), key: true }) },
        { t: T('Contractar molts perfils júnior perquè facin la feina'), v: 'juniors', fx: { hire: { id: 'juniors', name: T('Tres perfils júnior'), salary: 5400 }, trust: { julia: -1, berta: -1 }, log: T('Va contractar tres juniors sense responsables.') }, say: [['julia.a', T('I qui els forma? Jo no tinc temps!')]] },
        { t: T('Continuar com fins ara: tot passa per {en}'), v: 'igual', fx: { trust: { julia: -2, berta: -2 }, rep: -2 }, say: [['berta.w', T('{nom}... així no creixerem mai.')]] }
      ] }
    ]
  });

  CH('7.4', {
    title: T('La decisió sobre la segona seu'), who: 'laia', bg: 'barcelona', weeks: 2,
    blurb: T('Oficina a Barcelona o equips distribuïts des d\'Osona?'),
    steps: [
      { t: 'dlg', lines: (S) => [
        ['laia.n', S.f.laiaAliada ? T('{nom}, si obriu oficina a Barcelona, us podria cedir un espai a prop de la nostra. Seria bo per als dos.') : T('He sentit que esteu pensant en Barcelona. Benvinguts a la competència directa.')],
        ['pau.t', T('Barcelona vol dir clients grans i talent. També lloguers alts i més complexitat.')]
      ] },
      { t: 'choice', key: 'seu74', prompt: T('Què decideixes?'), opts: [
        { t: T('Obrir oficina a Barcelona (+1.800 €/mes)'), v: 'bcn', fx: (S) => ({ rent: S.rent + 1800, rep: 4, flags: { bcn: true }, money: 3000, log: T('Va obrir una segona oficina a Barcelona.'), key: true }), say: [['', T('Tres clients nous de Barcelona en el primer trimestre. També el doble de reunions de coordinació.')]] },
        { t: T('Mantenir tota l\'activitat a Osona amb equips distribuïts i visites als clients'), v: 'osona', fx: { rep: 2, flags: { equilibri: 3 }, log: T('Va mantenir l\'agència a Osona amb treball distribuït.'), key: true }, say: [['julia.h', T('L\'equip ho agraeix: menys desplaçaments i més concentració.')]] },
        { t: T('Coworking a Barcelona dos dies per setmana (+400 €/mes)'), v: 'cowork', fx: (S) => ({ rent: S.rent + 400, rep: 3, money: 1500, log: T('Va optar per un coworking a Barcelona dos dies per setmana.') }), say: [['pau.h', T('Presència a Barcelona sense un gran cost fix. Equilibri.')]] }
      ] }
    ]
  });

  CH('7.5', {
    title: T('La nova generació del màrqueting'), who: 'berta', bg: 'oficina', weeks: 2,
    blurb: T('IA, automatització i personalització. La competència és més ràpida i barata.'),
    steps: [
      { t: 'dlg', lines: [
        ['berta.t', T('Hi ha agències que ofereixen 100 publicacions al mes per 300 € fetes amb IA. Els clients pregunten.')],
        ['julia.n', T('La IA ens pot fer molt més ràpids. Però també pot inventar dades i cometre errors greus.')]
      ] },
      { t: 'lesson', id: 'L_ia' },
      { t: 'multi', key: 'ia75', pick: 3, prompt: T('Tria 3 usos de la IA que l\'agència adoptarà'), opts: [
        { t: T('Generar variants de títols i anuncis que una persona revisa abans de provar-les'), ok: true, why: T('Accelera la creativitat amb control humà.') },
        { t: T('Resumir informes de dades, comprovant les xifres amb la font'), ok: true, why: T('Estalvia temps sense renunciar al rigor.') },
        { t: T('Classificar per temes milers de comentaris de clients'), ok: true, why: T('Escolta social a escala.') },
        { t: T('Publicar automàticament contingut sense revisió'), ok: false, why: T('Errors, to inadequat i promeses falses.') },
        { t: T('Generar ressenyes positives per als clients'), ok: false, why: T('Enganyós i il·legal.') },
        { t: T('Pujar la base de dades de clients a una eina pública'), ok: false, why: T('Vulnera la protecció de dades.') },
        { t: T('Clonar la veu d\'un actor per a un anunci sense permís'), ok: false, why: T('Vulnera drets d\'imatge i de veu.') }
      ], fx: (S, g) => ({ xp: g * 15, know: { avancat: 1 } }) },
      { t: 'choice', key: 'iapol', prompt: T('Quina política d\'IA adopta l\'agència?'), opts: [
        { t: T('IA com a eina amb supervisió humana, transparència amb els clients i cap dada personal en eines sense garanties'), v: 'responsable', fx: { rep: 5, xp: 40, log: T('Va adoptar una política d\'ús responsable de la IA.'), key: true }, say: [['julia.h', T('Ràpids i fiables. Aquesta és la nostra diferència.')]] },
        { t: T('Rebaixar preus un 40 % i automatitzar-ho tot'), v: 'barata', fx: (S) => ({ rep: -4, clientFee: Object.fromEntries(S.clients.map(c => [c.id, -Math.round(c.fee * 0.2)])), log: T('Va automatitzar-ho tot i va rebaixar preus.') }), say: [['berta.a', T('Ara competim amb els que fan 100 publicacions per 300 €. I perdrem.')]] },
        { t: T('No fer servir IA en cap cas'), v: 'res', fx: { rep: -1 }, say: [['julia.t', T('Respectable, però anirem més lents que la competència.')]] }
      ] },
      { t: 'dlg', lines: [['pau.t', T('L\'agència ja té una dimensió considerable. El repte ja no és el pròxim client, sinó quina empresa volem ser.')]] }
    ]
  });

  /* ============================================================
     ETAPA 8 — L'EMPRESA QUE HAS CONSTRUÏT
     ============================================================ */
  CH('8.1', {
    title: T('La revisió de tota una carrera'), who: 'julia', bg: 'vic', weeks: 1,
    blurb: T('Tots els personatges tornen. Les seves reaccions depenen del que has fet.'),
    steps: [
      { t: 'dlg', lines: (S) => {
        const t = S.trust, L = [['', T('Deu anys després d\'aquell despatx damunt la merceria. Festa de l\'agència a la Plaça Major.')]];
        L.push(t.carme >= 4 ? ['carme.h', T('El forn té cua cada tarda. I tot va començar amb una fitxa de Google mal posada. Ets de casa, {nom}.')] : t.carme >= 1 ? ['carme.n', T('Ens has ajudat, {nom}. No sempre has tingut temps per a nosaltres, però ens has ajudat.')] : ['carme.w', T('Fa temps que no ens veiem, {nom}. Massa feina, suposo.')]);
        L.push(t.miquel >= 4 ? ['miquel.h', T('Has portat comandes de veritat a la fàbrica. La quarta generació ja ven a l\'estranger.')] : t.miquel >= 1 ? ['miquel.n', T('Bona feina, en general. Les oportunitats han estat reals.')] : ['miquel.t', T('Esperava més qualitat en les oportunitats, la veritat.')]);
        if (S.f.met_julia) L.push(t.julia >= 3 ? ['julia.h', T('Les dades no menteixen: hem construït una empresa sòlida. I he après tant com tu.')] : ['julia.t', T('Les xifres tenen llums i ombres. Ho veurem a l\'informe.')]);
        if (S.f.met_berta) L.push(t.berta >= 3 ? ['berta.h', T('Tenim una identitat pròpia. Els clients ens reconeixen. Això no té preu.')] : ['berta.n', T('Hem fet coses boniques. Algunes, fins i tot efectives.')]);
        if (S.f.met_quim) L.push(S.f.quimFora ? ['quim.n', T('Encara et guardo una mica de rancúnia, {g:nano|nena|nano}. Però reconec que {g:eres seriós|eres seriosa|vas ser seriós}.')] : t.quim >= 1 ? ['quim.h', T('Amb tu he après que «tot el digital» no existeix. I ara venc més que mai.')] : ['quim.t', T('Ha estat una relació... intensa.')]);
        if (S.f.met_laia) L.push(t.laia >= 2 ? ['laia.h', T('Competència, sòcia i amiga. Qui ho havia de dir, aquell dia a la fira?')] : ['laia.n', T('Has crescut molt, {nom}. Ens continuarem trobant als concursos.')]);
        L.push(['pau.t', T('La Júlia ha preparat un informe final. És hora de mirar enrere amb honestedat.')]);
        return L;
      } },
      { t: 'report' }
    ]
  });

  CH('8.2', {
    title: T('La decisió final'), who: 'pau', bg: 'vic', weeks: 0,
    blurb: T('Tres oportunitats alhora. Quin futur vols?'),
    steps: [
      { t: 'dlg', lines: (S) => [
        ['', T('La mateixa setmana arriben tres propostes.')],
        ['laia.n', S.f.laiaAliada ? T('{nom}, el meu grup vol comprar {agencia}. Mantindríeu la marca i l\'equip. Seria una fusió entre iguals.') : T('Un grup internacional vol comprar {agencia}. M\'han demanat que t\'ho faci arribar.')],
        ['ramon.n', S.f.inversor ? T('Com a soci, et proposo l\'expansió: oficines a França i Portugal en dos anys.') : T('Si voleu fer el salt internacional, hi ha capital disponible. França i Portugal.')],
        ['julia.n', T('I l\'opció de consolidar-nos a Catalunya: créixer amb calma, ser referents aquí.')],
        ['pau.t', T('Quin futur vull per a l\'empresa que hem construït?')]
      ] },
      { t: 'choice', key: 'final', prompt: T('La decisió final'), opts: [
        { t: T('🤝 Vendre l\'agència'), d: T('Una nova etapa per a {en}, amb l\'equip protegit.'), v: 'vendre' },
        { t: T('🌍 Expandir-la internacionalment'), d: T('França, Portugal i més enllà.'), v: 'expandir', req: (S) => S.f.franca && S.rep >= 50, },
        { t: T('🏔️ Consolidar-la a Catalunya'), d: T('Créixer amb calma i ser referents aquí.'), v: 'consolidar' },
        { t: T('🌿 Rebutjar-les totes i mantenir l\'agència tal com és'), d: T('Triar projectes, cuidar l\'equip i tenir vida.'), v: 'vida', req: (S) => !S.f.creixementRapid }
      ] },
      { t: 'ending' }
    ]
  });
  // Etiquetes dels requisits de la decisió final
  GD.chapters['8.2'].steps[1].opts[1].req.label = T('Requereix experiència internacional i reputació ≥ 50');
  GD.chapters['8.2'].steps[1].opts[3].req.label = T('No compatible amb un inversor que exigeix creixement ràpid');

  /* ============================================================
     FINALS
     ============================================================ */
  GD.endings = {
    osona: { title: T('Final 1 — L\'orgull d\'Osona'), bg: 'vic', cast: ['pau', 'carme', 'miquel', 'julia'], text: [
      T('{agencia} es manté independent, rendible i arrelada al territori. Té una cartera estable, clients fidels i un equip petit que s\'estima la feina.'),
      T('{En} ha prioritzat la qualitat, les relacions i la sostenibilitat. Quan algú d\'Osona pregunta «qui em pot ajudar amb el màrqueting?», la resposta sol ser la mateixa.')
    ] },
    referents: { title: T('Final 2 — Referents en una especialitat'), bg: 'oficina', cast: ['pau', 'julia', 'berta', 'marta'], text: [
      T('{agencia} s\'ha convertit en un referent tècnic. Rep projectes complexos, treballa amb clients grans i és coneguda per la qualitat dels resultats.'),
      T('Les universitats conviden {en} a fer classes i els competidors estudien els seus casos.')
    ] },
    grup: { title: T('Final 3 — El grup internacional'), bg: 'franca', cast: ['pau', 'amelie', 'ramon', 'laia'], text: [
      T('{agencia} ha crescut a diversos mercats. {En} dirigeix equips a Vic, Barcelona i Lió, i unitats de negoci que mai no hauria imaginat.'),
      T('Ha après a equilibrar creixement, rendibilitat i complexitat. Alguns dies troba a faltar aquell despatx damunt la merceria.')
    ] },
    ordre: { title: T('Final 4 — Tornar a posar ordre'), bg: 'despatx:night', cast: ['pau', 'julia'], text: [
      T('L\'empresa va créixer massa de pressa i va acumular problemes de tresoreria i gestió. Ha calgut reduir l\'estructura i renegociar deutes.'),
      T('No és una derrota: {agencia} és ara més petita, però ordenada. {En} ha après la lliçó més cara de totes: créixer no és el mateix que millorar.')
    ] },
    vida: { title: T('Final 5 — La vida que volies'), bg: 'vic', cast: ['pau', 'carme', 'berta'], text: [
      T('{En} ha decidit no perseguir el creixement indefinit. Ha construït una empresa viable que li permet triar projectes, cuidar l\'equip i tenir temps per a la vida.'),
      T('Els dissabtes continua comprant el pa al forn de la Carme. I continua fent preguntes abans de proposar res.')
    ] }
  };

  GD.computeEnding = function (S) {
    const cash = S.money + S.reserve;
    if (cash < 0 || (S.f.creixementRapid && cash < 15000) || (S.f.numerosVermells || 0) >= 8) return 'ordre';
    switch (S.f.final) {
      case 'expandir': return 'grup';
      case 'vida': return 'vida';
      case 'vendre': return 'vida';
      default: return (S.f.path === 'A' || S.rep < 55) ? 'osona' : 'referents';
    }
  };

  GD.epilogue = function (S) {
    const E = [];
    if (S.f.final === 'vendre') E.push(S.rep >= 60 ? T('La venda es tanca a un preu excel·lent: la reputació de l\'agència valia molt. L\'equip conserva la feina i la marca.') : T('La venda es tanca, però a un preu modest. L\'equip continua sota una altra direcció.'));
    if (S.trust.carme >= 4) E.push(T('La Carme ha obert un obrador i ven coques a vint cafeteries de la comarca.'));
    if (S.trust.miquel >= 4) E.push(T('Mecanitzats Bellmunt exporta a cinc països. Miquel encara diu que «els m\'agrades no paguen nòmines».'));
    if (S.f.met_julia && S.trust.julia >= 3) E.push(T('La Júlia és sòcia de l\'agència i fa classes d\'analítica a la universitat.'));
    if (S.f.met_berta && S.trust.berta >= 3) E.push(T('La Berta ha guanyat un premi de creativitat amb una campanya que, a més, va vendre.'));
    if (S.f.laiaAliada || S.trust.laia >= 2) E.push(T('La Laia i {en} comparteixen projectes cada any. La competència s\'ha convertit en aliança.'));
    if (S.f.sergiEngany) E.push(T('El Sergi va acabar descobrint que aquella primera campanya no havia venut res. Mai no ho va oblidar.'));
    if (S.f.quimFora) E.push(T('En Quim va passar per quatre agències més. Totes amb «tot el digital».'));
    return E;
  };

  /* ============================================================
     ENCÀRRECS LLIURES (repetibles)
     ============================================================ */
  GD.gigs = [
    { id: 'g_perru', who: 'client', title: T('Perruqueria sense clientes al matí'), area: 'seo', pay: 180, intro: T('Una perruqueria de Manlleu té el matí buit.'), problem: T('La fitxa de Google no diu que obren a les 9 h i no es pot reservar en línia. Què proposes?'), opts: [
      { t: T('Actualitzar la fitxa, activar reserves en línia i una oferta de matí'), q: 0.9, r: T('Les reserves del matí es dupliquen en tres setmanes.') },
      { t: T('Fer vídeos per a TikTok'), q: 0.35, r: T('Molts visionats de gent jove de fora, poques reserves.') },
      { t: T('Repartir fulletons a tot Osona'), q: 0.4, r: T('Algunes trucades, però cost alt per reserva.') }] },
    { id: 'g_casa', who: 'client', title: T('Casa rural amb reserves per Booking'), area: 'web', pay: 220, intro: T('Una casa rural paga molta comissió a les plataformes.'), problem: T('Vol més reserves directes. Què prioritzes?'), opts: [
      { t: T('Web pròpia amb reserva directa, millor preu garantit i correu als antics hostes que van acceptar rebre\'n'), q: 0.9, r: T('El 30 % de les reserves passen a ser directes.') },
      { t: T('Deixar Booking de cop'), q: 0.2, r: T('Les reserves cauen en picat.') },
      { t: T('Comprar una llista de correus de turistes'), q: 0.1, r: T('Queixes i problemes de protecció de dades.') }] },
    { id: 'g_ferret', who: 'client', title: T('Ferreteria i el supermercat de bricolatge'), area: 'fonaments', pay: 160, intro: T('Una gran superfície de bricolatge ha obert a Vic.'), problem: T('La ferreteria de barri no pot competir en preu. On es diferencia?'), opts: [
      { t: T('Assessorament expert, servei a domicili i comandes per WhatsApp'), q: 0.85, r: T('Els clients professionals tornen.') },
      { t: T('Baixar preus un 25 %'), q: 0.25, r: T('Marge destruït; la gran superfície baixa encara més.') },
      { t: T('Canviar el logo'), q: 0.2, r: T('Bonic, però tot continua igual.') }] },
    { id: 'g_dentista', who: 'client', title: T('Clínica dental i anuncis cars'), area: 'ads', pay: 260, intro: T('Una clínica dental gasta 1.000 €/mes en anuncis.'), problem: T('CTR del 4 %, 300 clics, 2 cites. Què revises primer?'), opts: [
      { t: T('La pàgina de destinació i el formulari de cita al mòbil'), q: 0.9, r: T('El formulari no funcionava al mòbil. Ara: 24 cites/mes.') },
      { t: T('Canviar l\'anunci'), q: 0.3, r: T('El CTR ja era bo; les cites no pugen.') },
      { t: T('Duplicar el pressupost'), q: 0.15, r: T('Més clics, mateixes cites, més cost.') }] },
    { id: 'g_vi', who: 'client', title: T('Celler del Lluçanès'), area: 'marca', pay: 240, intro: T('Un celler petit vol vendre a restaurants de Barcelona.'), problem: T('Quin missatge proposes?'), opts: [
      { t: T('Història real del celler, varietats autòctones i maridatges per a cartes de restaurant'), q: 0.85, r: T('Quatre restaurants hi incorporen els vins.') },
      { t: T('«El millor vi del món»'), q: 0.2, r: T('Ningú no s\'ho creu.') },
      { t: T('Copiar l\'estil d\'un celler famós'), q: 0.3, r: T('Es confon amb la competència.') }] },
    { id: 'g_ong', who: 'client', title: T('Entitat social que vol voluntaris'), area: 'xarxes', pay: 140, intro: T('Una entitat de Vic necessita voluntaris per al banc d\'aliments.'), problem: T('Com ho plantejaries?'), opts: [
      { t: T('Històries reals de voluntaris, crida concreta (dates i hores) i formulari senzill'), q: 0.9, r: T('45 inscripcions en dues setmanes.') },
      { t: T('Publicar «Necessitem voluntaris» cada dia'), q: 0.35, r: T('Poca resposta: no hi ha concreció.') },
      { t: T('Un sorteig de samarretes'), q: 0.25, r: T('Molts participants, pocs voluntaris.') }] },
    { id: 'g_report', who: 'client', title: T('Informe per a un comitè de direcció'), area: 'analitica', pay: 300, minStage: 2, intro: T('Una empresa et demana un informe de resultats digitals.'), problem: T('Quina estructura proposes?'), opts: [
      { t: T('Objectiu → resultats comercials → resultats de màrqueting → activitat → recomanacions'), q: 0.9, r: T('El comitè entén l\'informe en cinc minuts.') },
      { t: T('Totes les mètriques de totes les plataformes'), q: 0.3, r: T('Quaranta pàgines que ningú no llegeix.') },
      { t: T('Només els seguidors i els m\'agrada'), q: 0.1, r: T('La directora financera fa preguntes incòmodes.') }] },
    { id: 'g_b2b', who: 'client', title: T('Fabricant de pinsos'), area: 'creixement', pay: 320, minStage: 2, intro: T('Un fabricant vol captar granges com a clients.'), problem: T('Quin canal prioritzes?'), opts: [
      { t: T('Contingut tècnic útil, fires del sector i seguiment comercial en 24 h'), q: 0.85, r: T('Contactes qualificats i tres clients nous.') },
      { t: T('Anuncis a Instagram per a públic jove urbà'), q: 0.15, r: T('Cap granger a la vista.') },
      { t: T('Enviar correus massius a una base comprada'), q: 0.1, r: T('Queixes i risc legal.') }] },
    { id: 'g_preu', who: 'client', title: T('Pressupost per a una web'), area: 'direccio', pay: 260, minStage: 3, intro: T('Un client vol «una web senzilla», però canvia d\'idea cada dia.'), problem: T('Com plantegeu el pressupost?'), opts: [
      { t: T('Abast tancat, dues rondes de revisió i canvis fora d\'abast pressupostats a part'), q: 0.9, r: T('Projecte entregat a temps i amb marge.') },
      { t: T('Preu tancat, «el que calgui»'), q: 0.2, r: T('Tres mesos de canvis. Pèrdues.') },
      { t: T('Cobrar per hores sense estimació'), q: 0.45, r: T('El client se sent insegur i regateja cada factura.') }] },
    { id: 'g_crisi', who: 'client', title: T('Hotel amb una ressenya viral'), area: 'xarxes', pay: 300, minStage: 4, intro: T('Un hotel rep una ressenya negativa que es fa viral.'), problem: T('Què li recomanes?'), opts: [
      { t: T('Respondre amb empatia, reconèixer l\'error, explicar la solució i aplicar-la'), q: 0.9, r: T('La resposta es comparteix com a exemple de bona gestió.') },
      { t: T('Amenaçar el client amb accions legals'), q: 0.1, r: T('Efecte Streisand: tothom en parla.') },
      { t: T('No dir res i esperar'), q: 0.35, r: T('La crisi s\'apaga lentament, però deixa marca.') }] },
    { id: 'g_ab', who: 'client', title: T('Prova A/B d\'una botiga en línia'), area: 'analitica', pay: 340, minStage: 5, intro: T('Una botiga ha provat dos botons de compra durant dos dies.'), problem: T('Botó verd: 6 vendes. Botó taronja: 4. Què recomanes?'), opts: [
      { t: T('Continuar la prova fins a tenir prou dades amb el criteri definit abans'), q: 0.9, r: T('Al cap de tres setmanes, no hi havia diferència real.') },
      { t: T('El verd guanya: canviar-ho tot'), q: 0.3, r: T('Conclusió precipitada.') },
      { t: T('Provar deu colors alhora'), q: 0.3, r: T('Massa variants per a poc trànsit.') }] },
    { id: 'g_ia', who: 'client', title: T('Textos amb IA per a un e-commerce'), area: 'avancat', pay: 380, minStage: 6, intro: T('Un e-commerce vol generar 2.000 descripcions de producte amb IA.'), problem: T('Com ho planteges?'), opts: [
      { t: T('Plantilla amb dades reals de cada producte, generació amb IA i revisió per mostreig abans de publicar'), q: 0.9, r: T('Ràpid, coherent i sense errors greus.') },
      { t: T('Generar-les i publicar-les directament'), q: 0.25, r: T('Diverses descripcions inventen característiques que el producte no té.') },
      { t: T('Escriure-les totes a mà'), q: 0.5, r: T('Bona qualitat, però sis mesos de feina.') }] },
    { id: 'g_intl', who: 'client', title: T('Formatgeria que vol vendre a Andorra'), area: 'avancat', pay: 360, minStage: 7, intro: T('Una formatgeria vol vendre a Andorra.'), problem: T('Quin és el primer pas?'), opts: [
      { t: T('Investigar demanda, normativa d\'enviament i distribuïdors, i fer una prova petita'), q: 0.9, r: T('Dos distribuïdors interessats i la logística resolta.') },
      { t: T('Llançar una campanya gran directament'), q: 0.25, r: T('Les comandes no es poden enviar per la normativa duanera.') },
      { t: T('Traduir la web al francès'), q: 0.3, r: T('A Andorra la llengua oficial és el català...') }] }
  ];
})();
