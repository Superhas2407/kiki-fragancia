# Tarea: Generar acordes olfativos y recomendaciones de uso para 442 perfumes

## Contexto
Estoy construyendo una tienda online de perfumería (kikifragancia.com). En la página de detalle de cada producto quiero mostrar:
1. **Acordes principales** — 4 barras de progreso que representan el perfil olfativo del perfume con un porcentaje de presencia (0-100).
2. **¿Cuándo usarlo?** — indica si aplica para época seca/lluviosa y para día/noche.

## Tu tarea
Procesa cada perfume del array JSON adjunto y devuelve un objeto JSON con dos claves: `acordes` y `cuando`, cada una con el ID del producto como clave.

## Opciones de acordes disponibles
Usa SOLO estas etiquetas (en español, exactamente como aparecen):
[
  "dulce",
  "cálido especiado",
  "avainillado",
  "ámbar",
  "amaderado",
  "terroso",
  "seco",
  "floral",
  "frutal",
  "cítrico",
  "fresco",
  "verde",
  "gourmand",
  "caramelo",
  "aromático",
  "powder",
  "especiado",
  "acuático",
  "ahumado",
  "cuero",
  "resinoso",
  "chipre",
  "oud",
  "oriental",
  "amoscado",
  "herbal",
  "marino"
]

## Reglas para acordes
- Devuelve exactamente **4 acordes** por perfume, ordenados de mayor a menor porcentaje.
- El porcentaje máximo es 95 y el mínimo es 35.
- Basa los acordes en las notas olfativas (notasSalida, notasCorazon, notasFondo) y la familia.
- El acorde dominante debe reflejar la esencia principal del perfume.

## Reglas para cuando
- `clima`: marca `true` si el perfume aplica para esa época.
  - Los frescos, cítricos, acuáticos, florales ligeros → Época seca ✓
  - Los orientales, gourmand, amaderados pesados, especiados → Lluviosa ✓ (o todo el año)
- `momentos`: marca `true` si aplica para ese momento.
  - Frescos, cítricos, florales → Día ✓
  - Orientales, gourmand, oud, especiados → Noche ✓
  - Florales orientales, amaderados versátiles → ambos ✓

## Formato de salida esperado
Devuelve ÚNICAMENTE el JSON, sin texto adicional, sin markdown, sin explicaciones.
La estructura exacta es:

```json
{
  "acordes": {
    "<id>": [["<acorde1>", <pct1>], ["<acorde2>", <pct2>], ["<acorde3>", <pct3>], ["<acorde4>", <pct4>]],
    ...
  },
  "cuando": {
    "<id>": {
      "clima":    [["Época seca", "sun", true_o_false], ["Lluviosa", "rain", true_o_false]],
      "momentos": [["Día", "sun", true_o_false], ["Noche", "moon", true_o_false]]
    },
    ...
  }
}
```

## Ejemplo para 2 perfumes
```json
{
  "acordes": {
    "1": [
      [
        "floral",
        90
      ],
      [
        "fresco",
        75
      ],
      [
        "cítrico",
        60
      ],
      [
        "verde",
        45
      ]
    ],
    "2": [
      [
        "amaderado",
        85
      ],
      [
        "oud",
        75
      ],
      [
        "especiado",
        65
      ],
      [
        "ámbar",
        55
      ]
    ]
  },
  "cuando": {
    "1": {
      "clima": [
        [
          "Época seca",
          "sun",
          true
        ],
        [
          "Lluviosa",
          "rain",
          false
        ]
      ],
      "momentos": [
        [
          "Día",
          "sun",
          true
        ],
        [
          "Noche",
          "moon",
          false
        ]
      ]
    },
    "2": {
      "clima": [
        [
          "Época seca",
          "sun",
          false
        ],
        [
          "Lluviosa",
          "rain",
          true
        ]
      ],
      "momentos": [
        [
          "Día",
          "sun",
          false
        ],
        [
          "Noche",
          "moon",
          true
        ]
      ]
    }
  }
}
```

## Productos a procesar
Adjunto el archivo `gemini-products-input.json` con los 442 perfumes.
Procesa TODOS. Si necesitas dividirlos en lotes, avísame y te los paso en grupos de 100.
