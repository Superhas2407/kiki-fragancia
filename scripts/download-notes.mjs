/**
 * Descarga imágenes de notas olfativas desde Pexels API
 * Uso: node scripts/download-notes.mjs
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR   = path.join(__dirname, '../public/notes')
const MAP_FILE  = path.join(__dirname, '../src/data/notes-images.js')
const PEXELS_KEY = 'YPpRWKtpngEpzkK2Q7KQiHMB1lHEM6Cy2sGL1SmhWThnae2SDq4XHCjI'

fs.mkdirSync(OUT_DIR, { recursive: true })

// keyword → { file, query }
// "file" es el nombre del archivo (sin extensión) — notas que comparten imagen usan el mismo file
// "query" es el término de búsqueda en Pexels
const NOTES_MAP = {
  // ── Cítricos ──────────────────────────────────────────────
  'bergamota':                   { file: 'bergamot-orange',     query: 'bergamot orange fruit' },
  'bergamota de calabria':       { file: 'bergamot-orange',     query: 'bergamot orange fruit' },
  'bergamota de italia':         { file: 'bergamot-orange',     query: 'bergamot orange fruit' },
  'limón':                       { file: 'lemon',               query: 'lemon fruit fresh' },
  'limon':                       { file: 'lemon',               query: 'lemon fruit fresh' },
  'naranja':                     { file: 'orange-fruit',        query: 'orange fruit fresh' },
  'naranja amarga':              { file: 'orange-fruit',        query: 'orange fruit fresh' },
  'naranja italiana':            { file: 'orange-fruit',        query: 'orange fruit fresh' },
  'naranjo':                     { file: 'orange-fruit',        query: 'orange fruit fresh' },
  'hojas de naranjo':            { file: 'orange-fruit',        query: 'orange fruit fresh' },
  'cáscara de naranja':          { file: 'orange-fruit',        query: 'orange fruit fresh' },
  'naranja roja':                { file: 'blood-orange',        query: 'blood orange fruit' },
  'naranja sanguina':            { file: 'blood-orange',        query: 'blood orange fruit' },
  'naranja siciliana':           { file: 'blood-orange',        query: 'blood orange fruit' },
  'naranja tangerina':           { file: 'tangerine',           query: 'tangerine citrus fruit' },
  'mandarina':                   { file: 'mandarin-orange',     query: 'mandarin orange fruit' },
  'mandarina italiana':          { file: 'mandarin-orange',     query: 'mandarin orange fruit' },
  'mandarina verde':             { file: 'mandarin-orange',     query: 'mandarin orange fruit' },
  'pomelo':                      { file: 'grapefruit',          query: 'grapefruit cut fresh' },
  'pomelo rosado':               { file: 'grapefruit',          query: 'grapefruit cut fresh' },
  'toronja':                     { file: 'grapefruit',          query: 'grapefruit cut fresh' },
  'toronja rosa':                { file: 'grapefruit',          query: 'grapefruit cut fresh' },
  'toronja (pomelo)':            { file: 'grapefruit',          query: 'grapefruit cut fresh' },
  'yuzu':                        { file: 'yuzu',                query: 'yuzu citrus fruit' },
  'lima':                        { file: 'key-lime',            query: 'lime citrus fruit fresh' },
  'clementina':                  { file: 'clementine',          query: 'clementine citrus fruit' },
  'kumquat':                     { file: 'kumquat',             query: 'kumquat fruit' },
  'petit grain':                 { file: 'petitgrain',          query: 'orange blossom petitgrain leaves' },
  'petitgrain':                  { file: 'petitgrain',          query: 'orange blossom petitgrain leaves' },
  'neroli':                      { file: 'neroli',              query: 'orange blossom flower white' },
  'néroli':                      { file: 'neroli',              query: 'orange blossom flower white' },
  'neroli de túnez':             { file: 'neroli',              query: 'orange blossom flower white' },
  'azahar':                      { file: 'orange-blossom',      query: 'orange blossom white flower' },
  'flor de azahar':              { file: 'orange-blossom',      query: 'orange blossom white flower' },
  'flor de azahar del naranjo':  { file: 'orange-blossom',      query: 'orange blossom white flower' },
  'flor de naranja':             { file: 'orange-blossom',      query: 'orange blossom white flower' },
  'flor de naranjo':             { file: 'orange-blossom',      query: 'orange blossom white flower' },
  'flor de azahar africano':     { file: 'orange-blossom',      query: 'orange blossom white flower' },
  'flor de naranjo africano':    { file: 'orange-blossom',      query: 'orange blossom white flower' },
  'flor del naranjo africano':   { file: 'orange-blossom',      query: 'orange blossom white flower' },
  'azahar de naranjo':           { file: 'orange-blossom',      query: 'orange blossom white flower' },
  'cidra':                       { file: 'citron',              query: 'citron yellow fruit' },

  // ── Especias ──────────────────────────────────────────────
  'pimienta negra':              { file: 'black-pepper',        query: 'black pepper spice' },
  'pimienta':                    { file: 'black-pepper',        query: 'black pepper spice' },
  'pimienta rosa':               { file: 'pink-peppercorn',     query: 'pink peppercorn spice' },
  'pimienta de sichuan':         { file: 'sichuan-pepper',      query: 'sichuan pepper spice' },
  'cardamomo':                   { file: 'cardamom',            query: 'cardamom pods spice' },
  'canela':                      { file: 'cinnamon',            query: 'cinnamon sticks spice' },
  'canela de ceilán':            { file: 'cinnamon',            query: 'cinnamon sticks spice' },
  'hoja de canela':              { file: 'cinnamon',            query: 'cinnamon sticks spice' },
  'clavo':                       { file: 'clove',               query: 'clove spice dried' },
  'clavo de olor':               { file: 'clove',               query: 'clove spice dried' },
  'jengibre':                    { file: 'ginger',              query: 'ginger root fresh' },
  'flor de jengibre':            { file: 'ginger',              query: 'ginger root fresh' },
  'nuez moscada':                { file: 'nutmeg',              query: 'nutmeg spice' },
  'azafrán':                     { file: 'saffron',             query: 'saffron spice red threads' },
  'azafran':                     { file: 'saffron',             query: 'saffron spice red threads' },
  'anís':                        { file: 'anise',               query: 'anise star spice' },
  'anis':                        { file: 'anise',               query: 'anise star spice' },
  'anís estrellado':             { file: 'star-anise',          query: 'star anise spice' },
  'incienso':                    { file: 'frankincense',        query: 'frankincense resin incense' },
  'incienso de olíbano':         { file: 'frankincense',        query: 'frankincense resin incense' },
  'cúrcuma':                     { file: 'turmeric',            query: 'turmeric root yellow spice' },
  'cilantro':                    { file: 'coriander',           query: 'coriander seeds spice' },
  'alcaravea':                   { file: 'caraway',             query: 'caraway seeds spice' },
  'hinojo':                      { file: 'fennel',              query: 'fennel herb fresh' },

  // ── Flores ────────────────────────────────────────────────
  'rosa':                        { file: 'rose',                query: 'rose flower red pink' },
  'rosa búlgara':                { file: 'rosa-damascena',      query: 'damask rose pink flower' },
  'rosa damascena':              { file: 'rosa-damascena',      query: 'damask rose pink flower' },
  'rosa de taif':                { file: 'rose',                query: 'rose flower red pink' },
  'rosa turca':                  { file: 'rose',                query: 'rose flower red pink' },
  'rosa blanca':                 { file: 'rose',                query: 'white rose flower' },
  'rosa de bulgaria':            { file: 'rosa-damascena',      query: 'damask rose pink flower' },
  'rosa de damasco':             { file: 'rosa-damascena',      query: 'damask rose pink flower' },
  'rosa de grasse':              { file: 'rose',                query: 'rose flower pink petals' },
  'rosa de mayo':                { file: 'rose',                query: 'rose flower pink petals' },
  'rosa silvestre':              { file: 'rose',                query: 'wild rose flower pink' },
  'leche de rosa':               { file: 'rose',                query: 'rose flower pink petals' },
  'pétalos de rosa':             { file: 'rose',                query: 'rose petals scattered' },
  'jazmín':                      { file: 'jasmine',             query: 'jasmine white flowers blooming' },
  'jazmin':                      { file: 'jasmine',             query: 'jasmine white flowers blooming' },
  'jazmín sambac':               { file: 'jasmine',             query: 'jasmine white flowers blooming' },
  'jazmín de la india':          { file: 'jasmine',             query: 'jasmine white flowers blooming' },
  'jazmín egipcio':              { file: 'jasmine',             query: 'jasmine white flowers blooming' },
  'capullos de jazmín':          { file: 'jasmine',             query: 'jasmine buds white flowers' },
  'pétalos de jazmín':           { file: 'jasmine',             query: 'jasmine white flowers blooming' },
  'sorbete de jazmín':           { file: 'jasmine',             query: 'jasmine white flowers blooming' },
  'té de jazmín':                { file: 'jasmine',             query: 'jasmine tea flowers' },
  'geranio':                     { file: 'geranium',            query: 'geranium flower pink' },
  'lavanda':                     { file: 'lavender',            query: 'lavender field purple flowers' },
  'lavandín':                    { file: 'lavender',            query: 'lavender field purple flowers' },
  'lirio de los valles':         { file: 'lily-of-the-valley',  query: 'lily of the valley white flowers' },
  'lirio del valle':             { file: 'lily-of-the-valley',  query: 'lily of the valley white flowers' },
  'muguete':                     { file: 'lily-of-the-valley',  query: 'lily of the valley white flowers' },
  'peonía':                      { file: 'peony',               query: 'peony flower pink bloom' },
  'peonia':                      { file: 'peony',               query: 'peony flower pink bloom' },
  'peonía rosa':                 { file: 'peony',               query: 'peony flower pink bloom' },
  'iris':                        { file: 'iris-plant',          query: 'iris flower purple bloom' },
  'raíz de iris':                { file: 'iris-plant',          query: 'iris flower purple bloom' },
  'raíz de lirio':               { file: 'iris-plant',          query: 'iris flower purple bloom' },
  'tuberosa':                    { file: 'tuberose',            query: 'tuberose white flower fragrant' },
  'nardo':                       { file: 'tuberose',            query: 'tuberose white flower fragrant' },
  'nardos':                      { file: 'tuberose',            query: 'tuberose white flower fragrant' },
  'fresia':                      { file: 'freesia',             query: 'freesia flower colorful' },
  'fresia africana':             { file: 'freesia',             query: 'freesia flower colorful' },
  'fresia rosa':                 { file: 'freesia',             query: 'freesia flower pink' },
  'violeta':                     { file: 'viola-plant',         query: 'violet flower purple small' },
  'hojas de violeta':            { file: 'viola-plant',         query: 'violet flower purple small' },
  'amarilis':                    { file: 'amaryllis',           query: 'amaryllis red flower bloom' },
  'camelia':                     { file: 'camellia',            query: 'camellia flower pink white' },
  'magnolia':                    { file: 'magnolia',            query: 'magnolia white flower tree' },
  'mimosa':                      { file: 'mimosa',              query: 'mimosa yellow flower acacia' },
  'azucena':                     { file: 'lily',                query: 'white lily flower bloom' },
  'lirio':                       { file: 'lily',                query: 'lily flower bloom' },
  'lirio stargazer':             { file: 'lily',                query: 'stargazer lily pink flower' },
  'ylang-ylang':                 { file: 'ylang-ylang',         query: 'ylang ylang yellow flower tropical' },
  'ylang ylang':                 { file: 'ylang-ylang',         query: 'ylang ylang yellow flower tropical' },
  'gardenia':                    { file: 'gardenia',            query: 'gardenia white flower fragrant' },
  'gardenia de tahití':          { file: 'gardenia',            query: 'gardenia white flower fragrant' },
  'orquídea':                    { file: 'orchid',              query: 'orchid flower exotic purple' },
  'orquídea de vainilla':        { file: 'orchid',              query: 'vanilla orchid flower' },
  'orquídea negra':              { file: 'orchid',              query: 'dark orchid flower exotic' },
  'heliotropo':                  { file: 'heliotrope',          query: 'heliotrope purple flower' },
  'jacinto':                     { file: 'hyacinth',            query: 'hyacinth purple blue flower' },
  'jacinto de agua':             { file: 'hyacinth',            query: 'hyacinth purple blue flower' },
  'narciso':                     { file: 'narcissus',           query: 'narcissus daffodil yellow white' },
  'lila':                        { file: 'lilac',               query: 'lilac purple flower cluster' },
  'hibisco':                     { file: 'hibiscus',            query: 'hibiscus red flower tropical' },
  'frangipani':                  { file: 'frangipani',          query: 'frangipani plumeria white flower tropical' },
  'osmanto':                     { file: 'osmanthus',           query: 'osmanthus orange small flower' },
  'champaca':                    { file: 'champaca',            query: 'champaca magnolia yellow flower' },
  'ciclamen':                    { file: 'cyclamen',            query: 'cyclamen pink flower' },
  'madreselva':                  { file: 'honeysuckle',         query: 'honeysuckle white yellow flower' },
  'dalia':                       { file: 'dahlia',              query: 'dahlia colorful flower' },
  'flor de cerezo':              { file: 'cherry-blossom',      query: 'cherry blossom pink flower spring' },
  'flor del cerezo':             { file: 'cherry-blossom',      query: 'cherry blossom pink flower spring' },
  'lirio de agua':               { file: 'water-lily',          query: 'water lily white flower pond' },
  'nenúfar':                     { file: 'water-lily',          query: 'water lily white flower pond' },
  'loto':                        { file: 'lotus',               query: 'lotus flower pink water' },
  'flor de loto':                { file: 'lotus',               query: 'lotus flower pink water' },
  'davana':                      { file: 'davana',              query: 'artemisia herb plant' },
  'palmarosa':                   { file: 'palmarosa',           query: 'palmarosa grass tropical plant' },
  'flor de la pasión':           { file: 'passionfruit',        query: 'passion flower purple exotic' },
  'flor de pasionaria':          { file: 'passionfruit',        query: 'passion flower purple exotic' },
  'flor de frambueso':           { file: 'raspberry',           query: 'raspberry fruit red' },
  'flores blancas':              { file: 'jasmine',             query: 'white flowers fragrant bouquet' },
  'flor tropical':               { file: 'frangipani',          query: 'tropical flower colorful' },
  'flor del tabaco':             { file: 'tobacco',             query: 'tobacco plant flower' },
  'cempasúchil':                 { file: 'marigold',            query: 'marigold orange flower' },
  'espino blanco':               { file: 'hawthorn',            query: 'hawthorn white flower blossom' },
  'trébol blanco':               { file: 'white-clover',        query: 'white clover flower meadow' },
  'mirto':                       { file: 'myrtle',              query: 'myrtle plant white flower' },

  // ── Maderas & bases ───────────────────────────────────────
  'sándalo':                     { file: 'sandalwood',          query: 'sandalwood wood chips aromatic' },
  'sandalo':                     { file: 'sandalwood',          query: 'sandalwood wood chips aromatic' },
  'madera de sándalo':           { file: 'sandalwood',          query: 'sandalwood wood chips aromatic' },
  'cedro':                       { file: 'cedar',               query: 'cedar wood texture aromatic' },
  'cedro del atlas':             { file: 'cedar',               query: 'cedar wood texture aromatic' },
  'cedro de virginia':           { file: 'cedar',               query: 'cedar wood texture aromatic' },
  'agujas de cedro':             { file: 'cedar',               query: 'cedar branches needles' },
  'madera de cedro':             { file: 'cedar',               query: 'cedar wood texture aromatic' },
  'vetiver':                     { file: 'vetiver',             query: 'vetiver grass roots earthy' },
  'vetiver de haití':            { file: 'vetiver',             query: 'vetiver grass roots earthy' },
  'pachulí':                     { file: 'patchouli',           query: 'patchouli plant herb green' },
  'pachuli':                     { file: 'patchouli',           query: 'patchouli plant herb green' },
  'patchouli':                   { file: 'patchouli',           query: 'patchouli plant herb green' },
  'musgo de roble':              { file: 'oakmoss',             query: 'oakmoss moss green forest' },
  'musgo':                       { file: 'moss',                query: 'green moss forest nature' },
  'abedul':                      { file: 'birch',               query: 'birch tree white bark' },
  'birch':                       { file: 'birch',               query: 'birch tree white bark' },
  'bambú':                       { file: 'bamboo',              query: 'bamboo green stalks fresh' },
  'bambu':                       { file: 'bamboo',              query: 'bamboo green stalks fresh' },
  'oud':                         { file: 'agarwood',            query: 'agarwood oud wood dark aromatic' },
  'madera de oud':               { file: 'agarwood',            query: 'agarwood oud wood dark aromatic' },
  'palo de rosa':                { file: 'rosewood',            query: 'rosewood pink wood texture' },
  'palo de rosa de brasil':      { file: 'rosewood',            query: 'rosewood pink wood texture' },
  'palo santo':                  { file: 'palo-santo',          query: 'palo santo wood sticks incense' },
  'caoba':                       { file: 'mahogany',            query: 'mahogany dark wood texture' },
  'madera de gaiac':             { file: 'guaiacwood',          query: 'guaiacwood tropical tree resin' },
  'madera de guayaco':           { file: 'guaiacwood',          query: 'guaiacwood tropical tree resin' },
  'pino':                        { file: 'pine',                query: 'pine tree needles cone forest' },
  'ciprés':                      { file: 'cypress',             query: 'cypress tree tall green' },
  'abeto balsámico':             { file: 'balsam-fir',          query: 'balsam fir tree branch needles' },
  'roble':                       { file: 'oak',                 query: 'oak tree wood bark' },
  'olivo':                       { file: 'olive',               query: 'olive branch leaves green' },
  'heno':                        { file: 'hay',                 query: 'hay bales golden field' },
  'cálamo aromático':            { file: 'calamus',             query: 'calamus sweet flag plant' },
  'lycium':                      { file: 'lycium',              query: 'goji berries red lycium' },

  // ── Ambarinos & resinas ───────────────────────────────────
  'ámbar':                       { file: 'ambergris',           query: 'amber resin golden aromatic' },
  'ambar':                       { file: 'ambergris',           query: 'amber resin golden aromatic' },
  'ámbar gris':                  { file: 'ambergris',           query: 'amber resin golden aromatic' },
  'ambergris':                   { file: 'ambergris',           query: 'amber resin golden aromatic' },
  'almizcle':                    { file: 'musk',                query: 'musk deer animal nature' },
  'almizcle blanco':             { file: 'musk',                query: 'white musk powder soft' },
  'almizcle ambreta':            { file: 'musk',                query: 'musk deer animal nature' },
  'benjuí':                      { file: 'benzoin-resin',       query: 'benzoin resin styrax aromatic' },
  'benjui':                      { file: 'benzoin-resin',       query: 'benzoin resin styrax aromatic' },
  'labdano':                     { file: 'labdanum',            query: 'labdanum cistus resin plant' },
  'lábdano':                     { file: 'labdanum',            query: 'labdanum cistus resin plant' },
  'ládano':                      { file: 'labdanum',            query: 'labdanum cistus resin plant' },
  'cistus':                      { file: 'cistus',              query: 'cistus rock rose pink flower' },
  'mirra':                       { file: 'myrrh',               query: 'myrrh resin dark brown aromatic' },
  'incienso de olíbano':         { file: 'frankincense',        query: 'frankincense resin incense' },
  'elemí':                       { file: 'elemi',               query: 'elemi resin aromatic plant' },
  'resina de elemí':             { file: 'elemi',               query: 'elemi resin aromatic plant' },
  'resina':                      { file: 'resin',               query: 'tree resin amber golden drops' },
  'opopónaco':                   { file: 'opopanax',            query: 'opopanax sweet myrrh resin' },
  'bálsamo de tolú':             { file: 'balsam-tolu',         query: 'balsam resin aromatic tree' },

  // ── Dulces & gourmand ─────────────────────────────────────
  'vainilla':                    { file: 'vanilla',             query: 'vanilla bean pod dark' },
  'vainilla de madagascar':      { file: 'vanilla',             query: 'vanilla bean pod dark' },
  'vainilla bourbon':            { file: 'vanilla',             query: 'vanilla bean pod dark' },
  'vainilla de tahití':          { file: 'vanilla',             query: 'vanilla bean pod dark' },
  'cacao':                       { file: 'cacao',               query: 'cacao beans chocolate dark' },
  'chocolate':                   { file: 'chocolate',           query: 'dark chocolate pieces' },
  'chocolate blanco':            { file: 'chocolate',           query: 'white chocolate smooth' },
  'caramelo':                    { file: 'caramel',             query: 'caramel sauce golden sweet' },
  'caramelo de fresa':           { file: 'caramel',             query: 'caramel sauce golden sweet' },
  'toffee':                      { file: 'caramel',             query: 'toffee caramel sweet golden' },
  'almendra':                    { file: 'almond',              query: 'almond nuts raw' },
  'almendra amarga':             { file: 'almond',              query: 'almond nuts raw' },
  'café':                        { file: 'coffee',              query: 'coffee beans roasted dark' },
  'cafe':                        { file: 'coffee',              query: 'coffee beans roasted dark' },
  'capuchino':                   { file: 'cappuccino',          query: 'cappuccino coffee cup froth' },
  'tonka':                       { file: 'tonka-bean',          query: 'tonka bean dark aromatic' },
  'haba tonka':                  { file: 'tonka-bean',          query: 'tonka bean dark aromatic' },
  'haba tonka tostada':          { file: 'tonka-bean',          query: 'tonka bean dark aromatic' },
  'miel':                        { file: 'honey',               query: 'honey golden jar drip' },
  'praliné':                     { file: 'praline',             query: 'praline nuts caramel sweet' },
  'castaña':                     { file: 'chestnut',            query: 'chestnut autumn brown' },
  'castañas':                    { file: 'chestnut',            query: 'chestnut autumn brown' },
  'pistacho':                    { file: 'pistachio',           query: 'pistachio green nut open' },
  'avellana':                    { file: 'hazelnut',            query: 'hazelnut brown nut' },
  'arroz':                       { file: 'rice',                query: 'rice grains white bowl' },
  'tabaco':                      { file: 'tobacco',             query: 'tobacco leaves dried brown' },
  'regaliz':                     { file: 'liquorice',           query: 'liquorice root black sweet' },
  'trufa':                       { file: 'truffle',             query: 'truffle mushroom black luxury' },
  'azúcar':                      { file: 'sugar',               query: 'sugar crystals white sweet' },
  'dulce de leche':              { file: 'dulce-de-leche',      query: 'dulce de leche caramel sauce' },
  'leche':                       { file: 'milk',                query: 'milk white creamy glass' },
  'crema':                       { file: 'cream',               query: 'cream dairy white smooth' },
  'mantequilla':                 { file: 'butter',              query: 'butter golden creamy block' },
  'galleta':                     { file: 'cookie',              query: 'cookie biscuit golden baked' },
  'merengue':                    { file: 'meringue',            query: 'meringue white sweet swirl' },
  'malvavisco':                  { file: 'marshmallow',         query: 'marshmallow white fluffy soft' },
  'ron':                         { file: 'rum',                 query: 'rum bottle dark golden' },
  'whisky':                      { file: 'whisky',              query: 'whisky glass amber golden' },
  'brandy':                      { file: 'brandy',              query: 'brandy cognac glass amber' },
  'champán':                     { file: 'champagne',           query: 'champagne bubbles glass celebration' },
  'amaretto':                    { file: 'amaretto',            query: 'amaretto almond liqueur glass' },

  // ── Frutas ────────────────────────────────────────────────
  'manzana':                     { file: 'apple',               query: 'apple red fresh fruit' },
  'manzana verde':               { file: 'apple',               query: 'green apple fresh fruit' },
  'manzana roja':                { file: 'apple',               query: 'apple red fresh fruit' },
  'manzana granny smith':        { file: 'apple',               query: 'green apple granny smith' },
  'pera':                        { file: 'pear',                query: 'pear green yellow fruit' },
  'pera nashi':                  { file: 'pear',                query: 'asian pear nashi fruit' },
  'melocotón':                   { file: 'peach',               query: 'peach fruit fresh juicy' },
  'durazno':                     { file: 'peach',               query: 'peach fruit fresh juicy' },
  'flor de albaricoquero':       { file: 'apricot',             query: 'apricot blossom flower pink' },
  'piña':                        { file: 'pineapple',           query: 'pineapple tropical fresh fruit' },
  'higo':                        { file: 'common-fig',          query: 'fig fruit purple open' },
  'cassis':                      { file: 'blackcurrant',        query: 'blackcurrant berries dark' },
  'casis':                       { file: 'blackcurrant',        query: 'blackcurrant berries dark' },
  'grosella negra':              { file: 'blackcurrant',        query: 'blackcurrant berries dark' },
  'grosellas negras':            { file: 'blackcurrant',        query: 'blackcurrant berries dark' },
  'grosellero negro':            { file: 'blackcurrant',        query: 'blackcurrant berries dark' },
  'brotes de grosella negra':    { file: 'blackcurrant',        query: 'blackcurrant berries dark' },
  'grosella roja':               { file: 'redcurrant',          query: 'redcurrant red berries' },
  'grosella blanca':             { file: 'redcurrant',          query: 'currant white berries' },
  'arándano':                    { file: 'blueberry',           query: 'blueberry fresh berries' },
  'arándano rojo':               { file: 'cranberry',           query: 'cranberry red berries fresh' },
  'frambuesa':                   { file: 'raspberry',           query: 'raspberry red berries fresh' },
  'bayas rojas':                 { file: 'raspberry',           query: 'red berries mix fresh' },
  'frutos rojos':                { file: 'raspberry',           query: 'red berries mix fresh' },
  'frutos del bosque':           { file: 'raspberry',           query: 'wild berries forest mix' },
  'bayas silvestres':            { file: 'juniper-berry',       query: 'wild berries forest' },
  'ciruela':                     { file: 'plum',                query: 'plum purple fruit fresh' },
  'ciruela mirabel':             { file: 'plum',                query: 'mirabelle yellow plum fruit' },
  'cereza':                      { file: 'cherry',              query: 'cherry red fruit fresh' },
  'cereza negra':                { file: 'cherry',              query: 'dark cherry black fruit' },
  'cereza ácida':                { file: 'cherry',              query: 'cherry red fruit fresh' },
  'mermelada de cereza':         { file: 'cherry',              query: 'cherry red fruit fresh' },
  'albaricoque':                 { file: 'apricot',             query: 'apricot orange fruit fresh' },
  'chabacano':                   { file: 'apricot',             query: 'apricot orange fruit fresh' },
  'caqui':                       { file: 'persimmon',           query: 'persimmon orange fruit' },
  'coco':                        { file: 'coconut',             query: 'coconut tropical white flesh' },
  'agua de coco':                { file: 'coconut',             query: 'coconut water tropical fresh' },
  'fresa':                       { file: 'strawberry',          query: 'strawberry red fresh berries' },
  'mermelada de fresa':          { file: 'strawberry',          query: 'strawberry red fresh berries' },
  'mora':                        { file: 'blackberry',          query: 'blackberry dark berries fresh' },
  'zarzamora':                   { file: 'blackberry',          query: 'blackberry dark berries fresh' },
  'granada':                     { file: 'pomegranate',         query: 'pomegranate red fruit open seeds' },
  'lichi':                       { file: 'lychee',              query: 'lychee tropical fruit white' },
  'lichi rojo':                  { file: 'lychee',              query: 'lychee tropical fruit red' },
  'mango':                       { file: 'mango',               query: 'mango tropical yellow orange fruit' },
  'guayaba':                     { file: 'guava',               query: 'guava tropical pink fruit' },
  'maracuyá':                    { file: 'passionfruit',        query: 'passion fruit yellow tropical' },
  'kumquat':                     { file: 'kumquat',             query: 'kumquat small orange fruit' },
  'endrino':                     { file: 'sloe',                query: 'sloe berry dark purple' },
  'nectarina':                   { file: 'nectarine',           query: 'nectarine peach orange fruit' },
  'papaya':                      { file: 'papaya',              query: 'papaya tropical orange fruit' },
  'uva':                         { file: 'grape',               query: 'grape cluster purple green' },
  'melón':                       { file: 'melon',               query: 'melon green yellow fresh fruit' },
  'sandía':                      { file: 'watermelon',          query: 'watermelon red fresh summer' },
  'kiwi':                        { file: 'kiwifruit',           query: 'kiwi fruit green slice' },
  'membrillo':                   { file: 'quince',              query: 'quince yellow fruit autumn' },
  'ruibarbo':                    { file: 'rhubarb',             query: 'rhubarb red stalks fresh' },
  'carambola':                   { file: 'starfruit',           query: 'starfruit carambola yellow' },
  'dátiles':                     { file: 'dates',               query: 'dates fruit brown sweet' },
  'plátano':                     { file: 'banana',              query: 'banana yellow tropical fruit' },
  'pepino':                      { file: 'cucumber',            query: 'cucumber green fresh vegetable' },
  'clementina':                  { file: 'clementine',          query: 'clementine small orange fruit' },

  // ── Verdes & frescos ──────────────────────────────────────
  'menta':                       { file: 'mint',                query: 'mint leaves fresh green herb' },
  'menta fresca':                { file: 'spearmint',           query: 'spearmint fresh green leaves' },
  'romero':                      { file: 'rosemary',            query: 'rosemary herb fresh green branch' },
  'salvia':                      { file: 'salvia-officinalis',  query: 'sage herb green leaves fresh' },
  'salvia esclarea':             { file: 'clary-sage',          query: 'clary sage purple flower herb' },
  'tomillo':                     { file: 'thyme',               query: 'thyme herb fresh green' },
  'albahaca':                    { file: 'basil',               query: 'basil herb green fresh leaves' },
  'cilantro':                    { file: 'coriander',           query: 'coriander cilantro green herb' },
  'hinojo':                      { file: 'fennel',              query: 'fennel green herb fresh' },
  'bayas de enebro':             { file: 'juniper-berry',       query: 'juniper berry blue herb' },
  'enebro':                      { file: 'juniper',             query: 'juniper branch blue berries' },
  'enebro de virginia':          { file: 'juniper',             query: 'juniper branch blue berries' },
  'aloe vera':                   { file: 'aloe-vera',           query: 'aloe vera plant green succulent' },
  'té verde':                    { file: 'green-tea',           query: 'green tea leaves fresh cup' },
  'te verde':                    { file: 'green-tea',           query: 'green tea leaves fresh cup' },
  'té blanco':                   { file: 'white-tea',           query: 'white tea delicate cup steam' },
  'té negro':                    { file: 'black-tea',           query: 'black tea dark cup aromatic' },
  'té lapsang souchong':         { file: 'black-tea',           query: 'black tea smoky dark' },
  'verbena':                     { file: 'verbena',             query: 'verbena purple flower herb' },
  'verbena limonera':            { file: 'lemon-verbena',       query: 'lemon verbena herb fresh leaves' },
  'hoja de laurel':              { file: 'bay-laurel',          query: 'bay laurel leaves green herb' },
  'pino':                        { file: 'pine',                query: 'pine needles green branch' },
  'cactus':                      { file: 'cactus',              query: 'cactus succulent desert green' },

  // ── Abstractos / sintéticos / texturas ───────────────────
  'cuero':                       { file: 'leather',             query: 'leather brown texture luxury' },
  'gamuza':                      { file: 'suede',               query: 'suede leather soft brown texture' },
  'cachemira':                   { file: 'cashmere',            query: 'cashmere wool soft fabric warm' },
  'cashmeran':                   { file: 'cashmere',            query: 'cashmere wool soft fabric warm' },
  'madera de cachemira':         { file: 'cashmere',            query: 'cashmere wool soft fabric warm' },
  'arena':                       { file: 'sand',                query: 'sand beach golden texture close' },
  'tierra':                      { file: 'soil',                query: 'dark soil earth texture close' },
  'carbón':                      { file: 'charcoal',            query: 'charcoal black texture dark' },
  'gota del rocío':              { file: 'dewdrop',             query: 'dew drop water leaf close macro' },
  'hoja de plátano':             { file: 'banana-leaf',         query: 'banana leaf green tropical' },
  'algas':                       { file: 'seaweed',             query: 'seaweed green underwater marine' },
  'algas marinas':               { file: 'seaweed',             query: 'seaweed ocean marine green' },
  'agua de mar':                 { file: 'sea-water',           query: 'sea water blue ocean wave' },
  'notas marinas':               { file: 'sea-water',           query: 'sea water blue ocean wave' },
  'acorde marino':               { file: 'sea-water',           query: 'sea water blue ocean wave' },
  'acordes marinos':             { file: 'sea-water',           query: 'sea water blue ocean wave' },
  'notas acuosas':               { file: 'aquatic',             query: 'water drops aquatic fresh blue' },
  'notas acuáticas':             { file: 'aquatic',             query: 'water drops aquatic fresh blue' },
  'acorde ozónico':              { file: 'ozone',               query: 'fresh air sky clouds blue clean' },
  'notas solares':               { file: 'solar',               query: 'golden sunlight warm sunshine' },
  'notas verdes':                { file: 'green-leaves',        query: 'green leaves nature fresh' },
  'acordes verdes':              { file: 'green-leaves',        query: 'green leaves nature fresh' },
  'notas florales':              { file: 'flowers-bouquet',     query: 'flowers colorful bouquet fragrant' },
  'notas dulces':                { file: 'sweets',              query: 'sweet candy colorful dessert' },
  'notas especiadas':            { file: 'spices-mix',          query: 'spices mix colorful aromatic' },
  'especias':                    { file: 'spices-mix',          query: 'spices mix colorful aromatic' },
  'especias frescas':            { file: 'spices-mix',          query: 'spices herbs fresh aromatic' },
  'notas amaderadas':            { file: 'wood-texture',        query: 'wood texture natural dark grain' },
  'madera':                      { file: 'wood-texture',        query: 'wood texture natural dark grain' },
  'maderas':                     { file: 'wood-texture',        query: 'wood texture natural dark grain' },
  'amaderada':                   { file: 'wood-texture',        query: 'wood texture natural dark grain' },
  'madera seca':                 { file: 'driftwood',           query: 'driftwood beach weathered grey' },
  'madera a la deriva':          { file: 'driftwood',           query: 'driftwood beach weathered grey' },
  'madera blanca':               { file: 'white-wood',          query: 'white wood pale clean texture' },
  'maderas blancas':             { file: 'white-wood',          query: 'white wood pale clean texture' },
  'maderas preciosas':           { file: 'precious-wood',       query: 'precious dark wood luxury texture' },
  'madera de akigala':           { file: 'precious-wood',       query: 'exotic dark wood aromatic' },
  'notas empolvadas':            { file: 'powder',              query: 'powder soft pink pastel texture' },
  'acuerdo polvoroso':           { file: 'powder',              query: 'powder soft pink pastel texture' },
  'notas lácteas':               { file: 'milk-cream',          query: 'milk cream white smooth fresh' },
  'notas afrutadas':             { file: 'fruits-mix',          query: 'fruits colorful mix fresh' },
  'frutas':                      { file: 'fruits-mix',          query: 'fruits colorful mix fresh' },
  'frutas rojas':                { file: 'red-fruits',          query: 'red fruits berries mix fresh' },
  'frutas tropicales':           { file: 'tropical-fruits',     query: 'tropical fruits colorful exotic' },
  'frutas cítricas':             { file: 'citrus-mix',          query: 'citrus fruits mix colorful' },
  'cítricos':                    { file: 'citrus-mix',          query: 'citrus fruits mix colorful' },
  'cítricos suaves':             { file: 'citrus-mix',          query: 'citrus fruits soft fresh' },
  'frutas confitadas':           { file: 'candied-fruits',      query: 'candied fruits colorful sweet' },
  'acuerdo goloso':              { file: 'sweets',              query: 'sweet candy dessert colorful' },
  'acorde dulce gourmand':       { file: 'sweets',              query: 'sweet candy dessert colorful' },
  'dulce':                       { file: 'sweets',              query: 'sweet candy dessert colorful' },
  'amapola roja':                { file: 'red-poppy',           query: 'red poppy flower field' },
  'celosía':                     { file: 'celosia',             query: 'celosia cockscomb red flower' },
  'flor del árbol de la seda':   { file: 'silk-tree',           query: 'silk floss tree pink flower tropical' },
  'aldehídos':                   { file: 'aldehydes',           query: 'vintage perfume bottle glass transparent' },
  'ambroxan':                    { file: 'ambroxan',            query: 'ocean wave sea amber blue' },
  'ambroxán':                    { file: 'ambroxan',            query: 'ocean wave sea amber blue' },
  'amberwood':                   { file: 'amberwood',           query: 'amber resin wood golden warm' },
  'madera de ámbar':             { file: 'amberwood',           query: 'amber resin wood golden warm' },
  'ámbar negro':                 { file: 'dark-amber',          query: 'dark amber resin black glossy' },
  'ámbar seco':                  { file: 'dark-amber',          query: 'amber resin dry golden stone' },
  'iso e super':                 { file: 'cedar',               query: 'cedarwood chips aromatic' },
  'mahonial':                    { file: 'lily',                query: 'lily white flower bloom' },
  'lactonas':                    { file: 'peach-cream',         query: 'peach cream milky soft' },
  'algalia':                     { file: 'civet',               query: 'musk animal nature dark' },
  'cumarina':                    { file: 'coumarin',            query: 'tonka bean hay sweet dried' },
  'abrótano':                    { file: 'southernwood',        query: 'artemisia herb silver green plant' },
  'acorde de manzana y shisha':  { file: 'shisha',              query: 'hookah shisha smoke apple' },
  'orégano':                     { file: 'oregano',             query: 'oregano herb green dried leaves' },
  'pimiento morrón':             { file: 'bell-pepper',         query: 'red bell pepper fresh vegetable' },
  'semillas de apio':            { file: 'celery-seeds',        query: 'celery seeds spice small' },
  'semillas de zanahoria':       { file: 'carrot-seeds',        query: 'carrot seeds small spice' },
  'bizcocho':                    { file: 'sponge-cake',         query: 'sponge cake soft baked golden' },
  'quequito':                    { file: 'cupcake',             query: 'cupcake small sweet decorated' },
  'crema batida':                { file: 'whipped-cream',       query: 'whipped cream white fluffy swirl' },
  'nata montada':                { file: 'whipped-cream',       query: 'whipped cream white fluffy swirl' },
  'crema de pistacho':           { file: 'pistachio',           query: 'pistachio cream green sweet' },
  'crème brûlée':                { file: 'creme-brulee',        query: 'creme brulee dessert caramel' },
  'panacotta':                   { file: 'panna-cotta',         query: 'panna cotta dessert white smooth' },
  'fudge de chocolate':          { file: 'chocolate',           query: 'chocolate fudge dark rich sweet' },
  'chocolate mexicano':          { file: 'chocolate',           query: 'mexican chocolate spiced dark' },
  'chicle':                      { file: 'bubblegum',           query: 'bubblegum pink sweet candy' },
  'mermelada de rosa':           { file: 'rose-jam',            query: 'rose jam pink flower sweet' },
  'sorbete':                     { file: 'sorbet',              query: 'sorbet ice cream colorful fruit' },
  'licor de ciruela':            { file: 'plum-liqueur',        query: 'plum liqueur purple glass dark' },
  'sal':                         { file: 'sea-salt',            query: 'sea salt crystals white texture' },
  'sal de mar':                  { file: 'sea-salt',            query: 'sea salt crystals white texture' },
  'sal marina':                  { file: 'sea-salt',            query: 'sea salt crystals white texture' },
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    const req = https.get({
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: {
        'User-Agent': 'KikiFragancia/1.0',
        ...headers,
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
        return resolve(httpsGet(res.headers.location, headers))
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }))
    })
    req.on('error', reject)
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')) })
  })
}

async function getPexelsImage(query) {
  try {
    const encoded = encodeURIComponent(query)
    const { status, body } = await httpsGet(
      `https://api.pexels.com/v1/search?query=${encoded}&per_page=1&orientation=square`,
      { Authorization: PEXELS_KEY }
    )
    if (status !== 200) return null
    const data = JSON.parse(body.toString())
    return data.photos?.[0]?.src?.medium || null
  } catch { return null }
}

function isRealImage(filePath) {
  if (!fs.existsSync(filePath)) return false
  const size = fs.statSync(filePath).size
  if (size < 8000) return false
  const buf = Buffer.alloc(4)
  const fd = fs.openSync(filePath, 'r')
  fs.readSync(fd, buf, 0, 4, 0)
  fs.closeSync(fd)
  return (buf[0] === 0xFF && buf[1] === 0xD8) ||
         (buf[0] === 0x89 && buf[1] === 0x50) ||
         (buf.toString('ascii', 0, 4) === 'RIFF')
}

async function downloadImage(imageUrl, destPath) {
  return new Promise(resolve => {
    const url = new URL(imageUrl)
    const req = https.get({
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://www.pexels.com/',
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        req.destroy()
        return resolve(downloadImage(res.headers.location, destPath))
      }
      if (res.statusCode !== 200) { res.resume(); return resolve(false) }
      const out = fs.createWriteStream(destPath)
      res.pipe(out)
      out.on('finish', () => { out.close(); resolve(isRealImage(destPath)) })
      out.on('error', () => resolve(false))
    })
    req.on('error', () => resolve(false))
    req.setTimeout(25000, () => { req.destroy(); resolve(false) })
  })
}

async function main() {
  // Agrupar keywords por archivo destino
  const byFile = {}
  for (const [kw, { file, query }] of Object.entries(NOTES_MAP)) {
    if (!byFile[file]) byFile[file] = { query, keywords: [] }
    byFile[file].keywords.push(kw)
  }

  console.log(`\n🔍 Paso 1: Buscando imágenes en Pexels para ${Object.keys(byFile).length} archivos únicos...\n`)

  const queue = []
  for (const [file, { query, keywords }] of Object.entries(byFile)) {
    const destPath = path.join(OUT_DIR, file + '.jpg')
    if (isRealImage(destPath)) {
      process.stdout.write(`  ⏭ ya existe: ${file}.jpg\n`)
      queue.push({ file, imgUrl: null, keywords, exists: true })
      continue
    }
    await sleep(300)
    const imgUrl = await getPexelsImage(query)
    if (imgUrl) {
      process.stdout.write(`  📋 ${keywords[0].padEnd(28)} → ${file}.jpg\n`)
      queue.push({ file, imgUrl, keywords, exists: false })
    } else {
      process.stdout.write(`  ❌ sin resultado: ${keywords[0]}\n`)
      queue.push({ file, imgUrl: null, keywords, exists: false })
    }
  }

  const toDownload = queue.filter(q => q.imgUrl)
  console.log(`\n📦 Paso 2: Descargando ${toDownload.length} imágenes...\n`)

  const mapping = {}
  let downloaded = 0

  for (const item of queue) {
    const destPath = path.join(OUT_DIR, item.file + '.jpg')

    if (item.exists) {
      for (const kw of item.keywords) mapping[kw] = `/notes/${item.file}.jpg`
      continue
    }
    if (!item.imgUrl) continue

    await sleep(500)
    const ok = await downloadImage(item.imgUrl, destPath)

    if (ok) {
      console.log(`  ✅ ${item.keywords[0].padEnd(28)} → ${item.file}.jpg`)
      for (const kw of item.keywords) mapping[kw] = `/notes/${item.file}.jpg`
      downloaded++
    } else {
      console.log(`  ❌ ${item.keywords[0]}`)
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath)
    }
  }

  // Generar mapeo JS ordenado
  const lines = Object.entries(mapping)
    .sort(([a], [b]) => a.localeCompare(b, 'es'))
    .map(([k, v]) => `  '${k}': '${v}',`)
    .join('\n')

  fs.writeFileSync(MAP_FILE,
    `// Auto-generado por scripts/download-notes.mjs — no editar manualmente\nexport const NOTES_IMAGES = {\n${lines}\n}\n`
  )

  console.log(`\n✅ Nuevas: ${downloaded} | Ya existían: ${queue.filter(q => q.exists).length}`)
  console.log(`📄 Actualizado: src/data/notes-images.js\n`)
}

main().catch(console.error)
