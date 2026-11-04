// Confirmed offers only; season alone never implies discounts or an expiry.
export const NOVEMBER_CAMPAIGNS = [
  { id: 'banderas', keyword: 'BANDERAS', price: 60, title: 'Tus favoritos, por tres', size: 'Caballero: 100 ml · Dama: 80 o 100 ml, según el perfume', detail: 'Elige 3 entre las opciones de la promo BANDERAS.', from: '2026-11-03T18:37:38Z' },
  { id: 'grande', keyword: 'GRANDE', price: 90, title: 'El tamaño sí importa', size: '200 ml cada uno', detail: 'Elige 3 entre Black Seduction, The Secret, The Golden Secret y Blue Seduction para dama.', from: '2026-11-04T10:00:00-04:00' },
]
export const activeNovemberCampaigns = now => NOVEMBER_CAMPAIGNS.filter(c => +new Date(c.from) <= +now)
