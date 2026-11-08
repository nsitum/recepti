import type { Category, Recipe } from './types';

export const categories: Category[] = [
  { id: 'toplo-predjelo', name: 'Toplo predjelo', emoji: '🍲', description: 'Mirisni i topli početak obroka' },
  { id: 'hladno-predjelo', name: 'Hladno predjelo', emoji: '🥗', description: 'Lagani zalogaji za svaku priliku' },
  { id: 'riba', name: 'Glavno jelo – riba', emoji: '🐟', description: 'Okusi mora na domaćem stolu' },
  { id: 'meso', name: 'Glavno jelo – meso', emoji: '🍖', description: 'Zasitna i omiljena glavna jela' },
  { id: 'vege', name: 'Glavno jelo – vege', emoji: '🥦', description: 'Šareni tanjuri puni povrća' },
  { id: 'bez-glutena', name: 'Deserti bez glutena', emoji: '🍰', description: 'Slatko bez glutena' },
  { id: 'bez-secera', name: 'Deserti bez šećera', emoji: '🍓', description: 'Prirodno slatke ideje' },
  { id: 'tradicionalni-deserti', name: 'Tradicionalni deserti', emoji: '🥧', description: 'Recepti koji mirišu na djetinjstvo' },
];

export const recipes: Recipe[] = [
  { id: 'krem-juha-bundeva', categoryId: 'toplo-predjelo', title: 'Krem juha od bundeve', description: 'Bundevu, mrkvu i luk kratko zapecite, podlijte temeljcem i kuhajte dok ne omekšaju. Usitnite, dodajte malo vrhnja i začinite muškatnim oraščićem.', imageUrl: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=1200&q=80', authorName: 'Ana K.', ratingAverage: 4.8, ratingCount: 24 },
  { id: 'bruschette', categoryId: 'hladno-predjelo', title: 'Bruschette s rajčicom', description: 'Prepečeni kruh natrljajte češnjakom te nadjenite rajčicom, bosiljkom, maslinovim uljem i prstohvatom soli.', imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=1200&q=80', authorName: 'Marko P.', ratingAverage: 4.5, ratingCount: 18 },
  { id: 'orada-povrce', categoryId: 'riba', title: 'Orada s pečenim povrćem', description: 'Očišćenu oradu začinite limunom i začinskim biljem. Pecite je na posteljici od krumpira, tikvica i cherry rajčica.', imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80', authorName: 'Ivana M.', ratingAverage: 4.7, ratingCount: 31 },
  { id: 'gulas', categoryId: 'meso', title: 'Sporo kuhani gulaš', description: 'Meso zapecite, dodajte luk, papriku i rajčicu. Kuhajte na laganoj vatri dok meso ne postane potpuno mekano.', imageUrl: 'https://images.unsplash.com/photo-1608500218807-7f974d92f57b?auto=format&fit=crop&w=1200&q=80', authorName: 'Luka S.', ratingAverage: 4.9, ratingCount: 42 },
  { id: 'rizoto-gljive', categoryId: 'vege', title: 'Kremasti rižoto s gljivama', description: 'Gljive zapecite odvojeno. Rižu postupno podlijevajte toplim temeljcem, zatim umiješajte gljive, maslac i parmezan.', imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1200&q=80', authorName: 'Petra V.', ratingAverage: 4.6, ratingCount: 27 },
  { id: 'cokoladna-torta', categoryId: 'bez-glutena', title: 'Čokoladna torta bez brašna', description: 'Otopite čokoladu i maslac, umiješajte žumanjke te lagano dodajte snijeg od bjelanjaka. Pecite dok sredina ostane sočna.', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80', authorName: 'Mia R.', ratingAverage: 4.9, ratingCount: 36 },
  { id: 'chia-puding', categoryId: 'bez-secera', title: 'Chia puding s bobičastim voćem', description: 'Chia sjemenke pomiješajte s mlijekom i vanilijom. Ostavite preko noći pa poslužite sa svježim bobičastim voćem.', imageUrl: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1200&q=80', authorName: 'Sara B.', ratingAverage: null, ratingCount: 0 },
  { id: 'strudla-jabuke', categoryId: 'tradicionalni-deserti', title: 'Štrudla od jabuka', description: 'Naribane jabuke začinite cimetom i rasporedite po tankim korama. Zarolajte i pecite do zlatne boje.', imageUrl: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=1200&q=80', authorName: 'Baka Marija', ratingAverage: 4.8, ratingCount: 54 },
];
