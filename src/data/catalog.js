// Catálogo completo — fuente: Lista de Precios Abril 2
// Campos: id, house, name, ref, ml, tipo, genero, precioBS, precioUSD, familia, image, descripcion

function g(name) {
  const u = name.toUpperCase()
  if (/\bUNISEX\b/.test(u)) return 'Unisex'
  if (/\bWOMEN\b|\bWOMAN\b|\bFEMININE\b|\bFEMENINE\b|\bFEMME\b|\bHER\b|\bGIRL\b|\bDAMA\b|\bROSE\b|\bNIÑA\b/.test(u)) return 'Femenino'
  if (/\bMEN\b|\bHOMBRE\b|\bBOY\b|\bHOMME\b|\bHOMO\b|\bHIM\b|\bKING\b|\bNIÑO\b/.test(u)) return 'Masculino'
  return 'Unisex'
}

function t(ref) {
  const r = (ref || '').toUpperCase()
  if (/PARFUM/.test(r) && !/EDP|EDT/.test(r)) return 'Parfum'
  if (/EDP|EAU DE PARFUM/.test(r)) return 'Eau de Parfum'
  if (/EDT|EAU DE TOILETTE/.test(r)) return 'Eau de Toilette'
  if (/BODY|SPRAY/.test(r)) return 'Body Spray'
  if (/SET/.test(r)) return 'Set'
  return 'Eau de Parfum'
}

function ml(ref) {
  const m = (ref || '').match(/(\d+)\s*ML/i)
  return m ? parseInt(m[1]) : null
}

