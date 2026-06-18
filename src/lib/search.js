// Normaliza tildes y pone en minúsculas
export function norm(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

// Distancia de edición (Levenshtein) entre dos strings cortos
function editDist(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 99
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)])
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
  return dp[m][n]
}

// Tolerancia según longitud del término buscado
function tolerance(term) {
  if (term.length <= 3) return 0
  if (term.length <= 5) return 1
  return 2
}

// ¿El término hace match con alguna "palabra" del texto (ya normalizados)?
function termMatchesText(term, text) {
  if (text.includes(term)) return true
  const tol = tolerance(term)
  if (tol === 0) return false
  const words = text.split(/[\s,]+/).filter(w => w.length > 0)
  return words.some(w => editDist(term, w) <= tol || (w.length > term.length && w.startsWith(term)))
}

// Filtra productos por una query de búsqueda libre
// searchFields: array de strings ya normalizados del producto
export function productMatchesQuery(terms, searchFields) {
  return terms.every(t => searchFields.some(field => termMatchesText(t, field)))
}

// Devuelve un score de relevancia (mayor = más relevante).
// Prioriza coincidencias en nombre > casa > resto.
export function scoreProduct(terms, name, house) {
  const nName  = norm(name  || '')
  const nHouse = norm(house || '')
  const phrase = terms.join(' ')

  // Coincidencia exacta de nombre completo
  if (nName === phrase) return 100000

  let score = 0

  // Frase completa en el nombre
  if (nName.startsWith(phrase + ' ') || nName === phrase) score += 5000
  else if (nName.includes(' ' + phrase)) score += 3000
  else if (nName.includes(phrase)) score += 2000

  // Frase completa en la casa
  if (nHouse.includes(phrase)) score += 1500

  // Todos los términos están en el nombre
  if (terms.every(t => nName.includes(t))) score += 800

  // Términos individuales — coincidencia exacta de palabra > inicio de palabra > substring
  const nameWords  = nName.split(/[\s\-,./]+/).filter(Boolean)
  const houseWords = nHouse.split(/[\s\-,./]+/).filter(Boolean)

  for (const t of terms) {
    if (nameWords.includes(t))                          score += 400  // palabra exacta en nombre
    else if (nameWords.some(w => w.startsWith(t)))     score += 180  // inicio de palabra en nombre
    else if (nName.includes(t))                         score += 60   // substring en nombre

    if (houseWords.includes(t))                         score += 120  // palabra exacta en casa
    else if (houseWords.some(w => w.startsWith(t)))    score += 50   // inicio en casa
    else if (nHouse.includes(t))                        score += 20   // substring en casa
  }

  return score
}
