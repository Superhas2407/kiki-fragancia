export const productFilters = {
  agotados: '_type == "product" && agotado == true',
  disponibles: '_type == "product" && coalesce(agotado, false) == false',
}

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
      filteredProducts('agotados', 'Agotados'),
      filteredProducts('disponibles', 'Disponibles'),
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'product'),
    ])
}
