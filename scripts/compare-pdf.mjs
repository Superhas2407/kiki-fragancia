import { products as allProducts } from '../src/data/products-enriched.js'

const PDF = [
  {m:'Adidas',n:'Dynamic Pulse Men',ml:100,t:'EDT',p:15},
  {m:'Adidas',n:'Ice Dive Men',ml:100,t:'EDT',p:15},
  {m:'Adidas',n:'Victory League Men',ml:100,t:'EDT',p:15},
  {m:'Afnan',n:'9AM Dive',ml:100,t:'EDP',p:40},
  {m:'Afnan',n:'9AM White',ml:100,t:'EDP',p:40},
  {m:'Afnan',n:'9PM Men',ml:100,t:'EDP',p:40},
  {m:'Afnan',n:'9PM Black',ml:150,t:'EDP',p:55},
  {m:'Afnan',n:'Supremacy Collectors Edition',ml:100,t:'EDP',p:60},
  {m:'Afnan',n:'Turathi Blue',ml:90,t:'EDP',p:45},
  {m:'Al Haramain',n:'Amber Oud Gold Edit',ml:60,t:'EDP',p:55},
  {m:'Al Haramain',n:'Amber Oud Gold Edition',ml:200,t:'EDP',p:95},
  {m:'Al Haramain',n:'Amber Oud Gold Edition',ml:120,t:'EDP',p:80},
  {m:'Al Haramain',n:'Amber Oud Night Dubai',ml:75,t:'EDP',p:65},
  {m:'Al Haramain',n:'Amber Oud Night Dubai',ml:100,t:'EDP',p:75},
  {m:'Al Haramain',n:'Amber Oud Rouge',ml:60,t:'EDP',p:60},
  {m:'Al Haramain',n:'Junoon Rose',ml:75,t:'EDP',p:65},
  {m:'Al Haramain',n:'Portfolio Imperial Oud',ml:75,t:'EDP',p:150},
  {m:'Animale',n:'Animale Men',ml:100,t:'EDT',p:40},
  {m:'Animale',n:'Animale Women',ml:100,t:'EDP',p:50},
  {m:'Antonio Banderas',n:'Black Seduction',ml:100,t:'EDT',p:25},
  {m:'Antonio Banderas',n:'Black Seduction',ml:200,t:'EDT',p:35},
  {m:'Antonio Banderas',n:'Blue Seduction Man',ml:200,t:'EDT',p:35},
  {m:'Antonio Banderas',n:'Blue Seduction Men',ml:100,t:'EDT',p:25},
  {m:'Antonio Banderas',n:'Blue Seduction Women',ml:80,t:'EDT',p:25},
  {m:'Antonio Banderas',n:'Her Golden Secret',ml:80,t:'EDT',p:25},
  {m:'Antonio Banderas',n:'Her Secret Absoluto',ml:80,t:'EDP',p:25},
  {m:'Antonio Banderas',n:'Her Secret Desire',ml:80,t:'EDT',p:25},
  {m:'Antonio Banderas',n:'Her Secret Temptation',ml:80,t:'EDT',p:25},
  {m:'Antonio Banderas',n:'King of Seduction Absolute',ml:100,t:'EDT',p:25},
  {m:'Antonio Banderas',n:'King of Seduction',ml:100,t:'EDT',p:25},
  {m:'Antonio Banderas',n:'King of Seduction',ml:200,t:'EDT',p:35},
  {m:'Antonio Banderas',n:'Power Seduction',ml:100,t:'EDT',p:25},
  {m:'Antonio Banderas',n:'The Golden Secret',ml:100,t:'EDT',p:25},
  {m:'Antonio Banderas',n:'The Icon EDP',ml:100,t:'EDP',p:30},
  {m:'Antonio Banderas',n:'The Icon',ml:200,t:'EDT',p:40},
  {m:'Antonio Banderas',n:'The Icon EDT',ml:100,t:'EDT',p:30},
  {m:'Antonio Banderas',n:'The Icon Splendid Woman',ml:100,t:'EDP',p:30},
  {m:'Antonio Banderas',n:'The Secret Absolu',ml:100,t:'EDP',p:25},
  {m:'Antonio Banderas',n:'The Secret',ml:100,t:'EDT',p:25},
  {m:'Antonio Banderas',n:'The Secret',ml:200,t:'EDT',p:35},
  {m:'Antonio Banderas',n:'The Secret Temptation',ml:100,t:'EDT',p:30},
  {m:'Arabiyat',n:'Sugar Coconut Chiffon',ml:100,t:'EDP',p:45},
  {m:'Arabiyat',n:'Sugar Cotton Blush',ml:100,t:'EDP',p:45},
  {m:'Arabiyat',n:'Sugar Lemon Sorbet',ml:100,t:'EDP',p:45},
  {m:'Arabiyat',n:'Sugar Mango Affogato',ml:100,t:'EDP',p:45},
  {m:'Arabiyat',n:'Sugar Strawberry Tres Leches',ml:100,t:'EDP',p:45},
  {m:'Aramis',n:'New West Men',ml:100,t:'EDT',p:55},
  {m:'Ariana Grande',n:'Ari',ml:100,t:'EDP',p:55},
  {m:'Ariana Grande',n:'Cloud 2.0 Intense',ml:100,t:'EDP',p:75},
  {m:'Ariana Grande',n:'Cloud Pink',ml:100,t:'EDP',p:75},
  {m:'Ariana Grande',n:'Cloud',ml:100,t:'EDP',p:75},
  {m:'Ariana Grande',n:'God Is A Woman',ml:100,t:'EDP',p:65},
  {m:'Ariana Grande',n:'Mod Blush',ml:100,t:'EDP',p:75},
  {m:'Ariana Grande',n:'Moonlight',ml:100,t:'EDP',p:55},
  {m:'Ariana Grande',n:'Sweet Like Candy',ml:100,t:'EDP',p:55},
  {m:'Ariana Grande',n:'Thank U Next 2.0',ml:100,t:'EDP',p:75},
  {m:'Ariana Grande',n:'Thank U Next',ml:100,t:'EDP',p:65},
  {m:'Armaf',n:'Aura Men',ml:100,t:'EDP',p:35},
  {m:'Armaf',n:'Club de Nuit Iconic',ml:100,t:'EDP',p:55},
  {m:'Armaf',n:'Club de Nuit Intense Men',ml:105,t:'EDT',p:40},
  {m:'Armaf',n:'Club de Nuit Intense Women',ml:105,t:'EDT',p:35},
  {m:'Armaf',n:'Club de Nuit Maleka',ml:105,t:'EDP',p:50},
  {m:'Armaf',n:'Club de Nuit Man',ml:105,t:'EDT',p:40},
  {m:'Armaf',n:'Club de Nuit Milestone',ml:105,t:'EDP',p:50},
  {m:'Armaf',n:'Club de Nuit Sillage',ml:100,t:'EDP',p:50},
  {m:'Armaf',n:'Club de Nuit Urban Man Elixir',ml:105,t:'EDP',p:50},
  {m:'Armaf',n:'Club de Nuit Woman',ml:105,t:'EDP',p:40},
  {m:'Armaf',n:'Connoisseur',ml:100,t:'EDP',p:45},
  {m:'Armaf',n:'El Cielo Men',ml:100,t:'EDP',p:35},
  {m:'Armaf',n:'Hunter Intense',ml:100,t:'EDP',p:35},
  {m:'Armaf',n:'Hunter',ml:100,t:'EDP',p:35},
  {m:'Armaf',n:'Island Bliss Delights',ml:100,t:'EDP',p:60},
  {m:'Armaf',n:'La Rosa',ml:100,t:'EDP',p:35},
  {m:'Armaf',n:'Mandarin Sky',ml:60,t:'EDP',p:35},
  {m:'Armaf',n:'Odyssey Aoud',ml:100,t:'EDP',p:45},
  {m:'Armaf',n:'Odyssey Artisto The Red Edition',ml:100,t:'EDP',p:50},
  {m:'Armaf',n:'Odyssey Bahamas Tropical',ml:100,t:'EDP',p:60},
  {m:'Armaf',n:'Odyssey Black Forest',ml:100,t:'EDP',p:60},
  {m:'Armaf',n:'Odyssey Candee',ml:100,t:'EDP',p:35},
  {m:'Armaf',n:'Odyssey Dubai Chocolat',ml:100,t:'EDP',p:35},
  {m:'Armaf',n:'Odyssey Femme',ml:75,t:'EDP',p:35},
  {m:'Armaf',n:'Odyssey Homme Black',ml:100,t:null,p:40},
  {m:'Armaf',n:'Odyssey Limoni',ml:100,t:'EDP',p:35},
  {m:'Armaf',n:'Odyssey Mandarin Sky',ml:200,t:'EDP',p:70},
  {m:'Armaf',n:'Odyssey Mandarin Sky Elixir',ml:100,t:'EDP',p:55},
  {m:'Armaf',n:'Odyssey Mandarin Sky',ml:100,t:'EDP',p:45},
  {m:'Armaf',n:'Odyssey Mango Tropical',ml:100,t:'EDP',p:45},
  {m:'Armaf',n:'Odyssey Marshmallow Gourmand',ml:100,t:'EDP',p:45},
  {m:'Armaf',n:'Odyssey Mega',ml:100,t:'EDP',p:35},
  {m:'Armaf',n:'Odyssey Montagne Mountain',ml:100,t:'EDP',p:60},
  {m:'Armaf',n:'Odyssey Revolution Ultra Edition',ml:100,t:'EDP',p:45},
  {m:'Armaf',n:'Odyssey Spectra',ml:100,t:'EDP',p:35},
  {m:'Armaf',n:'Odyssey Tyrant Especial Edit',ml:100,t:'EDP',p:35},
  {m:'Armaf',n:'Odyssey White Edition',ml:100,t:'EDP',p:40},
  {m:'Armaf',n:'Pride Men',ml:100,t:'EDP',p:45},
  {m:'Armaf',n:'Tag Donna Colorata',ml:100,t:'EDP',p:45},
  {m:'Armaf',n:'Tag Her',ml:100,t:'EDP',p:35},
  {m:'Armaf',n:'The Pride Woman',ml:100,t:'EDP',p:45},
  {m:'Armaf',n:'Tres Jour',ml:100,t:'EDP',p:40},
  {m:'Armaf',n:'Tres Nuit Lyric',ml:100,t:'EDP',p:45},
  {m:'Armaf',n:'Tres Nuit',ml:100,t:'EDP',p:30},
  {m:'Armaf',n:'Ventana Men',ml:100,t:'EDP',p:40},
  {m:'Armani',n:'Acqua di Gio Woman',ml:100,t:'EDT',p:100},
  {m:'Armani',n:'Code Women',ml:75,t:'EDP',p:130},
  {m:'Armani',n:'My Way Ylang',ml:90,t:'EDP',p:180},
  {m:'Azzaro',n:'Azzaro Wanted EDP',ml:100,t:'EDP',p:110},
  {m:'Azzaro',n:'The Most Wanted Intense',ml:100,t:'EDT',p:90},
  {m:'Benetton',n:'Cold Men',ml:100,t:'EDT',p:20},
  {m:'Benetton',n:'Cold Silver',ml:100,t:'EDT',p:20},
  {m:'Benetton',n:'Colors Blue Man',ml:100,t:'EDT',p:25},
  {m:'Benetton',n:'Colors Man Black Intense',ml:100,t:'EDP',p:25},
  {m:'Benetton',n:'Hot Gold Woman',ml:100,t:'EDT',p:15},
  {m:'Benetton',n:'Hot Woman',ml:100,t:'EDT',p:20},
  {m:'Benetton',n:'Inferno Paradiso Blue',ml:100,t:'EDT',p:20},
  {m:'Benetton',n:'Paradiso Inferno Pink',ml:100,t:'EDT',p:30},
  {m:'Benetton',n:'Sisterland Green Jasmine',ml:80,t:'EDT',p:30},
  {m:'Benetton',n:'Sisterland Pink Raspberry',ml:100,t:'EDT',p:25},
  {m:'Benetton',n:'Sisterland Red Rose',ml:80,t:'EDT',p:30},
  {m:'Benetton',n:'United Dream Love Yourself',ml:80,t:'EDT',p:25},
  {m:'Bharara',n:'Bharara Chocolate',ml:100,t:'EDP',p:90},
  {m:'Bharara',n:'Bharara King',ml:100,t:'EDP',p:75},
  {m:'Bharara',n:'Bharara King',ml:200,t:'EDP',p:100},
  {m:'Bharara',n:'Bharara King Parfum',ml:100,t:'PARFUM',p:100},
  {m:'Bharara',n:'Bharara Onyx',ml:100,t:'EDP',p:90},
  {m:'Bharara',n:'Bharara Queen',ml:100,t:'EDP',p:85},
  {m:'Bharara',n:'Champagne Pink',ml:100,t:'EDP',p:45},
  {m:'Bharara',n:'Rome Extradose Pour Femme',ml:100,t:'EDP',p:45},
  {m:'Bharara',n:'Rome Paradoxe Pour Women',ml:100,t:'EDP',p:45},
  {m:'Bharara',n:'Rome Pour Femme',ml:100,t:'EDP',p:45},
  {m:'Billie Eilish',n:'Billie Eilish No 2',ml:100,t:'EDP',p:80},
  {m:'Boucheron',n:'Boucheron Pour Homme',ml:100,t:'EDP',p:50},
  {m:'Britney Spears',n:'Circus',ml:100,t:'EDP',p:30},
  {m:'Britney Spears',n:'Curious',ml:100,t:'EDP',p:30},
  {m:'Britney Spears',n:'Fantasy Hidden',ml:100,t:'EDP',p:30},
  {m:'Britney Spears',n:'Fantasy',ml:100,t:'EDP',p:35},
  {m:'Britney Spears',n:'Midnight',ml:100,t:'EDP',p:30},
  {m:'Bvlgari',n:'Aqua Marine',ml:100,t:'EDT',p:155},
  {m:'Cacharel',n:'Amor Amor',ml:100,t:'EDT',p:50},
  {m:'Cacharel',n:'Anais Anais',ml:100,t:'EDT',p:45},
  {m:'Calvin Klein',n:'Calvin Be',ml:200,t:'EDT',p:45},
  {m:'Calvin Klein',n:'Calvin Be',ml:100,t:'EDT',p:30},
  {m:'Calvin Klein',n:'Escape Men',ml:100,t:'EDT',p:45},
  {m:'Calvin Klein',n:'Escape Woman',ml:100,t:'EDP',p:40},
  {m:'Calvin Klein',n:'Eternity',ml:200,t:'EDT',p:70},
  {m:'Calvin Klein',n:'Eternity Woman',ml:100,t:'EDP',p:55},
  {m:'Calvin Klein',n:'Euphoria Men',ml:100,t:'EDT',p:50},
  {m:'Calvin Klein',n:'Euphoria Women',ml:100,t:'EDP',p:65},
  {m:'Calvin Klein',n:'In2U Woman',ml:100,t:'EDT',p:30},
  {m:'Calvin Klein',n:'Obsession Men',ml:200,t:'EDT',p:50},
  {m:'Calvin Klein',n:'Obsession Men',ml:125,t:'EDT',p:35},
  {m:'Calvin Klein',n:'One Calvin',ml:100,t:'EDT',p:40},
  {m:'Calvin Klein',n:'One Calvin',ml:200,t:'EDT',p:50},
  {m:'Calvin Klein',n:'One Shock Woman',ml:100,t:'EDT',p:35},
  {m:'Carolina Herrera',n:'CH Men',ml:100,t:'EDT',p:130},
  {m:'Carolina Herrera',n:'212 Heroes Forever',ml:90,t:'EDP',p:115},
  {m:'Carolina Herrera',n:'212 NYC Men',ml:100,t:'EDT',p:110},
  {m:'Carolina Herrera',n:'212 Sexy Men',ml:100,t:'EDT',p:90},
  {m:'Carolina Herrera',n:'212 VIP Black',ml:200,t:'EDT',p:180},
  {m:'Carolina Herrera',n:'212 VIP Black Elixir',ml:100,t:'EDP',p:175},
  {m:'Carolina Herrera',n:'212 VIP Men',ml:100,t:'EDT',p:110},
  {m:'Carolina Herrera',n:'212 VIP Woman',ml:80,t:'EDP',p:110},
  {m:'Carolina Herrera',n:'Bad Boy Parfum',ml:100,t:'PARFUM',p:150},
  {m:'Carolina Herrera',n:'Carolina Clasico',ml:100,t:'EDP',p:80},
  {m:'Carolina Herrera',n:'CH Hot Hot Hot',ml:100,t:'EDP',p:160},
  {m:'Carolina Herrera',n:'CH Leau',ml:100,t:'EDT',p:90},
  {m:'Carolina Herrera',n:'CH Pasion',ml:100,t:'EDP',p:85},
  {m:'Carolina Herrera',n:'CH Sport',ml:100,t:'EDT',p:65},
  {m:'Carolina Herrera',n:'Chic For Men',ml:100,t:'EDT',p:70},
  {m:'Clinique',n:'Happy Heart',ml:100,t:'EDT',p:50},
  {m:'Clinique',n:'Happy Men',ml:100,t:'EDT',p:45},
  {m:'Clinique',n:'Happy Women',ml:100,t:'EDP',p:60},
  {m:'Creed',n:'Aventus Men',ml:100,t:'EDP',p:480},
  {m:'Creed',n:'Creed Aventus Absolu',ml:100,t:'EDP',p:580},
  {m:'Creed',n:'Millesime Imperial',ml:100,t:'EDP',p:400},
  {m:'Cuba',n:'Cuba Green Men',ml:100,t:'EDT',p:15},
  {m:'Davidoff',n:'Cool Water Women',ml:100,t:'EDT',p:40},
  {m:'Davidoff',n:'Cool Water Men',ml:125,t:'EDT',p:40},
  {m:'Davidoff',n:'Cool Water Men',ml:200,t:'EDT',p:55},
  {m:'Davidoff',n:'Cool Water Women',ml:200,t:'EDT',p:55},
  {m:'Diesel',n:'Plus Plus Woman',ml:75,t:'EDT',p:20},
  {m:'Dior',n:'Homme Dior Intense',ml:100,t:'EDP',p:220},
  {m:'Dior',n:'Homme Dior Men',ml:100,t:'EDT',p:200},
  {m:'Dior',n:'Sauvage Elixir',ml:100,t:'EDP',p:250},
  {m:'Dolce & Gabbana',n:'King Dolce Pour Homme Parfum',ml:100,t:'PARFUM',p:110},
  {m:'Dolce & Gabbana',n:'Devotion Men',ml:100,t:'EDP',p:130},
  {m:'Dolce & Gabbana',n:'Devotion Women',ml:100,t:'EDP',p:85},
  {m:'Dolce & Gabbana',n:'Gabbana King',ml:100,t:'EDP',p:110},
  {m:'Dolce & Gabbana',n:'Light Blue Eau Intense',ml:125,t:'EDP',p:100},
  {m:'Dolce & Gabbana',n:'Light Blue Forever Woman',ml:100,t:'EDP',p:125},
  {m:'Dolce & Gabbana',n:'Light Blue Summer Vibes',ml:100,t:'EDT',p:85},
  {m:'Dumont',n:'Nitro Blue Men',ml:100,t:'EDP',p:45},
  {m:'Dumont',n:'Nitro Platinum Men',ml:100,t:'EDP',p:45},
  {m:'Dumont',n:'Nitro Red Intensely',ml:100,t:'EDP',p:60},
  {m:'Elizabeth Arden',n:'5th Avenue',ml:125,t:'EDP',p:40},
  {m:'Elizabeth Arden',n:'Red Door',ml:100,t:'EDT',p:45},
  {m:'Elizabeth Arden',n:'Sunflowers',ml:100,t:'EDT',p:25},
  {m:'Emper',n:'The Black 92',ml:100,t:'EDP',p:40},
  {m:'Emper',n:'Ilang 62',ml:100,t:'EDP',p:50},
  {m:'Emper',n:'Stallion 53',ml:100,t:'EDP',p:35},
  {m:'Emporio Armani',n:'Stronger With You Parfum',ml:100,t:'PARFUM',p:195},
  {m:'Escada',n:'Magnetism',ml:75,t:'EDT',p:45},
  {m:'Estee Lauder',n:'Pleasures Men',ml:100,t:null,p:40},
  {m:'Ferrari',n:'Ferrari Black',ml:125,t:'EDT',p:30},
  {m:'Givenchy',n:'Ange ou Demon',ml:100,t:'EDP',p:120},
  {m:'Grandeur Tubbees',n:'Bubble Gum',ml:50,t:'EDP',p:20},
  {m:'Grandeur Tubbees',n:'Berry Blass',ml:50,t:'EDP',p:20},
  {m:'Grandeur Tubbees',n:'Candy Pop',ml:50,t:'EDP',p:20},
  {m:'Grandeur Tubbees',n:'Caramel',ml:50,t:'EDP',p:20},
  {m:'Grandeur Tubbees',n:'Chocolate Fudge',ml:50,t:'EDP',p:20},
  {m:'Grandeur Tubbees',n:'Cookies Cream',ml:50,t:'EDP',p:20},
  {m:'Grandeur Tubbees',n:'Pink Sugar',ml:50,t:'EDP',p:20},
  {m:'Grandeur Tubbees',n:'Cherry Luxe',ml:50,t:'EDP',p:20},
  {m:'Guess',n:'1981 Los Angeles Men',ml:100,t:'EDT',p:35},
  {m:'Guess',n:'Bella Vita',ml:100,t:'EDP',p:45},
  {m:'Guess',n:'Gold Guess Men',ml:75,t:'EDT',p:35},
  {m:'Guess',n:'Gold Guess Woman',ml:75,t:'EDP',p:35},
  {m:'Guess',n:'Guess Women',ml:75,t:'EDP',p:35},
  {m:'Guess',n:'Seductive Homme Red',ml:100,t:'EDT',p:35},
  {m:'Guess',n:'Seductive Men',ml:150,t:'EDT',p:40},
  {m:'Guess',n:'Seductive Men',ml:100,t:'EDT',p:35},
  {m:'Guess',n:'Seductive Red Woman',ml:75,t:'EDT',p:35},
  {m:'Guess',n:'Seductive Women',ml:125,t:'EDT',p:40},
  {m:'Halloween',n:'Blosson Women',ml:100,t:'EDT',p:55},
  {m:'Halloween',n:'Halloween Men',ml:125,t:'EDT',p:55},
  {m:'Halloween',n:'Halloween Women',ml:100,t:'EDT',p:55},
  {m:'Halloween',n:'Mystery Man',ml:125,t:'EDP',p:60},
  {m:'Hugo Boss',n:'Boss Man Green',ml:200,t:'EDT',p:75},
  {m:'Hugo Boss',n:'Bottle Unlimited Men',ml:100,t:'EDT',p:65},
  {m:'Hugo Boss',n:'Deep Red Woman',ml:90,t:'EDP',p:45},
  {m:'Hugo Boss',n:'Energise Men',ml:75,t:'EDT',p:55},
  {m:'Hugo Boss',n:'Hugo XX Woman',ml:100,t:'EDT',p:40},
  {m:'Hugo Boss',n:'Hugo XY Men',ml:100,t:null,p:45},
  {m:'Hugo Boss',n:'In Motion Men',ml:100,t:'EDT',p:45},
  {m:'Hugo Boss',n:'Orange Women',ml:75,t:'EDT',p:40},
  {m:'Hugo Boss',n:'Selection Boss Men',ml:90,t:'EDT',p:45},
  {m:'Hugo Boss',n:'The Scent Women',ml:100,t:'EDP',p:90},
  {m:'Issey Miyake',n:'Issey Classic Men',ml:200,t:'EDT',p:90},
  {m:'Issey Miyake',n:'Issey Intense Men',ml:75,t:'EDT',p:35},
  {m:'Issey Miyake',n:'Issey Intense Men',ml:125,t:'EDT',p:45},
  {m:'Issey Miyake',n:'Issey Leau Dissey EDP',ml:125,t:'EDP',p:90},
  {m:'Issey Miyake',n:'Issey Nuit Men',ml:125,t:'EDT',p:60},
  {m:'Issey Miyake',n:'Issey Pleats Leau Women',ml:100,t:'EDT',p:45},
  {m:'Jean Paul Gaultier',n:'Le Beau Gaultier',ml:125,t:'EDT',p:150},
  {m:'Jean Paul Gaultier',n:'Le Beau Paradise Garden',ml:125,t:'EDP',p:185},
  {m:'Jean Paul Gaultier',n:'Le Male',ml:125,t:'EDT',p:130},
  {m:'Jean Paul Gaultier',n:'Scandal Men',ml:100,t:'EDT',p:150},
  {m:'Jean Paul Gaultier',n:'Scandal Intense Men',ml:100,t:'EDP',p:180},
  {m:'Jimmy Choo',n:'Flash Women',ml:100,t:'EDP',p:55},
  {m:'Jo Milano',n:'Game of Spade Rouge',ml:100,t:'PARFUM',p:110},
  {m:'Jo Milano',n:'Game of Spades Gold',ml:100,t:'PARFUM',p:120},
  {m:'Joop',n:'Joop Homme',ml:125,t:'EDT',p:35},
  {m:'Katy Perry',n:'Killer Queen',ml:100,t:'EDP',p:45},
  {m:'Katy Perry',n:'Meow',ml:100,t:'EDP',p:30},
  {m:'Katy Perry',n:'Purrs',ml:100,t:'EDP',p:30},
  {m:'Katy Perry',n:'Royal Revolution',ml:100,t:'EDP',p:45},
  {m:'Kenzo',n:'Amour Woman',ml:100,t:'EDP',p:85},
  {m:'Kenzo',n:'Kenzo Homme',ml:100,t:'EDT',p:85},
  {m:'Kenzo',n:'World Power',ml:75,t:'EDT',p:95},
  {m:'Lacoste',n:'Booster',ml:125,t:'EDT',p:70},
  {m:'Lacoste',n:'L1212 Blanc',ml:100,t:'EDT',p:70},
  {m:'Lacoste',n:'Touch of Pink',ml:90,t:'EDT',p:55},
  {m:'Lattafa',n:'Najdia Intense',ml:100,t:'EDP',p:35},
  {m:'Lattafa',n:'Asad Bourbon',ml:100,t:'EDP',p:40},
  {m:'Lattafa',n:'Atlas',ml:55,t:'EDP',p:45},
  {m:'Lattafa',n:'Badee Al Oud Noble Blush',ml:100,t:'EDP',p:35},
  {m:'Lattafa',n:'Musamam Woman',ml:100,t:'EDP',p:60},
  {m:'Lattafa',n:'Yara Tous',ml:100,t:'EDP',p:30},
  {m:'Lattafa',n:'Afeef',ml:100,t:'EDP',p:60},
  {m:'Lattafa',n:'Ajwad',ml:60,t:'EDP',p:40},
  {m:'Lattafa',n:'Ajwad Pink to Pink',ml:60,t:'EDP',p:40},
  {m:'Lattafa',n:'Al Areeq Silver',ml:100,t:'EDP',p:50},
  {m:'Lattafa',n:'Amethyst Badee Al Oud',ml:100,t:'EDP',p:35},
  {m:'Lattafa',n:'Ana Abiyedh Rouge',ml:60,t:'EDP',p:30},
  {m:'Lattafa',n:'Ana Abiyedh Scarlet',ml:60,t:'EDP',p:30},
  {m:'Lattafa',n:'Ana Abiyedh',ml:60,t:'EDP',p:30},
  {m:'Lattafa',n:'Angham Woman',ml:100,t:'EDP',p:45},
  {m:'Lattafa',n:'Asad Elixir',ml:100,t:'EDP',p:45},
  {m:'Lattafa',n:'Asad',ml:100,t:'EDP',p:40},
  {m:'Lattafa',n:'Asad Zanzibar',ml:100,t:'EDP',p:40},
  {m:'Lattafa',n:'Badee Al Oud For Glory',ml:100,t:'EDP',p:35},
  {m:'Lattafa',n:'Badee Al Oud Honor Y Glory',ml:100,t:'EDP',p:40},
  {m:'Lattafa',n:'Badee Al Oud Sublime',ml:100,t:'EDP',p:35},
  {m:'Lattafa',n:'Confidential Platinum',ml:100,t:'EDP',p:30},
  {m:'Lattafa',n:'Eclair Banoffi',ml:100,t:'EDP',p:50},
  {m:'Lattafa',n:'Eclair Pistache',ml:100,t:'EDP',p:60},
  {m:'Lattafa',n:'Eclaire Women',ml:100,t:'EDP',p:35},
  {m:'Lattafa',n:'Eternal Oud',ml:100,t:null,p:65},
  {m:'Lattafa',n:'Fakhar Extrait Gold',ml:100,t:'EDP',p:35},
  {m:'Lattafa',n:'Give Me Gourmand Berry On Top',ml:75,t:'EDP',p:60},
  {m:'Lattafa',n:'Give Me Gourmand Cookie Crave',ml:75,t:'EDP',p:60},
  {m:'Lattafa',n:'Give Me Gourmand Choco Overdose',ml:75,t:'EDP',p:60},
  {m:'Lattafa',n:'Haya Woman',ml:100,t:'EDP',p:40},
  {m:'Lattafa',n:'Hayaati Al Maleky',ml:100,t:'EDP',p:40},
  {m:'Lattafa',n:'Hayaati Black',ml:100,t:'EDP',p:30},
  {m:'Lattafa',n:'Hayaatim',ml:100,t:'EDP',p:30},
  {m:'Lattafa',n:'His Confession',ml:100,t:'EDP',p:45},
  {m:'Lattafa',n:'Ishq Al Shuyukh Silver',ml:100,t:'EDP',p:45},
  {m:'Lattafa',n:'Khamrah Clasico',ml:100,t:'EDP',p:35},
  {m:'Lattafa',n:'Khamrah Dukhan',ml:100,t:'EDP',p:40},
  {m:'Lattafa',n:'Khamrah Qahwa',ml:100,t:'EDP',p:40},
  {m:'Lattafa',n:'Lail Maleki',ml:100,t:'EDP',p:40},
  {m:'Lattafa',n:'Liam Blue Shine',ml:100,t:'EDP',p:40},
  {m:'Lattafa',n:'Mashrabya',ml:100,t:'EDP',p:40},
  {m:'Lattafa',n:'Mayar Cherry Intense',ml:100,t:'EDP',p:40},
  {m:'Lattafa',n:'Musamam White Intense',ml:100,t:'EDP',p:50},
  {m:'Lattafa',n:'Najdia',ml:100,t:'EDP',p:35},
  {m:'Lattafa',n:'Petra Woman',ml:100,t:'EDP',p:55},
  {m:'Lattafa',n:'Pride Art of Universe',ml:100,t:'EDP',p:50},
  {m:'Lattafa',n:'Qaed Al Fursan',ml:90,t:'EDP',p:35},
  {m:'Lattafa',n:'Qaed Al Fursan Unlimited',ml:90,t:'EDP',p:25},
  {m:'Lattafa',n:'Qaed Al Fursan Untamed',ml:90,t:'EDP',p:40},
  {m:'Lattafa',n:'Qimmah',ml:100,t:'EDP',p:25},
  {m:'Lattafa',n:'Rave Now Pink',ml:100,t:'EDP',p:35},
  {m:'Lattafa',n:'Rave Now',ml:100,t:'EDP',p:45},
  {m:'Lattafa',n:'Rave Now White',ml:100,t:'EDP',p:40},
  {m:'Lattafa',n:'Sakeena',ml:100,t:'EDP',p:40},
  {m:'Lattafa',n:'Sehr',ml:100,t:'EDP',p:50},
  {m:'Lattafa',n:'Taweel',ml:100,t:'EDP',p:45},
  {m:'Lattafa',n:'Teriaq Men',ml:100,t:'EDP',p:50},
  {m:'Lattafa',n:'Teriaq Woman',ml:100,t:'EDP',p:50},
  {m:'Lattafa',n:'Tharwah Silver',ml:100,t:'EDP',p:50},
  {m:'Lattafa',n:'Tharwah Woman',ml:100,t:'EDP',p:50},
  {m:'Lattafa',n:'The Kingdom',ml:100,t:'EDP',p:40},
  {m:'Lattafa',n:'Thouq Woman',ml:80,t:'EDP',p:40},
  {m:'Lattafa',n:'Victoria Women',ml:100,t:'EDP',p:65},
  {m:'Lattafa',n:'Vintage Radio',ml:100,t:'EDP',p:40},
  {m:'Lattafa',n:'Wajood',ml:100,t:'EDP',p:40},
  {m:'Lattafa',n:'Winners Trophy Gold',ml:100,t:'EDP',p:40},
  {m:'Lattafa',n:'Yara Candy',ml:100,t:'EDP',p:30},
  {m:'Lattafa',n:'Yara Elixir',ml:100,t:'EDP',p:45},
  {m:'Lattafa',n:'Yara Moi',ml:100,t:'EDP',p:30},
  {m:'Lattafa',n:'Yara',ml:100,t:'EDP',p:30},
  {m:'Le Labo',n:'Santal 33',ml:100,t:'EDP',p:580},
  {m:'Lomani',n:'Spirit Millionarie Woman',ml:100,t:'EDP',p:20},
  {m:'Macarena',n:'Bit Coin For Woman',ml:100,t:'EDP',p:30},
  {m:'Maison Alhambra',n:'Glacier Pour Homme',ml:100,t:'EDP',p:30},
  {m:'Maison Alhambra',n:'Glacier Ultra Men',ml:100,t:'EDP',p:30},
  {m:'Maison Alhambra',n:'Infini Elixir',ml:100,t:'EDP',p:30},
  {m:'Maison Alhambra',n:'Kismet Women',ml:100,t:'EDP',p:40},
  {m:'Maison Margiela',n:'Replica Flower Market',ml:100,t:null,p:120},
  {m:'Mancera',n:'Cedrat Boise',ml:125,t:'EDP',p:140},
  {m:'Marc Jacobs',n:'Daisy',ml:100,t:'EDT',p:100},
  {m:'Marc Jacobs',n:'Perfect EDP',ml:100,t:'EDP',p:110},
  {m:'Marc Jacobs',n:'Perfect EDT',ml:100,t:'EDT',p:110},
  {m:'Mont Blanc',n:'Emblem Elixir Women',ml:75,t:'EDP',p:55},
  {m:'Mont Blanc',n:'Emblem Men',ml:100,t:'EDT',p:60},
  {m:'Mont Blanc',n:'Explorer Men',ml:100,t:'EDP',p:80},
  {m:'Mont Blanc',n:'Explorer Platinum',ml:100,t:'EDP',p:65},
  {m:'Mont Blanc',n:'Femme Individuelle',ml:75,t:'EDT',p:45},
  {m:'Mont Blanc',n:'Legend Blue',ml:100,t:'EDP',p:85},
  {m:'Mont Blanc',n:'Legend Eau Parfum',ml:100,t:'EDP',p:80},
  {m:'Mont Blanc',n:'Legend Men',ml:200,t:'EDT',p:85},
  {m:'Mont Blanc',n:'Legend Men',ml:100,t:'EDT',p:70},
  {m:'Mont Blanc',n:'Legend Night Men',ml:100,t:'EDT',p:60},
  {m:'Mont Blanc',n:'Legend Red Men',ml:100,t:'EDP',p:60},
  {m:'Mont Blanc',n:'Legend Spirit Men EDT',ml:100,t:'EDT',p:65},
  {m:'Mont Blanc',n:'Presence Men',ml:75,t:'EDT',p:40},
  {m:'Mont Blanc',n:'Starwalker Men',ml:75,t:'EDT',p:45},
  {m:'Montale',n:'Arabians Tonka',ml:100,t:'EDP',p:180},
  {m:'Montale',n:'Golden Aoud',ml:100,t:'EDP',p:130},
  {m:'Moschino',n:'Toy 2 Pearl',ml:100,t:'EDP',p:80},
  {m:'Moschino',n:'Toy Boy 2 Women',ml:100,t:'EDP',p:70},
  {m:'Moschino',n:'Toy Boy Men',ml:100,t:'EDP',p:70},
  {m:'Moschino',n:'Toy Boy Bubble Gum',ml:100,t:'EDT',p:75},
  {m:'Nautica',n:'Heritage Men',ml:100,t:'EDT',p:25},
  {m:'Nautica',n:'Nautica Blue',ml:100,t:'EDT',p:25},
  {m:'Nautica',n:'Nautica Classic Men',ml:100,t:'EDT',p:25},
  {m:'Nautica',n:'Voyage Men',ml:200,t:'EDT',p:40},
  {m:'Nautica',n:'Voyage Men',ml:100,t:'EDT',p:25},
  {m:'Nautica',n:'Voyage N83',ml:100,t:'EDT',p:25},
  {m:'Nautica',n:'Voyage Sport',ml:100,t:'EDT',p:25},
  {m:'New Brand',n:'Commando Men',ml:100,t:'EDT',p:10},
  {m:'Orientica',n:'Le Motif Wild Neroli',ml:85,t:null,p:165},
  {m:'Orientica',n:'Royal Amber',ml:80,t:'EDP',p:90},
  {m:'Orientica',n:'Royal Bleu',ml:80,t:'EDP',p:100},
  {m:'Orientica',n:'Velvet Gold',ml:100,t:'EDP',p:125},
  {m:'Paco Rabanne',n:'Black XS',ml:100,t:'EDT',p:105},
  {m:'Paco Rabanne',n:'Black XS Excess',ml:80,t:null,p:90},
  {m:'Paco Rabanne',n:'Black XS Woman',ml:100,t:'EDT',p:85},
  {m:'Paco Rabanne',n:'Fame Parfum',ml:80,t:'PARFUM',p:180},
  {m:'Paco Rabanne',n:'Invictus',ml:100,t:'EDT',p:125},
  {m:'Paco Rabanne',n:'Invictus Victory Absolu',ml:100,t:'EDP',p:180},
  {m:'Paco Rabanne',n:'Invictus Victory Elixir',ml:100,t:'PARFUM',p:150},
  {m:'Paco Rabanne',n:'Invictus Victory Extreme',ml:100,t:'EDP',p:150},
  {m:'Paco Rabanne',n:'Million Gold Elixir',ml:100,t:'EDP',p:150},
  {m:'Paco Rabanne',n:'Million Gold Intense',ml:100,t:'EDP',p:150},
  {m:'Paco Rabanne',n:'Old XS',ml:100,t:'EDT',p:85},
  {m:'Paco Rabanne',n:'One Million Clasico',ml:100,t:'EDT',p:110},
  {m:'Paco Rabanne',n:'One Million Royal Parfum',ml:100,t:'EDP',p:130},
  {m:'Paco Rabanne',n:'One Million Royal Women',ml:80,t:'EDP',p:110},
  {m:'Paco Rabanne',n:'Paco Black Can',ml:100,t:'EDT',p:45},
  {m:'Paco Rabanne',n:'Phantom Intense',ml:100,t:'EDP',p:140},
  {m:'Paco Rabanne',n:'Phantom Men',ml:100,t:null,p:125},
  {m:'Paco Rabanne',n:'Ultraviolet Women',ml:75,t:'EDP',p:65},
  {m:'Paco Rabanne',n:'XS Men',ml:100,t:'EDT',p:65},
  {m:'Paris Hilton',n:'Gold Rush Woman',ml:100,t:'EDP',p:45},
  {m:'Paris Hilton',n:'Just Me Woman',ml:100,t:'EDP',p:35},
  {m:'Paris Hilton',n:'Paris Hilton Classic',ml:100,t:'EDP',p:35},
  {m:'Paris Hilton',n:'Pink Rush',ml:100,t:'EDP',p:45},
  {m:'Paris Hilton',n:'Ruby Rush',ml:100,t:'EDP',p:45},
  {m:'Perry Ellis',n:'Ellis 360 Red Men',ml:100,t:'EDT',p:40},
  {m:'Perry Ellis',n:'Ellis 360 Red Woman',ml:100,t:'EDP',p:40},
  {m:'Perry Ellis',n:'Ellis For 360 Coral Woman',ml:100,t:'EDP',p:45},
  {m:'Philipp Plein',n:'No Limits Super Fresh',ml:90,t:'EDP',p:120},
  {m:'Philipp Plein',n:'No Limits Men',ml:90,t:'EDP',p:140},
  {m:'Polo Ralph Lauren',n:'Sport Men',ml:125,t:'EDT',p:60},
  {m:'Prada',n:'Paradoxe EDP',ml:90,t:'EDP',p:220},
  {m:'Prada',n:'Paradoxe Intense',ml:90,t:'EDP',p:230},
  {m:'Ralph Lauren',n:'Club Men',ml:100,t:'EDP',p:85},
  {m:'Ralph Lauren',n:'Polo 67 Men',ml:100,t:'EDT',p:95},
  {m:'Ralph Lauren',n:'Polo Black',ml:125,t:'EDT',p:55},
  {m:'Ralph Lauren',n:'Polo Red Men',ml:125,t:'EDT',p:60},
  {m:'Ralph Lauren',n:'Polo Red Men EDP',ml:125,t:'EDP',p:80},
  {m:'Ralph Lauren',n:'Ralph Lauren Big Pony',ml:100,t:'EDT',p:40},
  {m:'Rasasi',n:'Egra Women',ml:100,t:'EDP',p:35},
  {m:'Rasasi',n:'Hawas Diva',ml:100,t:'EDP',p:55},
  {m:'Rasasi',n:'Hawas Eclat',ml:100,t:'EDP',p:60},
  {m:'Rasasi',n:'Hawas Kobra',ml:100,t:'EDP',p:65},
  {m:'Rasasi',n:'Hawas London',ml:100,t:'EDP',p:75},
  {m:'Rasasi',n:'Hawas Malibu',ml:100,t:'EDP',p:65},
  {m:'Rasasi',n:'Hawas Men',ml:100,t:'EDP',p:45},
  {m:'Rasasi',n:'Hawas For Her',ml:100,t:'EDP',p:35},
  {m:'Rasasi',n:'Daarej Women',ml:100,t:'EDP',p:45},
  {m:'Rasasi',n:'Yuqawan Orchid Prairie',ml:75,t:'EDP',p:50},
  {m:'Rayhaan',n:'Rayhaan Elixir',ml:100,t:'EDP',p:50},
  {m:'Salvatore Ferragamo',n:'Eleganza Woman',ml:100,t:'EDP',p:60},
  {m:'Salvatore Ferragamo',n:'Ferragamo F Black',ml:100,t:'EDT',p:60},
  {m:'Salvatore Ferragamo',n:'Ferragamo F By Black',ml:100,t:'EDT',p:45},
  {m:'Salvatore Ferragamo',n:'Ferragamo F Pour Men',ml:100,t:'EDT',p:45},
  {m:'Salvatore Ferragamo',n:'Ferragamo Men',ml:100,t:'EDT',p:70},
  {m:'Salvatore Ferragamo',n:'Ferragamo Uomo',ml:100,t:'EDT',p:60},
  {m:'Salvatore Ferragamo',n:'Signorina',ml:100,t:'EDP',p:65},
  {m:'Sean John',n:'I Am King',ml:100,t:'EDT',p:45},
  {m:'Taxi',n:'Taxi EDT',ml:100,t:'EDT',p:20},
  {m:'Thierry Mugler',n:'Alien Women',ml:90,t:'EDP',p:115},
  {m:'Tom Ford',n:'Ombre Leather',ml:100,t:'EDP',p:270},
  {m:'Tom Ford',n:'Velvet Orchid Woman',ml:100,t:'EDP',p:270},
  {m:'Tommy Hilfiger',n:'Tommy Girl',ml:100,t:'EDT',p:45},
  {m:'UDV',n:'Ciel Paris Woman',ml:100,t:'EDP',p:20},
  {m:'Valentino',n:'Born In Roma Coral Fantasy',ml:100,t:'EDP',p:190},
  {m:'Valentino',n:'Born In Roma Yellow',ml:100,t:'EDP',p:180},
  {m:'Valentino',n:'Valentina Woman',ml:80,t:'EDP',p:125},
  {m:'Versace',n:'Blue Jeans Men',ml:75,t:'EDT',p:30},
  {m:'Versace',n:'Dylan Blue Woman',ml:100,t:'EDP',p:95},
  {m:'Versace',n:'Dylan Purple Women',ml:100,t:'EDP',p:110},
  {m:'Versace',n:'Eros EDP',ml:100,t:'EDP',p:100},
  {m:'Versace',n:'Eros Flame',ml:100,t:'EDP',p:110},
  {m:'Versace',n:'Eros Parfum',ml:100,t:'PARFUM',p:120},
  {m:'Versace',n:'Pour Homme',ml:100,t:'EDT',p:80},
  {m:'Versace',n:'Red Jeans Women',ml:75,t:'EDT',p:30},
  {m:'Viktor & Rolf',n:'Flowerbomb Nectar Intense',ml:90,t:'EDP',p:155},
  {m:'Viktor & Rolf',n:'Bon Bon Victor',ml:100,t:'EDP',p:150},
  {m:'Viktor & Rolf',n:'Spicebomb Clasico',ml:90,t:'EDT',p:90},
  {m:'Viktor & Rolf',n:'Spice Bomb Extreme',ml:90,t:'EDP',p:140},
  {m:'Victorinox',n:'Swiss Army Classic',ml:100,t:'EDT',p:35},
  {m:'Yves Saint Laurent',n:'Kouros',ml:100,t:'EDT',p:75},
  {m:'Yves Saint Laurent',n:'La Nuit De L Homme',ml:100,t:'EDT',p:150},
  {m:'Yves Saint Laurent',n:'Libre L Eau',ml:90,t:'EDP',p:230},
  {m:'Zimaya',n:'Tiramisu Caramel',ml:100,t:'EDP',p:45},
  {m:'Zimaya',n:'Zimaya Precious Collect',ml:100,t:null,p:45},
  {m:'Disney',n:'Perfume Ninos',ml:100,t:'EDT',p:15},
]

