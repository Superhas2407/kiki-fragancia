import { motion } from 'framer-motion'

const cn = (...classes) => classes.filter(Boolean).join(' ')

export function ThreeDMarquee({ images, className }) {
  // Duplicar para evitar huecos en la animación (sin descargar más imágenes)
  const filled = [...images, ...images]
  const chunkSize = Math.ceil(filled.length / 4)
  const chunks = Array.from({ length: 4 }, (_, colIndex) => {
    const start = colIndex * chunkSize
    return filled.slice(start, start + chunkSize)
  })

  return (
    <div className={cn('mx-auto block h-[600px] overflow-hidden rounded-2xl max-sm:h-[400px]', className)}>
      <div className="flex size-full items-center justify-center">
        <div className="size-[1720px] shrink-0 scale-50 sm:scale-75 lg:scale-100">
          <div
            style={{
              transform: 'rotateX(55deg) rotateY(0deg) rotateZ(-45deg)',
              transformStyle: 'preserve-3d',
            }}
            className="relative top-96 right-[50%] grid size-full origin-top-left grid-cols-4 gap-8"
          >
            {/* Separadores dorados entre columnas */}
            {['24.5%', '50%', '75.5%'].map(left => (
              <div key={left} style={{
                position: 'absolute', left, top: 0, bottom: 0, width: 2,
                background: 'linear-gradient(to bottom, transparent 0%, rgba(201,168,76,0.6) 10%, rgba(201,168,76,0.6) 90%, transparent 100%)',
                pointerEvents: 'none', zIndex: 20,
              }} />
            ))}
            {chunks.map((subarray, colIndex) => (
              <motion.div
                animate={{ y: colIndex % 2 === 0 ? 100 : -100 }}
                transition={{
                  duration: colIndex % 2 === 0 ? 10 : 15,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                key={colIndex + 'marquee'}
                className="flex flex-col items-start gap-8"
              >
                <GridLineVertical offset="80px" />
                {subarray.map((image, imageIndex) => (
                  <div className="relative" key={imageIndex + image}>
                    <GridLineHorizontal offset="20px" />
                    <motion.img
                      whileHover={{ y: -10 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      src={image}
                      alt=""
                      className="aspect-[970/700] rounded-lg object-cover"
                      style={{ boxShadow: '0 0 0 1px rgba(201,168,76,0.15)' }}
                      width={970}
                      height={700}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function GridLineHorizontal({ className, offset = '200px' }) {
  return (
    <div
      style={{
        '--background': 'var(--bg)',
        '--color': 'rgba(201,168,76,0.15)',
        '--height': '1px',
        '--width': '5px',
        '--fade-stop': '90%',
        '--offset': offset,
        '--color-dark': 'rgba(201,168,76,0.15)',
        maskComposite: 'exclude',
      }}
      className={cn(
        'absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]',
        'bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]',
        '[background-size:var(--width)_var(--height)]',
        '[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]',
        '[mask-composite:exclude]',
        'z-30',
        className,
      )}
    />
  )
}

function GridLineVertical({ className, offset = '150px' }) {
  return (
    <div
      style={{
        '--background': 'var(--bg)',
        '--color': 'rgba(201,168,76,0.15)',
        '--height': '5px',
        '--width': '1px',
        '--fade-stop': '90%',
        '--offset': offset,
        maskComposite: 'exclude',
      }}
      className={cn(
        'absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]',
        'bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]',
        '[background-size:var(--width)_var(--height)]',
        '[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]',
        '[mask-composite:exclude]',
        'z-30',
        className,
      )}
    />
  )
}
