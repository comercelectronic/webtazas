// Textos legals. Les dades del titular surten de data/site.json (apartat
// "legal"); si falten, es mostren com a [Pendent: ...].
//
// IMPORTANT: aquests textos són una base de treball, no assessorament jurídic.
// Els comentaris "REVISIÓ JURÍDICA" assenyalen punts que cal validar amb un
// professional abans d'obrir la botiga al públic.
const { site, esc, euro, value, PRICE, SHIPPING, FREE_SHIPPING, DELIVERY } = require('./lib');

const L = site.legal;
const CUSTOM_RETURNS = site.customReturns === true;
const SHOP = site.mode !== 'aparador';
const IG = `@${esc(site.instagram)}`;
const owner = () => value(L.ownerName, 'nom i cognoms o raó social del titular');
const taxId = () => value(L.taxId, 'NIF/CIF del titular');
const address = () => value(L.address, 'domicili del titular');
const email = value(site.contactEmail, 'correu electrònic de contacte');
const updated = new Date().toLocaleDateString('ca-ES', { year: 'numeric', month: 'long' });

const pages = {
  'avis-legal': {
    title: 'Avís legal',
    description: `Dades identificatives del titular ${site.brandOf} i condicions d'ús del lloc web.`,
    body: () => `
<!-- REVISIÓ JURÍDICA: completar les dades identificatives (art. 10 LSSI-CE) i confirmar si hi ha inscripció registral. -->
<h2>1. Dades identificatives</h2>
<p>En compliment de l'article 10 de la Llei 34/2002, de serveis de la societat de la informació i de comerç electrònic (LSSI-CE):</p>
<ul>
  <li><strong>Titular:</strong> ${owner()}</li>
  <li><strong>NIF/CIF:</strong> ${taxId()}</li>
  <li><strong>Domicili:</strong> ${address()}</li>
  <li><strong>Correu electrònic:</strong> ${email}</li>
  <li><strong>Dades registrals:</strong> ${value(L.registryData, 'dades registrals (si escau) o indicar que no n\'hi ha')}</li>
</ul>

<h2>2. Objecte</h2>
<p>Aquest lloc web, ${esc(site.siteUrl)}, té per objecte la venda en línia de tasses amb dissenys ${esc(site.brandOf)}. Navegar-hi atribueix la condició de persona usuària i implica acceptar aquest avís legal.</p>

<h2>3. Condicions d'ús</h2>
<p>Et comprometes a fer un ús adequat del lloc web i a no fer-lo servir per a activitats il·lícites, contràries a la bona fe o que puguin perjudicar terceres persones o el funcionament del lloc.</p>

<h2>4. Normes per a les valoracions</h2>
<p>Pots publicar una valoració de cada tassa amb un nom o pseudònim, una puntuació i un comentari. Totes les valoracions es revisen abans de publicar-se. No es publicaran les que:</p>
<ul>
  <li>continguin insults o atacs a persones, o contingut discriminatori, violent o sexual;</li>
  <li>incloguin publicitat, enllaços o dades de contacte;</li>
  <li>no tinguin relació amb el producte o siguin enganyoses.</li>
</ul>
<p>No inventem valoracions, no en paguem i no n'eliminem cap pel fet de ser negativa. Pots demanar que retirem la teva escrivint a ${email}.</p>
<!-- REVISIÓ JURÍDICA: Directiva (UE) 2019/2161 (Òmnibus) — si en el futur s'indica que les valoracions són de "compradors verificats", cal explicar com es verifica. Ara no es verifica la compra i així s'ha de mantenir el text. -->
<p>Les valoracions no estan limitades a persones que hagin comprat a la botiga: no podem verificar que qui escriu hagi comprat la tassa.</p>

<h2>5. Propietat intel·lectual</h2>
<p>Els textos, dissenys, il·lustracions, fotografies i el codi d'aquest lloc web són de ${owner()} o de les persones que n'han autoritzat l'ús, i estan protegits per la normativa de propietat intel·lectual i industrial.</p>

<h2>6. Responsabilitat</h2>
<p>Treballem perquè la informació sigui correcta i el lloc funcioni, però no podem garantir l'absència d'interrupcions o errors tècnics aliens al nostre control.</p>

<h2>7. Legislació aplicable</h2>
<p>Aquest avís legal es regeix per la legislació espanyola. Si ets consumidor/a, et correspon el fur del teu domicili.</p>`,
  },

  privacitat: {
    title: 'Política de privacitat',
    description: `Com tracta ${site.brand} les teves dades personals: comandes, contacte, newsletter i valoracions.`,
    body: () => `
<!-- REVISIÓ JURÍDICA: revisar finalitats, bases legals, terminis i transferències internacionals (Stripe, Netlify i Resend són empreses dels EUA). Valorar si cal registre d'activitats de tractament. -->
<h2>1. Qui és el responsable</h2>
<ul>
  <li><strong>Responsable:</strong> ${owner()}</li>
  <li><strong>NIF/CIF:</strong> ${taxId()}</li>
  <li><strong>Domicili:</strong> ${address()}</li>
  <li><strong>Contacte per a privacitat:</strong> ${email}</li>
</ul>

<h2>2. Quines dades tractem i per a què</h2>

${SHOP ? '' : `<h3>Comandes per Instagram</h3>
<p><strong>Dades:</strong> les que ens facis arribar per missatge directe a ${IG} per fer una comanda: nom, adreça d'enviament, telèfon, correu electrònic i les tasses que vols (inclòs el text i el dibuix de les personalitzades).<br>
<strong>Finalitat:</strong> preparar la comanda, enviar-la, cobrar-la i atendre't després.<br>
<strong>Base legal:</strong> execució del contracte (art. 6.1.b RGPD) i obligacions fiscals i comptables (art. 6.1.c RGPD).<br>
<strong>Conservació:</strong> el temps que exigeixin les obligacions fiscals i mercantils (amb caràcter general, fins a 6 anys).<br>
Instagram és un servei de Meta Platforms Ireland Limited, que tracta les converses d'acord amb la seva pròpia <a href="https://privacycenter.instagram.com/policy" rel="noopener" target="_blank">política de privacitat</a>.</p>
`}${SHOP ? `<h3>Comandes</h3>
<p><strong>Dades:</strong> nom, adreça d'enviament, correu electrònic, telèfon i detall de la comanda (inclòs el text i el dibuix de les tasses personalitzades). Les dades de la targeta les gestiona directament Stripe; nosaltres no les veiem ni les desem.<br>
<strong>Finalitat:</strong> gestionar la compra, l'enviament, la facturació i l'atenció postvenda.<br>
<strong>Base legal:</strong> execució del contracte (art. 6.1.b RGPD) i compliment d'obligacions legals fiscals i comptables (art. 6.1.c RGPD).<br>
<strong>Conservació:</strong> el temps que exigeixin les obligacions fiscals i mercantils (amb caràcter general, fins a 6 anys).</p>` : ''}

<h3>Formulari de contacte</h3>
<p><strong>Dades:</strong> nom, correu electrònic i missatge.<br>
<strong>Finalitat:</strong> respondre la teva consulta.<br>
<strong>Base legal:</strong> el teu consentiment en enviar el formulari (art. 6.1.a RGPD).<br>
<strong>Conservació:</strong> mentre duri la consulta i, com a màxim, 1 any després.</p>

<h3>Newsletter</h3>
<p><strong>Dades:</strong> correu electrònic i el registre del consentiment (data i hora, formulari d'origen, text acceptat i un identificador xifrat de la connexió).<br>
<strong>Finalitat:</strong> enviar-te novetats, nous dissenys, ofertes i descomptes de la botiga.<br>
<strong>Base legal:</strong> el teu consentiment (art. 6.1.a RGPD i art. 21 LSSI-CE), confirmat en dos passos (double opt-in).<br>
<strong>Conservació:</strong> fins que et donis de baixa. Si no confirmes la subscripció, la sol·licitud s'esborra en 7 dies. Quan et dones de baixa esborrem l'adreça i només guardem la data de la baixa.<br>
Pots donar-te de baixa des de l'enllaç que hi ha a cada correu. Cal tenir almenys 14 anys.</p>

<h3>Valoracions</h3>
<p><strong>Dades:</strong> nom o pseudònim, puntuació, comentari i data, i un identificador xifrat de la connexió per evitar abusos.<br>
<strong>Finalitat:</strong> publicar opinions sobre les tasses i evitar valoracions duplicades o massives.<br>
<strong>Base legal:</strong> el teu consentiment en enviar-la (art. 6.1.a RGPD) i el nostre interès legítim a evitar abusos (art. 6.1.f RGPD).<br>
<strong>Conservació:</strong> les valoracions publicades, fins que en demanis la retirada; les rebutjades s'esborren en revisar-les. L'identificador xifrat que impedeix valorar dues vegades la mateixa tassa es conserva 12 mesos.</p>

<h3>Estadístiques del web (Google Analytics)</h3>
<p>Només si ho acceptes a l'avís de cookies.<br>
<strong>Dades:</strong> identificadors pseudònims del navegador, pàgines que visites, tasses que afegeixes a la cistella, tipus de dispositiu i ubicació aproximada (ciutat o país). Google Analytics 4 no desa l'adreça IP completa.<br>
<strong>Finalitat:</strong> saber, de manera agregada, quantes persones visiten la botiga i què els interessa, per millorar-la.<br>
<strong>Base legal:</strong> el teu consentiment (art. 6.1.a RGPD i art. 22.2 LSSI-CE). El pots retirar quan vulguis des de «Configura les cookies», al peu de la web.<br>
<strong>Conservació:</strong> 14 mesos.</p>

<h3>Seguretat dels formularis</h3>
<p>Per frenar el correu brossa i els enviaments automàtics, calculem un identificador xifrat i irreversible a partir de l'adreça IP i no desem mai l'adreça IP. Els comptadors diaris s'esborren als 2 dies. Base legal: interès legítim (art. 6.1.f RGPD).</p>

<h2>3. A qui comuniquem les dades</h2>
<p>No venem ni cedim les teves dades. Les comuniquem només als proveïdors necessaris, que actuen com a encarregats del tractament:</p>
<ul>
  ${SHOP ? '<li><strong>Stripe</strong> — pagaments. <a href="https://stripe.com/es/privacy" rel="noopener" target="_blank">Política de privacitat de Stripe</a>.</li>' : ''}
  <li><strong>Netlify</strong> — allotjament del web, formulari de contacte i emmagatzematge de dades de la botiga.</li>
  <li><strong>Resend</strong> — enviament dels correus de la newsletter.</li>
  <li><strong>Google Ireland Limited</strong> — correu electrònic (Gmail), si ens escrius, i estadístiques del web amb Google Analytics, només si ho acceptes. <a href="https://policies.google.com/privacy?hl=ca" rel="noopener" target="_blank">Política de privacitat de Google</a>.</li>
  <li><strong>Empresa de transport:</strong> ${value(site.shipping.carrier, 'empresa de transport')} — nom, adreça i telèfon per lliurar la comanda.</li>
</ul>
<p>${SHOP ? 'Stripe, ' : ''}Netlify, Resend i Google poden tractar dades fora de l'Espai Econòmic Europeu, amb les garanties previstes al RGPD (Marc de privacitat de dades UE-EUA o clàusules contractuals tipus).</p>

<h2>4. Els teus drets</h2>
<p>Pots exercir els drets d'accés, rectificació, supressió, oposició, limitació del tractament i portabilitat, i retirar el consentiment en qualsevol moment, escrivint a ${email}. Et respondrem en el termini d'un mes. No prenem decisions automatitzades ni fem perfils amb les teves dades. Si no estàs d'acord amb la resposta, pots reclamar davant l'Agència Espanyola de Protecció de Dades (<a href="https://www.aepd.es" rel="noopener" target="_blank">aepd.es</a>).</p>

<h2>5. Seguretat</h2>
<p>La web funciona sempre amb connexió xifrada (HTTPS), les zones d'administració estan protegides amb contrasenya i només hi accedeix el titular.</p>`,
  },

  cookies: {
    title: 'Política de cookies',
    description: `Quines cookies i quin emmagatzematge local fa servir ${site.brand} i com configurar-los.`,
    body: () => `
<h2>1. Què són</h2>
<p>Les cookies i l'emmagatzematge local són petits fitxers o dades que el web desa al teu navegador.</p>

<h2>2. Què fem servir</h2>
<h3>Necessàries (sempre actives)</h3>
<p>Són imprescindibles perquè la botiga funcioni i no requereixen el teu consentiment (art. 22.2 LSSI-CE).</p>
<div class="table-wrap"><table>
  <thead><tr><th>Nom</th><th>Tipus</th><th>Per a què serveix</th><th>Durada</th></tr></thead>
  <tbody>
    ${SHOP ? '<tr><td><code>tdm-cart</code></td><td>Emmagatzematge local (propi)</td><td>Recordar què tens a la cistella.</td><td>Fins que la buidis o acabis la compra</td></tr>' : ''}
    <tr><td><code>tdm-consent</code></td><td>Emmagatzematge local (propi)</td><td>Recordar què has triat a l'avís de cookies.</td><td>12 mesos</td></tr>
    <tr><td><code>tdm-admin</code></td><td>Emmagatzematge de sessió (propi)</td><td>Mantenir la sessió a la zona d'administració. Només per al titular de la botiga.</td><td>Fins que tanques la pestanya</td></tr>
    ${SHOP ? '<tr><td>Cookies de Stripe</td><td>De tercers (stripe.com)</td><td>Processar el pagament i prevenir el frau. Només es creen a la pàgina de pagament de Stripe.</td><td>Segons <a href="https://stripe.com/es/cookies-policy/legal" rel="noopener" target="_blank">Stripe</a></td></tr>' : ''}
  </tbody>
</table></div>

<h3>Analítiques (només si les acceptes)</h3>
<p>Fem servir Google Analytics 4, de Google Ireland Limited, per saber quantes persones visiten la botiga, quines pàgines i tasses miren i d'on venen, sempre de manera agregada. No es carreguen fins que les acceptes.</p>
<div class="table-wrap"><table>
  <thead><tr><th>Nom</th><th>Tipus</th><th>Per a què serveix</th><th>Durada</th></tr></thead>
  <tbody>
    <tr><td><code>_ga</code></td><td>De tercers (Google Analytics)</td><td>Distingir visitants de manera pseudònima.</td><td>2 anys</td></tr>
    <tr><td><code>_ga_&lt;ID&gt;</code></td><td>De tercers (Google Analytics)</td><td>Mantenir l'estat de la sessió de visita.</td><td>2 anys</td></tr>
  </tbody>
</table></div>
<p>Google pot tractar aquestes dades fora de l'Espai Econòmic Europeu, amb les garanties del Marc de privacitat de dades UE-EUA. Més informació a la <a href="https://policies.google.com/technologies/cookies?hl=ca" rel="noopener" target="_blank">política de cookies de Google</a>.</p>
<p>No fem servir cookies de publicitat ni de xarxes socials.</p>

<h2>3. Com acceptar-les, rebutjar-les o canviar d'opinió</h2>
<p>La primera vegada que entres, un avís et deixa acceptar-les, rebutjar-les o triar-les una per una. Rebutjar-les és tan fàcil com acceptar-les i la botiga funciona igual. Pots canviar la teva elecció quan vulguis:</p>
<p><button type="button" class="btn btn--ghost" data-cookie-settings>Configura les cookies</button></p>
<p>Si retires el consentiment, esborrem les cookies de Google Analytics del teu navegador. També pots esborrar-les o bloquejar-les des de la configuració del navegador. Si bloqueges l'emmagatzematge local, la cistella no funcionarà.</p>

<h2>4. Canvis</h2>
<p>Si afegim altres eines, les afegirem a aquesta llista i et tornarem a demanar el consentiment.</p>`,
  },

  'condicions-venda': {
    title: 'Condicions de venda',
    description: `Condicions generals de contractació ${site.brandOf}: preus, pagament, enviament, desistiment i garantia.`,
    body: () => `
<!-- REVISIÓ JURÍDICA: validar el conjunt amb un professional (TRLGDCU, RDL 1/2007, i Codi de consum de Catalunya, Llei 22/2010). Confirmar l'alta fiscal del titular abans de vendre. -->
<h2>1. Venedor</h2>
<p>${owner()} · NIF/CIF ${taxId()} · ${address()} · ${email}</p>

<h2>2. Àmbit</h2>
<p>Aquestes condicions regulen les compres fetes a ${esc(site.siteUrl)}. Per comprar cal ser major d'edat. En finalitzar una comanda acceptes aquestes condicions.</p>

<h2>3. Preus i impostos</h2>
<p>El preu habitual de cada tassa és <strong>${PRICE}</strong>, inclosa la tassa personalitzada. Algunes tasses i els packs poden tenir un preu d'oferta, que s'indica a la fitxa i a la cistella. Quan es mostra un preu anterior ratllat, és el preu més baix que ha tingut aquella tassa durant els 30 dies anteriors a l'oferta. El preu que pagues és el que veus a la cistella i a la pàgina de pagament en el moment de la compra. Els preus s'indiquen en euros.</p>
<p>Impostos: ${value(L.vatInfo, 'indicar si el preu inclou l\'IVA i el règim fiscal aplicable')}</p>
<p>${FREE_SHIPPING ? "L'enviament és gratuït: el preu de les tasses ja l'inclou." : `Les despeses d'enviament (${SHIPPING} per comanda) es mostren a la cistella i a la pàgina de pagament abans de pagar.`}</p>

<h2>4. Com comprar</h2>
<ol>
  <li>Afegeix les tasses a la cistella.</li>
  <li>Prem «Finalitza la compra»: aniràs a la pàgina de pagament segur de Stripe.</li>
  <li>Indica les dades d'enviament i paga amb targeta.</li>
  <li>En acabar, veuràs la confirmació de la comanda.</li>
</ol>
<p>Pots corregir les dades i les quantitats abans de pagar. El contracte es formalitza en català.</p>

<h2>5. Pagament</h2>
<p>El pagament es fa amb targeta a través de Stripe. No tenim accés a les dades completes de la teva targeta.</p>

<h2>6. Enviament</h2>
<p>Enviem a ${esc(site.shipping.countriesLabel)}. Termini estimat: ${DELIVERY} des del pagament. Cost: ${FREE_SHIPPING ? 'gratuït' : `${SHIPPING} per comanda`}. Més informació a <a href="/enviaments-i-devolucions/">Enviaments i devolucions</a>.</p>

<h2>7. Dret de desistiment (devolució en 14 dies)</h2>
<p>Tens <strong>14 dies naturals</strong> per desistir de la compra sense haver de donar cap explicació (art. 102 i següents del TRLGDCU). El termini comença el dia que reps la comanda o, si arriba en diversos paquets, el dia que reps l'últim.</p>
<p><strong>Com fer-ho.</strong> Envia'ns una declaració clara a ${email} abans que acabi el termini. Pots fer servir aquest model, però no és obligatori:</p>
<blockquote class="legal-model">A l'atenció de ${owner()}, ${address()}, ${email}:<br>
Per la present us comunico que desisteixo del contracte de venda dels béns següents: [tasses] · Comanda feta el: [data] · Rebuda el: [data] · Nom: [nom] · Adreça: [adreça] · Data i signatura (només si s'envia en paper).</blockquote>
<p><strong>Retorn de les tasses.</strong> Les has d'enviar a l'adreça que t'indicarem en un màxim de 14 dies naturals des que ens comuniquis el desistiment. Les despeses directes del retorn van a càrrec teu. Només respons de la pèrdua de valor de les tasses si les has fet servir més enllà del que cal per comprovar-ne la naturalesa i les característiques.</p>
<p><strong>Reemborsament.</strong> Et retornarem tot l'import pagat, incloses les despeses d'enviament inicials si n'hi havia, en un màxim de 14 dies naturals des que ens comuniquis el desistiment, pel mateix mitjà de pagament i sense cap cost per a tu. Podem esperar a fer-lo fins que rebem les tasses o ens enviïs el justificant d'enviament. Si desisteixes d'una part d'un pack, et retornarem la part proporcional del preu del pack.</p>

<h3 id="personalitzades">Tasses personalitzades</h3>
${CUSTOM_RETURNS
  ? `<p>La llei permet excloure del dret de desistiment els productes fets a mida (art. 103.c del TRLGDCU). Nosaltres no ho fem: <strong>les tasses que dissenyes amb «Crea la teva tassa» també les pots retornar en 14 dies</strong>, en les mateixes condicions que la resta.</p>`
  : `<p>Les tasses que dissenyes amb el configurador «Crea la teva tassa» es fabriquen a mida amb el teu text i el teu dibuix. Per això <strong>no tenen dret de desistiment</strong> (art. 103.c del TRLGDCU), i així t'ho indiquem abans de comprar-les. Sí que tenen tota la garantia legal.</p>`}
<p>Revisem cada disseny abans d'imprimir-lo. Si conté textos ofensius, marques registrades o no es pot imprimir bé, t'escriurem abans de fabricar-lo i, si no ho podem resoldre, et retornarem l'import.</p>

<h2>8. Garanties legals</h2>
<p><strong>Transport.</strong> Fins que reps la comanda, el risc de pèrdua o de danys durant el transport és nostre. Si una tassa arriba trencada, te l'enviem de nou o et retornem l'import, sense cap cost.</p>
<p><strong>Garantia de conformitat de 3 anys</strong> des del lliurament (art. 114 i següents del TRLGDCU). Respondrem de qualsevol falta de conformitat: defectes de fabricació o d'impressió, una tassa que no correspon a la que vas triar (paraula, disseny o color) o que no té les qualitats que hi anunciem.</p>
<ul>
  <li>Si el defecte apareix durant els <strong>2 primers anys</strong>, es presumeix que ja existia en el moment del lliurament: no has de demostrar res.</li>
  <li>Pots triar entre la <strong>reparació o la substitució</strong> de la tassa, que farem gratuïtament, en un termini raonable i sense molèsties per a tu. Totes les despeses (enviaments, materials i mà d'obra) van a càrrec nostre.</li>
  <li>Si la substitució no és possible, no la fem en un termini raonable o el defecte és greu, pots demanar una <strong>rebaixa proporcional del preu</strong> o la <strong>resolució del contracte</strong> amb el reemborsament de l'import.</li>
  <li>Mentre no ho resolguem, pots suspendre el pagament de la part pendent, si n'hi ha.</li>
</ul>
<p>La garantia no cobreix els danys causats després del lliurament per un cop, una caiguda o un ús inadequat.</p>
<p>Per fer-la servir, escriu-nos a ${email} amb fotos de la tassa i la data o el número de la comanda.</p>

<h2>9. Atenció i reclamacions</h2>
<p>Pots fer-nos arribar qualsevol queixa a ${email}. També pots adreçar-te a l'Agència Catalana del Consum (<a href="https://consum.gencat.cat" rel="noopener" target="_blank">consum.gencat.cat</a>) o a la junta arbitral de consum del teu territori.</p>
<p>No estem adherits a cap sistema d'arbitratge de consum.</p>
<!-- REVISIÓ JURÍDICA: confirmar si l'empresa vol adherir-se a la Junta Arbitral de Consum i les obligacions sobre fulls de reclamació (Codi de consum de Catalunya) per a la venda a distància. -->

<h2>10. Llei aplicable</h2>
<p>Aquestes condicions es regeixen per la legislació espanyola. Si ets consumidor/a, et correspon el fur del teu domicili.</p>`,
  },

  'enviaments-i-devolucions': {
    title: 'Enviaments i devolucions',
    description: `Cost i terminis d'enviament, devolucions, dret de desistiment i garantia de les tasses ${site.brandOf}.`,
    body: () => `
<!-- REVISIÓ: confirmar cost, terminis, països i transportista amb les tarifes reals abans de publicar. -->
<h2>Enviament</h2>
<ul>
  <li><strong>Cost:</strong> ${FREE_SHIPPING ? 'gratuït, sigui quin sigui el nombre de tasses' : `${SHIPPING} per comanda, sigui quin sigui el nombre de tasses`}.</li>
  <li><strong>Termini estimat:</strong> ${DELIVERY} des del pagament.</li>
  <li><strong>On enviem:</strong> ${esc(site.shipping.countriesLabel)}.</li>
  <li><strong>Transportista:</strong> ${value(site.shipping.carrier, 'empresa de transport')}</li>
</ul>
<p>Veuràs el cost d'enviament a la cistella i a la pàgina de pagament abans de pagar.</p>

<h2>Si la tassa arriba trencada o amb defectes</h2>
<p>Escriu-nos a ${email} amb una foto del paquet i de la tassa, i la data o el número de la comanda. Te l'enviem de nou o et retornem l'import, sense cap cost per a tu.</p>

<h2>Devolucions en 14 dies</h2>
<ol>
  <li>Tens 14 dies naturals des que reps la comanda per retornar-la, sense haver de donar cap explicació.</li>
  <li>Escriu-nos a ${email} dient que vols retornar la comanda.</li>
  <li>Envia les tasses a l'adreça que t'indicarem en un màxim de 14 dies. El cost del retorn va a càrrec teu.</li>
  <li>Et retornem tot l'import, incloses les despeses d'enviament inicials si n'hi havia, en un màxim de 14 dies.</li>
</ol>
<p>${CUSTOM_RETURNS ? 'Això també val per a les tasses personalitzades (fetes amb «Crea la teva tassa»).' : 'Les tasses personalitzades (fetes amb «Crea la teva tassa») no es poden retornar per desistiment perquè es fan a mida, però sí que les canviem o te\'n retornem l\'import si arriben amb defectes.'}</p>
<p>Tots els detalls són a les <a href="/condicions-venda/">condicions de venda</a>.</p>

<h2>Garanties</h2>
<ul>
  <li><strong>3 anys de garantia legal</strong> de conformitat des del lliurament.</li>
  <li>Si el defecte apareix durant els 2 primers anys, es presumeix que ja hi era: no has de demostrar res.</li>
  <li>Reparació o substitució gratuïtes i, si no és possible, rebaixa del preu o reemborsament.</li>
  <li>El risc del transport és nostre fins que reps la comanda.</li>
</ul>

<h2>Preus</h2>
<p>Preu habitual per tassa: ${PRICE}, enviament inclòs. Impostos: ${value(L.vatInfo, 'indicar si el preu inclou l\'IVA i el règim fiscal aplicable')}</p>`,
  },
};

module.exports = { pages, updated };
