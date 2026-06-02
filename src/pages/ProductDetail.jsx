import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCartContext } from '../context/CartContext'
import { products } from '../data/products-enriched'
import { NOTES_IMAGES } from '../data/notes-images'
import { diaDeLPadreIds } from '../data/dia-del-padre'
import Header from '../components/Header'
import Footer from '../components/Footer'

// SVG icons per note family — no emoji, consistent with luxury aesthetic
const NOTE_ICONS = {
  // Cítricos
  bergamota: 'citrus', limón: 'citrus', limon: 'citrus', naranja: 'citrus', mandarina: 'citrus', pomelo: 'citrus',
  // Florales
  rosa: 'floral', jazmín: 'floral', jazmin: 'floral', neroli: 'floral', fresia: 'floral',
  tuberosa: 'floral', iris: 'floral', violeta: 'floral', lavanda: 'floral', ylang: 'floral',
  // Amaderados
  sándalo: 'wood', sandalo: 'wood', cedro: 'wood', oud: 'wood', patchouli: 'wood',
  pachulí: 'wood', pachuli: 'wood', vetiver: 'wood', musgo: 'wood',
  // Especiados
  pimienta: 'spice', cardamomo: 'spice', canela: 'spice', jengibre: 'spice', azafrán: 'spice', azafran: 'spice',
  // Gourmand
  vainilla: 'sweet', caramelo: 'sweet', chocolate: 'sweet', tonka: 'sweet',
  // Balsámicos / resinas
  ámbar: 'resin', ambar: 'resin', incienso: 'resin', benjuí: 'resin', benjui: 'resin',
  mirra: 'resin', resina: 'resin',
  // Frescos
  menta: 'fresh', almizcle: 'fresh',
}

const NOTE_SVG = {
  citrus: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" /><line x1="12" y1="3" x2="12" y2="21" /><path d="M3 12 Q7 8 12 12 Q17 16 21 12" />
    </svg>
  ),
  floral: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2 Q14 7 12 9 Q10 7 12 2" /><path d="M12 15 Q14 17 12 22 Q10 17 12 15" />
      <path d="M2 12 Q7 10 9 12 Q7 14 2 12" /><path d="M15 12 Q17 10 22 12 Q17 14 15 12" />
    </svg>
  ),
  wood: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 2 L12 22" /><path d="M5 6 Q8 9 12 8 Q16 9 19 6" /><path d="M4 13 Q8 16 12 15 Q16 16 20 13" />
    </svg>
  ),
  spice: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9" />
    </svg>
  ),
  sweet: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 2 Q18 2 20 8 Q22 14 17 18 Q14 22 12 22 Q10 22 7 18 Q2 14 4 8 Q6 2 12 2" />
      <path d="M9 10 Q12 14 15 10" />
    </svg>
  ),
  resin: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 3 L20 8 L20 16 L12 21 L4 16 L4 8 Z" /><path d="M12 3 L12 21" /><path d="M4 8 L20 8" />
    </svg>
  ),
  fresh: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 22 Q4 16 4 10 A8 8 0 0 1 20 10 Q20 16 12 22Z" />
    </svg>
  ),
}

function getNoteIcon(nota) {
  const lower = nota.toLowerCase().trim()
  for (const [key, family] of Object.entries(NOTE_ICONS)) {
    if (lower.includes(key)) return NOTE_SVG[family]
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="2" /><line x1="12" y1="2" x2="12" y2="8" /><line x1="12" y1="16" x2="12" y2="22" /><line x1="2" y1="12" x2="8" y2="12" /><line x1="16" y1="12" x2="22" y2="12" />
    </svg>
  )
}

function getNoteImage(nota) {
  const lower = nota.toLowerCase().trim()
  if (NOTES_IMAGES[lower]) return NOTES_IMAGES[lower]
  for (const [key, src] of Object.entries(NOTES_IMAGES)) {
    if (lower.includes(key) || key.includes(lower)) return src
  }
  return null
}

function NoteIcon({ nota, size = 22 }) {
  const img = getNoteImage(nota)
  if (img) {
    return (
      <span style={{
        display: 'inline-flex', width: size, height: size,
        borderRadius: '50%', flexShrink: 0,
        background: 'rgba(201,168,76,0.12)',
        border: '1px solid rgba(201,168,76,0.25)',
        overflow: 'hidden',
      }}>
        <img
          src={img}
          alt={nota}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </span>
    )
  }
  const svgSize = Math.round(size * 0.45)
  return (
    <span style={{
      display: 'inline-flex', width: size, height: size,
      borderRadius: '50%', flexShrink: 0,
      background: 'rgba(201,168,76,0.08)',
      border: '1px solid rgba(201,168,76,0.2)',
      alignItems: 'center', justifyContent: 'center',
      color: 'rgba(201,168,76,0.6)',
    }}>
      {React.cloneElement(getNoteIcon(nota), { width: svgSize, height: svgSize })}
    </span>
  )
}
function parseNotes(str) {
  if (!str) return []
  return str.split(',').map(n => n.trim()).filter(Boolean)
}


