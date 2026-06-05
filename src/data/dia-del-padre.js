// Campaña Día del Padre 2026 — descuentos en modo REF (divisa)
// Formato: id → porcentaje de descuento (10 ó 15). Sin entrada = sin descuento.
export const diaDeLPadreDiscounts = {
  2: 10,   // Afnan 9 AM Dive
  3: 10,   // Afnan 9 PM
  9: 10,   // Al Haramain Gold Edition 200ml
  17: 10,  // Armaf Aura
  20: 10,  // Armaf Club de Nuit Intense
  23: 10,  // Armaf Club de Nuit Milestone
  26: 10,  // Armaf Club de Nuit Urban Elixir
  31: 15,  // Armaf Hunter Intense
  37: 15,  // Armaf Odyssey Black Forest
  42: 10,  // Armaf Odyssey Go Mango
  44: 10,  // Armaf Odyssey Homme White Edition
  48: 15,  // Armaf Odyssey Mega Man
  71: 15,  // Bvlgari Aqva Marine
  86: 10,  // Dior Homme Intense
  102: 10, // Emper Stallion 53
  143: 10, // Lattafa Asad Elixir
  144: 10, // Lattafa Asad Zanzibar
  147: 15, // Lattafa Bade'e Al Oud Amethyst
  150: 10, // Lattafa Bade'e Al Oud for Glory
  162: 10, // Lattafa Fakhar Extrait de Parfum
  166: 10, // Lattafa Hayaati
  169: 10, // Lattafa His Confession
  173: 10, // Lattafa Khamrah Dukhan
  174: 10, // Lattafa Khamrah Qahwa
  180: 15, // Lattafa Najdia
  184: 15, // Lattafa Qaed Al Fursan
  185: 15, // Lattafa Qaed Al Fursan Unlimited
  187: 15, // Lattafa Qimmah Men
  198: 10, // Lattafa Vintage Radio
  232: 10, // Rasasi Hawas Kobra
  251: 10, // Moschino Toy Boy
  286: 10, // Le Labo Santal 33
  287: 10, // Paco Rabanne Paco XS
  295: 15, // Ralph Lauren Polo Sport
  324: 10, // Ralph Lauren Polo Blue
  328: 10, // Carolina Herrera 212 Sexy Men
  332: 10, // Montblanc Legend Spirit
  338: 15, // Benetton Paradiso Inferno Blue
  340: 10, // Guess Seductive Red Homme
  343: 15, // Calvin Klein CK Be 100ml
  344: 10, // Calvin Klein CK Be 200ml
  346: 10, // Antonio Banderas The Golden Secret
  349: 10, // Montblanc Legend Red
  350: 10, // Montblanc Legend Blue
  355: 10, // Antonio Banderas Black Seduction 200ml
  359: 10, // Antonio Banderas The Icon
  364: 10, // Issey Miyake Intense 75ml
  366: 10, // Antonio Banderas King of Seduction
  374: 10, // Perry Ellis 360 Red for Men
  388: 15, // Calvin Klein Obsession for Men
  393: 10, // Guess Seductive Homme
  411: 10, // Benetton Cold
  272: 10, // Rabanne Phantom Intense
  61: 10,  // Bharara King EDP
}

// Productos en DDP sin descuento (solo ribbon)
const ddpSinDescuento = []

export const diaDeLPadreIds = [
  ...Object.keys(diaDeLPadreDiscounts).map(Number),
  ...ddpSinDescuento,
]

// Subsets para uso independiente (retrocompatibilidad)
export const antoniobanderasIds = [346, 349, 350, 355, 359, 366, 375, 391, 410]
export const armafOdysseyIds    = [37, 42, 44, 48, 43]
