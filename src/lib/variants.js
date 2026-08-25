// Un producto con `variantIds` es el "canónico" de su grupo de presentaciones
// (distinto ml y/o concentración del mismo perfume) — su card muestra un
// selector de tamaño con todas las opciones. Los productos que aparecen
// listados en el `variantIds` de otro se ocultan de los listados de catálogo
// (se ven solo a través del selector del canónico, o directo si alguien
// entra a su URL/lo comparte).
export function excludeVariantDuplicates(products) {
  const referenced = new Set(products.flatMap(p => p.variantIds ?? []))
  return products.filter(p => !referenced.has(p.id))
}