const ACORDES_POR_PRODUTO_FALLBACK = [['floral',80],['fresco',70],['especiado',55],['ámbar',45]]
const DEFAULT_CUANDO = { clima:[['Época seca','sun',true],['Lluviosa','rain',true]], momentos:[['Día','sun',true],['Noche','moon',true]] }
const ACORDES_POR_PRODUCTO = {
  1: [["frutal",90],["floral",80],["cítrico",70],["fresco",60]],
  2: [["fresco",90],["cítrico",80],["frutal",70],["amaderado",60]],
  3: [["dulce",95],["avainillado",85],["cálido especiado",75],["frutal",65]],
  4: [["cítrico",90],["frutal",80],["fresco",70],["amaderado",60]],
  5: [["cítrico",90],["fresco",80],["amaderado",70],["ámbar",60]],
  6: [["aromático",90],["marino",80],["amaderado",70],["fresco",60]],
  7: [["oriental",90],["oud",80],["ámbar",70],["floral",60]],
  8: [["dulce",90],["frutal",85],["cítrico",75],["ámbar",65]],
  9: [["dulce",90],["frutal",85],["cítrico",75],["ámbar",65]],
  10: [["dulce",90],["frutal",85],["cítrico",75],["ámbar",65]],
  11: [["floral",90],["powder",80],["dulce",70],["amaderado",60]],
  12: [["acuático",90],["fresco",85],["frutal",75],["cítrico",65]],
  13: [["floral",90],["frutal",80],["dulce",75],["avainillado",65]],
  14: [["floral",90],["frutal",80],["dulce",75],["avainillado",65]],
  15: [["frutal",90],["floral",80],["dulce",75],["avainillado",65]],
  16: [["floral",90],["dulce",80],["ámbar",70],["especiado",60]],
  17: [["fresco",90],["cítrico",80],["aromático",75],["amaderado",65]],
  18: [["floral",90],["verde",80],["powder",70],["amaderado",60]],
  19: [["cítrico",90],["fresco",85],["cálido especiado",75],["amaderado",65]],
  20: [["cítrico",90],["frutal",85],["amaderado",75],["ahumado",60]],
  21: [["frutal",90],["floral",80],["dulce",70],["amaderado",60]],
  22: [["cítrico",90],["frutal",85],["amaderado",75],["fresco",65]],
  23: [["marino",90],["frutal",80],["amaderado",70],["amoscado",60]],
  24: [["frutal",90],["dulce",85],["caramelo",80],["amaderado",70]],
  25: [["cítrico",90],["fresco",85],["amaderado",75],["amoscado",65]],
  26: [["fresco",90],["amaderado",80],["ámbar",75],["aromático",65]],
  27: [["aromático",90],["fresco",80],["amaderado",75],["especiado",65]],
  28: [["floral",90],["cítrico",80],["dulce",75],["avainillado",65]],
  29: [["frutal",90],["fresco",85],["cítrico",75],["amaderado",65]],
  30: [["amaderado",90],["aromático",80],["floral",70],["fresco",60]],
  31: [["cítrico",90],["fresco",85],["aromático",75],["floral",65]],
  32: [["floral",90],["frutal",85],["dulce",75],["avainillado",65]],
  33: [["floral",90],["dulce",85],["frutal",75],["gourmand",65]],
  34: [["oud",90],["amaderado",85],["cálido especiado",75],["aromático",65]],
  35: [["amaderado",90],["fresco",80],["especiado",75],["cítrico",65]],
  36: [["amaderado",90],["aromático",80],["fresco",75],["cítrico",65]],
  37: [["dulce",90],["caramelo",85],["cálido especiado",75],["amaderado",65]],
  38: [["frutal",90],["dulce",85],["caramelo",75],["floral",65]],
  39: [["gourmand",95],["dulce",90],["avainillado",85],["caramelo",75]],
  40: [["gourmand",90],["dulce",85],["avainillado",80],["amaderado",70]],
  41: [["dulce",90],["gourmand",85],["floral",75],["frutal",65]],
  42: [["frutal",95],["dulce",85],["gourmand",75],["avainillado",65]],
  43: [["floral",90],["frutal",80],["dulce",70],["fresco",60]],
  44: [["cítrico",90],["fresco",85],["verde",75],["amaderado",65]],
  45: [["amaderado",90],["cálido especiado",80],["ámbar",75],["cuero",65]],
  46: [["floral",90],["powder",80],["avainillado",75],["dulce",65]],
  47: [["fresco",90],["cítrico",80],["aromático",75],["amaderado",65]],
  48: [["floral",90],["frutal",85],["dulce",75],["fresco",65]],
  49: [["cítrico",90],["fresco",85],["marino",75],["amaderado",65]],
  50: [["floral",90],["dulce",80],["powder",75],["avainillado",65]],
  51: [["amaderado",88],["aromático",72],["cálido especiado",60],["ámbar",50]],
  52: [["floral",85],["frutal",70],["dulce",65],["ámbar",45]],
  53: [["amaderado",80],["aromático",72],["cítrico",65],["verde",48]],
  54: [["gourmand",88],["dulce",78],["avainillado",62],["amoscado",45]],
  55: [["floral",82],["amaderado",68],["powder",58],["dulce",45]],
  56: [["amaderado",85],["aromático",72],["ámbar",62],["floral",45]],
  57: [["amaderado",82],["cítrico",70],["aromático",62],["ámbar",50]],
  58: [["frutal",85],["floral",72],["amaderado",58],["ámbar",45]],
  59: [["floral",82],["frutal",72],["dulce",58],["fresco",45]],
  60: [["floral",78],["dulce",68],["amaderado",58],["ámbar",50]],
  61: [["cítrico",88],["fresco",72],["ámbar",55],["dulce",42]],
  62: [["cítrico",85],["fresco",68],["ámbar",58],["dulce",45]],
  63: [["floral",78],["frutal",68],["aromático",58],["dulce",48]],
  64: [["floral",82],["frutal",68],["dulce",58],["amoscado",45]],
  65: [["amaderado",82],["aromático",72],["floral",58],["verde",45]],
  66: [["floral",78],["frutal",68],["dulce",62],["amoscado",45]],
  67: [["floral",82],["frutal",70],["amaderado",55],["dulce",45]],
  68: [["gourmand",88],["frutal",72],["floral",60],["dulce",50]],
  69: [["floral",78],["amaderado",68],["oriental",58],["dulce",48]],
  70: [["frutal",82],["floral",68],["dulce",58],["ámbar",48]],
  71: [["acuático",85],["cítrico",75],["amaderado",60],["marino",50]],
  72: [["amaderado",85],["oriental",72],["cuero",62],["resinoso",50]],
  73: [["floral",88],["amaderado",65],["powder",55],["amoscado",45]],
  74: [["floral",78],["frutal",68],["amaderado",55],["dulce",45]],
  75: [["gourmand",85],["floral",68],["dulce",62],["ámbar",50]],
  76: [["floral",82],["amaderado",65],["fresco",55],["amoscado",45]],
  77: [["amaderado",80],["oriental",68],["floral",58],["ámbar",50]],
  78: [["oriental",78],["cítrico",68],["ámbar",60],["amoscado",48]],
  79: [["floral",75],["amaderado",70],["fresco",58],["ámbar",48]],
  80: [["floral",85],["amaderado",68],["ámbar",55],["powder",45]],
  81: [["amaderado",78],["floral",68],["fresco",58],["cítrico",45]],
  82: [["floral",78],["frutal",72],["fresco",60],["amoscado",45]],
  83: [["frutal",82],["floral",70],["dulce",58],["amoscado",45]],
  84: [["frutal",82],["floral",70],["dulce",60],["amaderado",48]],
  85: [["amaderado",85],["aromático",68],["terroso",58],["cítrico",45]],
  86: [["aromático",80],["amaderado",70],["frutal",58],["floral",45]],
  87: [["floral",78],["dulce",70],["oriental",60],["amaderado",48]],
  88: [["aromático",85],["fresco",72],["amaderado",62],["cítrico",50]],
  89: [["amaderado",85],["cálido especiado",72],["ámbar",62],["terroso",50]],
  90: [["cítrico",82],["aromático",70],["especiado",58],["gourmand",45]],
  91: [["floral",85],["frutal",68],["powder",55],["dulce",45]],
  92: [["frutal",82],["floral",72],["verde",60],["fresco",48]],
  93: [["frutal",78],["amaderado",68],["floral",58],["aromático",48]],
  94: [["gourmand",88],["especiado",72],["ámbar",60],["amaderado",48]],
  95: [["frutal",78],["dulce",68],["amaderado",58],["floral",48]],
  96: [["frutal",82],["amaderado",68],["fresco",58],["ámbar",48]],
  97: [["frutal",80],["fresco",68],["amaderado",58],["marino",45]],
  98: [["oriental",85],["ámbar",72],["cuero",60],["amoscado",48]],
  99: [["fresco",85],["verde",72],["cítrico",62],["floral",48]],
  100: [["floral",80],["frutal",72],["fresco",58],["amaderado",45]],
  101: [["floral",90],["amaderado",80],["terroso",60],["resinoso",45]],
  102: [["amaderado",90],["cálido especiado",75],["especiado",60],["amoscado",45]],
  103: [["amaderado",90],["verde",70],["aromático",60],["amoscado",45]],
  104: [["amaderado",85],["cítrico",75],["aromático",65],["fresco",50]],
  105: [["floral",90],["cítrico",70],["avainillado",60],["dulce",50]],
  106: [["avainillado",85],["dulce",75],["aromático",65],["cálido especiado",50]],
  107: [["floral",95],["powder",70],["amaderado",55],["fresco",40]],
  108: [["floral",95],["fresco",70],["amaderado",50],["amoscado",40]],
  109: [["floral",85],["frutal",75],["terroso",60],["dulce",45]],
  110: [["floral",90],["frutal",80],["cítrico",65],["fresco",50]],
  111: [["floral",85],["frutal",75],["avainillado",60],["dulce",45]],
  112: [["floral",85],["acuático",70],["marino",60],["powder",45]],
  113: [["frutal",90],["floral",75],["dulce",60],["avainillado",45]],
  114: [["frutal",90],["cítrico",75],["floral",60],["dulce",45]],
  115: [["frutal",85],["floral",75],["cítrico",60],["amoscado",45]],
  116: [["floral",90],["amoscado",75],["powder",60],["amaderado",45]],
  117: [["floral",90],["fresco",75],["amoscado",60],["amaderado",45]],
  118: [["floral",85],["powder",75],["avainillado",65],["amoscado",50]],
  119: [["floral",85],["frutal",70],["dulce",55],["amoscado",40]],
  120: [["cítrico",80],["cálido especiado",70],["amaderado",60],["oriental",50]],
  121: [["amaderado",85],["ámbar",75],["dulce",65],["frutal",50]],
  122: [["amaderado",85],["ámbar",75],["floral",60],["especiado",45]],
  123: [["frutal",90],["dulce",75],["floral",60],["amoscado",45]],
  124: [["dulce",85],["frutal",75],["gourmand",65],["floral",50]],
  125: [["dulce",85],["avainillado",75],["frutal",65],["floral",50]],
  126: [["frutal",85],["dulce",75],["floral",65],["avainillado",50]],
  127: [["floral",80],["frutal",70],["amaderado",60],["dulce",45]],
  128: [["avainillado",90],["powder",75],["floral",60],["amoscado",45]],
  129: [["acuático",90],["marino",80],["amaderado",70],["fresco",55]],
  130: [["aromático",85],["amaderado",70],["dulce",55],["fresco",40]],
  131: [["cítrico",85],["frutal",75],["floral",65],["fresco",50]],
  132: [["floral",85],["frutal",75],["dulce",60],["amaderado",45]],
  133: [["frutal",85],["dulce",75],["floral",65],["amaderado",50]],
  134: [["frutal",90],["floral",75],["cítrico",60],["cuero",45]],
  135: [["cuero",85],["amaderado",75],["oud",65],["cálido especiado",50]],
  136: [["cítrico",85],["frutal",75],["amoscado",60],["dulce",45]],
  137: [["dulce",85],["caramelo",75],["ámbar",65],["cítrico",50]],
  138: [["dulce",85],["frutal",75],["caramelo",60],["floral",45]],
  139: [["dulce",85],["avainillado",75],["floral",60],["cítrico",45]],
  140: [["cítrico",90],["fresco",75],["frutal",60],["amoscado",45]],
  141: [["cálido especiado",90],["ámbar",80],["amaderado",65],["oriental",50]],
  142: [["gourmand",90],["avainillado",80],["dulce",65],["ámbar",50]],
  143: [["amaderado",85],["cálido especiado",75],["ahumado",60],["ámbar",45]],
  144: [["aromático",85],["avainillado",70],["fresco",55],["acuático",40]],
  145: [["floral",90],["fresco",75],["avainillado",60],["ámbar",45]],
  146: [["marino",95],["acuático",85],["cítrico",65],["amaderado",50]],
  147: [["floral",90],["oud",80],["amaderado",65],["ámbar",50]],
  148: [["dulce",90],["frutal",80],["gourmand",70],["avainillado",55]],
  149: [["dulce",90],["gourmand",75],["avainillado",60],["floral",45]],
  150: [["oud",95],["amaderado",85],["cálido especiado",70],["terroso",50]],
  151: [["frutal",90],["dulce",75],["floral",60],["terroso",45]],
  152: [["dulce",95],["frutal",85],["gourmand",75],["avainillado",60]],
  153: [["gourmand",95],["dulce",85],["caramelo",70],["avainillado",55]],
  154: [["amaderado",80],["cítrico",70],["acuático",60],["aromático",45]],
  155: [["gourmand",95],["dulce",85],["avainillado",70],["powder",45]],
  156: [["dulce",95],["caramelo",85],["gourmand",75],["avainillado",60]],
  157: [["gourmand",95],["dulce",85],["caramelo",70],["avainillado",55]],
  158: [["gourmand",95],["dulce",85],["avainillado",70],["amoscado",45]],
  159: [["amaderado",85],["cítrico",75],["aromático",65],["fresco",50]],
  160: [["ámbar",90],["oud",80],["amaderado",65],["oriental",50]],
  161: [["fresco",85],["aromático",75],["frutal",65],["amaderado",50]],
  162: [["floral",80],["frutal",70],["cuero",60],["ámbar",45]],
  163: [["amaderado",80],["fresco",70],["cítrico",60],["ahumado",45]],
  164: [["floral",95],["frutal",75],["amoscado",55],["dulce",40]],
  165: [["frutal",90],["floral",75],["dulce",60],["cítrico",45]],
  166: [["cítrico",85],["frutal",70],["amaderado",60],["dulce",45]],
  167: [["amaderado",85],["aromático",75],["ámbar",60],["fresco",45]],
  168: [["frutal",90],["dulce",75],["caramelo",60],["floral",45]],
  169: [["oriental",85],["cálido especiado",75],["avainillado",60],["amaderado",45]],
  170: [["cuero",90],["oud",80],["caramelo",65],["dulce",50]],
  171: [["frutal",90],["cítrico",75],["amaderado",60],["dulce",45]],
  172: [["dulce",95],["gourmand",85],["oriental",70],["cálido especiado",55]],
  173: [["oriental",90],["ahumado",75],["cálido especiado",60],["dulce",45]],
  174: [["gourmand",95],["dulce",85],["cálido especiado",70],["avainillado",55]],
  175: [["dulce",85],["frutal",75],["floral",60],["amaderado",45]],
  176: [["dulce",90],["frutal",70],["caramelo",60],["oriental",45]],
  177: [["frutal",95],["dulce",85],["gourmand",70],["avainillado",55]],
  178: [["fresco",85],["frutal",75],["floral",65],["acuático",50]],
  179: [["amaderado",90],["aromático",75],["cítrico",60],["ámbar",45]],
  180: [["frutal",85],["cítrico",75],["fresco",60],["amaderado",45]],
  181: [["fresco",85],["frutal",75],["marino",60],["acuático",45]],
  182: [["dulce",95],["avainillado",85],["gourmand",70],["frutal",55]],
  183: [["dulce",85],["frutal",75],["amaderado",60],["gourmand",45]],
  184: [["frutal",95],["dulce",80],["amaderado",65],["oud",50]],
  185: [["frutal",90],["dulce",75],["floral",60],["avainillado",45]],
  186: [["oriental",85],["dulce",75],["cálido especiado",65],["caramelo",50]],
  187: [["amaderado",90],["oud",80],["aromático",65],["terroso",45]],
  188: [["frutal",90],["dulce",80],["gourmand",65],["floral",50]],
  189: [["frutal",85],["floral",75],["dulce",60],["avainillado",45]],
  190: [["frutal",85],["cítrico",75],["avainillado",60],["aromático",45]],
  191: [["floral",85],["dulce",75],["caramelo",60],["cálido especiado",45]],
  192: [["amaderado",85],["aromático",75],["cuero",60],["cítrico",45]],
  193: [["dulce",90],["caramelo",80],["floral",65],["cuero",50]],
  194: [["ámbar",85],["cálido especiado",75],["cítrico",60],["oriental",45]],
  195: [["oriental",85],["aromático",75],["avainillado",60],["fresco",45]],
  196: [["dulce",85],["frutal",75],["floral",65],["avainillado",50]],
  197: [["floral",85],["frutal",75],["ahumado",60],["ámbar",45]],
  198: [["amaderado",85],["aromático",75],["frutal",60],["oud",45]],
  199: [["floral",90],["avainillado",75],["amoscado",60],["dulce",45]],
  200: [["dulce",95],["frutal",85],["caramelo",70],["floral",55]],
  201: [["dulce",90],["frutal",85],["gourmand",80],["caramelo",75]],
  202: [["dulce",90],["frutal",80],["powder",75],["avainillado",70]],
  203: [["floral",85],["dulce",80],["frutal",75],["ámbar",65]],
  204: [["cítrico",90],["fresco",85],["aromático",75],["amaderado",65]],
  205: [["amaderado",85],["cálido especiado",80],["ámbar",75],["fresco",60]],
  206: [["aromático",90],["fresco",80],["especiado",75],["amaderado",70]],
  207: [["oriental",85],["oud",80],["cálido especiado",75],["ámbar",70]],
  208: [["dulce",90],["avainillado",85],["gourmand",80],["ámbar",70]],
  209: [["cítrico",90],["frutal",80],["fresco",75],["amoscado",65]],
  210: [["floral",85],["powder",80],["dulce",75],["fresco",65]],
  211: [["marino",90],["acuático",85],["fresco",80],["cítrico",70]],
  212: [["amaderado",85],["cuero",80],["ahumado",75],["cálido especiado",65]],
  213: [["frutal",90],["dulce",85],["fresco",75],["floral",70]],
  214: [["fresco",90],["verde",80],["herbal",75],["cítrico",70]],
  215: [["floral",85],["frutal",80],["amoscado",75],["dulce",65]],
  216: [["cálido especiado",90],["ámbar",85],["amaderado",75],["resinoso",65]],
  217: [["cítrico",90],["fresco",85],["amaderado",75],["aromático",70]],
  218: [["dulce",95],["caramelo",85],["avainillado",80],["gourmand",75]],
  219: [["floral",90],["dulce",80],["powder",75],["ámbar",65]],
  220: [["chipre",85],["terroso",80],["amaderado",75],["fresco",65]],
  221: [["frutal",90],["cítrico",85],["dulce",75],["fresco",70]],
  222: [["amaderado",90],["aromático",80],["fresco",75],["especiado",65]],
  223: [["floral",85],["avainillado",80],["dulce",75],["amoscado",65]],
  224: [["cítrico",90],["fresco",80],["marino",75],["amaderado",65]],
  225: [["dulce",90],["frutal",85],["floral",75],["avainillado",70]],
  226: [["cálido especiado",85],["tabaco",80],["ámbar",75],["dulce",70]],
  227: [["fresco",90],["aromático",85],["cítrico",75],["amaderado",65]],
  228: [["floral",90],["frutal",80],["fresco",75],["amoscado",65]],
  229: [["oud",90],["amaderado",85],["oriental",75],["ahumado",70]],
  230: [["dulce",90],["avainillado",85],["cálido especiado",75],["ámbar",70]],
  231: [["frutal",82],["acuático",68],["especiado",58],["ámbar",48]],
  232: [["cítrico",85],["aromático",68],["especiado",58],["fresco",45]],
  233: [["floral",78],["resinoso",65],["frutal",58],["ámbar",48]],
  234: [["frutal",80],["cítrico",68],["ámbar",58],["aromático",45]],
  235: [["floral",80],["oud",68],["ámbar",58],["amoscado",45]],
  236: [["cítrico",85],["fresco",72],["amoscado",55],["ámbar",42]],
  237: [["floral",78],["frutal",68],["dulce",62],["amoscado",45]],
  238: [["cítrico",80],["aromático",70],["dulce",58],["fresco",45]],
  239: [["floral",78],["frutal",65],["ámbar",58],["cuero",48]],
  240: [["floral",85],["powder",68],["frutal",55],["amoscado",45]],
  241: [["floral",78],["cuero",68],["amaderado",58],["dulce",45]],
  242: [["floral",82],["amaderado",68],["dulce",58],["amoscado",45]],
  243: [["floral",82],["aromático",68],["dulce",58],["verde",45]],
  244: [["floral",78],["dulce",72],["ámbar",65],["resinoso",48]],
  245: [["frutal",80],["floral",72],["amaderado",58],["dulce",48]],
  246: [["frutal",82],["floral",72],["amaderado",55],["dulce",45]],
  247: [["amaderado",85],["aromático",72],["especiado",60],["terroso",48]],
  248: [["gourmand",88],["dulce",78],["caramelo",68],["amoscado",50]],
  249: [["aromático",80],["cítrico",72],["amaderado",60],["verde",48]],
  250: [["frutal",82],["amaderado",72],["fresco",60],["ámbar",50]],
  251: [["floral",75],["aromático",70],["amaderado",60],["especiado",48]],
  252: [["amaderado",82],["oriental",70],["especiado",62],["ámbar",50]],
  253: [["amaderado",82],["aromático",72],["terroso",58],["especiado",45]],
  254: [["amaderado",82],["oud",68],["aromático",62],["especiado",50]],
  255: [["fresco",82],["amaderado",70],["cítrico",60],["ámbar",48]],
  256: [["fresco",80],["amaderado",70],["especiado",58],["ámbar",48]],
  257: [["floral",82],["amaderado",70],["oriental",58],["dulce",48]],
  258: [["oud",82],["oriental",72],["ámbar",62],["especiado",50]],
  259: [["aromático",82],["amaderado",72],["cuero",60],["ámbar",48]],
  260: [["powder",82],["floral",72],["dulce",62],["amoscado",50]],
  261: [["floral",80],["powder",70],["dulce",62],["amaderado",50]],
  262: [["frutal",82],["floral",72],["dulce",62],["amoscado",48]],
  263: [["amaderado",82],["frutal",68],["aromático",60],["especiado",45]],
  264: [["aromático",82],["cítrico",72],["amaderado",60],["floral",48]],
  265: [["aromático",80],["cítrico",70],["amaderado",62],["fresco",48]],
  266: [["aromático",78],["amaderado",68],["especiado",62],["cítrico",48]],
  267: [["frutal",82],["floral",70],["dulce",60],["amoscado",48]],
  268: [["floral",85],["dulce",65],["amoscado",55],["cítrico",45]],
  269: [["floral",80],["frutal",68],["amaderado",58],["dulce",48]],
  270: [["floral",85],["amaderado",68],["amoscado",58],["cítrico",45]],
  271: [["cítrico",80],["aromático",72],["amaderado",62],["fresco",48]],
  272: [["aromático",82],["amaderado",72],["dulce",58],["terroso",45]],
  273: [["amaderado",82],["cítrico",70],["ámbar",62],["aromático",48]],
  274: [["floral",82],["frutal",72],["powder",58],["dulce",45]],
  275: [["dulce",88],["frutal",72],["floral",60],["amoscado",48]],
  276: [["especiado",82],["amaderado",72],["oriental",60],["resinoso",48]],
  277: [["floral",88],["ámbar",65],["amaderado",58],["oriental",45]],
  278: [["floral",82],["amaderado",70],["cítrico",58],["ámbar",48]],
  279: [["oriental",82],["amaderado",72],["ámbar",62],["dulce",50]],
  280: [["especiado",78],["cítrico",68],["cuero",62],["ámbar",52]],
  281: [["floral",82],["frutal",70],["amaderado",60],["fresco",48]],
  282: [["floral",78],["amaderado",68],["cuero",60],["especiado",45]],
  283: [["floral",82],["fresco",70],["aromático",60],["amoscado",48]],
  284: [["cítrico",85],["fresco",72],["amaderado",58],["aromático",45]],
  285: [["cítrico",78],["aromático",70],["amaderado",62],["especiado",48]],
  286: [["amaderado",88],["cuero",72],["ámbar",62],["terroso",50]],
  287: [["aromático",82],["amaderado",70],["floral",58],["fresco",45]],
  288: [["cuero",78],["amaderado",68],["especiado",62],["resinoso",48]],
  289: [["cítrico",85],["floral",70],["amaderado",58],["amoscado",45]],
  290: [["floral",82],["oriental",72],["oud",62],["ámbar",50]],
  291: [["especiado",82],["amaderado",70],["oriental",60],["aromático",48]],
  292: [["floral",82],["frutal",72],["powder",60],["dulce",48]],
  293: [["floral",80],["frutal",70],["dulce",62],["amoscado",50]],
  294: [["cítrico",78],["amaderado",70],["especiado",60],["aromático",48]],
  295: [["fresco",82],["cítrico",72],["aromático",62],["amaderado",48]],
  296: [["amaderado",78],["oud",68],["aromático",62],["ámbar",52]],
  297: [["aromático",78],["amaderado",68],["especiado",62],["cítrico",48]],
  298: [["frutal",90],["fresco",85],["gourmand",75],["amaderado",65]],
  299: [["cálido especiado",90],["amaderado",80],["ámbar",75],["cítrico",65]],
  300: [["cítrico",80],["fresco",70],["amaderado",62],["ámbar",48]],
  301: [["cítrico",90],["fresco",85],["aromático",75],["amaderado",65]],
  302: [["fresco",90],["marino",85],["aromático",70],["amaderado",60]],
  303: [["amaderado",90],["cálido especiado",80],["fresco",75],["cítrico",65]],
  304: [["dulce",95],["avainillado",85],["gourmand",75],["ámbar",65]],
  305: [["floral",90],["frutal",85],["dulce",75],["avainillado",65]],
  306: [["cítrico",95],["fresco",85],["verde",75],["amoscado",60]],
  307: [["aromático",90],["fresco",80],["amaderado",75],["especiado",65]],
  308: [["oriental",85],["oud",80],["ámbar",75],["cálido especiado",70]],
  309: [["frutal",90],["dulce",85],["floral",75],["fresco",65]],
  310: [["floral",90],["powder",80],["amoscado",75],["fresco",65]],
  311: [["cuero",90],["amaderado",85],["ahumado",75],["cálido especiado",65]],
  312: [["marino",95],["acuático",85],["cítrico",75],["fresco",70]],
  313: [["dulce",90],["caramelo",85],["avainillado",80],["gourmand",75]],
  314: [["fresco",90],["aromático",85],["cítrico",75],["amaderado",65]],
  315: [["floral",85],["frutal",80],["dulce",75],["ámbar",65]],
  316: [["cálido especiado",90],["amaderado",80],["ámbar",75],["tabaco",70]],
  317: [["cítrico",90],["frutal",85],["fresco",75],["amaderado",65]],
  318: [["floral",90],["dulce",80],["avainillado",75],["powder",65]],
  319: [["chipre",85],["terroso",80],["amaderado",75],["fresco",65]],
  320: [["frutal",95],["dulce",85],["gourmand",70],["avainillado",65]],
  321: [["amaderado",90],["aromático",80],["fresco",75],["cítrico",65]],
  322: [["floral",90],["frutal",80],["fresco",75],["amoscado",65]],
  323: [["oriental",85],["ámbar",80],["cálido especiado",75],["amaderado",70]],
  324: [["cítrico",90],["fresco",85],["marino",75],["amaderado",65]],
  325: [["dulce",90],["avainillado",85],["frutal",75],["ámbar",65]],
  326: [["aromático",90],["fresco",85],["especiado",75],["amaderado",65]],
  327: [["floral",85],["powder",80],["dulce",75],["avainillado",70]],
  328: [["frutal",90],["cítrico",85],["fresco",75],["dulce",65]],
  329: [["oud",90],["amaderado",85],["cálido especiado",75],["ahumado",65]],
  330: [["gourmand",95],["dulce",90],["avainillado",85],["caramelo",75]],
  331: [["fresco",90],["verde",80],["herbal",75],["cítrico",70]],
  332: [["floral",90],["dulce",85],["frutal",75],["gourmand",65]],
  333: [["amaderado",85],["cálido especiado",80],["ámbar",75],["cuero",70]],
  334: [["cítrico",90],["fresco",85],["aromático",75],["amoscado",65]],
  335: [["dulce",90],["frutal",85],["ámbar",75],["avainillado",70]],
  336: [["dulce",88],["caramelo",78],["floral",62],["amoscado",48]],
  337: [["aromático",82],["fresco",72],["amaderado",60],["cítrico",45]],
  338: [["fresco",82],["aromático",72],["cítrico",60],["amaderado",45]],
  339: [["acuático",82],["fresco",72],["cítrico",62],["amaderado",48]],
  340: [["aromático",80],["cítrico",70],["amaderado",62],["fresco",45]],
  341: [["fresco",82],["floral",70],["cítrico",62],["amoscado",48]],
  342: [["fresco",82],["floral",70],["cítrico",62],["amoscado",48]],
  343: [["fresco",80],["floral",70],["cítrico",60],["amaderado",50]],
  344: [["fresco",80],["floral",70],["cítrico",60],["amaderado",50]],
  345: [["oud",82],["especiado",70],["amaderado",62],["cuero",52]],
  346: [["cítrico",82],["aromático",70],["amaderado",60],["fresco",48]],
  347: [["fresco",82],["acuático",70],["aromático",62],["amaderado",48]],
  348: [["fresco",82],["cítrico",70],["aromático",62],["amaderado",48]],
  349: [["especiado",78],["cítrico",70],["aromático",62],["amaderado",50]],
  350: [["aromático",82],["amaderado",70],["cítrico",62],["fresco",48]],
  351: [["acuático",82],["cítrico",72],["amaderado",60],["fresco",50]],
  352: [["acuático",82],["cítrico",72],["amaderado",60],["fresco",50]],
  353: [["cítrico",80],["amaderado",70],["aromático",62],["fresco",48]],
  354: [["acuático",85],["fresco",75],["aromático",60],["amaderado",45]],
  355: [["amaderado",80],["aromático",68],["cítrico",60],["cuero",48]],
  356: [["oriental",78],["amaderado",70],["aromático",60],["ámbar",50]],
  357: [["amaderado",82],["oud",70],["aromático",62],["ámbar",50]],
  358: [["aromático",80],["cítrico",70],["amaderado",62],["fresco",48]],
  359: [["amaderado",80],["especiado",68],["cítrico",60],["ámbar",50]],
  360: [["fresco",80],["aromático",70],["cítrico",60],["amaderado",48]],
  361: [["fresco",82],["cítrico",72],["aromático",60],["amaderado",45]],
  362: [["amaderado",82],["cuero",70],["terroso",62],["ámbar",50]],
  363: [["cítrico",80],["aromático",70],["amaderado",62],["fresco",48]],
  364: [["amaderado",82],["especiado",70],["oud",60],["cítrico",50]],
  365: [["fresco",85],["acuático",72],["cítrico",62],["amaderado",48]],
  366: [["cítrico",80],["aromático",70],["amaderado",60],["fresco",48]],
  367: [["amaderado",80],["aromático",70],["especiado",62],["ámbar",50]],
  368: [["acuático",85],["fresco",75],["verde",60],["amaderado",45]],
  369: [["fresco",85],["acuático",72],["cítrico",62],["aromático",48]],
  370: [["amaderado",85],["cuero",70],["especiado",58],["ámbar",48]],
  371: [["amaderado",80],["aromático",70],["cítrico",62],["floral",48]],
  372: [["amaderado",82],["cuero",70],["resinoso",60],["especiado",48]],
  373: [["fresco",82],["aromático",72],["cítrico",60],["amaderado",45]],
  374: [["cítrico",82],["aromático",70],["amaderado",60],["fresco",48]],
  375: [["amaderado",80],["aromático",68],["cítrico",60],["cuero",48]],
  376: [["amaderado",82],["cuero",70],["cítrico",60],["ámbar",50]],
  377: [["amaderado",82],["cítrico",70],["cuero",60],["aromático",48]],
  378: [["amaderado",82],["cítrico",70],["cuero",60],["aromático",48]],
  379: [["verde",82],["fresco",72],["aromático",62],["herbal",50]],
  380: [["amaderado",80],["especiado",70],["cuero",62],["cítrico",48]],
  381: [["especiado",78],["amaderado",68],["resinoso",62],["cítrico",48]],
  382: [["cítrico",82],["aromático",70],["fresco",62],["amaderado",45]],
  383: [["acuático",85],["fresco",75],["verde",60],["amaderado",45]],
  384: [["fresco",80],["aromático",70],["amaderado",62],["especiado",48]],
  385: [["aromático",82],["cítrico",70],["amaderado",62],["fresco",48]],
  386: [["aromático",82],["cítrico",70],["amaderado",60],["floral",48]],
  387: [["amaderado",82],["aromático",70],["terroso",60],["especiado",48]],
  388: [["oriental",78],["amaderado",70],["aromático",60],["ámbar",50]],
  389: [["fresco",82],["aromático",72],["cítrico",60],["amaderado",45]],
  390: [["aromático",80],["cítrico",70],["amaderado",62],["fresco",48]],
  391: [["fresco",80],["cítrico",72],["aromático",62],["amaderado",48]],
  392: [["amaderado",78],["especiado",68],["cuero",62],["cítrico",48]],
  393: [["cítrico",82],["aromático",70],["amaderado",60],["fresco",48]],
  394: [["aromático",78],["especiado",70],["amaderado",62],["cuero",48]],
  395: [["amaderado",80],["aromático",72],["floral",58],["terroso",48]],
  396: [["acuático",82],["fresco",72],["cítrico",62],["amaderado",45]],
  397: [["acuático",85],["fresco",75],["aromático",60],["verde",45]],
  398: [["amaderado",82],["oud",70],["aromático",62],["terroso",48]],
  399: [["acuático",80],["fresco",72],["aromático",62],["amaderado",48]],
  400: [["fresco",82],["cítrico",72],["aromático",62],["amaderado",45]],
  401: [["cítrico",90],["fresco",85],["marino",75],["amaderado",65]],
  402: [["aromático",90],["fresco",85],["cítrico",75],["amaderado",65]],
  403: [["aromático",90],["fresco especiado",80],["cítrico",75],["ahumado",65]],
  404: [["dulce",95],["cálido especiado",90],["avainillado",85],["floral",75]],
  405: [["aromático",90],["fresco especiado",85],["cítrico",75],["amaderado",65]],
  406: [["amaderado",90],["aromático",85],["cítrico",75],["fresco especiado",70]],
  407: [["cítrico",95],["fresco",90],["verde",80],["aromático",75]],
  408: [["fresco",90],["cítrico",85],["aromático",75],["verde",65]],
  409: [["cítrico",90],["fresco",85],["aromático",80],["amaderado",70]],
  410: [["aromático",90],["fresco",85],["cítrico",75],["amaderado",65]],
  411: [["cítrico",90],["fresco",85],["aromático",75],["verde",70]],
  412: [["amaderado",90],["aromático",85],["fresco especiado",75],["cuero",70]],
  413: [["marino",95],["cítrico",85],["fresco",80],["amaderado",65]],
  414: [["fresco",90],["cítrico",85],["aromático",75],["verde",65]],
  415: [["aromático",90],["fresco especiado",85],["amaderado",75],["atalcado",65]],
  416: [["amaderado",90],["aromático",85],["terroso",80],["musgo",75]],
  417: [["frutal",95],["dulce",90],["floral",80],["amoscado",70]],
  418: [["dulce",95],["gourmand",90],["lactónico",85],["avainillado",80]],
  419: [["dulce",95],["coco",90],["gourmand",85],["avainillado",80]],
  420: [["cítrico",90],["dulce",85],["gourmand",80],["avainillado",75]],
  421: [["frutal",90],["cálido especiado",85],["amaderado",80],["cuero",75]],
  422: [["dulce",95],["frutal",90],["gourmand",85],["floral",75]],
  423: [["frutal",90],["dulce",85],["floral",80],["fresco",70]],
  424: [["cítrico",85],["coco",80],["ámbar",75],["amaderado",70]],
  425: [["oriental",90],["oud",85],["rosa",80],["cálido especiado",75]],
  426: [["frutal",90],["amaderado",85],["pachulí",80],["floral",75]],
  427: [["rosa",90],["pachulí",85],["cálido especiado",80],["oud",75]],
  428: [["dulce",95],["gourmand",90],["avainillado",85],["frutal",80]],
  429: [["floral blanco",90],["frutal",85],["cítrico",80],["marino",70]],
  430: [["frutal",90],["dulce",85],["avainillado",80],["amaderado",75]],
  431: [["frutal",90],["dulce",85],["floral",80],["fresco",75]],
  432: [["cítrico",90],["floral",80],["atalcado",75],["amaderado",70]],
  433: [["floral",90],["cítrico",85],["amaderado",75],["terroso",70]],
  434: [["floral",95],["cítrico",90],["fresco",85],["verde",75]],
  435: [["cítrico",95],["fresco",90],["floral blanco",80],["amoscado",70]],
  436: [["frutal",90],["rosa",85],["dulce",80],["floral",75]],
  437: [["floral",90],["atalcado",85],["frutal",75],["verde",70]],
  438: [["cítrico",90],["verde",85],["floral",80],["amaderado",75]],
  439: [["floral",95],["floral blanco",90],["atalcado",80],["cítrico",75]],
  440: [["floral",95],["dulce",90],["miel",85],["floral blanco",80]],
  441: [["aromático",90],["frutal",85],["floral",80],["herbal",75]],
  442: [["frutal",90],["dulce",85],["floral",80],["fresco",75]]
}

