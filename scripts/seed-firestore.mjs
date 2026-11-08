import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

const categories = [
  { id: 'toplo-predjelo', name: 'Toplo predjelo', emoji: '🍲', description: 'Mirisni i topli početak obroka', image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=1200&q=80', recipes: [
    ['krem-juha-bundeva', 'Krem juha od bundeve', 'Pečena bundeva kuhana s mrkvom, lukom i temeljcem, usitnjena u nježnu krem juhu.'],
    ['juha-rajcica', 'Juha od pečene rajčice', 'Rajčice pečene s češnjakom i začinskim biljem kuhaju se s povrtnim temeljcem i pasiraju.'],
    ['palenta-gljive', 'Hrskava palenta s gljivama', 'Zapečene ploške palente poslužuju se s pirjanim gljivama, peršinom i malo parmezana.'],
    ['punjene-gljive', 'Punjene gljive iz pećnice', 'Šampinjoni punjeni krušnim mrvicama, sirom, češnjakom i začinskim biljem peku se do zlatne boje.'],
    ['mini-pite-poriluk', 'Mini pite s porilukom', 'Prhko tijesto puni se mekanim porilukom, jajima i sirom te peče u malim kalupima.'],
  ]},
  { id: 'hladno-predjelo', name: 'Hladno predjelo', emoji: '🥗', description: 'Lagani zalogaji za svaku priliku', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80', recipes: [
    ['bruschette-rajcica', 'Bruschette s rajčicom', 'Prepečeni kruh s rajčicom, bosiljkom, češnjakom i kvalitetnim maslinovim uljem.'],
    ['namaz-slanutak', 'Namaz od slanutka', 'Kremasti slanutak s tahinijem, limunom, češnjakom i maslinovim uljem.'],
    ['salata-hobotnica', 'Salata od hobotnice', 'Kuhana hobotnica s krumpirom, crvenim lukom, peršinom i maslinovim uljem.'],
    ['rolada-spinata', 'Rolada od špinata i sira', 'Mekana rolada od špinata puni se svježim sirom i reže na hladne zalogaje.'],
    ['caprese-raznjici', 'Caprese ražnjići', 'Cherry rajčice, mini mozzarella i bosiljak poslužuju se s balzamičnim preljevom.'],
  ]},
  { id: 'riba', name: 'Glavno jelo – riba', emoji: '🐟', description: 'Okusi mora na domaćem stolu', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80', recipes: [
    ['orada-povrce', 'Orada s pečenim povrćem', 'Cijela orada peče se s krumpirom, tikvicama, rajčicama, limunom i mediteranskim biljem.'],
    ['losos-limun', 'Losos s limunom i koprom', 'File lososa peče se kratko uz limun, kopar i maslinovo ulje kako bi ostao sočan.'],
    ['bakalar-bijelo', 'Bakalar na bijelo', 'Bakalar i krumpir miješaju se s češnjakom, peršinom i maslinovim uljem do kremaste teksture.'],
    ['rizoto-kozice', 'Rižoto s kozicama', 'Riža se postupno podlijeva ribljim temeljcem i dovršava kozicama, vinom i peršinom.'],
    ['brancin-blitva', 'Brancin s blitvom', 'File brancina peče se na tavi i poslužuje uz blitvu s krumpirom i češnjakom.'],
  ]},
  { id: 'meso', name: 'Glavno jelo – meso', emoji: '🍖', description: 'Zasitna i omiljena glavna jela', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80', recipes: [
    ['sporo-kuhani-gulas', 'Sporo kuhani gulaš', 'Govedina se dugo kuha s lukom, paprikom i rajčicom dok ne postane potpuno mekana.'],
    ['piletina-ruzmarin', 'Piletina s ružmarinom', 'Pileći zabatci peku se s krumpirom, češnjakom, limunom i svježim ružmarinom.'],
    ['punjene-paprike', 'Punjene paprike', 'Paprike punjene mljevenim mesom i rižom kuhaju se polako u umaku od rajčice.'],
    ['teletina-ispod-peke', 'Teletina s povrćem iz pećnice', 'Teletina, krumpir i povrće peku se poklopljeni dok meso ne omekša i pusti bogat sok.'],
    ['mesne-okruglice', 'Mesne okruglice u umaku', 'Sočne mesne okruglice kuhaju se u domaćem umaku od rajčice i poslužuju uz pire.'],
  ]},
  { id: 'vege', name: 'Glavno jelo – vege', emoji: '🥦', description: 'Šareni tanjuri puni povrća', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1200&q=80', recipes: [
    ['rizoto-gljive', 'Kremasti rižoto s gljivama', 'Arborio riža kuha se uz temeljac te dovršava gljivama, maslacem i parmezanom.'],
    ['lazanje-povrce', 'Lazanje s povrćem', 'Slojevi tjestenine, pečenog povrća, umaka od rajčice i bešamela peku se do zlatne boje.'],
    ['curry-slanutak', 'Curry od slanutka', 'Slanutak se kuha u mirisnom umaku od rajčice, kokosova mlijeka i toplih začina.'],
    ['punjene-tikvice', 'Tikvice punjene kvinojom', 'Tikvice se pune kvinojom, povrćem i sirom te zapeku u pećnici.'],
    ['njoki-kadulja', 'Njoki s maslacem i kaduljom', 'Mekani njoki poslužuju se u mirisnom maslacu s hrskavom kaduljom i parmezanom.'],
  ]},
  { id: 'bez-glutena', name: 'Deserti bez glutena', emoji: '🍰', description: 'Slatko bez glutena', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80', recipes: [
    ['torta-bez-brasna', 'Čokoladna torta bez brašna', 'Bogata torta od tamne čokolade, maslaca, jaja i kakaa s mekanom sredinom.'],
    ['kolac-badem-naranca', 'Kolač od badema i naranče', 'Sočan kolač od mljevenih badema i cijelih naranči bez pšeničnog brašna.'],
    ['panna-cotta', 'Panna cotta s malinama', 'Nježna krema od vrhnja i vanilije hladi se i poslužuje s umakom od malina.'],
    ['kokos-macarons', 'Kokosovi poljupci', 'Jednostavni hrskavi kolačići od kokosa, bjelanjaka i malo šećera.'],
    ['palacinke-heljda', 'Palačinke od heljde', 'Tanke palačinke od heljdina brašna pune se voćem i laganom kremom.'],
  ]},
  { id: 'bez-secera', name: 'Deserti bez šećera', emoji: '🍓', description: 'Prirodno slatke ideje', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1200&q=80', recipes: [
    ['chia-puding', 'Chia puding s bobičastim voćem', 'Chia sjemenke odmaraju u mlijeku i vaniliji te se poslužuju sa svježim voćem.'],
    ['banana-kruh', 'Kruh od banane bez šećera', 'Zrele banane prirodno zaslađuju mekan kolač sa zobenim pahuljicama i orasima.'],
    ['kuglice-datulje', 'Kuglice od datulja i kakaa', 'Datulje, orašasti plodovi i kakao usitnjavaju se u brze energetske zalogaje.'],
    ['pecene-jabuke', 'Pečene jabuke s orasima', 'Jabuke punjene orasima, cimetom i grožđicama peku se dok ne omekšaju.'],
    ['jogurt-sladoled', 'Jogurt sladoled s jagodama', 'Smrznute jagode i grčki jogurt miksaju se u osvježavajući desert bez dodanog šećera.'],
  ]},
  { id: 'tradicionalni-deserti', name: 'Tradicionalni deserti', emoji: '🥧', description: 'Recepti koji mirišu na djetinjstvo', image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=1200&q=80', recipes: [
    ['strudla-jabuke', 'Štrudla od jabuka', 'Tanke kore pune se naribanim jabukama, cimetom i mrvicama pa peku do hrskavosti.'],
    ['fritule', 'Mirisne fritule', 'Mali prženi uštipci s grožđicama, koricom limuna i rumom posipaju se šećerom.'],
    ['krempite', 'Domaće krempite', 'Prhko lisnato tijesto puni se visokom, laganom kremom od vanilije.'],
    ['makovnjaca', 'Makovnjača', 'Dizano tijesto premazuje se bogatim nadjevom od maka i savija u tradicionalnu roladu.'],
    ['rozata', 'Dubrovačka rozata', 'Krema od jaja, mlijeka i vanilije kuha se na pari preko sloja karamela.'],
  ]},
];

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Nedostaje GOOGLE_APPLICATION_CREDENTIALS. Postavi je na apsolutnu putanju service-account JSON datoteke koja je izvan projekta.');
  process.exit(1);
}

