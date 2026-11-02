export const productFilters = {
  agotados: '_type == "product" && agotado == true',
  disponibles: '_type == "product" && coalesce(agotado, false) == false',
}