const raw = [
  // ── ADIDAS ──────────────────────────────────────────────────
  { house:'ADIDAS', name:'Dynamic Pulse Men', ref:'EDT / 100 ML', bs:9750, usd:15 },
  { house:'ADIDAS', name:'Ice Dive Men', ref:'EDT / 100 ML', bs:9750, usd:15 },
  { house:'ADIDAS', name:'Victory League Men', ref:'EDT / 100 ML', bs:9750, usd:15 },

  // ── AFNAN ───────────────────────────────────────────────────
  { house:'AFNAN', name:'9 AM Dive Unisex', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'AFNAN', name:'9AM White', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'AFNAN', name:'9PM Men', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'AFNAN', name:'9PM Black Men', ref:'150ML EDP', bs:35750, usd:55 },
  { house:'AFNAN', name:'Supremacy Collectors Edition Unisex', ref:'100ML EDP', bs:39000, usd:60 },
  { house:'AFNAN', name:'Turathi Blue Men', ref:'90ML EDP', bs:29250, usd:45 },

  // ── AL HARAMAIN ─────────────────────────────────────────────
  { house:'AL HARAMAIN', name:'Junoon Rose Woman', ref:'75ML EDP', bs:42250, usd:65 },
  { house:'AL HARAMAIN', name:'Amber Oud Gold Edit', ref:'60ML EDP', bs:35750, usd:55 },
  { house:'AL HARAMAIN', name:'Amber Oud Night Dubai Unisex', ref:'100ML EDP', bs:48750, usd:75 },
  { house:'AL HARAMAIN', name:'Amber Oud Night Dubai Unisex', ref:'75ML EDP', bs:42250, usd:65 },
  { house:'AL HARAMAIN', name:'Amber Oud Carbon Unisex', ref:'60ML EDP', bs:39000, usd:60 },
  { house:'AL HARAMAIN', name:'Amber Oud Gold Edition Unisex', ref:'200ML EDP', bs:61750, usd:95 },
  { house:'AL HARAMAIN', name:'Amber Oud Gold Edition Unisex', ref:'120ML EDP', bs:52000, usd:80 },
  { house:'AL HARAMAIN', name:'Amber Oud Rouge', ref:'60ML EDP', bs:39000, usd:60 },
  { house:'AL HARAMAIN', name:'Portfolio Imperial Oud', ref:'75ML EDP', bs:97500, usd:150 },

  // ── ANIMALE ─────────────────────────────────────────────────
  { house:'ANIMALE', name:'Animale For Men', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'ANIMALE', name:'Animale Men EDT', ref:'100ML EDT', bs:26000, usd:40 },
  { house:'ANIMALE', name:'Animale Women', ref:'100ML EDP', bs:32500, usd:50 },

  // ── ANTONIO BANDERAS ────────────────────────────────────────
  { house:'ANTONIO BANDERAS', name:'The Secret Men EDT', ref:'200ML EDT', bs:22750, usd:35 },
  { house:'ANTONIO BANDERAS', name:'Blue Seduction Women', ref:'80ML EDT', bs:16250, usd:25 },
  { house:'ANTONIO BANDERAS', name:'King of Seduction Men EDT', ref:'200ML EDT', bs:22750, usd:35 },
  { house:'ANTONIO BANDERAS', name:'The Secret Absolu Men EDP', ref:'100ML EDP', bs:16250, usd:25 },
  { house:'ANTONIO BANDERAS', name:'Black Seduction Men', ref:'100ML EDT', bs:16250, usd:25 },
  { house:'ANTONIO BANDERAS', name:'Black Seduction Men', ref:'200ML EDT', bs:22750, usd:35 },
  { house:'ANTONIO BANDERAS', name:'Blue Seduction Man', ref:'200ML EDT', bs:22750, usd:35 },
  { house:'ANTONIO BANDERAS', name:'Blue Seduction Men', ref:'100ML EDT', bs:16250, usd:25 },
  { house:'ANTONIO BANDERAS', name:'Blue Seduction Woman', ref:'200ML EDT', bs:22750, usd:35 },
  { house:'ANTONIO BANDERAS', name:'Her Golden Secret Woman', ref:'80ML EDT', bs:16250, usd:25 },
  { house:'ANTONIO BANDERAS', name:'Her Secret Absoluto Women', ref:'80ML EDP', bs:16250, usd:25 },
  { house:'ANTONIO BANDERAS', name:'Her Secret Desire Woman', ref:'80ML EDT', bs:16250, usd:25 },
  { house:'ANTONIO BANDERAS', name:'Her Secret Temptation Woman', ref:'80ML EDT', bs:16250, usd:25 },
  { house:'ANTONIO BANDERAS', name:'King of Seduction Absolute Men', ref:'100ML EDT', bs:16250, usd:25 },
  { house:'ANTONIO BANDERAS', name:'King of Seduction Men', ref:'100ML EDT', bs:16250, usd:25 },
  { house:'ANTONIO BANDERAS', name:'Power Seduction Men', ref:'100ML EDT', bs:16250, usd:25 },
  { house:'ANTONIO BANDERAS', name:'The Golden Secret Men', ref:'100ML EDT', bs:16250, usd:25 },
  { house:'ANTONIO BANDERAS', name:'The Icon Men EDP', ref:'100ML EDP', bs:19500, usd:30 },
  { house:'ANTONIO BANDERAS', name:'The Icon Men EDT', ref:'200ML EDT', bs:26000, usd:40 },
  { house:'ANTONIO BANDERAS', name:'The Icon Men EDT', ref:'100ML EDT', bs:19500, usd:30 },
  { house:'ANTONIO BANDERAS', name:'The Icon Splendid Woman', ref:'100ML EDP', bs:19500, usd:30 },
  { house:'ANTONIO BANDERAS', name:'The Secret Men', ref:'100ML EDT', bs:16250, usd:25 },
  { house:'ANTONIO BANDERAS', name:'The Secret Temptation Men', ref:'100ML EDT', bs:19500, usd:30 },

  // ── ARABIYAT SUGAR ──────────────────────────────────────────
  { house:'ARABIYAT SUGAR', name:'Coconut Chiffon Unisex', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'ARABIYAT SUGAR', name:'Cotton Blush Women', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'ARABIYAT SUGAR', name:'Lemon Sorbet Unisex', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'ARABIYAT SUGAR', name:'Mango Affogato Unisex', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'ARABIYAT SUGAR', name:'Strawberry Tres Leches Unisex', ref:'100ML EDP', bs:29250, usd:45 },

  // ── ARAMIS ──────────────────────────────────────────────────
  { house:'ARAMIS', name:'New West Men', ref:'100ML EDT', bs:35750, usd:55 },

  // ── ARIANA GRANDE ───────────────────────────────────────────
  { house:'ARIANA GRANDE', name:'Ari Women', ref:'100ML EDP', bs:35750, usd:55 },
  { house:'ARIANA GRANDE', name:'God Is A Woman', ref:'100ML EDP', bs:42250, usd:65 },
  { house:'ARIANA GRANDE', name:'Mod Blush Women', ref:'100ML EDP', bs:48750, usd:75 },
  { house:'ARIANA GRANDE', name:'Thank U Next Women', ref:'100ML EDP', bs:42250, usd:65 },
  { house:'ARIANA GRANDE', name:'Cloud 2.0 Intense Women', ref:'100ML EDP', bs:48750, usd:75 },
  { house:'ARIANA GRANDE', name:'Cloud Pink Women', ref:'100ML EDP', bs:48750, usd:75 },
  { house:'ARIANA GRANDE', name:'Cloud Women', ref:'100ML EDP', bs:48750, usd:75 },
  { house:'ARIANA GRANDE', name:'Cloud Women Set (3 PC)', ref:'SET', bs:65000, usd:100 },
  { house:'ARIANA GRANDE', name:'Moonlight Woman', ref:'100ML EDP', bs:35750, usd:55 },
  { house:'ARIANA GRANDE', name:'R.E.M. Women', ref:'100ML EDP', bs:42250, usd:65 },
  { house:'ARIANA GRANDE', name:'Set Moonlight Woman', ref:'100ML EDP', bs:52000, usd:80 },
  { house:'ARIANA GRANDE', name:'Set Ari Women (3 PC)', ref:'SET', bs:45500, usd:70 },
  { house:'ARIANA GRANDE', name:'Set Thank U Next 2.0 (3 PC)', ref:'SET', bs:58500, usd:90 },
  { house:'ARIANA GRANDE', name:'Set Cloud Pink Women (3 PC)', ref:'SET', bs:65000, usd:100 },
  { house:'ARIANA GRANDE', name:'Set Moon Light (3 PC)', ref:'SET', bs:45500, usd:70 },
  { house:'ARIANA GRANDE', name:'Sweet Like Candy Women', ref:'100ML EDP', bs:35750, usd:55 },
  { house:'ARIANA GRANDE', name:'Thank U Next 2.0 Women', ref:'100ML EDP', bs:48750, usd:75 },

  // ── ARMAF ───────────────────────────────────────────────────
  { house:'ARMAF', name:'La Rosa Woman', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'ARMAF', name:'Set Tag Her 4 Piezas', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'ARMAF', name:'Set Club de Nuit Intense Man', ref:'SET', bs:45500, usd:70 },
  { house:'ARMAF', name:'Aura EDP', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'ARMAF', name:'Boy Body Spray', ref:'200ML BODY', bs:6500, usd:10 },
  { house:'ARMAF', name:'Club de Nuit Iconic Men EDP', ref:'100ML EDP', bs:35750, usd:55 },
  { house:'ARMAF', name:'Club de Nuit Sillage EDP', ref:'100ML EDP', bs:32500, usd:50 },
  { house:'ARMAF', name:'El Cielo Men EDP', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'ARMAF', name:'Hunter Intense For Men EDP', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'ARMAF', name:'Hunter Men EDP', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'ARMAF', name:'Island Bliss Delights Woman', ref:'100ML EDP', bs:39000, usd:60 },
  { house:'ARMAF', name:'Odyssey Limoni Men EDP', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'ARMAF', name:'Odyssey Mega Men EDP', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'ARMAF', name:'Odyssey Spectra Men EDP', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'ARMAF', name:'Odyssey Tyrant Men EDP', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'ARMAF', name:'Pride Men EDP', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'ARMAF', name:'Tag Her Women', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'ARMAF', name:'The Pride Woman EDP', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'ARMAF', name:'Tres Nuit Lyric Pour Men EDP', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'ARMAF', name:'Checkmate Queen Women', ref:'100ML EDP', bs:35750, usd:55 },
  { house:'ARMAF', name:'Club de Nuit Intense Men', ref:'105ML EDT', bs:26000, usd:40 },
  { house:'ARMAF', name:'Club de Nuit Intense Women', ref:'105ML EDT', bs:22750, usd:35 },
  { house:'ARMAF', name:'Club de Nuit Maleka Women', ref:'105ML EDP', bs:32500, usd:50 },
  { house:'ARMAF', name:'Club de Nuit Man', ref:'105ML EDT', bs:26000, usd:40 },
  { house:'ARMAF', name:'Club de Nuit Milestone Unisex', ref:'105ML EDP', bs:32500, usd:50 },
  { house:'ARMAF', name:'Club de Nuit Urban Man Elixir', ref:'105ML EDP', bs:32500, usd:50 },
  { house:'ARMAF', name:'Club de Nuit Woman', ref:'105ML EDP', bs:26000, usd:40 },
  { house:'ARMAF', name:'Connoisseur Women', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'ARMAF', name:'Mandarin Sky Men', ref:'60ML EDP', bs:22750, usd:35 },
  { house:'ARMAF', name:'Odyssey Aoud Men', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'ARMAF', name:'Odyssey Artisto The Red Edition', ref:'100ML EDP', bs:32500, usd:50 },
  { house:'ARMAF', name:'Odyssey Bahamas Tropical Unisex', ref:'100ML EDP', bs:39000, usd:60 },
  { house:'ARMAF', name:'Odyssey Black Forest Unisex', ref:'100ML EDP', bs:39000, usd:60 },
  { house:'ARMAF', name:'Odyssey Candee Women', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'ARMAF', name:'Odyssey Dubai Chocolat Unisex', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'ARMAF', name:'Odyssey Femme Woman', ref:'75ML EDP', bs:22750, usd:35 },
  { house:'ARMAF', name:'Odyssey Homme Black For Men', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'ARMAF', name:'Odyssey Mandarin Sky Especial Men', ref:'200ML EDP', bs:45500, usd:70 },
  { house:'ARMAF', name:'Odyssey Mandarin Sky LE Men EDP', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'ARMAF', name:'Odyssey Mango Tropical Unisex', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'ARMAF', name:'Odyssey Marshmallow Gourmand Unisex', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'ARMAF', name:'Odyssey Montagne Mountain Unisex', ref:'100ML EDP', bs:39000, usd:60 },
  { house:'ARMAF', name:'Odyssey Revolution Ultra Edition Men', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'ARMAF', name:'Odyssey White Edition Men', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'ARMAF', name:'Set Club de Nuit Sillage Unisex 4PC', ref:'100ML EDP', bs:48750, usd:75 },
  { house:'ARMAF', name:'Set Mandarin Sky', ref:'SET', bs:48750, usd:75 },
  { house:'ARMAF', name:'Set Odyssey Mega 4PC Men', ref:'100ML EDP', bs:45500, usd:70 },
  { house:'ARMAF', name:'Tag Donna Colorata Women', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'ARMAF', name:'Tres Jour Women', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'ARMAF', name:'Tres Nuit Men', ref:'100ML EDP', bs:19500, usd:30 },
  { house:'ARMAF', name:'Ventana Men', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'ARMAF', name:'Yum Yum Women', ref:'100ML EDP', bs:32500, usd:50 },

  // ── ARMANI ──────────────────────────────────────────────────
  { house:'ARMANI', name:'Acqua di Gio Men', ref:'100ML EDT', bs:65000, usd:100 },
  { house:'ARMANI', name:'Code Women', ref:'75ML EDP', bs:84500, usd:130 },
  { house:'ARMANI', name:'My Way Ylang Woman', ref:'90ML EDP', bs:104000, usd:160 },

  // ── AZZARO ──────────────────────────────────────────────────
  { house:'AZZARO', name:'Wanted Men EDP', ref:'100ML EDP', bs:71500, usd:110 },
  { house:'AZZARO', name:'The Most Wanted Intense Men', ref:'100ML EDT', bs:58500, usd:90 },

  // ── BENETTON ────────────────────────────────────────────────
  { house:'BENETTON', name:'Colors Blue Man', ref:'100ML EDT', bs:16250, usd:25 },
  { house:'BENETTON', name:'United Dream Love Yourself Woman', ref:'80ML EDT', bs:16250, usd:25 },
  { house:'BENETTON', name:'Cold Men', ref:'100ML EDT', bs:13000, usd:20 },
  { house:'BENETTON', name:'Cold Silver Men', ref:'100ML EDT', bs:13000, usd:20 },
  { house:'BENETTON', name:'Colors Man Black Intense Men', ref:'100ML EDP', bs:16250, usd:25 },
  { house:'BENETTON', name:'Hot Gold Woman', ref:'100ML EDT', bs:9750, usd:15 },
  { house:'BENETTON', name:'Hot Woman', ref:'100ML EDT', bs:13000, usd:20 },
  { house:'BENETTON', name:'Inferno Paradiso Blue Men', ref:'100ML EDT', bs:13000, usd:20 },
  { house:'BENETTON', name:'Paradiso Inferno Pink Women', ref:'100ML EDT', bs:13000, usd:20 },
  { house:'BENETTON', name:'Sisterland Green Jasmine Woman', ref:'80ML EDT', bs:19500, usd:30 },
  { house:'BENETTON', name:'Sisterland Pink Raspberry Women', ref:'100ML EDT', bs:16250, usd:25 },

  // ── BHARARA ─────────────────────────────────────────────────
  { house:'BHARARA', name:'Chocolate Unisex', ref:'100ML EDP', bs:58500, usd:90 },
  { house:'BHARARA', name:'King Men', ref:'100ML EDP', bs:48750, usd:75 },
  { house:'BHARARA', name:'King Men EDP', ref:'200ML EDP', bs:65000, usd:100 },
  { house:'BHARARA', name:'King Parfum', ref:'100ML PARFUM', bs:65000, usd:100 },
  { house:'BHARARA', name:'Onyx Men EDP', ref:'100ML EDP', bs:58500, usd:90 },
  { house:'BHARARA', name:'Queen Woman', ref:'100ML EDP', bs:55250, usd:85 },
  { house:'BHARARA', name:'Champagne Pink Women', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'BHARARA', name:'Rome Extradose Pour Femme', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'BHARARA', name:'Rome Paradoxe Pour Women', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'BHARARA', name:'Rome Pour Femme Woman', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'BHARARA', name:'Rome Pour Homme Men', ref:'100ML EDP', bs:26000, usd:40 },

  // ── BILLIE EILISH ───────────────────────────────────────────
  { house:'BILLIE EILISH', name:'No. 2 Women', ref:'100ML EDP', bs:52000, usd:80 },

  // ── BOUCHERON ───────────────────────────────────────────────
  { house:'BOUCHERON', name:'Boucheron Men', ref:'100ML EDP', bs:32500, usd:50 },

  // ── BRITNEY SPEARS ──────────────────────────────────────────
  { house:'BRITNEY SPEARS', name:'Curious Women', ref:'100ML EDP', bs:19500, usd:30 },
  { house:'BRITNEY SPEARS', name:'Circus Woman', ref:'100ML EDP', bs:19500, usd:30 },
  { house:'BRITNEY SPEARS', name:'Fantasy Hidden Woman', ref:'100ML EDP', bs:19500, usd:30 },
  { house:'BRITNEY SPEARS', name:'Fantasy Women EDP', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'BRITNEY SPEARS', name:'Midnight Woman', ref:'100ML EDP', bs:19500, usd:30 },

  // ── BVLGARI ─────────────────────────────────────────────────
  { house:'BVLGARI', name:'Aqua Marine Men', ref:'100ML EDT', bs:100750, usd:155 },
  { house:'BVLGARI', name:'Set Man In Black Men 2PC', ref:'100ML EDP', bs:97500, usd:150 },

  // ── CACHAREL ────────────────────────────────────────────────
  { house:'CACHAREL', name:'Amor Amor Woman', ref:'100ML EDT', bs:32500, usd:50 },
  { house:'CACHAREL', name:'Anais Anais Women', ref:'100ML EDT', bs:29250, usd:45 },

  // ── CALVIN KLEIN ────────────────────────────────────────────
  { house:'CALVIN KLEIN', name:'Be Unisex', ref:'100ML EDT', bs:19500, usd:30 },
  { house:'CALVIN KLEIN', name:'Be Unisex', ref:'200ML EDT', bs:29250, usd:45 },
  { house:'CALVIN KLEIN', name:'Eternity Unisex', ref:'200ML EDT', bs:45500, usd:70 },
  { house:'CALVIN KLEIN', name:'In2U Women EDT', ref:'100ML EDT', bs:19500, usd:30 },
  { house:'CALVIN KLEIN', name:'Obsession For Men EDT', ref:'200ML EDT', bs:32500, usd:50 },
  { house:'CALVIN KLEIN', name:'One Shock For Her Women', ref:'100ML EDT', bs:22750, usd:35 },
  { house:'CALVIN KLEIN', name:'Truth Women EDP', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'CALVIN KLEIN', name:'Escape Men', ref:'100ML EDT', bs:29250, usd:45 },
  { house:'CALVIN KLEIN', name:'Escape Woman', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'CALVIN KLEIN', name:'Eternity Woman', ref:'100ML EDP', bs:35750, usd:55 },
  { house:'CALVIN KLEIN', name:'Euphoria Men', ref:'100ML EDT', bs:32500, usd:50 },
  { house:'CALVIN KLEIN', name:'Euphoria Women', ref:'100ML EDP', bs:42250, usd:65 },
  { house:'CALVIN KLEIN', name:'Obsession Men', ref:'125ML EDT', bs:22750, usd:35 },
  { house:'CALVIN KLEIN', name:'One Unisex', ref:'100ML EDT', bs:26000, usd:40 },
  { house:'CALVIN KLEIN', name:'One Unisex', ref:'200ML EDT', bs:32500, usd:50 },
  { house:'CALVIN KLEIN', name:'Set Be Men', ref:'200ML EDT', bs:39000, usd:60 },

  // ── CAROLINA HERRERA ────────────────────────────────────────
  { house:'CAROLINA HERRERA', name:'212 NYC Men', ref:'100ML EDT', bs:71500, usd:110 },
  { house:'CAROLINA HERRERA', name:'212 NYC MTV Men', ref:'100ML EDT', bs:117000, usd:180 },
  { house:'CAROLINA HERRERA', name:'212 Sexy Men', ref:'100ML EDT', bs:58500, usd:90 },
  { house:'CAROLINA HERRERA', name:'212 VIP Black Elixir Men', ref:'100ML EDP', bs:113750, usd:175 },
  { house:'CAROLINA HERRERA', name:'212 VIP Men', ref:'100ML EDT', bs:71500, usd:110 },
  { house:'CAROLINA HERRERA', name:'212 Heroes Forever Men', ref:'90ML EDT', bs:74750, usd:115 },
  { house:'CAROLINA HERRERA', name:'212 VIP Rose Women', ref:'80ML EDP', bs:71500, usd:110 },
  { house:'CAROLINA HERRERA', name:'Bad Boy Men Parfum', ref:'100ML PARFUM', bs:97500, usd:150 },
  { house:'CAROLINA HERRERA', name:'CH Hot! Hot! Hot! Men EDP', ref:'100ML EDP', bs:104000, usd:160 },
  { house:'CAROLINA HERRERA', name:'CH Men EDT', ref:'100ML EDT', bs:84500, usd:130 },
  { house:'CAROLINA HERRERA', name:'CH Pasión Men EDP', ref:'100ML EDP', bs:55250, usd:85 },
  { house:'CAROLINA HERRERA', name:'CH Woman EDT', ref:'100ML EDT', bs:74750, usd:115 },
  { house:'CAROLINA HERRERA', name:'Chic Women EDP', ref:'80ML EDP', bs:45500, usd:70 },
  { house:'CAROLINA HERRERA', name:'Good Girl Very Good Women', ref:'80ML EDP', bs:117000, usd:180 },
  { house:'CAROLINA HERRERA', name:'Carolina Herrera Women', ref:'100ML EDP', bs:52000, usd:80 },
  { house:'CAROLINA HERRERA', name:'CH L\'eau Women', ref:'100ML EDT', bs:58500, usd:90 },
  { house:'CAROLINA HERRERA', name:'CH Sport Men EDT', ref:'100ML EDT', bs:42250, usd:65 },
  { house:'CAROLINA HERRERA', name:'Chic For Men', ref:'100ML EDT', bs:45500, usd:70 },
  { house:'CAROLINA HERRERA', name:'Set 212 VIP Rose Woman', ref:'80ML EDP', bs:91000, usd:140 },
  { house:'CAROLINA HERRERA', name:'Tester Bad Boy Extreme Men EDP', ref:'100ML EDP', bs:71500, usd:110 },
  { house:'CAROLINA HERRERA', name:'Tester Bad Boy Men EDT', ref:'100ML EDT', bs:55250, usd:85 },
  { house:'CAROLINA HERRERA', name:'Tester 212 Heroes Men', ref:'90ML EDT', bs:61750, usd:95 },
  { house:'CAROLINA HERRERA', name:'Tester 212 VIP Woman', ref:'80ML EDP', bs:52000, usd:80 },
  { house:'CAROLINA HERRERA', name:'Tester Bad Boy LE Men Parfum', ref:'100ML PARFUM', bs:65000, usd:100 },
  { house:'CAROLINA HERRERA', name:'Tester CH Dama EDT', ref:'100ML EDT', bs:55250, usd:85 },
  { house:'CAROLINA HERRERA', name:'Tester CH Men EDT', ref:'100ML EDT', bs:55250, usd:85 },
  { house:'CAROLINA HERRERA', name:'Tester Good Girl Women', ref:'80ML EDP', bs:78000, usd:120 },
  { house:'CAROLINA HERRERA', name:'Tester Good Girl Blush Elixir Women', ref:'80ML EDP', bs:78000, usd:120 },

  // ── CLINIQUE ────────────────────────────────────────────────
  { house:'CLINIQUE', name:'Happy Heart Women EDP', ref:'100ML EDP', bs:32500, usd:50 },
  { house:'CLINIQUE', name:'Happy Men', ref:'100ML EDT', bs:29250, usd:45 },
  { house:'CLINIQUE', name:'Happy Women', ref:'100ML EDP', bs:39000, usd:60 },

  // ── CREED ───────────────────────────────────────────────────
  { house:'CREED', name:'Aventus Men', ref:'100ML EDP', bs:312000, usd:480 },
  { house:'CREED', name:'Aventus Absolu Men', ref:'100ML EDP', bs:377000, usd:580 },
  { house:'CREED', name:'Millesime Imperial Unisex', ref:'100ML EDP', bs:260000, usd:400 },

  // ── CUBA ────────────────────────────────────────────────────
  { house:'CUBA', name:'Green Men EDT', ref:'100ML EDT', bs:9750, usd:15 },

  // ── D&G ─────────────────────────────────────────────────────
  { house:'D&G', name:'K Men EDP', ref:'100ML EDP', bs:71500, usd:110 },
  { house:'D&G', name:'Light Blue Eau Intense Men', ref:'125ML EDP', bs:65000, usd:100 },
  { house:'D&G', name:'Light Blue Forever Men EDP', ref:'100ML EDP', bs:81250, usd:125 },

  // ── DANIELA KOSAN ───────────────────────────────────────────
  { house:'DANIELA KOSAN', name:'Splash Variados', ref:'150ML', bs:4336, usd:7 },

  // ── DAVIDOFF ────────────────────────────────────────────────
  { house:'DAVIDOFF', name:'Cool Water Women', ref:'100ML EDT', bs:26000, usd:40 },
  { house:'DAVIDOFF', name:'Cool Water Men', ref:'200ML EDT', bs:35750, usd:55 },
  { house:'DAVIDOFF', name:'Cool Water Men', ref:'125ML EDT', bs:26000, usd:40 },
  { house:'DAVIDOFF', name:'Cool Water Women', ref:'200ML EDT', bs:35750, usd:55 },
  { house:'DAVIDOFF', name:'Set Cool Water Men', ref:'125ML EDT', bs:39000, usd:60 },

  // ── DIESEL ──────────────────────────────────────────────────
  { house:'DIESEL', name:'Diesel Plus Plus Feminine EDT', ref:'75ML EDT', bs:13000, usd:20 },

  // ── DIOR ────────────────────────────────────────────────────
  { house:'DIOR', name:'Homme Intense Men', ref:'100ML EDP', bs:143000, usd:220 },
  { house:'DIOR', name:'Homme Men', ref:'100ML EDT', bs:130000, usd:200 },
  { house:'DIOR', name:'Poison Girl Women', ref:'100ML EDT', bs:97500, usd:150 },
  { house:'DIOR', name:'Sauvage Elixir Men', ref:'100ML EDP', bs:162500, usd:250 },

  // ── DISNEY ──────────────────────────────────────────────────
  { house:'DISNEY', name:'Eau My Unicorn 2 Piezas Niña', ref:'100ML EDT', bs:29250, usd:45 },
  { house:'DISNEY', name:'Frozen II 2 Piezas Niña', ref:'100ML EDT', bs:29250, usd:45 },
  { house:'DISNEY', name:'Perfume Niños', ref:'100ML EDT', bs:9750, usd:15 },

  // ── DOLCE & GABBANA ─────────────────────────────────────────
  { house:'DOLCE & GABBANA', name:'King Pour Homme Parfum Men', ref:'100ML PARFUM', bs:71500, usd:110 },
  { house:'DOLCE & GABBANA', name:'Light Blue Summer Vibes Women', ref:'100ML EDT', bs:55250, usd:85 },
  { house:'DOLCE & GABBANA', name:'Devotion Women', ref:'100ML EDP', bs:55250, usd:85 },
  { house:'DOLCE & GABBANA', name:'Devotion Men EDP', ref:'100ML EDP', bs:84500, usd:130 },
  { house:'DOLCE & GABBANA', name:'The One Men EDP', ref:'100ML EDP', bs:55250, usd:85 },
  { house:'DOLCE & GABBANA', name:'Dolce Peony Women', ref:'75ML EDP', bs:52000, usd:80 },

  // ── DUMONT ──────────────────────────────────────────────────
  { house:'DUMONT', name:'Nitro Blue Men', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'DUMONT', name:'Nitro Platinum Men', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'DUMONT', name:'Nitro Red Intensely Men', ref:'100ML EDP', bs:39000, usd:60 },
  { house:'DUMONT PARIS', name:'Nitro Red Men', ref:'100ML EDP', bs:29250, usd:45 },

  // ── ELIZABETH ARDEN ─────────────────────────────────────────
  { house:'ELIZABETH ARDEN', name:'5th Avenue Women EDP', ref:'125ML EDP', bs:26000, usd:40 },
  { house:'ELIZABETH ARDEN', name:'Green Tea Women', ref:'100ML EDP', bs:13000, usd:20 },
  { house:'ELIZABETH ARDEN', name:'Red Door Woman', ref:'100ML EDT', bs:29250, usd:45 },
  { house:'ELIZABETH ARDEN', name:'Set 5th Avenue (3 PC)', ref:'SET', bs:29250, usd:45 },
  { house:'ELIZABETH ARDEN', name:'Sunflowers Women', ref:'100ML EDT', bs:16250, usd:25 },

  // ── EMPER ───────────────────────────────────────────────────
  { house:'EMPER', name:'The Black 92 Unisex EDP', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'EMPER', name:'Ilang 62 Unisex', ref:'100ML EDP', bs:32500, usd:50 },
  { house:'EMPER', name:'Stallion 53 Unisex', ref:'100ML EDP', bs:22750, usd:35 },

  // ── EMPORIO ARMANI ──────────────────────────────────────────
  { house:'EMPORIO ARMANI', name:'Stronger With You Parfum Men', ref:'100ML PARFUM', bs:126750, usd:195 },

  // ── ESCADA ──────────────────────────────────────────────────
  { house:'ESCADA', name:'Magnetism Women', ref:'75ML EDP', bs:29250, usd:45 },

  // ── ESTEE LAUDER ────────────────────────────────────────────
  { house:'ESTEE LAUDER', name:'Pleasures Men', ref:'100ML EDT', bs:26000, usd:40 },

  // ── FERRARI ─────────────────────────────────────────────────
  { house:'FERRARI SCUDERIA', name:'Black Men', ref:'125ML EDT', bs:19500, usd:30 },

  // ── GIORGIO ARMANI ──────────────────────────────────────────
  { house:'GIORGIO ARMANI', name:'Acqua di Gio Profondo Men Parfum', ref:'100ML PARFUM', bs:110500, usd:170 },

  // ── GIVENCHY ────────────────────────────────────────────────
  { house:'GIVENCHY', name:'Ange ou Demon Women', ref:'100ML EDP', bs:78000, usd:120 },

  // ── GRANDEUR TUBBEES ────────────────────────────────────────
  { house:'GRANDEUR TUBBEES', name:'Berry Blass Women', ref:'50ML EDP', bs:13000, usd:20 },
  { house:'GRANDEUR TUBBEES', name:'Candy Pop Women', ref:'50ML EDP', bs:13000, usd:20 },
  { house:'GRANDEUR TUBBEES', name:'Caramel Women', ref:'50ML EDP', bs:13000, usd:20 },
  { house:'GRANDEUR TUBBEES', name:'Chocolate Fudge Women', ref:'50ML EDP', bs:13000, usd:20 },
  { house:'GRANDEUR TUBBEES', name:'Cookies & Cream Women', ref:'50ML EDP', bs:13000, usd:20 },
  { house:'GRANDEUR TUBBEES', name:'Pink Sugar Women', ref:'50ML EDP', bs:13000, usd:20 },
  { house:'GRANDEUR TUBBEES', name:'Bubble Gum Unisex', ref:'50ML EDP', bs:13000, usd:20 },
  { house:'GRANDEUR TUBBEES', name:'Cherry Luxe Women', ref:'50ML EDP', bs:13000, usd:20 },

  // ── GUCCI ───────────────────────────────────────────────────
  { house:'GUCCI', name:'Rush Women EDT', ref:'75ML EDT', bs:58500, usd:90 },

  // ── GUESS ───────────────────────────────────────────────────
  { house:'GUESS', name:'1981 Los Angeles Men EDT', ref:'100ML EDT', bs:22750, usd:35 },
  { house:'GUESS', name:'Bella Vita Women EDP', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'GUESS', name:'1981 Men', ref:'100ML EDT', bs:22750, usd:35 },
  { house:'GUESS', name:'Gold Men', ref:'75ML EDT', bs:22750, usd:35 },
  { house:'GUESS', name:'Gold Women EDP', ref:'75ML EDP', bs:22750, usd:35 },
  { house:'GUESS', name:'Seductive Homme Red Men EDT', ref:'100ML EDT', bs:22750, usd:35 },
  { house:'GUESS', name:'Women EDP', ref:'75ML EDP', bs:22750, usd:35 },
  { house:'GUESS', name:'Seductive Men', ref:'150ML EDT', bs:26000, usd:40 },
  { house:'GUESS', name:'Seductive Men', ref:'100ML EDT', bs:22750, usd:35 },
  { house:'GUESS', name:'Seductive Red Women', ref:'75ML EDT', bs:22750, usd:35 },
  { house:'GUESS', name:'Seductive Women', ref:'75ML EDT', bs:19500, usd:30 },
  { house:'GUESS', name:'Seductive Women', ref:'125ML EDT', bs:26000, usd:40 },
  { house:'GUESS', name:'Set Marciano Women (3 PC)', ref:'SET', bs:29250, usd:45 },

  // ── HALLOWEEN ───────────────────────────────────────────────
  { house:'HALLOWEEN', name:'Blosson Women', ref:'100ML EDT', bs:35750, usd:55 },
  { house:'HALLOWEEN', name:'Halloween Men', ref:'125ML EDT', bs:35750, usd:55 },
  { house:'HALLOWEEN', name:'Halloween Women', ref:'100ML EDT', bs:35750, usd:55 },

  // ── HUGO BOSS ───────────────────────────────────────────────
  { house:'HUGO BOSS', name:'Boss Man Green', ref:'200ML EDT', bs:48750, usd:75 },
  { house:'HUGO BOSS', name:'Deep Red Woman', ref:'90ML EDP', bs:29250, usd:45 },
  { house:'HUGO BOSS', name:'Bottle Unlimited Men EDT', ref:'100ML EDT', bs:42250, usd:65 },
  { house:'HUGO BOSS', name:'Energise Men EDT', ref:'75ML EDT', bs:35750, usd:55 },
  { house:'HUGO BOSS', name:'Selection Men EDT', ref:'90ML EDT', bs:29250, usd:45 },
  { house:'HUGO BOSS', name:'The Scent Women', ref:'100ML EDP', bs:58500, usd:90 },
  { house:'HUGO BOSS', name:'Hugo XX Woman', ref:'100ML EDT', bs:26000, usd:40 },
  { house:'HUGO BOSS', name:'Hugo XY Men', ref:'100ML EDT', bs:29250, usd:45 },
  { house:'HUGO BOSS', name:'In Motion Men', ref:'100ML EDT', bs:29250, usd:45 },
  { house:'HUGO BOSS', name:'Orange Women', ref:'75ML EDT', bs:26000, usd:40 },

  // ── ISSEY MIYAKE ────────────────────────────────────────────
  { house:'ISSEY MIYAKE', name:'Pleats Please L\'Eau Women', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'ISSEY MIYAKE', name:'A Drop d\'Issey Women', ref:'90ML EDP', bs:32500, usd:50 },
  { house:'ISSEY MIYAKE', name:'Issey Intense Men', ref:'75ML EDT', bs:22750, usd:35 },
  { house:'ISSEY MIYAKE', name:'L\'Eau d\'Issey Men EDP', ref:'125ML EDP', bs:58500, usd:90 },
  { house:'ISSEY MIYAKE', name:'Miyake Classic Men', ref:'200ML EDT', bs:58500, usd:90 },
  { house:'ISSEY MIYAKE', name:'Miyake Intense Men', ref:'125ML EDT', bs:29250, usd:45 },
  { house:'ISSEY MIYAKE', name:'Miyake Nuit Men', ref:'125ML EDT', bs:39000, usd:60 },
  { house:'ISSEY MIYAKE', name:'Miyake Sport Men', ref:'100ML EDT', bs:29250, usd:45 },
  { house:'ISSEY MIYAKE', name:'Miyake Woman', ref:'100ML EDT', bs:42250, usd:65 },
  { house:'ISSEY MIYAKE', name:'Set L\'Eau d\'Issey Men 3PC', ref:'125ML EDT', bs:48750, usd:75 },

  // ── JEAN PAUL GAULTIER ──────────────────────────────────────
  { house:'JEAN PAUL GAULTIER', name:'Tester Classique Women', ref:'100ML EDT', bs:65000, usd:100 },
  { house:'JEAN PAUL GAULTIER', name:'Le Beau Men', ref:'125ML EDT', bs:97500, usd:150 },
  { house:'JEAN PAUL GAULTIER', name:'Le Beau Paradise Garden Men', ref:'125ML EDP', bs:120250, usd:185 },
  { house:'JEAN PAUL GAULTIER', name:'Le Male Men', ref:'125ML EDT', bs:84500, usd:130 },
  { house:'JEAN PAUL GAULTIER', name:'Set Divine 3 Piezas Women', ref:'100ML EDP', bs:136500, usd:210 },
  { house:'JEAN PAUL GAULTIER', name:'Tester Gaultier Men', ref:'100ML EDP', bs:71500, usd:110 },
  { house:'JEAN PAUL GAULTIER', name:'Tester Le Beau Men', ref:'125ML EDT', bs:65000, usd:100 },

  // ── JIMMY CHOO ──────────────────────────────────────────────
  { house:'JIMMY CHOO', name:'Flash Women', ref:'100ML EDP', bs:35750, usd:55 },

  // ── JO MILANO ───────────────────────────────────────────────
  { house:'JO MILANO', name:'Game of Spades Rouge Men', ref:'100ML EXTRAIT', bs:71500, usd:110 },
  { house:'JO MILANO', name:'Game of Spades Full-House Unisex', ref:'100ML PARFUM', bs:71500, usd:110 },
  { house:'JO MILANO', name:'Game of Spades Gold Men', ref:'100ML PARFUM', bs:78000, usd:120 },

  // ── JOOP ────────────────────────────────────────────────────
  { house:'JOOP', name:'Joop! Homme Men', ref:'125ML EDT', bs:22750, usd:35 },
  { house:'JOOP', name:'Joop! Homme Men', ref:'200ML EDT', bs:29250, usd:45 },

  // ── KATY PERRY ──────────────────────────────────────────────
  { house:'KATY PERRY', name:'Meow Women', ref:'100ML EDP', bs:19500, usd:30 },
  { house:'KATY PERRY', name:'Purrs Women EDP', ref:'100ML EDP', bs:19500, usd:30 },
  { house:'KATY PERRY', name:'Killer Queen Women', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'KATY PERRY', name:'Royal Revolution Women', ref:'100ML EDP', bs:29250, usd:45 },

  // ── KENZO ───────────────────────────────────────────────────
  { house:'KENZO', name:'Amour Women', ref:'100ML EDP', bs:55250, usd:85 },
  { house:'KENZO', name:'Kenzo Homme Men', ref:'100ML EDT', bs:55250, usd:85 },
  { house:'KENZO', name:'Kenzo World Power Women', ref:'75ML EDT', bs:61750, usd:95 },

  // ── LACOSTE ─────────────────────────────────────────────────
  { house:'LACOSTE', name:'L.12.12 Blanc Men Body Spray', ref:'100ML BODY', bs:13000, usd:20 },
  { house:'LACOSTE', name:'Booster Men', ref:'125ML EDT', bs:45500, usd:70 },
  { house:'LACOSTE', name:'L.12.12 White Men', ref:'100ML EDT', bs:45500, usd:70 },
  { house:'LACOSTE', name:'Touch of Pink Women', ref:'90ML EDT', bs:35750, usd:55 },

  // ── LATTAFA ─────────────────────────────────────────────────
  { house:'LATTAFA', name:'Najdia Intense Men EDP', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'LATTAFA', name:'Atlas Men', ref:'55ML EDP', bs:29250, usd:45 },
  { house:'LATTAFA', name:'Musamam EDP', ref:'100ML EDP', bs:39000, usd:60 },
  { house:'LATTAFA', name:'Asad Bourbon', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Badee Al Oud Noble Blush', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'LATTAFA', name:'Yara Tous Woman', ref:'100ML EDP', bs:19500, usd:30 },
  { house:'LATTAFA', name:'Afeef Unisex', ref:'100ML EDP', bs:39000, usd:60 },
  { house:'LATTAFA', name:'Ajwad Pink to Pink Unisex', ref:'60ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Al Areeq Silver Unisex', ref:'100ML EDP', bs:32500, usd:50 },
  { house:'LATTAFA', name:'Amethyst Badee Al Oud Men', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'LATTAFA', name:'Ana Abiyedh Rouge Unisex', ref:'60ML EDP', bs:19500, usd:30 },
  { house:'LATTAFA', name:'Ana Abiyedh Scarlet Unisex', ref:'60ML EDP', bs:19500, usd:30 },
  { house:'LATTAFA', name:'Angham Women', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'LATTAFA', name:'Asad Elixir Men', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'LATTAFA', name:'Asad Men', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Asad Zanzibar Men', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Badee Al Oud Honor y Glory', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Badee Al Oud Unisex Set (2 PC)', ref:'SET', bs:29250, usd:45 },
  { house:'LATTAFA', name:'Eclair Pistache Women', ref:'100ML EDP', bs:39000, usd:60 },
  { house:'LATTAFA', name:'Ejaazi Men', ref:'100ML EDP', bs:19500, usd:30 },
  { house:'LATTAFA', name:'Eternal Oud Men', ref:'100ML EDP', bs:42250, usd:65 },
  { house:'LATTAFA', name:'Give Me Gourmand Berry On Top Women', ref:'75ML EDP', bs:39000, usd:60 },
  { house:'LATTAFA', name:'Give Me Gourmand Cookie Crave Unisex', ref:'75ML EDP', bs:39000, usd:60 },
  { house:'LATTAFA', name:'Give Me Gourmand Choco Overdose Unisex', ref:'75ML EDP', bs:39000, usd:60 },
  { house:'LATTAFA', name:'Haya Women', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Hayaatim Unisex', ref:'100ML EDP', bs:19500, usd:30 },
  { house:'LATTAFA', name:'His Confession Men', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'LATTAFA', name:'Khamrah Dukhan', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Khamrah Qahwa Unisex', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Lail Maleki Men', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Ajwad Unisex EDP', ref:'60ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Ana Abiyedh Unisex', ref:'60ML EDP', bs:19500, usd:30 },
  { house:'LATTAFA', name:'Badee Al Oud For Glory Unisex', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'LATTAFA', name:'Badee Al Oud Sublime Unisex', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'LATTAFA', name:'Body Spray Women', ref:'200ML BODY', bs:6500, usd:10 },
  { house:'LATTAFA', name:'Confidential Platinum Men', ref:'100ML EDP', bs:19500, usd:30 },
  { house:'LATTAFA', name:'Eclaire Women', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'LATTAFA', name:'Fakhar Extrait Gold Unisex', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'LATTAFA', name:'Fakhar Women', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'LATTAFA', name:'Hayaati Al Maleky Unisex', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Hayaati Black Men', ref:'100ML EDP', bs:19500, usd:30 },
  { house:'LATTAFA', name:'Khamrah Unisex', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'LATTAFA', name:'Liam Blue Shine Unisex EDP', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Qaed Al Fursan Men EDP', ref:'90ML EDP', bs:22750, usd:35 },
  { house:'LATTAFA', name:'Qimmah Men', ref:'100ML EDP', bs:16250, usd:25 },
  { house:'LATTAFA', name:'Sehr Unisex EDP', ref:'100ML EDP', bs:32500, usd:50 },
  { house:'LATTAFA', name:'Victoria Women', ref:'100ML EDP', bs:42250, usd:65 },
  { house:'LATTAFA', name:'Vintage Radio Unisex', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Mashrabya Unisex', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Mayar Cherry Intense Unisex', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Musamam White Intense Unisex', ref:'100ML EDP', bs:32500, usd:50 },
  { house:'LATTAFA', name:'Najdia Unisex', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'LATTAFA', name:'Petra Women', ref:'100ML EDP', bs:35750, usd:55 },
  { house:'LATTAFA', name:'Pride Art of Universe Unisex', ref:'100ML EDP', bs:32500, usd:50 },
  { house:'LATTAFA', name:'Pride Ishq Al Shuyukh Gold Women', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Qaed Al Fursan Unlimited Men', ref:'90ML EDP', bs:16250, usd:25 },
  { house:'LATTAFA', name:'Qaed Al Fursan Untamed Men', ref:'90ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Rave Now Pink Women', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'LATTAFA', name:'Rave Now Unisex', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'LATTAFA', name:'Sakeena Women', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'LATTAFA', name:'Set Badee Al Oud Honor and Glory Women 3PC', ref:'100ML EDP', bs:32500, usd:50 },
  { house:'LATTAFA', name:'Set Khamrah Unisex 3PC', ref:'100ML EDP', bs:35750, usd:55 },
  { house:'LATTAFA', name:'Set Badee Al Oud Honor and Glory 3PC', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'LATTAFA', name:'Taweel Unisex', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'LATTAFA', name:'Teriaq Men', ref:'100ML EDP', bs:32500, usd:50 },
  { house:'LATTAFA', name:'Teriaq Women', ref:'100ML EDP', bs:32500, usd:50 },
  { house:'LATTAFA', name:'Tharwah Silver Men', ref:'100ML EDP', bs:32500, usd:50 },
  { house:'LATTAFA', name:'Tharwah Women', ref:'100ML EDP', bs:32500, usd:50 },
  { house:'LATTAFA', name:'The Kingdom Women', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Thouq Women', ref:'80ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Wajood Unisex', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Winners Trophy Gold Unisex', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Yara Candy Women', ref:'100ML EDP', bs:19500, usd:30 },
  { house:'LATTAFA', name:'Yara Elixir Women', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'LATTAFA', name:'Yara Mini Collection (4 PC)', ref:'SET', bs:26000, usd:40 },
  { house:'LATTAFA', name:'Yara Moi Women EDP', ref:'100ML EDP', bs:19500, usd:30 },
  { house:'LATTAFA', name:'Yara Women EDP', ref:'100ML EDP', bs:19500, usd:30 },

  // ── LE LABO ─────────────────────────────────────────────────
  { house:'LE LABO', name:'Santal 33 Unisex', ref:'100ML EDP', bs:377000, usd:580 },

  // ── LOMANI ──────────────────────────────────────────────────
  { house:'LOMANI', name:'AB Spirit Millionaire Women EDP', ref:'100ML EDP', bs:13000, usd:20 },

  // ── MACARENA ────────────────────────────────────────────────
  { house:'MACARENA', name:'Bit Coin For Women', ref:'100ML EDP', bs:19500, usd:30 },

  // ── MAISON ALHAMBRA ─────────────────────────────────────────
  { house:'MAISON ALHAMBRA', name:'Glacier Pour Homme Men', ref:'100ML EDP', bs:19500, usd:30 },
  { house:'MAISON ALHAMBRA', name:'Glacier Ultra Men', ref:'100ML EDP', bs:19500, usd:30 },
  { house:'MAISON ALHAMBRA', name:'Infini Elixir Unisex', ref:'100ML EDP', bs:19500, usd:30 },
  { house:'MAISON ALHAMBRA', name:'Kismet Women', ref:'100ML EDP', bs:26000, usd:40 },

  // ── MAISON MARGIELA ─────────────────────────────────────────
  { house:'MAISON MARGIELA', name:'Replica Flower Market Unisex', ref:'100ML EDP', bs:78000, usd:120 },

  // ── MANCERA ─────────────────────────────────────────────────
  { house:'MANCERA', name:'Cedrat Boise Men EDP', ref:'125ML EDP', bs:91000, usd:140 },

  // ── MARC JACOBS ─────────────────────────────────────────────
  { house:'MARC JACOBS', name:'Daisy Women', ref:'100ML EDT', bs:65000, usd:100 },
  { house:'MARC JACOBS', name:'Perfect Women EDP', ref:'100ML EDP', bs:71500, usd:110 },
  { house:'MARC JACOBS', name:'Perfect Women EDT', ref:'100ML EDT', bs:71500, usd:110 },

  // ── MARVEL ──────────────────────────────────────────────────
  { house:'MARVEL', name:'Black Panther Kids EDT', ref:'100ML EDT', bs:13000, usd:20 },
  { house:'MARVEL', name:'Spiderman 3 Piezas Kids', ref:'50ML EDT', bs:29250, usd:45 },

  // ── MATTEL ──────────────────────────────────────────────────
  { house:'MATTEL', name:'Barbie 2 Piezas Niña', ref:'100ML EDT', bs:29250, usd:45 },

  // ── MONT BLANC ──────────────────────────────────────────────
  { house:'MONT BLANC', name:'Legend Night Men', ref:'100ML EDP', bs:39000, usd:60 },
  { house:'MONT BLANC', name:'Emblem Elixir Women', ref:'75ML EDP', bs:35750, usd:55 },
  { house:'MONT BLANC', name:'Emblem Men', ref:'100ML EDT', bs:39000, usd:60 },
  { house:'MONT BLANC', name:'Explorer Men', ref:'100ML EDP', bs:52000, usd:80 },
  { house:'MONT BLANC', name:'Lady Emblem Women', ref:'75ML EDP', bs:29250, usd:45 },
  { house:'MONT BLANC', name:'Legend Blue Men', ref:'100ML EDP', bs:55250, usd:85 },
  { house:'MONT BLANC', name:'Legend Men', ref:'100ML EDT', bs:45500, usd:70 },
  { house:'MONT BLANC', name:'Legend Red Men', ref:'100ML EDP', bs:39000, usd:60 },
  { house:'MONT BLANC', name:'Explorer Platinum Men', ref:'100ML EDP', bs:42250, usd:65 },
  { house:'MONT BLANC', name:'Femme Individuelle Women EDT', ref:'75ML EDT', bs:29250, usd:45 },
  { house:'MONT BLANC', name:'Legend Eau de Parfum Men', ref:'100ML EDP', bs:52000, usd:80 },
  { house:'MONT BLANC', name:'Legend Men EDT', ref:'200ML EDT', bs:55250, usd:85 },
  { house:'MONT BLANC', name:'Legend Spirit Men EDT', ref:'100ML EDT', bs:42250, usd:65 },
  { house:'MONT BLANC', name:'Starwalker Men EDT', ref:'75ML EDT', bs:29250, usd:45 },
  { house:'MONT BLANC', name:'Presence Men', ref:'75ML EDT', bs:26000, usd:40 },
  { house:'MONT BLANC', name:'Set Signature Women 3PC', ref:'90ML EDP', bs:74750, usd:115 },
  { house:'MONT BLANC', name:'Set Legend Blue Men 4PC', ref:'100ML EDP', bs:55250, usd:85 },
  { house:'MONT BLANC', name:'Set Legend Red Men 3PC', ref:'100ML EDP', bs:45500, usd:70 },

  // ── MONTALE ─────────────────────────────────────────────────
  { house:'MONTALE', name:'Arabians Tonka Men EDP', ref:'100ML EDP', bs:117000, usd:180 },
  { house:'MONTALE', name:'Paris Golden Aoud Men', ref:'100ML EDP', bs:84500, usd:130 },

  // ── MOSCHINO ────────────────────────────────────────────────
  { house:'MOSCHINO', name:'Toy 2 Pearl Unisex', ref:'100ML EDP', bs:52000, usd:80 },
  { house:'MOSCHINO', name:'Toy Boy 2 Women', ref:'100ML EDP', bs:45500, usd:70 },
  { house:'MOSCHINO', name:'Toy Boy Men', ref:'100ML EDP', bs:45500, usd:70 },
  { house:'MOSCHINO', name:'Toy Boy Bubble Gum Women EDT', ref:'100ML EDT', bs:48750, usd:75 },

  // ── NAUTICA ─────────────────────────────────────────────────
  { house:'NAUTICA', name:'Heritage Men', ref:'100ML EDT', bs:16250, usd:25 },
  { house:'NAUTICA', name:'Nautica Blue Men', ref:'100ML EDT', bs:16250, usd:25 },
  { house:'NAUTICA', name:'Classic Men', ref:'100ML EDT', bs:16250, usd:25 },
  { house:'NAUTICA', name:'Voyage Men', ref:'200ML EDT', bs:26000, usd:40 },
  { house:'NAUTICA', name:'Voyage Men', ref:'100ML EDT', bs:16250, usd:25 },
  { house:'NAUTICA', name:'Voyage N-83 Men', ref:'100ML EDT', bs:16250, usd:25 },
  { house:'NAUTICA', name:'Voyage Sport Men', ref:'100ML EDT', bs:16250, usd:25 },

  // ── NEW BRAND ───────────────────────────────────────────────
  { house:'NEW BRAND', name:'Commando Men EDT', ref:'100ML EDT', bs:6500, usd:10 },

  // ── NUSUK ───────────────────────────────────────────────────
  { house:'NUSUK', name:'Taraf Al Oud Men', ref:'100ML EDP', bs:29250, usd:45 },

  // ── ORIENTICA ───────────────────────────────────────────────
  { house:'ORIENTICA', name:'Le Motif Wild Neroli Men', ref:'85ML EDP', bs:107250, usd:165 },
  { house:'ORIENTICA', name:'Royal Amber Unisex', ref:'80ML EDP', bs:58500, usd:90 },
  { house:'ORIENTICA', name:'Royal Bleu EDP Unisex', ref:'80ML EDP', bs:65000, usd:100 },
  { house:'ORIENTICA', name:'Velvet Gold Unisex', ref:'100ML EDP', bs:81250, usd:125 },

  // ── PACO RABANNE ────────────────────────────────────────────
  { house:'PACO RABANNE', name:'Black XS Excess Men', ref:'80ML EDP', bs:58500, usd:90 },
  { house:'PACO RABANNE', name:'Black XS Women EDT', ref:'100ML EDT', bs:55250, usd:85 },
  { house:'PACO RABANNE', name:'Black XS Men', ref:'100ML EDT', bs:68250, usd:105 },
  { house:'PACO RABANNE', name:'Invictus Body Spray Men', ref:'150ML BODY', bs:22750, usd:35 },
  { house:'PACO RABANNE', name:'Invictus Men', ref:'100ML EDT', bs:81250, usd:125 },
  { house:'PACO RABANNE', name:'Invictus Victory Elixir Men', ref:'100ML PARFUM', bs:97500, usd:150 },
  { house:'PACO RABANNE', name:'Invictus Victory Extreme Men', ref:'100ML EDP', bs:97500, usd:150 },
  { house:'PACO RABANNE', name:'Million Gold Intense Men', ref:'100ML EDP', bs:97500, usd:150 },
  { house:'PACO RABANNE', name:'Old XS Men', ref:'100ML EDT', bs:55250, usd:85 },
  { house:'PACO RABANNE', name:'One Million Gold Elixir Men', ref:'100ML EDP', bs:97500, usd:150 },
  { house:'PACO RABANNE', name:'One Million Royal Parfum Men', ref:'100ML EDP', bs:84500, usd:130 },
  { house:'PACO RABANNE', name:'One Million Royal Women', ref:'80ML EDP', bs:71500, usd:110 },
  { house:'PACO RABANNE', name:'Paco Black Can Men', ref:'100ML EDT', bs:29250, usd:45 },
  { house:'PACO RABANNE', name:'Fame Parfum Women', ref:'80ML PARFUM', bs:130000, usd:200 },
  { house:'PACO RABANNE', name:'Olympea Women EDP', ref:'80ML EDP', bs:65000, usd:100 },
  { house:'PACO RABANNE', name:'One Million Men EDT', ref:'100ML EDT', bs:71500, usd:110 },
  { house:'PACO RABANNE', name:'Phantom Intense Men', ref:'100ML EDP', bs:91000, usd:140 },
  { house:'PACO RABANNE', name:'Phantom Men', ref:'100ML EDP', bs:81250, usd:125 },
  { house:'PACO RABANNE', name:'Set Invictus Men', ref:'100ML EDT', bs:91000, usd:140 },
  { house:'PACO RABANNE', name:'Tester One Million Men EDT', ref:'100ML EDT', bs:58500, usd:90 },
  { house:'PACO RABANNE', name:'Tester One Million Parfum Men', ref:'100ML PARFUM', bs:61750, usd:95 },
  { house:'PACO RABANNE', name:'Ultraviolet Women', ref:'75ML EDP', bs:42250, usd:65 },
  { house:'PACO RABANNE', name:'XS Men', ref:'100ML EDT', bs:42250, usd:65 },

  // ── PARIS HILTON ────────────────────────────────────────────
  { house:'PARIS HILTON', name:'Gold Rush Women', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'PARIS HILTON', name:'Hilton Classic Women', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'PARIS HILTON', name:'Just Me Women', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'PARIS HILTON', name:'Gold Rush Men EDT', ref:'100ML EDT', bs:29250, usd:45 },
  { house:'PARIS HILTON', name:'Pink Rush Women', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'PARIS HILTON', name:'Rose Rush Women', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'PARIS HILTON', name:'Ruby Rush Women', ref:'100ML EDP', bs:29250, usd:45 },

  // ── PERRY ELLIS ─────────────────────────────────────────────
  { house:'PERRY ELLIS', name:'Aqua Extreme Men', ref:'100ML EDT', bs:22750, usd:35 },
  { house:'PERRY ELLIS', name:'360 Red Men', ref:'100ML EDT', bs:26000, usd:40 },
  { house:'PERRY ELLIS', name:'360 Red Women', ref:'100ML EDP', bs:26000, usd:40 },
  { house:'PERRY ELLIS', name:'For 360 Coral Women', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'PERRY ELLIS', name:'360 White Women EDT', ref:'100ML EDT', bs:29250, usd:45 },
  { house:'PERRY ELLIS', name:'Set 360 Red Men', ref:'100ML EDT', bs:39000, usd:60 },

  // ── PHILIPP PLEIN ───────────────────────────────────────────
  { house:'PHILIPP PLEIN', name:'No Limits Super Fresh Men', ref:'90ML EDP', bs:78000, usd:120 },
  { house:'PHILIPP PLEIN', name:'No Limits Men', ref:'90ML EDP', bs:91000, usd:140 },

  // ── RALPH LAUREN ────────────────────────────────────────────
  { house:'RALPH LAUREN', name:'Polo Ralph Sport Men', ref:'125ML EDT', bs:39000, usd:60 },
  { house:'RALPH LAUREN', name:'Club Men', ref:'100ML EDP', bs:55250, usd:85 },
  { house:'RALPH LAUREN', name:'Polo 67 Men EDT', ref:'100ML EDT', bs:61750, usd:95 },
  { house:'RALPH LAUREN', name:'Polo Big Pony 2 Pink Women', ref:'100ML EDT', bs:29250, usd:45 },
  { house:'RALPH LAUREN', name:'Polo Black Men', ref:'125ML EDT', bs:35750, usd:55 },
  { house:'RALPH LAUREN', name:'Polo Red Men EDP', ref:'125ML EDP', bs:52000, usd:80 },
  { house:'RALPH LAUREN', name:'Polo Red Men EDT', ref:'125ML EDT', bs:39000, usd:60 },
  { house:'RALPH LAUREN', name:'Big Pony Men EDT', ref:'100ML EDT', bs:26000, usd:40 },
  { house:'RALPH LAUREN', name:'Set Polo Blue Men 2 PCS', ref:'125ML EDT', bs:61750, usd:95 },

  // ── RASASI ──────────────────────────────────────────────────
  { house:'RASASI', name:'Egra Women', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'RASASI', name:'Hawas Diva Women', ref:'100ML EDP', bs:35750, usd:55 },
  { house:'RASASI', name:'Hawas Eclat Women', ref:'100ML EDP', bs:39000, usd:60 },
  { house:'RASASI', name:'Hawas Ice Men', ref:'100ML EDP', bs:42250, usd:65 },
  { house:'RASASI', name:'Hawas Kobra Men', ref:'100ML EDP', bs:42250, usd:65 },
  { house:'RASASI', name:'Hawas London Men', ref:'100ML EDP', bs:48750, usd:75 },
  { house:'RASASI', name:'Hawas Malibu Men', ref:'100ML EDP', bs:42250, usd:65 },
  { house:'RASASI', name:'Hawas Men', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'RASASI', name:'Hawas For Her Women', ref:'100ML EDP', bs:22750, usd:35 },
  { house:'RASASI', name:'Daarej Women EDP', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'RASASI', name:'Yuqawan Orchid Prairie Women', ref:'75ML EDP', bs:32500, usd:50 },

  // ── RAYHAAN ─────────────────────────────────────────────────
  { house:'RAYHAAN', name:'Elixir Men', ref:'100ML EDP', bs:32500, usd:50 },

  // ── REVLON ──────────────────────────────────────────────────
  { house:'REVLON', name:'Ciara Women', ref:'65ML EDP', bs:13000, usd:20 },

  // ── SALVATORE FERRAGAMO ─────────────────────────────────────
  { house:'SALVATORE FERRAGAMO', name:'Eleganza Women EDP', ref:'100ML EDP', bs:39000, usd:60 },
  { house:'SALVATORE FERRAGAMO', name:'F by Black Men', ref:'100ML EDT', bs:29250, usd:45 },
  { house:'SALVATORE FERRAGAMO', name:'F Pour Men EDT', ref:'100ML EDT', bs:29250, usd:45 },
  { house:'SALVATORE FERRAGAMO', name:'Ferragamo Men', ref:'100ML EDT', bs:45500, usd:70 },
  { house:'SALVATORE FERRAGAMO', name:'Uomo Men', ref:'100ML EDT', bs:39000, usd:60 },
  { house:'SALVATORE FERRAGAMO', name:'Signorina Women', ref:'100ML EDP', bs:42250, usd:65 },
  { house:'SALVATORE FERRAGAMO', name:'ST Ferragamo-F-Black Men', ref:'100ML EDT', bs:39000, usd:60 },

  // ── SEAN JOHN ───────────────────────────────────────────────
  { house:'SEAN JOHN', name:'I Am King Men', ref:'100ML EDT', bs:29250, usd:45 },

  // ── SWISS ARABIAN ───────────────────────────────────────────
  { house:'SWISS ARABIAN', name:'Shaghaf Oud Aswad', ref:'100ML EDP', bs:29250, usd:45 },

  // ── TAXI ────────────────────────────────────────────────────
  { house:'TAXI', name:'Taxi Men EDT', ref:'100ML EDT', bs:13000, usd:20 },

  // ── THIERRY MUGLER ──────────────────────────────────────────
  { house:'THIERRY MUGLER', name:'Alien Women', ref:'90ML EDP', bs:74750, usd:115 },

  // ── TOM FORD ────────────────────────────────────────────────
  { house:'TOM FORD', name:'Ombré Leather Unisex EDP', ref:'100ML EDP', bs:175500, usd:270 },
  { house:'TOM FORD', name:'Velvet Orchid Women', ref:'100ML EDP', bs:175500, usd:270 },

  // ── TOMMY HILFIGER ──────────────────────────────────────────
  { house:'TOMMY HILFIGER', name:'Girl Women', ref:'100ML EDT', bs:29250, usd:45 },

  // ── UDV ─────────────────────────────────────────────────────
  { house:'UDV', name:'Ciel Paris Men EDP', ref:'100ML EDP', bs:13000, usd:20 },

  // ── VALENTINO ───────────────────────────────────────────────
  { house:'VALENTINO', name:'Valentina Women', ref:'80ML EDP', bs:81250, usd:125 },

  // ── VARIADOS ────────────────────────────────────────────────
  { house:'VARIADOS', name:'Splash Variados Adulto', ref:'200ML', bs:9750, usd:15 },

  // ── VERSACE ─────────────────────────────────────────────────
  { house:'VERSACE', name:'Blue Jeans Men', ref:'75ML EDT', bs:19500, usd:30 },
  { house:'VERSACE', name:'Dylan Blue Women', ref:'100ML EDP', bs:61750, usd:95 },
  { house:'VERSACE', name:'Dylan Purple Women', ref:'100ML EDP', bs:71500, usd:110 },
  { house:'VERSACE', name:'Eros Flame Men', ref:'100ML EDP', bs:71500, usd:110 },
  { house:'VERSACE', name:'Red Jeans Women', ref:'75ML EDT', bs:19500, usd:30 },
  { house:'VERSACE', name:'Tester Dylan Blue Women', ref:'100ML EDP', bs:61750, usd:95 },
  { house:'VERSACE', name:'Eros Men EDP', ref:'100ML EDP', bs:65000, usd:100 },
  { house:'VERSACE', name:'Eros Parfum Men EDP', ref:'100ML EDP', bs:78000, usd:120 },
  { house:'VERSACE', name:'Pour Homme Men', ref:'100ML EDT', bs:52000, usd:80 },

  // ── VICTORINOX ──────────────────────────────────────────────
  { house:'VICTORINOX', name:'Swiss Army Classic Men', ref:'100ML EDT', bs:22750, usd:35 },

  // ── VIKTOR & ROLF ───────────────────────────────────────────
  { house:'VIKTOR & ROLF', name:'Flowerbomb Nectar Intense Women', ref:'90ML EDP', bs:100750, usd:155 },
  { house:'VIKTOR & ROLF', name:'Spicebomb Men EDT', ref:'90ML EDT', bs:58500, usd:90 },

  // ── WATT ────────────────────────────────────────────────────
  { house:'WATT', name:'Pink Women', ref:'100ML EDT', bs:13000, usd:20 },

  // ── XERJOFF ─────────────────────────────────────────────────
  { house:'XERJOFF', name:'Erba Pura Unisex', ref:'100ML EDP', bs:208000, usd:320 },

  // ── YSL ─────────────────────────────────────────────────────
  { house:'YVES SAINT LAURENT', name:'Kouros Men', ref:'100ML EDT', bs:48750, usd:75 },
  { house:'YVES SAINT LAURENT', name:'La Nuit de L\'Homme Men', ref:'100ML EDT', bs:97500, usd:150 },

  // ── ZIMAYA ──────────────────────────────────────────────────
  { house:'ZIMAYA', name:'Tiramisu Caramel Unisex', ref:'100ML EDP', bs:29250, usd:45 },
  { house:'ZIMAYA', name:'Precious Collection Fatima Vel', ref:'100ML EDP', bs:29250, usd:45 },
]

// Families olfativas por marca/nombre (best-effort)
const FAMILIA_MAP = {
  ADIDAS: 'Aromático', AFNAN: 'Oriental', 'AL HARAMAIN': 'Oriental',
  ANIMALE: 'Floral Amaderado', 'ANTONIO BANDERAS': 'Aromático',
  'ARABIYAT SUGAR': 'Frutal', ARAMIS: 'Aromático',
  'ARIANA GRANDE': 'Floral Frutal', ARMAF: 'Amaderado',
  ARMANI: 'Aromático', AZZARO: 'Aromático', BENETTON: 'Aromático',
  BHARARA: 'Amaderado', 'BILLIE EILISH': 'Floral Amaderado',
  BOUCHERON: 'Floral Oriental', 'BRITNEY SPEARS': 'Floral Frutal',
  BVLGARI: 'Aromático', CACHAREL: 'Floral', 'CALVIN KLEIN': 'Aromático',
  'CAROLINA HERRERA': 'Floral Amaderado', CLINIQUE: 'Floral Frutal',
  CREED: 'Frutal Amaderado', CUBA: 'Aromático',
  'D&G': 'Aromático', 'DANIELA KOSAN': 'Floral',
  DAVIDOFF: 'Aromático', DIESEL: 'Aromático',
  DIOR: 'Aromático', DISNEY: 'Floral Frutal',
  'DOLCE & GABBANA': 'Floral Amaderado', DUMONT: 'Amaderado',
  'DUMONT PARIS': 'Amaderado', 'ELIZABETH ARDEN': 'Floral',
  EMPER: 'Amaderado', 'EMPORIO ARMANI': 'Aromático',
  ESCADA: 'Floral', 'ESTEE LAUDER': 'Floral Frutal',
  'FERRARI SCUDERIA': 'Aromático', 'GIORGIO ARMANI': 'Aromático',
  GIVENCHY: 'Floral Oriental', 'GRANDEUR TUBBEES': 'Gourmand',
  GUCCI: 'Floral Oriental', GUESS: 'Floral Frutal',
  HALLOWEEN: 'Floral Oriental', 'HUGO BOSS': 'Aromático',
  'ISSEY MIYAKE': 'Aromático', 'JEAN PAUL GAULTIER': 'Oriental',
  'JIMMY CHOO': 'Floral', 'JO MILANO': 'Amaderado',
  JOOP: 'Oriental', 'KATY PERRY': 'Floral Frutal',
  KENZO: 'Floral', LACOSTE: 'Aromático',
  LATTAFA: 'Oriental', LATAFA: 'Oriental', LATAFFA: 'Oriental',
  'LE LABO': 'Amaderado', LOMANI: 'Floral Frutal',
  MACARENA: 'Floral Frutal', 'MAISON ALHAMBRA': 'Aromático',
  'MAISON MARGIELA': 'Floral', MANCERA: 'Cítrico',
  'MARC JACOBS': 'Floral', MARVEL: 'Aromático',
  MATTEL: 'Floral Frutal', 'MONT BLANC': 'Aromático',
  MONTALE: 'Oriental', MOSCHINO: 'Floral Frutal',
  NAUTICA: 'Aromático', 'NEW BRAND': 'Aromático',
  NUSUK: 'Oriental', ORIENTICA: 'Oriental',
  'PACO RABANNE': 'Aromático', 'PARIS HILTON': 'Floral Frutal',
  'PERRY ELLIS': 'Aromático', 'PHILIPP PLEIN': 'Aromático',
  'RALPH LAUREN': 'Aromático', RASASI: 'Oriental',
  RAYHAAN: 'Oriental', REVLON: 'Floral',
  'SALVATORE FERRAGAMO': 'Aromático', 'SEAN JOHN': 'Aromático',
  'SWISS ARABIAN': 'Oriental', TAXI: 'Aromático',
  'THIERRY MUGLER': 'Floral Oriental', 'TOM FORD': 'Amaderado',
  'TOMMY HILFIGER': 'Floral Frutal', UDV: 'Aromático',
  VALENTINO: 'Floral', VARIADOS: 'Floral',
  VERSACE: 'Aromático', VICTORINOX: 'Aromático',
  'VIKTOR & ROLF': 'Floral Oriental', WATT: 'Floral',
  XERJOFF: 'Floral Amaderado', 'YVES SAINT LAURENT': 'Aromático',
  ZIMAYA: 'Gourmand',
}

export const catalog = raw.map((item, i) => ({
  id: 1000 + i,
  house:       item.house,
  name:        item.name,
  ref:         item.ref,
  ml:          ml(item.ref),
  tipo:        t(item.ref),
  genero:      g(item.name),
  precioBS:    item.bs,
  precioUSD:   item.usd,
  familia:     FAMILIA_MAP[item.house] || 'Aromático',
  image:       null,
  descripcion: '',
}))

export default catalog
