import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { join } from 'path';

const PHOTOS_SRC = 'C:\\Users\\Azael\\Pictures\\FOTOS NUEVAS PERFUMES\\Fotos en iCloud';
const PRODUCTS_DEST = 'D:\\kiki-fragancia\\kiki-fragancia\\public\\products';
const ENRICHED_PATH = 'D:\\kiki-fragancia\\kiki-fragancia\\src\\data\\products-enriched.js';
const INDEX_PATH = 'D:\\kiki-fragancia\\kiki-fragancia\\src\\data\\products-index.js';

const photoMap = [
  'cofinluxe-watt-pink-100ml-f.webp',
  'benetton-paradiso-inferno-pink-100ml-f.webp',
  'elizabeth-arden-5th-avenue-125ml-f.webp',
  'elizabeth-arden-red-door-100ml-f.webp',
  'calvin-klein-escape-100ml-f.webp',
  'benetton-united-dreams-love-yourself-80ml-f.webp',
];

const newProducts = [
  {
    id: 437, house: 'COFINLUXE', name: 'Cofinluxe Watt Pink',
    image: 'cofinluxe-watt-pink-100ml-f.webp',
    familia: 'Floral Frutal', tipo: 'Parfum de Toilette', genero: 'Femenino', ml: 100,
    descripcion: 'Watt Pink de Cofinluxe es una fragancia para la mujer floral frutal delicada y femenina, lanzada en 1993. Su composición gira en torno a un bouquet floral de rosa, jacinto y violeta sobre una base afrutada de melocotón y albaricoque, con un toque suavizante de manzanilla y jazmín. Fresca, romántica y fácil de llevar, perfecta para el día a día en primavera y verano.',
    notasSalida: 'Rosa, Jacinto, Violeta',
    notasCorazon: 'Jazmín, Manzanilla',
    notasFondo: 'Melocotón, Albaricoque',
    precioUSD: 30,
    description: 'Watt Pink de Cofinluxe es una fragancia para la mujer floral frutal delicada y femenina, lanzada en 1993. Su composición gira en torno a un bouquet floral de rosa, jacinto y violeta sobre una base afrutada de melocotón y albaricoque, con un toque suavizante de manzanilla y jazmín. Fresca, romántica y fácil de llevar, perfecta para el día a día en primavera y verano.',
    notes: ['Rosa', 'Jacinto', 'Violeta', 'Jazmín', 'Manzanilla', 'Melocotón', 'Albaricoque'],
    categoria: 'disenador',
  },
  {
    id: 438, house: 'BENETTON', name: 'Benetton Paradiso Inferno Pink',
    image: 'benetton-paradiso-inferno-pink-100ml-f.webp',
    familia: 'Floral Cítrico', tipo: 'Eau de Toilette', genero: 'Femenino', ml: 100,
    descripcion: 'Paradiso Inferno Pink de Benetton es una fragancia para la mujer floral cítrica ligera y fresca, lanzada en 2004. Su apertura luminosa de limón, naranja y hojas verdes evoluciona hacia un corazón floral de rosa, ylang ylang y jazmín, cerrando con una base limpia y suave de cedro, sándalo y almizcle. Fresca, accesible y fácil de llevar en el día a día.',
    notasSalida: 'Limón, Hojas verdes, Naranja',
    notasCorazon: 'Rosa, Ylang ylang, Jazmín',
    notasFondo: 'Cedro, Almizcle, Sándalo',
    precioUSD: 20,
    description: 'Paradiso Inferno Pink de Benetton es una fragancia para la mujer floral cítrica ligera y fresca, lanzada en 2004. Su apertura luminosa de limón, naranja y hojas verdes evoluciona hacia un corazón floral de rosa, ylang ylang y jazmín, cerrando con una base limpia y suave de cedro, sándalo y almizcle. Fresca, accesible y fácil de llevar en el día a día.',
    notes: ['Limón', 'Hojas verdes', 'Naranja', 'Rosa', 'Ylang ylang', 'Jazmín', 'Cedro', 'Almizcle', 'Sándalo'],
    categoria: 'disenador',
  },
  {
    id: 439, house: 'ELIZABETH ARDEN', name: 'Elizabeth Arden 5th Avenue',
    image: 'elizabeth-arden-5th-avenue-125ml-f.webp',
    familia: 'Floral', tipo: 'Eau de Parfum', genero: 'Femenino', ml: 125,
    descripcion: '5th Avenue de Elizabeth Arden es una fragancia para la mujer floral sofisticada e icónica, creada por Ann Gottlieb y lanzada en 1996. Inspirada en el glamour de la famosa avenida neoyorquina, su apertura luminosa de lila, magnolia y bergamota evoluciona hacia un corazón floral opulento de tuberosa, jazmín, rosa y ylang ylang con toques de melocotón y nuez moscada, cerrando con una base cálida de sándalo, iris, ámbar y vainilla. Un clásico atemporal de elegancia refinada.',
    notasSalida: 'Tilo, Lila, Magnolia, Bergamota, Mandarina',
    notasCorazon: 'Jazmín, Tuberosa, Rosa de Bulgaria, Melocotón, Ylang ylang, Violeta, Clavel, Nuez moscada',
    notasFondo: 'Almizcle, Iris, Sándalo, Ámbar, Vainilla, Clavo',
    precioUSD: 40,
    description: '5th Avenue de Elizabeth Arden es una fragancia para la mujer floral sofisticada e icónica, creada por Ann Gottlieb y lanzada en 1996. Inspirada en el glamour de la famosa avenida neoyorquina, su apertura luminosa de lila, magnolia y bergamota evoluciona hacia un corazón floral opulento de tuberosa, jazmín, rosa y ylang ylang con toques de melocotón y nuez moscada, cerrando con una base cálida de sándalo, iris, ámbar y vainilla. Un clásico atemporal de elegancia refinada.',
    notes: ['Tilo', 'Lirio de los valles', 'Lila', 'Magnolia', 'Bergamota', 'Mandarina', 'Jazmín', 'Tuberosa', 'Rosa de Bulgaria', 'Melocotón', 'Ylang ylang', 'Violeta', 'Clavel', 'Nuez moscada', 'Almizcle', 'Iris', 'Sándalo', 'Ámbar', 'Vainilla', 'Clavo'],
    categoria: 'disenador',
  },
  {
    id: 440, house: 'ELIZABETH ARDEN', name: 'Elizabeth Arden Red Door',
    image: 'elizabeth-arden-red-door-100ml-f.webp',
    familia: 'Floral Oriental', tipo: 'Eau de Toilette', genero: 'Femenino', ml: 100,
    descripcion: 'Red Door de Elizabeth Arden es una fragancia para la mujer floral oriental clásica e icónica, lanzada en 1989 e inspirada en el famoso salón de belleza Red Door Spa de la marca. Su apertura opulenta de lirio de los valles, freesia y violeta silvestre evoluciona hacia un corazón floral lujoso de rosa roja, flor de naranja marroquí, jazmín y ylang ylang, cerrando con una base cálida y sensual de miel, musgo de roble y sándalo. Un símbolo atemporal de glamour y feminidad.',
    notasSalida: 'Lirio de los valles, Freesia, Violeta silvestre',
    notasCorazon: 'Rosa roja, Flor de naranja marroquí, Jazmín, Ylang ylang, Orquídea',
    notasFondo: 'Miel, Musgo de roble, Sándalo',
    precioUSD: 45,
    description: 'Red Door de Elizabeth Arden es una fragancia para la mujer floral oriental clásica e icónica, lanzada en 1989 e inspirada en el famoso salón de belleza Red Door Spa de la marca. Su apertura opulenta de lirio de los valles, freesia y violeta silvestre evoluciona hacia un corazón floral lujoso de rosa roja, flor de naranja marroquí, jazmín y ylang ylang, cerrando con una base cálida y sensual de miel, musgo de roble y sándalo. Un símbolo atemporal de glamour y feminidad.',
    notes: ['Lirio de los valles', 'Freesia', 'Violeta silvestre', 'Rosa roja', 'Flor de naranja marroquí', 'Jazmín', 'Ylang ylang', 'Orquídea', 'Miel', 'Musgo de roble', 'Sándalo'],
    categoria: 'disenador',
  },
  {
    id: 441, house: 'CALVIN KLEIN', name: 'Calvin Klein Escape',
    image: 'calvin-klein-escape-100ml-f.webp',
    familia: 'Floral Acuático', tipo: 'Eau de Parfum', genero: 'Femenino', ml: 100,
    descripcion: 'Escape de Calvin Klein es una fragancia para la mujer floral acuática clásica y atemporal, lanzada en 1991 y creada por el perfumista Claude Dir. Su apertura frutal y verde de melón, manzana, albaricoque y grosella negra evoluciona hacia un corazón floral romántico de rosa, jazmín y lirio de los valles con notas de melocotón, cerrando con una base terrosa y cálida de sándalo, ámbar, musgo de roble y vainilla. Un emblema de libertad femenina de los años 90.',
    notasSalida: 'Melón, Manzanilla, Caléndula, Albaricoque, Jacinto, Manzana, Cilantro, Mandarina, Grosella negra, Lichi',
    notasCorazon: 'Ylang ylang, Melocotón, Lirio de los valles, Clavel, Rosa, Jazmín, Clavo',
    notasFondo: 'Almizcle, Sándalo, Ámbar, Vetiver, Cedro, Vainilla, Musgo de roble',
    precioUSD: 40,
    description: 'Escape de Calvin Klein es una fragancia para la mujer floral acuática clásica y atemporal, lanzada en 1991 y creada por el perfumista Claude Dir. Su apertura frutal y verde de melón, manzana, albaricoque y grosella negra evoluciona hacia un corazón floral romántico de rosa, jazmín y lirio de los valles con notas de melocotón, cerrando con una base terrosa y cálida de sándalo, ámbar, musgo de roble y vainilla. Un emblema de libertad femenina de los años 90.',
    notes: ['Melón', 'Manzanilla', 'Caléndula', 'Albaricoque', 'Jacinto', 'Musgo de roble', 'Manzana', 'Cilantro', 'Mandarina', 'Grosella negra', 'Lichi', 'Ylang ylang', 'Melocotón', 'Lirio de los valles', 'Clavel', 'Rosa', 'Jazmín', 'Clavo', 'Almizcle', 'Sándalo', 'Ámbar', 'Vetiver', 'Cedro', 'Vainilla'],
    categoria: 'disenador',
  },
  {
    id: 442, house: 'BENETTON', name: 'Benetton United Dreams Love Yourself',
    image: 'benetton-united-dreams-love-yourself-80ml-f.webp',
    familia: 'Floral Frutal', tipo: 'Eau de Toilette', genero: 'Femenino', ml: 80,
    descripcion: 'United Dreams Love Yourself de United Colors of Benetton es una fragancia para la mujer floral frutal fresca y femenina, lanzada en 2014 como parte de la colección United Dreams. Su apertura afrutada de frambuesa, pera, albaricoque y bergamota evoluciona hacia un corazón floral suave de rosa, freesia y jazmín, cerrando con una base limpia y cremosa de sándalo, ámbar y almizcle. Un aroma optimista, joven y muy llevable para el día a día.',
    notasSalida: 'Frambuesa, Pera, Albaricoque, Bergamota',
    notasCorazon: 'Rosa, Freesia, Jazmín',
    notasFondo: 'Almizcle, Sándalo, Ámbar',
    precioUSD: 25,
    description: 'United Dreams Love Yourself de United Colors of Benetton es una fragancia para la mujer floral frutal fresca y femenina, lanzada en 2014 como parte de la colección United Dreams. Su apertura afrutada de frambuesa, pera, albaricoque y bergamota evoluciona hacia un corazón floral suave de rosa, freesia y jazmín, cerrando con una base limpia y cremosa de sándalo, ámbar y almizcle. Un aroma optimista, joven y muy llevable para el día a día.',
    notes: ['Frambuesa', 'Pera', 'Albaricoque', 'Bergamota', 'Rosa', 'Freesia', 'Jazmín', 'Almizcle', 'Sándalo', 'Ámbar'],
    categoria: 'disenador',
  },
];