const options = { credential: applicationDefault() };
if (process.env.FIREBASE_PROJECT_ID) options.projectId = process.env.FIREBASE_PROJECT_ID;
const app = getApps()[0] ?? initializeApp(options);
const db = getFirestore(app);
const categoryRefs = categories.map((category) => db.collection('categories').doc(category.id));
const recipeEntries = categories.flatMap((category) => category.recipes.map(([id, title, description]) => ({ ref: db.collection('recipes').doc(`seed-${category.id}-${id}`), category, title, description })));
const allRefs = [...categoryRefs, ...recipeEntries.map((entry) => entry.ref)];
const snapshots = await db.getAll(...allRefs);
const existing = new Set(snapshots.filter((snapshot) => snapshot.exists).map((snapshot) => snapshot.ref.path));
const batch = db.batch(); let createdCategories = 0; let createdRecipes = 0;

categories.forEach((category, index) => {
  const ref = categoryRefs[index]; if (existing.has(ref.path)) return;
  batch.create(ref, { name: category.name, emoji: category.emoji, description: category.description, createdAt: FieldValue.serverTimestamp() }); createdCategories += 1;
});
recipeEntries.forEach(({ ref, category, title, description }) => {
  if (existing.has(ref.path)) return;
  batch.create(ref, { categoryId: category.id, title, description, imageUrl: category.image, authorId: 'system-seed', authorEmail: 'seed@recepti.local', createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }); createdRecipes += 1;
});

if (createdCategories || createdRecipes) await batch.commit();
console.log(`Seed dovršen. Dodano kategorija: ${createdCategories}, recepata: ${createdRecipes}. Postojeći dokumenti nisu mijenjani.`);