const CUANDO_POR_PRODUCTO = {
  1: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  2: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  3: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  4: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  5: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  6: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  7: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  8: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  9: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  10: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  11: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  12: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  13: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  14: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  15: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  16: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  17: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  18: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  19: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  20: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  21: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  22: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  23: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  24: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  25: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  26: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  27: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  28: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  29: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  30: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  31: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  32: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  33: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  34: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  35: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  36: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  37: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  38: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  39: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  40: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  41: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  42: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  43: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  44: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  45: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  46: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  47: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  48: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  49: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  50: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  51: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  52: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  53: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  54: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  55: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  56: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  57: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  58: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  59: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  60: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  61: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  62: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  63: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  64: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  65: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  66: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  67: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  68: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  69: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  70: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  71: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  72: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  73: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  74: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  75: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  76: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  77: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  78: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  79: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  80: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  81: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  82: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  83: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  84: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  85: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  86: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  87: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  88: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  89: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  90: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  91: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  92: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  93: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  94: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  95: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  96: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  97: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  98: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  99: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  100: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  101: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  102: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  103: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  104: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  105: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  106: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  107: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  108: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  109: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  110: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  111: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  112: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  113: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  114: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  115: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  116: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  117: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  118: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  119: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  120: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  121: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  122: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  123: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  124: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  125: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  126: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  127: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  128: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  129: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  130: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  131: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  132: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  133: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  134: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  135: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  136: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  137: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  138: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  139: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  140: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  141: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  142: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  143: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  144: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  145: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  146: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  147: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  148: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  149: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  150: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  151: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  152: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  153: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  154: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  155: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  156: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  157: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  158: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  159: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  160: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  161: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  162: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  163: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  164: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  165: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  166: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  167: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  168: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  169: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  170: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  171: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  172: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  173: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  174: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  175: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  176: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  177: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  178: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  179: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  180: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  181: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  182: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  183: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  184: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  185: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  186: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  187: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  188: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  189: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  190: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  191: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  192: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  193: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  194: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  195: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  196: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  197: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  198: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  199: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  200: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  201: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  202: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  203: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  204: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  205: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  206: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  207: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  208: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  209: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  210: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  211: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  212: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  213: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  214: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  215: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  216: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  217: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  218: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  219: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  220: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  221: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  222: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  223: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  224: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  225: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  226: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  227: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  228: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  229: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  230: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  231: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  232: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  233: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  234: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  235: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  236: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  237: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  238: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  239: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  240: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  241: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  242: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  243: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  244: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  245: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  246: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  247: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  248: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  249: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  250: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  251: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  252: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  253: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  254: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  255: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  256: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  257: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  258: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  259: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  260: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  261: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  262: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  263: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  264: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  265: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  266: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  267: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  268: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  269: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  270: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  271: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  272: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  273: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  274: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  275: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  276: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  277: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  278: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  279: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  280: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  281: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  282: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  283: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  284: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  285: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  286: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  287: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  288: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  289: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  290: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  291: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  292: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  293: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  294: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  295: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  296: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  297: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  298: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  299: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  300: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  301: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  302: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  303: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  304: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  305: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  306: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  307: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  308: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  309: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  310: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  311: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  312: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  313: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  314: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  315: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  316: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  317: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  318: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  319: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  320: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  321: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  322: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  323: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  324: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  325: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  326: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  327: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  328: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  329: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  330: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  331: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  332: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  333: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  334: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  335: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  336: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  337: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  338: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  339: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  340: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  341: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  342: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  343: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  344: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  345: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  346: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  347: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  348: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  349: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  350: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  351: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  352: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  353: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  354: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  355: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  356: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  357: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  358: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  359: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  360: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  361: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  362: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  363: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  364: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  365: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  366: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  367: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  368: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  369: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  370: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  371: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  372: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  373: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  374: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  375: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  376: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  377: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  378: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  379: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  380: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  381: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  382: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  383: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  384: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  385: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  386: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  387: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  388: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  389: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  390: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  391: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  392: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  393: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  394: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  395: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  396: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  397: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  398: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  399: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  400: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  401: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  402: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  403: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  404: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  405: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  406: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  407: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  408: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  409: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  410: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  411: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  412: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  413: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  414: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  415: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  416: { clima: [["Época seca","sun",true],["Lluviosa","rain",true]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  417: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  418: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  419: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  420: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  421: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  422: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  423: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  424: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  425: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  426: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",true]] },
  427: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  428: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  429: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  430: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  431: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  432: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  433: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  434: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  435: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  436: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  437: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  438: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  439: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  440: { clima: [["Época seca","sun",false],["Lluviosa","rain",true]], momentos: [["Día","sun",false],["Noche","moon",true]] },
  441: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] },
  442: { clima: [["Época seca","sun",true],["Lluviosa","rain",false]], momentos: [["Día","sun",true],["Noche","moon",false]] }
}
const ACORDE_COLOR = {
  dulce:'#E8566C','cálido especiado':'#D4724A', avainillado:'#D4C07A',
  ámbar:'#C4722A', canela:'#A0522D', amaderado:'#8B6914', seco:'#8B7355',
  terroso:'#8B7355', floral:'#E8A0B4', cítrico:'#F4C842', aromático:'#7FB069',
  powder:'#C9A0DC', gourmand:'#D4956A', fresco:'#7FB069', verde:'#6B8E4E',
  especiado:'#D4724A', frutal:'#C0392B', caramelo:'#D4956A',
}
const SunIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)
const RainIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
    <line x1="8" y1="19" x2="8" y2="21" /><line x1="8" y1="13" x2="8" y2="15" />
    <line x1="16" y1="19" x2="16" y2="21" /><line x1="16" y1="13" x2="16" y2="15" />
    <line x1="12" y1="21" x2="12" y2="23" /><line x1="12" y1="15" x2="12" y2="17" />
  </svg>
)
const MoonIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const CUANDO_ICONS = { sun: SunIcon, rain: RainIcon, moon: MoonIcon }


const WhatsAppIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCartContext()
  const [mounted,      setMounted]      = useState(false)
  const [barsReady,    setBarsReady]    = useState(false)
  const [added,        setAdded]        = useState(false)
  const [imgHover,     setImgHover]     = useState(false)
  const [waHover,      setWaHover]      = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setMounted(false)
    setDescExpanded(false)
    const raf = requestAnimationFrame(() => setMounted(true))
    const t2 = setTimeout(() => setBarsReady(true), 500)
    return () => { cancelAnimationFrame(raf); clearTimeout(t2) }
  }, [id])

  const product = products.find(p => p.id === Number(id))

  if (!product) {
    return (
      <>
        <div className="pd-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
          <p style={{ fontFamily: 'var(--font-d)', fontSize: 36, fontStyle: 'italic', color: 'rgba(250,250,248,.25)' }}>
            Fragancia no encontrada
          </p>
          <Link to="/tienda" className="pd-back-link">← Volver al catálogo</Link>
        </div>
        <Footer />
      </>
    )
  }

  const rv = (d) => ({
    opacity:    mounted ? 1 : 0,
    transform:  mounted ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity .75s ease ${d}ms, transform .75s cubic-bezier(.22,1,.36,1) ${d}ms`,
  })

  const waPrecio = product.precioUSD > 0 ? ` — $${product.precioUSD} USD` : ''
  const waMl = product.ml ? ` ${product.ml}ml` : ''
  const waMsg = encodeURIComponent(
    `Hola, me interesa *${product.house} ${product.name}*${waMl}${waPrecio}. ¿Está disponible?`
  )
  const waUrl = `https://wa.me/584149112002?text=${waMsg}&ref=detalle_${product.id}`

  const descripcion = product.descripcion || (product.description ? product.description.replace(/\*\*/g, '') : null)

  const hasStructuredNotes = product.notasSalida || product.notasCorazon || product.notasFondo
  const notas = hasStructuredNotes ? {
    salida:  parseNotes(product.notasSalida),
    corazon: parseNotes(product.notasCorazon),
    fondo:   parseNotes(product.notasFondo),
  } : {
    salida:  Array.isArray(product.notes) ? product.notes.slice(0, 4) : [],
    corazon: Array.isArray(product.notes) ? product.notes.slice(4, 8) : [],
    fondo:   Array.isArray(product.notes) ? product.notes.slice(8) : [],
  }
  const acordes = ACORDES_POR_PRODUCTO[product.id] || ACORDES_POR_PRODUTO_FALLBACK
  const cuando  = CUANDO_POR_PRODUCTO[product.id]  || DEFAULT_CUANDO

  function handleAdd() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const metaTitle = `${product.house} ${product.name} ${product.ml}ml — KiKi Fragancia`
  const metaDesc = descripcion
    ? descripcion.slice(0, 155).replace(/\s\S+$/, '…')
    : `${product.house} ${product.name} ${product.ml}ml ${product.tipo}. Fragancia 100% original en Venezuela.`
  const canonicalUrl = `https://kikifragancia.com/tienda/${product.id}`
  const productImage = product.image ? `https://kikifragancia.com/products/${product.image}` : 'https://kikifragancia.com/khamrah-hero.jpg'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.house} ${product.name}`,
    image: productImage,
    description: descripcion || metaDesc,
    brand: { '@type': 'Brand', name: product.house },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'USD',
      price: product.precioUSD || undefined,
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={productImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header />

      <div className="pd-page">

        {/* ── Main section ── */}
        <div className="pd-main">
          <div className="kiki-container">

            <div style={rv(0)}>
              <Link to="/tienda" className="pd-back">← Catálogo</Link>
            </div>

            <div className="pd-layout">

              {/* Image */}
              <div style={rv(80)} onMouseEnter={() => setImgHover(true)} onMouseLeave={() => setImgHover(false)}>
                <div className="pd-img-wrap" style={{
                  boxShadow: imgHover ? '0 32px 64px rgba(0,0,0,.5)' : '0 8px 32px rgba(0,0,0,.3)',
                  transition: 'box-shadow .5s ease',
                }}>
                  {product.image ? (
                    <img
                      className="pd-img-photo"
                      src={`/products/${product.image}`}
                      alt={`${product.house} ${product.name}`}
                      style={{ transform: imgHover ? 'scale(1.04)' : 'scale(1)' }}
                    />
                  ) : (
                    <div className="pd-img-placeholder" style={{ transform: imgHover ? 'scale(1.04)' : 'scale(1)' }}>
                      <span className="pd-img-label">{product.house}<br />{product.name}<br />product photo</span>
                    </div>
                  )}

                  <div className="pd-img-badge">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                    <span className="pd-img-badge-text">Original Verificado</span>
                  </div>

                  {diaDeLPadreIds.includes(product.id) && (
                    <div className="vitrina-ribbon" aria-hidden="true">
                      <span>Día del Padre</span>
                    </div>
                  )}

                  <div className="pd-img-familia" style={{
                    opacity: imgHover ? 1 : 0,
                    transform: imgHover ? 'translateY(0)' : 'translateY(6px)',
                    transition: 'opacity .3s ease, transform .3s ease',
                  }}>
                    <span style={{ fontFamily: 'var(--font-s)', fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                      {product.familia}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="pd-info">
                <p className="pd-house" style={rv(140)}>{product.house}</p>
                <h1 className="pd-title" style={rv(200)}>{product.name}</h1>
                <p className="pd-meta" style={rv(260)}>
                  {[product.ml && `${product.ml} ml`, product.tipo, product.genero].filter(Boolean).join(' · ')}
                </p>
                <div className="pd-divider" style={rv(300)}></div>

                {product.variantIds && (() => {
                  const variantGroup = products
                    .filter(p => product.variantIds.includes(p.id))
                    .sort((a, b) => a.ml - b.ml)
                  return variantGroup.length > 1 ? (
                    <div className="pd-size-selector" style={rv(330)}>
                      <span className="pd-size-label">Tamaño</span>
                      <div className="pd-size-btns">
                        {variantGroup.map(v => (
                          <button
                            key={v.id}
                            type="button"
                            className={`pd-size-btn${v.id === product.id ? ' active' : ''}`}
                            onClick={() => navigate(`/tienda/${v.id}`)}
                          >
                            {v.ml} ml
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null
                })()}

                {product.precioUSD > 0 && (
                  <div className="pd-price" style={rv(350)}>
                    <span className="pd-price-amount">${product.precioUSD}</span>
                  </div>
                )}

                <div className="pd-actions" style={rv(380)}>
                  <button
                    onClick={handleAdd}
                    style={{
                      fontFamily: 'var(--font-s)', fontSize: 'clamp(11px, 3vw, 12px)', fontWeight: 400, letterSpacing: '.2em',
                      textTransform: 'uppercase', padding: 'clamp(13px, 3vw, 16px) clamp(20px, 5vw, 32px)', width: '100%', minHeight: '46px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      border: added ? '1px solid #25D366' : '1px solid var(--gold)',
                      background: added ? '#25D366' : 'var(--gold)',
                      color: added ? '#FFF' : '#0A0A0A',
                      transition: 'background .25s ease, border-color .25s ease, color .25s ease',
                    }}
                    onMouseEnter={e => { if (!added) e.currentTarget.style.background = '#E8C96A' }}
                    onMouseLeave={e => { if (!added) e.currentTarget.style.background = 'var(--gold)' }}
                  >
                    {added ? '✓ Agregado' : 'Agregar al carrito'}
                  </button>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pd-btn-wa"
                    style={{
                      background: waHover ? 'var(--gold)' : 'transparent',
                      color: waHover ? '#0A0A0A' : 'var(--gold)',
                      transform: waHover ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                    onMouseEnter={() => setWaHover(true)}
                    onMouseLeave={() => setWaHover(false)}
                  >
                    <WhatsAppIcon />
                    Consultar por WhatsApp
                  </a>

                  <p className="pd-trust">100% original verificado</p>
                </div>

                {descripcion && (
                  <div className="pd-desc-wrap" style={rv(440)}>
                    <div className="pd-desc-text" style={{
                      maxHeight: descExpanded ? '400px' : '72px',
                      overflow: 'hidden',
                      transition: 'max-height .45s cubic-bezier(.22,1,.36,1)',
                      position: 'relative',
                    }}>
                      <p className="pd-desc">{descripcion}</p>
                      {!descExpanded && <div className="pd-desc-fade"></div>}
                    </div>
                    <button className="pd-expand-btn" onClick={() => setDescExpanded(v => !v)}>
                      {descExpanded ? 'Leer menos ↑' : 'Leer más ↓'}
                    </button>
                  </div>
                )}

                {notas.salida.length > 0 && (
                  <div className="pd-notes-preview" style={rv(500)}>
                    <div className="pd-notes-label">
                      <div className="gold-line" style={{ width: 24 }}></div>
                      <span>Notas de salida</span>
                    </div>
                    <div className="pd-notes-chips">
                      {notas.salida.slice(0, 4).map(n => (
                        <span key={n} className="pd-note-chip">
                          <NoteIcon nota={n} />{n}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Dark section ── */}
        <div className="pd-dark">
          <div className="kiki-container pd-dark-inner">

            {/* Pirámide */}
            {(notas.salida.length || notas.corazon.length || notas.fondo.length) ? (
              <>
                <div className="pd-section-head">
                  <div className="pd-section-eyebrow"><div className="gold-line" style={{ width: 24 }}></div><span>Composición</span></div>
                  <h2 className="pd-section-title">Pirámide del perfume</h2>
                </div>

                <div className="pd-pyr">
                  {[
                    { label: 'Salida',  notes: notas.salida,  tier: 0 },
                    { label: 'Corazón', notes: notas.corazon, tier: 1 },
                    { label: 'Fondo',   notes: notas.fondo,   tier: 2 },
                  ].filter(l => l.notes.length > 0).map(({ label, notes, tier }) => (
                    <div key={label} className={`pd-pyr-tier pd-pyr-tier-${tier}`}>
                      <span className="pd-pyr-tier-label">{label}</span>
                      <div className="pd-pyr-notes">
                        {notes.map(n => (
                          <div key={n} className="pd-pyr-note">
                            <NoteIcon nota={n} size={56} />
                            <span className="pd-pyr-note-name">{n}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <p className="pd-pyr-footer">
                    {product.house} · {product.name} · {product.familia}
                  </p>
                </div>

                <div className="pd-sep"></div>
              </>
            ) : null}

            {/* Acordes */}
            <div className="pd-section-head">
              <div className="pd-section-eyebrow"><div className="gold-line" style={{ width: 24 }}></div><span>Perfil olfativo</span></div>
              <h2 className="pd-section-title">Acordes principales</h2>
            </div>
            <div className="pd-acordes">
              {acordes.map(([nombre, pct]) => {
                const color = ACORDE_COLOR[nombre] || '#C9A84C'
                return (
                  <div key={nombre} className="pd-acorde">
                    <div className="pd-acorde-meta">
                      <span className="pd-acorde-name">{nombre}</span>
                      <span className="pd-acorde-pct">{pct}%</span>
                    </div>
                    <div className="pd-acorde-track">
                      <div className="pd-acorde-bar" style={{
                        width: barsReady ? `${pct}%` : '0%',
                        background: `linear-gradient(90deg, ${color}88, ${color})`,
                      }}></div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pd-sep"></div>

            {/* Cuándo */}
            <div className="pd-section-head">
              <div className="pd-section-eyebrow"><div className="gold-line" style={{ width: 24 }}></div><span>Contexto ideal</span></div>
              <h2 className="pd-section-title">Cuándo usarlo</h2>
            </div>
            <div className="pd-cuando-grid">
              {[
                { titulo: 'Clima ideal',     items: cuando.clima },
                { titulo: 'Momento del día', items: cuando.momentos },
              ].map(({ titulo, items }) => (
                <div key={titulo} className="pd-cuando-card">
                  <p className="pd-cuando-label">{titulo}</p>
                  <div className="pd-cuando-items">
                    {items.map(([nombre, iconKey, activo]) => {
                      const Icon = CUANDO_ICONS[iconKey]
                      return (
                        <div key={nombre} className="pd-cuando-item">
                          <span className="pd-cuando-icon" style={{
                            opacity: activo ? 1 : 0.18,
                            color: activo ? 'var(--gold)' : 'rgba(247,242,234,.4)',
                            boxShadow: activo ? '0 0 22px rgba(201,168,76,.25)' : 'none',
                          }}>
                            {Icon && <Icon />}
                          </span>
                          <span className="pd-cuando-text" style={{ color: activo ? 'var(--gold)' : 'rgba(247,242,234,.2)' }}>
                            {nombre}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pd-back-bottom">
              <Link to="/tienda" className="pd-back-link">← Volver al catálogo</Link>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