// 1. Copy photos
console.log('Copiando fotos...');
for (const dest of photoMap) {
  const srcPath = join(PHOTOS_SRC, dest);
  const destPath = join(PRODUCTS_DEST, dest);
  copyFileSync(srcPath, destPath);
  console.log(`  ${dest}`);
}

// 2. Append to products-enriched.js
console.log('\nActualizando products-enriched.js...');
let enriched = readFileSync(ENRICHED_PATH, 'utf8');
const enrichedEntries = newProducts.map(p => {
  return `  {
    "id": ${p.id},
    "house": "${p.house}",
    "name": "${p.name}",
    "image": "${p.image}",
    "familia": "${p.familia}",
    "tipo": "${p.tipo}",
    "genero": "${p.genero}",
    "descripcion": ${JSON.stringify(p.descripcion)},
    "notasSalida": ${JSON.stringify(p.notasSalida)},
    "notasCorazon": ${JSON.stringify(p.notasCorazon)},
    "notasFondo": ${JSON.stringify(p.notasFondo)},
    "ml": ${p.ml},
    "precioUSD": ${p.precioUSD},
    "description": ${JSON.stringify(p.description)},
    "notes": ${JSON.stringify(p.notes)},
    "categoria": "${p.categoria}"
  }`;
}).join(',\n');

enriched = enriched.replace(/\]\s*$/, `,\n${enrichedEntries}\n]`);
writeFileSync(ENRICHED_PATH, enriched, 'utf8');
console.log(`  Agregados ${newProducts.length} productos a products-enriched.js`);

// 3. Append to products-index.js
console.log('\nActualizando products-index.js...');
let index = readFileSync(INDEX_PATH, 'utf8');
const indexEntries = newProducts.map(p => {
  return `  {
    "id": ${p.id},
    "house": "${p.house}",
    "name": "${p.name}",
    "image": "${p.image}",
    "familia": "${p.familia}",
    "tipo": "${p.tipo}",
    "genero": "${p.genero}",
    "ml": ${p.ml},
    "precioUSD": ${p.precioUSD},
    "categoria": "${p.categoria}"
  }`;
}).join(',\n');

index = index.replace(/\]\s*$/, `,\n${indexEntries}\n]`);
writeFileSync(INDEX_PATH, index, 'utf8');
console.log(`  Agregados ${newProducts.length} productos a products-index.js`);

console.log(`\n✓ Listo. ${newProducts.length} productos agregados (IDs 437-442).`);