function norm(s) {
  return (s||'').toLowerCase().replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim()
}

// Aliases: PDF house name → one or more catalog house names (normalized)
const HOUSE_ALIASES = {
  'mont blanc':       ['montblanc'],
  'paco rabanne':     ['paco rabanne', 'rabanne'],
  'thierry mugler':   ['mugler'],
  'mugler':           ['mugler'],
  'jo milano':        ['jo milano paris'],
  'armani':           ['giorgio armani'],
  'emporio armani':   ['giorgio armani'],
  'viktor rolf':      ['viktorrolf'],
  'viktor  rolf':     ['viktorrolf'],
  'arabiyat':         ['arabiyat sugar'],
  'sean john':        ['sean'],
  'yves saint laurent': ['ysl', 'yves saint laurent'],
  'joop':             ['joop'],
  'estee lauder':     ['estee lauder'],
}

function resolveHouseNorms(pdfHouseRaw) {
  const n = norm(pdfHouseRaw)
  return HOUSE_ALIASES[n] || [n]
}

// For Arabiyat Sugar: PDF has m:'Arabiyat', n:'Sugar X' → catalog name is 'Arabiyat Sugar X'
function expandPdfName(pdfHouseRaw, pdfNameRaw) {
  const n = norm(pdfHouseRaw)
  if (n === 'arabiyat') {
    return norm('Arabiyat ' + pdfNameRaw)
  }
  return norm(pdfNameRaw)
}

