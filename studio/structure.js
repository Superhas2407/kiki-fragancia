import QuickStock from './components/QuickStock'

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
      filteredProducts('agotados', 'Agotados'),
      filteredProducts('disponibles', 'Disponibles'),
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'product'),
    ])
}
