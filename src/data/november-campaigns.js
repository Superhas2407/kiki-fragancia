// Confirmed offers only; season alone never implies discounts or an expiry.
export const NOVEMBER_CAMPAIGNS = [
  { id: 'grande', keyword: 'GRANDE', price: 90, title: 'El tamaño sí importa', size: '200 ml cada uno', detail: 'Elige 3 entre Black Seduction, The Secret, The Golden Secret y Blue Seduction para dama.', from: '2026-11-04T10:00:00-04:00' },
]
export const activeNovemberCampaigns = now => NOVEMBER_CAMPAIGNS.filter(c => +new Date(c.from) <= +now)
