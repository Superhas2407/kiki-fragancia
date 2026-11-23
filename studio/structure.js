import QuickStock from './components/QuickStock'
import QuickPrice from './components/QuickPrice'

import { productFilters } from './lib/productFilters'

export const structure = (S) => {
  const filteredProducts = (id, title) =>
    S.listItem()
      .id(id)
      .title(title)
      .child(
        S.documentTypeList('product')
          .id(id)
          .title(title)
          .filter(productFilters[id])
          .apiVersion('2024-01-01')
          .defaultOrdering([{ field: 'name', direction: 'asc' }]),
      )

  return S.list()
    .title('Perfumes')
    .items([
      // Keep the existing product route and creation/search actions.
      S.documentTypeListItem('product').title('Todos los perfumes'),
      S.listItem().id('stock-rapido').title('Stock rápido').child(
        S.component().id('stock-rapido').title('Stock rápido').component(QuickStock),
      ),
      S.listItem().id('precio-rapido').title('Cambio de precio rápido').child(
        S.component().id('precio-rapido').title('Cambio de precio rápido').component(QuickPrice),
      ),
      filteredProducts('agotados', 'Agotados'),
      filteredProducts('disponibles', 'Disponibles'),
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'product'),
    ])
}