const catMap = new Map()
for (const p of allProducts) {
  const key = `${norm(p.house)}::${norm(p.name)}::${p.ml}`
  catMap.set(key, p)
}

const catByHouseML = new Map()
for (const p of allProducts) {
  const k = `${norm(p.house)}::${p.ml}`
  if (!catByHouseML.has(k)) catByHouseML.set(k, [])
  catByHouseML.get(k).push(p)
}

const catByHouse = new Map()
for (const p of allProducts) {
  const k = norm(p.house)
  if (!catByHouse.has(k)) catByHouse.set(k, [])
  catByHouse.get(k).push(p)
}

const missing = []
const priceDiff = []
const matched = new Set()

for (const pdf of PDF) {
  if (!pdf.p || pdf.p === 0) continue
  const pdfHouseNorms = resolveHouseNorms(pdf.m)
  const pdfNameNorm = expandPdfName(pdf.m, pdf.n)

  let found = false
  let matchedCat = null

  for (const pdfHouseNorm of pdfHouseNorms) {
    if (found) break

    // Strategy 1: exact house+name+ml
    const key1 = `${pdfHouseNorm}::${pdfNameNorm}::${pdf.ml}`
    if (catMap.has(key1)) { matchedCat = catMap.get(key1); found = true; break }

    // Strategy 2: house + name-without-house-prefix + ml
    const noPrefix = pdfNameNorm.startsWith(pdfHouseNorm+' ') ? pdfNameNorm.slice(pdfHouseNorm.length+1) : pdfNameNorm
    const key2 = `${pdfHouseNorm}::${noPrefix}::${pdf.ml}`
    if (catMap.has(key2)) { matchedCat = catMap.get(key2); found = true; break }

    // Strategy 3: fuzzy by house+ml, then name similarity
    const candidates = catByHouseML.get(`${pdfHouseNorm}::${pdf.ml}`) || []
    let bestScore3 = 0
    for (const cat of candidates) {
      const catN = norm(cat.name)
      const catNoH = catN.startsWith(pdfHouseNorm+' ') ? catN.slice(pdfHouseNorm.length+1) : catN
      const pdfWords = pdfNameNorm.split(' ').filter(w=>w.length>2)
      const hits = pdfWords.filter(w => catN.includes(w) || catNoH.includes(w)).length
      const score = pdfWords.length > 0 ? hits / pdfWords.length : 0
      if (score > bestScore3) { bestScore3 = score; matchedCat = cat }
    }
    if (bestScore3 >= 0.5) { found = true; break }
    else matchedCat = null

    // Strategy 4: house only match, ignore ml (to catch ml mismatches)
    const houseCandidates = catByHouse.get(pdfHouseNorm) || []
    let bestScore4 = 0
    let bestCat4 = null
    for (const cat of houseCandidates) {
      const catN = norm(cat.name)
      const catNoH = catN.startsWith(pdfHouseNorm+' ') ? catN.slice(pdfHouseNorm.length+1) : catN
      const pdfWords = pdfNameNorm.split(' ').filter(w=>w.length>2)
      const hits = pdfWords.filter(w => catN.includes(w) || catNoH.includes(w)).length
      const score = pdfWords.length > 0 ? hits / pdfWords.length : 0
      if (score > bestScore4) { bestScore4 = score; bestCat4 = cat }
    }
    if (bestScore4 >= 0.6 && bestCat4) {
      matchedCat = bestCat4
      if (matchedCat.ml !== pdf.ml) {
        missing.push({ ...pdf, note: `¿ML diferente? Web tiene ${matchedCat.ml}ml (ID:${matchedCat.id})` })
        found = true
      } else {
        found = true
      }
      break
    }
  }

  if (found && matchedCat && !matched.has(matchedCat.id)) {
    matched.add(matchedCat.id)
    if (matchedCat.precioUSD !== pdf.p && matchedCat.precioUSD > 0) {
      priceDiff.push({ pdf, cat: matchedCat, catPrice: matchedCat.precioUSD })
    }
  } else if (!found) {
    missing.push(pdf)
  }
}

console.log('\n===== NO ENCONTRADOS EN CATÁLOGO (posibles productos nuevos) =====')
for (const p of missing) {
  const note = p.note ? ` ← ${p.note}` : ''
  console.log(`  [${p.m}] ${p.n} ${p.ml}ml ${p.t||''}  REF:${p.p}${note}`)
}
console.log(`Total: ${missing.length}`)

console.log('\n===== PRECIOS DIFERENTES (PDF vs WEB) =====')
for (const d of priceDiff) {
  const diff = d.pdf.p - d.catPrice
  const arrow = diff > 0 ? '↑' : '↓'
  console.log(`  ID:${d.cat.id} [${d.pdf.m}] ${d.cat.name} ${d.cat.ml}ml — WEB:$${d.catPrice} → PDF:$${d.pdf.p} ${arrow}${Math.abs(diff)}`)
}
console.log(`Total: ${priceDiff.length}`)
