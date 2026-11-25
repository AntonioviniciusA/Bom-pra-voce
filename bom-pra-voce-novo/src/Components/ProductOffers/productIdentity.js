export function productFragrances(product) {
  if (Array.isArray(product.fragrances) && product.fragrances.length) return product.fragrances;
  return product.variant || product.barcode ? [{ name: product.variant || '', barcode: product.barcode || '' }] : [];
}

export function productDescription(product) {
  return [product.brand, product.name, productFragrances(product).map(f => f.name).filter(Boolean).join(' / '), product.content].filter(Boolean).join(' · ');
}

export function productBarcodes(product) {
  return productFragrances(product).map(f => f.barcode).filter(Boolean);
}
