/* Agència Digital — guió de les etapes 6, 7 i 8, encàrrecs i finals */
(function () {
  const CH = (id, o) => { GD.chapters[id] = Object.assign({ id, stage: +id.split('.')[0] }, o); };
  const tbl = GD.tbl;
  const has = (S, id) => S.clients.some(c => c.id === id);
  const recurring = (S) => S.clients.reduce((a, c) => a + c.fee, 0);
  const PATHS = { A: 'Especialista en negocis locals', B: 'Agència de rendiment', C: 'Estudi de marca i comerç electrònic' };

  /* ============================================================
     ETAPA 6 — CRÉIXER SENSE PERDRE EL NORD
     ============================================================ */
  CH('6.1', {
    title: 'Tres camins de creixement', who: 'julia', bg: 'oficina', weeks: 1,
    blurb: 'Quin tipus d\'agència vols construir?',
    steps: [
      { t: 'dlg', lines: (S) => [
        ['julia.n', 'He preparat les dades de l\'any. Els projectes locals són els que tenen més marge i fidelitat.'],
        ['julia.t', 'Els de rendiment (anuncis i analítica) creixen més de pressa, però els clients exigeixen proves constants.'],
        ['berta.h', 'I els projectes de marca i botiga en línia són els que ens fan més feliços... i els que guanyen premis!'],
        ['pau.t', `Ingressos recurrents: ${recurring(S).toLocaleString('ca-ES')} €/mes. Equip: ${S.team.length + 1} persones. Ara toca triar.`]
      ] },
      { t: 'choice', key: 'path', prompt: 'Quina línia principal tries per a l\'agència?', sub: 'Pots combinar especialitats més endavant, però cada línia requereix recursos.', opts: [
        { t: '🏘️ Camí A — Especialista en negocis locals', d: 'Comerços, restaurants, serveis i empreses de proximitat. Relació personal i reputació local.', v: 'A', fx: { know: { seo: 1, mercat: 1 }, trust: { carme: 1 }, rep: 3, log: 'Va triar el camí A: especialista en negocis locals.', key: true } },
        { t: '📈 Camí B — Agència de rendiment', d: 'Publicitat, analítica, conversió i creixement mesurable. Informes rigorosos.', v: 'B', fx: { know: { ads: 1, analitica: 1 }, trust: { julia: 1 }, rep: 3, log: 'Va triar el camí B: agència de rendiment.', key: true } },
        { t: '🛍️ Camí C — Estudi de marca i comerç electrònic', d: 'Identitat, continguts, experiència de compra i llançaments.', v: 'C', fx: { know: { marca: 1, web: 1 }, trust: { berta: 1 }, rep: 3, log: 'Va triar el camí C: estudi de marca i comerç electrònic.', key: true } }
      ] },
      { t: 'dlg', lines: (S) => ({
        A: [['julia.h', 'Arrelats al territori. Té sentit amb el que hem construït.'], ['berta.n', 'Faré que els comerços d\'Osona siguin els més macos de Catalunya.']],
        B: [['julia.h', 'Per fi! Experiments, atribució, incrementalitat... Em poso a dissenyar els quadres de comandament.'], ['berta.t', 'Doncs jo faré que els anuncis siguin efectius i bonics alhora.']],
        C: [['berta.h', 'Síííí! Marques amb ànima i botigues que venen.'], ['julia.n', 'Sempre que puguem mesurar-ho, compto amb vosaltres.']]
      })[S.f.path] }
    ]
  });

  CH('6.2', {
    title: 'El primer client gran', who: 'marta', bg: 'oficina', weeks: 3,
    blurb: 'Un pressupost molt superior, processos d\'aprovació i informes rigorosos.',
    steps: [
      { t: 'fx', silent: true, fx: { flags: { met_marta2: true } } },
      { t: 'dlg', lines: (S) => [
        ['marta.n', (S.f.met_marta ? 'Pau, ens vam conèixer a la fira, recordes? ' : '') + 'Marta Coll, directora de màrqueting de Làctics de la Plana.'],
        ['marta.n', 'Volem una agència per a tot l\'any: llançament de iogurts, botiga en línia i campanyes. Uns 6.000 € al mes d\'honoraris.'],
        ['marta.t', 'Però us aviso: informes mensuals al comitè, tres nivells d\'aprovació i coordinació amb el nostre equip de vendes i el de qualitat.'],
        ['pau.t', '(És més del doble del que factura qualsevol altre client. Podem assumir-ho sense descuidar la resta?)']
      ] },
      { t: 'choice', key: 'gran62', prompt: 'Com respons a la Marta?', opts: [
        { t: 'Acceptar i adaptar l\'agència: responsable de compte, una persona de suport, KPI pactats i calendari d\'aprovacions', v: 'preparat', req: { money: 4000 }, fx: { client: { id: 'marta', name: 'Làctics de la Plana', fee: 6000 }, hire: { id: 'suport', name: 'Arnau (suport de comptes)', salary: 2200 }, rep: 6, xp: 50, log: 'Va guanyar el primer client gran amb un pla de recursos.', key: true }, say: [['marta.h', 'Això és professionalitat. Signem.']] },
        { t: 'Acceptar sense canviar res: ja ens en sortirem', v: 'sensepla', fx: { client: { id: 'marta', name: 'Làctics de la Plana', fee: 6000 }, trust: { carme: -1, miquel: -1, julia: -1 }, rep: -2, flags: { sobrecarrega: 2 }, log: 'Va acceptar un client gran sense capacitat.', key: true }, say: [['', 'Dos mesos després: la Carme espera una resposta des de fa tres setmanes i Miquel ha rebut un informe amb errors.'], ['julia.a', 'Pau, no arribem. Els altres clients ho noten.']] },
        { t: 'Proposar una fase pilot de 3 mesos per demostrar valor i ajustar recursos', v: 'pilot', fx: { client: { id: 'marta', name: 'Làctics de la Plana (pilot)', fee: 3000 }, rep: 4, xp: 40, flags: { martaPilot: true }, log: 'Va proposar una fase pilot al client gran.' }, say: [['marta.t', 'Prudent. M\'agrada. Si el pilot funciona, ampliem.']] },
        { t: 'Declinar: ara no tenim capacitat', v: 'no', say: [['marta.n', 'Ho entenc. Potser més endavant.']] }
      ] }
    ]
  });

  CH('6.3', {
    title: 'La temptació del creixement ràpid', who: 'ramon', bg: 'oficina', weeks: 2,
    blurb: 'Un inversor vol finançar l\'expansió. Diners... i expectatives.',
    steps: [
      { t: 'dlg', lines: [
        ['ramon.n', 'Ramon Ferrer. Inverteixo en empreses de serveis. He seguit la vostra trajectòria.'],
        ['ramon.h', 'Us ofereixo 80.000 € a canvi del 30 % de l\'agència. Amb això podeu contractar cinc persones i anar a buscar clients grans.'],
        ['ramon.t', 'A canvi, vull duplicar la facturació en dos anys i un seient al consell.']
      ] },
      { t: 'lesson', id: 'L_financament' },
      { t: 'choice', key: 'inv63', prompt: 'Què fas amb l\'oferta de Ramon?', opts: [
        { t: 'Acceptar: 80.000 € pel 30 %', v: 'acceptar', fx: (S) => ({ money: 80000, hire: { id: 'nous', name: 'Equip nou (4 persones)', salary: 9600 }, rent: Math.max(S.rent, 1600), flags: { creixementRapid: true, inversor: true }, log: 'Va acceptar 80.000 € d\'un inversor pel 30 % de l\'agència.', key: true }), say: [['ramon.h', 'Excel·lent. Ara, a créixer!'], ['julia.w', 'Pau... amb cinc persones més, les despeses fixes es tripliquen.']] },
        { t: 'Negociar: 50.000 € pel 15 %, sense seient al consell i amb objectius realistes', v: 'negociar', req: { skill: 'comercial', min: 3 }, fx: { money: 50000, hire: { id: 'nous', name: 'Equip nou (2 persones)', salary: 4800 }, flags: { inversor: true }, xp: 60, log: 'Va negociar una entrada d\'inversor moderada i amb control.', key: true }, say: [['ramon.t', 'Negocies bé. D\'acord.']] },
        { t: 'Rebutjar l\'oferta', v: 'rebutjar', fx: { log: 'Va rebutjar l\'oferta de l\'inversor.' }, say: [['ramon.n', 'Respecto la decisió. Si canvies d\'opinió, ja saps on sóc.']] },
        { t: 'Créixer amb beneficis propis, pas a pas', v: 'propis', fx: { rep: 1, flags: { autofinancat: true, equilibri: 2 }, log: 'Va decidir créixer amb beneficis propis.', key: true }, say: [['pau.h', 'Més lent, però l\'empresa continua sent nostra.']] }
      ] }
    ]
  });

  CH('6.4', {
    title: 'La marca de l\'agència', who: 'berta', bg: 'despatx', weeks: 1,
    blurb: 'Com es presenta l\'agència al mercat? Quins projectes rebutja?',
    steps: [
      { t: 'dlg', lines: [['berta.h', 'Pau, és hora que l\'agència tingui una marca pròpia de veritat. Una promesa. Quina és la nostra?']] },
      { t: 'lesson', id: 'L_marca' },
      { t: 'choice', key: 'marca64', prompt: 'Quina promesa farà l\'agència?', opts: (S) => [
        { t: ({ A: '«Fem créixer els negocis d\'Osona amb dades i proximitat.»', B: '«Creixement mesurable: si no es pot demostrar, no ho venem.»', C: '«Marques amb ànima que venen.»' })[S.f.path || 'A'], v: 'coherent', d: 'Coherent amb el camí triat.', fx: { rep: 5, xp: 40, log: 'Va definir una promesa de marca coherent amb la seva especialitat.' } },
        { t: '«Fem tot el que necessitis, quan ho necessitis.»', v: 'generic', d: 'Agrada a tothom... i a ningú.', fx: { rep: -1 } },
        { t: '«Resultats garantits o et tornem els diners.»', v: 'promesa', d: 'Impactant, però arriscada.', fx: { rep: 2, flags: { garantia: true } } }
      ] },
      { t: 'dlg', lines: (S) => ({
        coherent: [['berta.h', 'Clara, creïble i difícil de copiar. Ara tot el que fem ha d\'estar a l\'altura.'], ['', 'Al cap d\'un mes, arriben contactes que encaixen molt millor amb l\'agència. Rebutgeu dos projectes que no hi encaixen.']],
        generic: [['berta.w', 'Això ho diu tothom...'], ['', 'Els contactes nous demanen de tot i a preus baixos.']],
        promesa: [['julia.a', 'Garantits? I si una campanya falla per culpa del client? Això ens portarà problemes.']]
      })[S.f.marca64] }
    ]
  });

  CH('6.5', {
    title: 'El repte de la retenció', who: 'miquel', bg: 'fabrica', weeks: 2,
    blurb: 'Un client important amenaça de marxar.',
    steps: [
      { t: 'dlg', lines: [
        ['miquel.a', 'Pau, et seré franc. Fa mesos que tinc la sensació que ja no m\'aporteu gaire. Els informes són iguals cada mes.'],
        ['miquel.t', 'M\'han trucat de Vidal & Co. M\'ho estic pensant.']
      ] },
      { t: 'lesson', id: 'L_ltv' },
      { t: 'choice', key: 'ret65', prompt: 'Com respons a Miquel?', opts: [
        { t: 'Analitzar resultats, escoltar les objeccions i presentar un pla de millora amb objectius nous', v: 'pla', fx: { trust: { miquel: 2 }, rep: 2, xp: 40 }, say: [['miquel.n', 'Això ja és una altra cosa. Tens tres mesos.']] },
        { t: 'Rebaixar la quota un 30 % perquè no marxi', v: 'rebaixa', fx: { clientFee: { miquel: -270 }, trust: { miquel: 0 } }, say: [['miquel.t', 'Més barat... però el problema no era el preu.']] },
        { t: 'Deixar-lo marxar', v: 'marxa', fx: { dropClient: 'miquel', trust: { miquel: -2 }, log: 'Va perdre Miquel com a client.', key: true }, say: [['miquel.n', 'Una llàstima. Hem fet coses bones junts.']] },
        { t: 'Presentar el valor de vida dels clients que l\'agència li ha portat i proposar una nova fase centrada en exportació', v: 'ltv', req: (S, H) => S.skills.analitica >= 3 || H.teamHas('julia'), fx: { trust: { miquel: 3 }, rep: 4, xp: 60, clientFee: { miquel: 400 }, log: 'Va retenir Miquel demostrant el valor de vida dels clients aconseguits.', key: true }, say: [['', 'Els 9 clients que l\'agència ha portat a Mecanitzats Bellmunt sumen 210.000 € de marge previst. El CAC mitjà ha estat de 1.300 €.'], ['miquel.h', 'Mai no ho havia vist així. Fem l\'exportació. I amplia el contracte.']] }
      ] }
    ]
  });

  /* ============================================================
     ETAPA 7 — MÉS ENLLÀ DE CATALUNYA
     ============================================================ */
  CH('7.1', {
    title: 'Un client de fora', who: 'amelie', bg: 'franca', weeks: 2,
    blurb: 'Una empresa vol vendre a França. No n\'hi ha prou amb traduir.',
    steps: [
      { t: 'dlg', lines: [
        ['amelie.h', 'Bonjour! Sóc l\'Amélie, responsable de mercat francès de Cosmètica del Montseny.'],
        ['amelie.n', 'Volem vendre els nostres sabons i cremes a França. La idea de la direcció és traduir la web i els anuncis i llestos.'],
        ['pau.t', '(Traduir no és localitzar...)']
      ] },
      { t: 'lesson', id: 'L_internacional' },
      { t: 'invest', who: 'amelie', time: 3, prompt: 'Investiga el mercat francès', opts: [
        { t: 'Quines paraules fan servir els compradors francesos?', flag: 'fr_kw', note: '«cosmétique naturelle certifiée bio», «savon saponifié à froid».', a: [['amelie.n', 'Busquen «cosmétique naturelle certifiée bio» i «savon saponifié à froid». La traducció literal del català gairebé no té cerques.']] },
        { t: 'Qui és la competència?', flag: 'fr_comp', note: 'Moltes marques locals amb certificació; preus 10–15 % més alts.', a: [['amelie.t', 'Moltes marques franceses petites, totes amb certificació. Preus entre un 10 i un 15 % més alts que els nostres.']] },
        { t: 'Com són la logística i les devolucions?', flag: 'fr_log', note: 'Esperen entrega en 48–72 h i devolució gratuïta.', a: [['amelie.w', 'Esperen entrega en 48–72 hores i devolució gratuïta. Ara trigaríem 6 dies.']] },
        { t: 'Què valoren culturalment?', flag: 'fr_cult', note: 'Certificacions i ingredients, més que l\'origen.', a: [['amelie.n', 'Valoren molt les certificacions i la llista d\'ingredients. Que siguem del Montseny els importa menys.']] }
      ] },
      { t: 'choice', key: 'fr71', prompt: 'Quina estratègia proposes?', opts: [
        { t: 'Traduir automàticament la web i els anuncis', v: 'traduir' },
        { t: 'Copiar la campanya que funciona a Catalunya', v: 'copiar' },
        { t: 'Localitzar: paraules clau franceses, missatge centrat en la certificació, preus adaptats i logística de 72 h amb un operador local', v: 'localitzar', fx: { xp: 40 } }
      ] },
      { t: 'fx', silent: true, fx: (S) => ({ flags: { franca: true, frQual: (S.f.fr71 === 'localitzar' ? 0.5 : 0.15) + ['fr_kw', 'fr_comp', 'fr_log', 'fr_cult'].filter(k => S.f[k]).length * 0.1 }, know: { avancat: 1 } }) },
      { t: 'dlg', lines: (S) => S.f.fr71 === 'localitzar' ? [['amelie.h', 'Parfait! La direcció volia anar de pressa, però això té molt més sentit.']] : [['amelie.w', 'D\'acord... però tinc dubtes que funcioni.']] }
    ]
  });

  CH('7.2', {
    title: 'La campanya internacional', who: 'amelie', bg: 'franca', weeks: 3,
    blurb: 'Prova petita, campanya completa o soci local?',
    steps: [
      { t: 'lesson', id: 'L_experiments' },
      { t: 'choice', key: 'test72', prompt: 'Com llances la campanya?', opts: (S) => [
        { t: 'Prova petita: 3.000 € entre França i Bèlgica amb criteri d\'èxit definit', v: 'prova', fx: { xp: 30 } },
        { t: 'Campanya completa: 25.000 € a tot França', v: 'completa' },
        { t: S.f.laiaAliada || S.trust.laia >= 2 ? 'Soci local: la Laia et presenta una agència de Lió amb qui col·labora' : 'Buscar un soci local a França', v: 'soci', fx: { trust: { laia: S.f.laiaAliada ? 1 : 0 } } }
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
        const F = [[(S.f.fr71 === 'localitzar') || false, S.f.fr71 === 'localitzar' ? 'La localització (certificació, paraules clau, logística) connecta amb el comprador francès.' : 'Sense localitzar, el missatge no connecta.']];
        if (v === 'completa') F.push([verdict === 'good' || false, verdict === 'good' ? 'L\'aposta forta ha sortit bé.' : 'Invertir 25.000 € sense provar abans ha amplificat les pèrdues.']);
        if (v === 'prova') F.push([true, 'La prova petita limita el risc i permet aprendre.']);
        if (v === 'soci') F.push([true, 'El soci local aporta coneixement del mercat i contactes amb distribuïdors.']);
        return {
          title: 'Campanya a França i Bèlgica',
          metrics: [['Inversió', H.eur(spend)], ['Vendes França', String(fr)], ['Vendes Bèlgica', String(be)], ['CPA', H.eur(cpa)], ['ROAS', String(roas).replace('.', ','), verdict]],
          summary: verdict === 'good' ? 'Cosmètica del Montseny ja ven a França.' : verdict === 'mid' ? 'Resultats prometedors però insuficients.' : 'El mercat francès no respon... encara.',
          verdict, factors: F,
          fx: { rep: verdict === 'good' ? 6 : verdict === 'mid' ? 2 : -2, money: v === 'completa' && verdict === 'bad' ? -2000 : 0, client: verdict !== 'bad' ? { id: 'amelie', name: 'Cosmètica del Montseny (França)', fee: 2500 } : null, flags: { frResult: verdict, frBe: be, frFr: fr }, log: `Campanya internacional a França: ${verdict === 'good' ? 'èxit' : verdict === 'mid' ? 'resultat parcial' : 'fracàs'}.`, key: true }
        };
      } },
      { t: 'choice', key: 'interp72', prompt: (S) => `L'Amélie pregunta: «Bèlgica té ${S.f.frBe || 4} vendes amb molt menys pressupost. Hi posem tots els diners?»`, opts: [
        { t: 'Sí: Bèlgica és millor perquè té un CPA més baix.', v: 'precipitat', fx: { rep: -1 }, say: [['julia.a', 'Amb tan poques vendes, la diferència pot ser atzar. No és una conclusió fiable.']] },
        { t: 'No hi ha prou dades: ampliem la prova a Bèlgica amb el mateix criteri i continuem a França.', v: 'prudent', fx: { xp: 40, trust: { julia: 1 } }, say: [['amelie.h', 'Té sentit. Prudència i dades.']] }
      ] }
    ]
  });

  CH('7.3', {
    title: 'L\'equip creix', who: 'julia', bg: 'oficina', weeks: 2,
    blurb: 'L\'empresa ja no pot dependre de la supervisió directa d\'en Pau.',
    steps: [
      { t: 'dlg', lines: (S) => [
        ['julia.w', 'Pau, tot passa per tu. Si estàs malalt una setmana, l\'agència s\'atura.'],
        S.f.cremat ? ['berta.w', 'I l\'equip encara arrossega el cansament dels mesos d\'hores extres.'] : ['berta.n', 'Necessitem rols clars i objectius per equips.']
      ] },
      { t: 'lesson', id: 'L_lideratge' },
      { t: 'choice', key: 'equip73', prompt: 'Com organitzes l\'equip?', opts: [
        { t: 'Responsables per àrea (analítica, creativitat, comptes) amb objectius trimestrals; en Pau es dedica a direcció i clients clau', v: 'responsables', fx: (S) => ({ hire: { id: 'comptes', name: 'Responsable de comptes', salary: 2800 }, trust: { julia: 2, berta: 2 }, rep: 3, xp: 50, flags: { cremat: false }, log: 'Va crear una estructura amb responsables per àrea.', key: true }) },
        { t: 'Contractar molts perfils júnior perquè facin la feina', v: 'juniors', fx: { hire: { id: 'juniors', name: 'Tres perfils júnior', salary: 5400 }, trust: { julia: -1, berta: -1 }, log: 'Va contractar tres juniors sense responsables.' }, say: [['julia.a', 'I qui els forma? Jo no tinc temps!']] },
        { t: 'Continuar com fins ara: tot passa per en Pau', v: 'igual', fx: { trust: { julia: -2, berta: -2 }, rep: -2 }, say: [['berta.w', 'Pau... així no creixerem mai.']] }
      ] }
    ]
  });

  CH('7.4', {
    title: 'La decisió sobre la segona seu', who: 'laia', bg: 'barcelona', weeks: 2,
    blurb: 'Oficina a Barcelona o equips distribuïts des d\'Osona?',
    steps: [
      { t: 'dlg', lines: (S) => [
        ['laia.n', S.f.laiaAliada ? 'Pau, si obriu oficina a Barcelona, us podria cedir un espai a prop de la nostra. Seria bo per als dos.' : 'He sentit que esteu pensant en Barcelona. Benvinguts a la competència directa.'],
        ['pau.t', 'Barcelona vol dir clients grans i talent. També lloguers alts i més complexitat.']
      ] },
      { t: 'choice', key: 'seu74', prompt: 'Què decideixes?', opts: [
        { t: 'Obrir oficina a Barcelona (+1.800 €/mes)', v: 'bcn', fx: (S) => ({ rent: S.rent + 1800, rep: 4, flags: { bcn: true }, money: 3000, log: 'Va obrir una segona oficina a Barcelona.', key: true }), say: [['', 'Tres clients nous de Barcelona en el primer trimestre. També el doble de reunions de coordinació.']] },
        { t: 'Mantenir tota l\'activitat a Osona amb equips distribuïts i visites als clients', v: 'osona', fx: { rep: 2, flags: { equilibri: 3 }, log: 'Va mantenir l\'agència a Osona amb treball distribuït.', key: true }, say: [['julia.h', 'L\'equip ho agraeix: menys desplaçaments i més concentració.']] },
        { t: 'Coworking a Barcelona dos dies per setmana (+400 €/mes)', v: 'cowork', fx: (S) => ({ rent: S.rent + 400, rep: 3, money: 1500, log: 'Va optar per un coworking a Barcelona dos dies per setmana.' }), say: [['pau.h', 'Presència a Barcelona sense un gran cost fix. Equilibri.']] }
      ] }
    ]
  });

  CH('7.5', {
    title: 'La nova generació del màrqueting', who: 'berta', bg: 'oficina', weeks: 2,
    blurb: 'IA, automatització i personalització. La competència és més ràpida i barata.',
    steps: [
      { t: 'dlg', lines: [
        ['berta.t', 'Hi ha agències que ofereixen 100 publicacions al mes per 300 € fetes amb IA. Els clients pregunten.'],
        ['julia.n', 'La IA ens pot fer molt més ràpids. Però també pot inventar dades i cometre errors greus.']
      ] },
      { t: 'lesson', id: 'L_ia' },
      { t: 'multi', key: 'ia75', pick: 3, prompt: 'Tria 3 usos de la IA que l\'agència adoptarà', opts: [
        { t: 'Generar variants de títols i anuncis que una persona revisa abans de provar-les', ok: true, why: 'Accelera la creativitat amb control humà.' },
        { t: 'Resumir informes de dades, comprovant les xifres amb la font', ok: true, why: 'Estalvia temps sense renunciar al rigor.' },
        { t: 'Classificar per temes milers de comentaris de clients', ok: true, why: 'Escolta social a escala.' },
        { t: 'Publicar automàticament contingut sense revisió', ok: false, why: 'Errors, to inadequat i promeses falses.' },
        { t: 'Generar ressenyes positives per als clients', ok: false, why: 'Enganyós i il·legal.' },
        { t: 'Pujar la base de dades de clients a una eina pública', ok: false, why: 'Vulnera la protecció de dades.' },
        { t: 'Clonar la veu d\'un actor per a un anunci sense permís', ok: false, why: 'Vulnera drets d\'imatge i de veu.' }
      ], fx: (S, g) => ({ xp: g * 15, know: { avancat: 1 } }) },
      { t: 'choice', key: 'iapol', prompt: 'Quina política d\'IA adopta l\'agència?', opts: [
        { t: 'IA com a eina amb supervisió humana, transparència amb els clients i cap dada personal en eines sense garanties', v: 'responsable', fx: { rep: 5, xp: 40, log: 'Va adoptar una política d\'ús responsable de la IA.', key: true }, say: [['julia.h', 'Ràpids i fiables. Aquesta és la nostra diferència.']] },
        { t: 'Rebaixar preus un 40 % i automatitzar-ho tot', v: 'barata', fx: (S) => ({ rep: -4, clientFee: Object.fromEntries(S.clients.map(c => [c.id, -Math.round(c.fee * 0.2)])), log: 'Va automatitzar-ho tot i va rebaixar preus.' }), say: [['berta.a', 'Ara competim amb els que fan 100 publicacions per 300 €. I perdrem.']] },
        { t: 'No fer servir IA en cap cas', v: 'res', fx: { rep: -1 }, say: [['julia.t', 'Respectable, però anirem més lents que la competència.']] }
      ] },
      { t: 'dlg', lines: [['pau.t', 'L\'agència ja té una dimensió considerable. El repte ja no és el pròxim client, sinó quina empresa volem ser.']] }
    ]
  });

  /* ============================================================
     ETAPA 8 — L'EMPRESA QUE HAS CONSTRUÏT
     ============================================================ */
  CH('8.1', {
    title: 'La revisió de tota una carrera', who: 'julia', bg: 'vic', weeks: 1,
    blurb: 'Tots els personatges tornen. Les seves reaccions depenen del que has fet.',
    steps: [
      { t: 'dlg', lines: (S) => {
        const t = S.trust, L = [['', 'Deu anys després d\'aquell despatx damunt la merceria. Festa de l\'agència a la Plaça Major.']];
        L.push(t.carme >= 4 ? ['carme.h', 'El forn té cua cada tarda. I tot va començar amb una fitxa de Google mal posada. Ets de casa, Pau.'] : t.carme >= 1 ? ['carme.n', 'Ens has ajudat, Pau. No sempre has tingut temps per a nosaltres, però ens has ajudat.'] : ['carme.w', 'Fa temps que no ens veiem, Pau. Massa feina, suposo.']);
        L.push(t.miquel >= 4 ? ['miquel.h', 'Has portat comandes de veritat a la fàbrica. La quarta generació ja ven a l\'estranger.'] : t.miquel >= 1 ? ['miquel.n', 'Bona feina, en general. Les oportunitats han estat reals.'] : ['miquel.t', 'Esperava més qualitat en les oportunitats, la veritat.']);
        if (S.f.met_julia) L.push(t.julia >= 3 ? ['julia.h', 'Les dades no menteixen: hem construït una empresa sòlida. I he après tant com tu.'] : ['julia.t', 'Les xifres tenen llums i ombres. Ho veurem a l\'informe.']);
        if (S.f.met_berta) L.push(t.berta >= 3 ? ['berta.h', 'Tenim una identitat pròpia. Els clients ens reconeixen. Això no té preu.'] : ['berta.n', 'Hem fet coses boniques. Algunes, fins i tot efectives.']);
        if (S.f.met_quim) L.push(S.f.quimFora ? ['quim.n', 'Encara et guardo una mica de rancúnia, nano. Però reconec que eres seriós.'] : t.quim >= 1 ? ['quim.h', 'Amb tu he après que «tot el digital» no existeix. I ara venc més que mai.'] : ['quim.t', 'Ha estat una relació... intensa.']);
        if (S.f.met_laia) L.push(t.laia >= 2 ? ['laia.h', 'Competència, sòcia i amiga. Qui ho havia de dir, aquell dia a la fira?'] : ['laia.n', 'Has crescut molt, Pau. Ens continuarem trobant als concursos.']);
        L.push(['pau.t', 'La Júlia ha preparat un informe final. És hora de mirar enrere amb honestedat.']);
        return L;
      } },
      { t: 'report' }
    ]
  });

  CH('8.2', {
    title: 'La decisió final', who: 'pau', bg: 'vic', weeks: 0,
    blurb: 'Tres oportunitats alhora. Quin futur vols?',
    steps: [
      { t: 'dlg', lines: (S) => [
        ['', 'La mateixa setmana arriben tres propostes.'],
        ['laia.n', S.f.laiaAliada ? 'Pau, el meu grup vol comprar {agencia}. Mantindríeu la marca i l\'equip. Seria una fusió entre iguals.' : 'Un grup internacional vol comprar {agencia}. M\'han demanat que t\'ho faci arribar.'],
        ['ramon.n', S.f.inversor ? 'Com a soci, et proposo l\'expansió: oficines a França i Portugal en dos anys.' : 'Si voleu fer el salt internacional, hi ha capital disponible. França i Portugal.'],
        ['julia.n', 'I l\'opció de consolidar-nos a Catalunya: créixer amb calma, ser referents aquí.'],
        ['pau.t', 'Quin futur vull per a l\'empresa que hem construït?']
      ] },
      { t: 'choice', key: 'final', prompt: 'La decisió final', opts: [
        { t: '🤝 Vendre l\'agència', d: 'Una nova etapa per a en Pau, amb l\'equip protegit.', v: 'vendre' },
        { t: '🌍 Expandir-la internacionalment', d: 'França, Portugal i més enllà.', v: 'expandir', req: (S) => S.f.franca && S.rep >= 50, },
        { t: '🏔️ Consolidar-la a Catalunya', d: 'Créixer amb calma i ser referents aquí.', v: 'consolidar' },
        { t: '🌿 Rebutjar-les totes i mantenir l\'agència tal com és', d: 'Triar projectes, cuidar l\'equip i tenir vida.', v: 'vida', req: (S) => !S.f.creixementRapid }
      ] },
      { t: 'ending' }
    ]
  });
  // Etiquetes dels requisits de la decisió final
  GD.chapters['8.2'].steps[1].opts[1].req.label = 'Requereix experiència internacional i reputació ≥ 50';
  GD.chapters['8.2'].steps[1].opts[3].req.label = 'No compatible amb un inversor que exigeix creixement ràpid';

  /* ============================================================
     FINALS
     ============================================================ */
  GD.endings = {
    osona: { title: 'Final 1 — L\'orgull d\'Osona', bg: 'vic', cast: ['pau', 'carme', 'miquel', 'julia'], text: [
      '{agencia} es manté independent, rendible i arrelada al territori. Té una cartera estable, clients fidels i un equip petit que s\'estima la feina.',
      'En Pau ha prioritzat la qualitat, les relacions i la sostenibilitat. Quan algú d\'Osona pregunta «qui em pot ajudar amb el màrqueting?», la resposta sol ser la mateixa.'
    ] },
    referents: { title: 'Final 2 — Referents en una especialitat', bg: 'oficina', cast: ['pau', 'julia', 'berta', 'marta'], text: [
      '{agencia} s\'ha convertit en un referent tècnic. Rep projectes complexos, treballa amb clients grans i és coneguda per la qualitat dels resultats.',
      'Les universitats conviden en Pau a fer classes i els competidors estudien els seus casos.'
    ] },
    grup: { title: 'Final 3 — El grup internacional', bg: 'franca', cast: ['pau', 'amelie', 'ramon', 'laia'], text: [
      '{agencia} ha crescut a diversos mercats. En Pau dirigeix equips a Vic, Barcelona i Lió, i unitats de negoci que ell mai no havia imaginat.',
      'Ha après a equilibrar creixement, rendibilitat i complexitat. Alguns dies troba a faltar aquell despatx damunt la merceria.'
    ] },
    ordre: { title: 'Final 4 — Tornar a posar ordre', bg: 'despatx:night', cast: ['pau', 'julia'], text: [
      'L\'empresa va créixer massa de pressa i va acumular problemes de tresoreria i gestió. Ha calgut reduir l\'estructura i renegociar deutes.',
      'No és una derrota: {agencia} és ara més petita, però ordenada. En Pau ha après la lliçó més cara de totes: créixer no és el mateix que millorar.'
    ] },
    vida: { title: 'Final 5 — La vida que volies', bg: 'vic', cast: ['pau', 'carme', 'berta'], text: [
      'En Pau ha decidit no perseguir el creixement indefinit. Ha construït una empresa viable que li permet triar projectes, cuidar l\'equip i tenir temps per a la vida.',
      'Els dissabtes continua comprant el pa al forn de la Carme. I continua fent preguntes abans de proposar res.'
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
    if (S.f.final === 'vendre') E.push(S.rep >= 60 ? 'La venda es tanca a un preu excel·lent: la reputació de l\'agència valia molt. L\'equip conserva la feina i la marca.' : 'La venda es tanca, però a un preu modest. L\'equip continua sota una altra direcció.');
    if (S.trust.carme >= 4) E.push('La Carme ha obert un obrador i ven coques a vint cafeteries de la comarca.');
    if (S.trust.miquel >= 4) E.push('Mecanitzats Bellmunt exporta a cinc països. Miquel encara diu que «els m\'agrades no paguen nòmines».');
    if (S.f.met_julia && S.trust.julia >= 3) E.push('La Júlia és sòcia de l\'agència i fa classes d\'analítica a la universitat.');
    if (S.f.met_berta && S.trust.berta >= 3) E.push('La Berta ha guanyat un premi de creativitat amb una campanya que, a més, va vendre.');
    if (S.f.laiaAliada || S.trust.laia >= 2) E.push('La Laia i en Pau comparteixen projectes cada any. La competència s\'ha convertit en aliança.');
    if (S.f.sergiEngany) E.push('El Sergi va acabar descobrint que aquella primera campanya no havia venut res. Mai no ho va oblidar.');
    if (S.f.quimFora) E.push('En Quim va passar per quatre agències més. Totes amb «tot el digital».');
    return E;
  };

  /* ============================================================
     ENCÀRRECS LLIURES (repetibles)
     ============================================================ */
  GD.gigs = [
    { id: 'g_perru', who: 'client', title: 'Perruqueria sense clientes al matí', area: 'seo', pay: 180, intro: 'Una perruqueria de Manlleu té el matí buit.', problem: 'La fitxa de Google no diu que obren a les 9 h i no es pot reservar en línia. Què proposes?', opts: [
      { t: 'Actualitzar la fitxa, activar reserves en línia i una oferta de matí', q: 0.9, r: 'Les reserves del matí es dupliquen en tres setmanes.' },
      { t: 'Fer vídeos per a TikTok', q: 0.35, r: 'Molts visionats de gent jove de fora, poques reserves.' },
      { t: 'Repartir fulletons a tot Osona', q: 0.4, r: 'Algunes trucades, però cost alt per reserva.' }] },
    { id: 'g_casa', who: 'client', title: 'Casa rural amb reserves per Booking', area: 'web', pay: 220, intro: 'Una casa rural paga molta comissió a les plataformes.', problem: 'Vol més reserves directes. Què prioritzes?', opts: [
      { t: 'Web pròpia amb reserva directa, millor preu garantit i correu als antics hostes que van acceptar rebre\'n', q: 0.9, r: 'El 30 % de les reserves passen a ser directes.' },
      { t: 'Deixar Booking de cop', q: 0.2, r: 'Les reserves cauen en picat.' },
      { t: 'Comprar una llista de correus de turistes', q: 0.1, r: 'Queixes i problemes de protecció de dades.' }] },
    { id: 'g_ferret', who: 'client', title: 'Ferreteria i el supermercat de bricolatge', area: 'fonaments', pay: 160, intro: 'Una gran superfície de bricolatge ha obert a Vic.', problem: 'La ferreteria de barri no pot competir en preu. On es diferencia?', opts: [
      { t: 'Assessorament expert, servei a domicili i comandes per WhatsApp', q: 0.85, r: 'Els clients professionals tornen.' },
      { t: 'Baixar preus un 25 %', q: 0.25, r: 'Marge destruït; la gran superfície baixa encara més.' },
      { t: 'Canviar el logo', q: 0.2, r: 'Bonic, però tot continua igual.' }] },
    { id: 'g_dentista', who: 'client', title: 'Clínica dental i anuncis cars', area: 'ads', pay: 260, intro: 'Una clínica dental gasta 1.000 €/mes en anuncis.', problem: 'CTR del 4 %, 300 clics, 2 cites. Què revises primer?', opts: [
      { t: 'La pàgina de destinació i el formulari de cita al mòbil', q: 0.9, r: 'El formulari no funcionava al mòbil. Ara: 24 cites/mes.' },
      { t: 'Canviar l\'anunci', q: 0.3, r: 'El CTR ja era bo; les cites no pugen.' },
      { t: 'Duplicar el pressupost', q: 0.15, r: 'Més clics, mateixes cites, més cost.' }] },
    { id: 'g_vi', who: 'client', title: 'Celler del Lluçanès', area: 'marca', pay: 240, intro: 'Un celler petit vol vendre a restaurants de Barcelona.', problem: 'Quin missatge proposes?', opts: [
      { t: 'Història real del celler, varietats autòctones i maridatges per a cartes de restaurant', q: 0.85, r: 'Quatre restaurants hi incorporen els vins.' },
      { t: '«El millor vi del món»', q: 0.2, r: 'Ningú no s\'ho creu.' },
      { t: 'Copiar l\'estil d\'un celler famós', q: 0.3, r: 'Es confon amb la competència.' }] },
    { id: 'g_ong', who: 'client', title: 'Entitat social que vol voluntaris', area: 'xarxes', pay: 140, intro: 'Una entitat de Vic necessita voluntaris per al banc d\'aliments.', problem: 'Com ho plantejaries?', opts: [
      { t: 'Històries reals de voluntaris, crida concreta (dates i hores) i formulari senzill', q: 0.9, r: '45 inscripcions en dues setmanes.' },
      { t: 'Publicar «Necessitem voluntaris» cada dia', q: 0.35, r: 'Poca resposta: no hi ha concreció.' },
      { t: 'Un sorteig de samarretes', q: 0.25, r: 'Molts participants, pocs voluntaris.' }] },
    { id: 'g_report', who: 'client', title: 'Informe per a un comitè de direcció', area: 'analitica', pay: 300, minStage: 2, intro: 'Una empresa et demana un informe de resultats digitals.', problem: 'Quina estructura proposes?', opts: [
      { t: 'Objectiu → resultats comercials → resultats de màrqueting → activitat → recomanacions', q: 0.9, r: 'El comitè entén l\'informe en cinc minuts.' },
      { t: 'Totes les mètriques de totes les plataformes', q: 0.3, r: 'Quaranta pàgines que ningú no llegeix.' },
      { t: 'Només els seguidors i els m\'agrada', q: 0.1, r: 'La directora financera fa preguntes incòmodes.' }] },
    { id: 'g_b2b', who: 'client', title: 'Fabricant de pinsos', area: 'creixement', pay: 320, minStage: 2, intro: 'Un fabricant vol captar granges com a clients.', problem: 'Quin canal prioritzes?', opts: [
      { t: 'Contingut tècnic útil, fires del sector i seguiment comercial en 24 h', q: 0.85, r: 'Contactes qualificats i tres clients nous.' },
      { t: 'Anuncis a Instagram per a públic jove urbà', q: 0.15, r: 'Cap granger a la vista.' },
      { t: 'Enviar correus massius a una base comprada', q: 0.1, r: 'Queixes i risc legal.' }] },
    { id: 'g_preu', who: 'client', title: 'Pressupost per a una web', area: 'direccio', pay: 260, minStage: 3, intro: 'Un client vol «una web senzilla», però canvia d\'idea cada dia.', problem: 'Com plantegeu el pressupost?', opts: [
      { t: 'Abast tancat, dues rondes de revisió i canvis fora d\'abast pressupostats a part', q: 0.9, r: 'Projecte entregat a temps i amb marge.' },
      { t: 'Preu tancat, «el que calgui»', q: 0.2, r: 'Tres mesos de canvis. Pèrdues.' },
      { t: 'Cobrar per hores sense estimació', q: 0.45, r: 'El client se sent insegur i regateja cada factura.' }] },
    { id: 'g_crisi', who: 'client', title: 'Hotel amb una ressenya viral', area: 'xarxes', pay: 300, minStage: 4, intro: 'Un hotel rep una ressenya negativa que es fa viral.', problem: 'Què li recomanes?', opts: [
      { t: 'Respondre amb empatia, reconèixer l\'error, explicar la solució i aplicar-la', q: 0.9, r: 'La resposta es comparteix com a exemple de bona gestió.' },
      { t: 'Amenaçar el client amb accions legals', q: 0.1, r: 'Efecte Streisand: tothom en parla.' },
      { t: 'No dir res i esperar', q: 0.35, r: 'La crisi s\'apaga lentament, però deixa marca.' }] },
    { id: 'g_ab', who: 'client', title: 'Prova A/B d\'una botiga en línia', area: 'analitica', pay: 340, minStage: 5, intro: 'Una botiga ha provat dos botons de compra durant dos dies.', problem: 'Botó verd: 6 vendes. Botó taronja: 4. Què recomanes?', opts: [
      { t: 'Continuar la prova fins a tenir prou dades amb el criteri definit abans', q: 0.9, r: 'Al cap de tres setmanes, no hi havia diferència real.' },
      { t: 'El verd guanya: canviar-ho tot', q: 0.3, r: 'Conclusió precipitada.' },
      { t: 'Provar deu colors alhora', q: 0.3, r: 'Massa variants per a poc trànsit.' }] },
    { id: 'g_ia', who: 'client', title: 'Textos amb IA per a un e-commerce', area: 'avancat', pay: 380, minStage: 6, intro: 'Un e-commerce vol generar 2.000 descripcions de producte amb IA.', problem: 'Com ho planteges?', opts: [
      { t: 'Plantilla amb dades reals de cada producte, generació amb IA i revisió per mostreig abans de publicar', q: 0.9, r: 'Ràpid, coherent i sense errors greus.' },
      { t: 'Generar-les i publicar-les directament', q: 0.25, r: 'Diverses descripcions inventen característiques que el producte no té.' },
      { t: 'Escriure-les totes a mà', q: 0.5, r: 'Bona qualitat, però sis mesos de feina.' }] },
    { id: 'g_intl', who: 'client', title: 'Formatgeria que vol vendre a Andorra', area: 'avancat', pay: 360, minStage: 7, intro: 'Una formatgeria vol vendre a Andorra.', problem: 'Quin és el primer pas?', opts: [
      { t: 'Investigar demanda, normativa d\'enviament i distribuïdors, i fer una prova petita', q: 0.9, r: 'Dos distribuïdors interessats i la logística resolta.' },
      { t: 'Llançar una campanya gran directament', q: 0.25, r: 'Les comandes no es poden enviar per la normativa duanera.' },
      { t: 'Traduir la web al francès', q: 0.3, r: 'A Andorra la llengua oficial és el català...' }] }
  ];
})();
