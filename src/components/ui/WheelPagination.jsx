import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const VISIBLE_COUNT = 7

export default function WheelPagination({ totalPages, currentPage, onPageChange }) {
  const [dir, setDir] = useState(1)

  if (!totalPages || totalPages <= 1) return null

  const half  = Math.floor(VISIBLE_COUNT / 2)
  let start   = Math.max(1, currentPage - half)
  let end     = Math.min(totalPages, start + VISIBLE_COUNT - 1)
  if (end - start + 1 < VISIBLE_COUNT) start = Math.max(1, end - VISIBLE_COUNT + 1)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  function goTo(page) {
    if (page < 1 || page > totalPages || page === currentPage) return
    setDir(page > currentPage ? 1 : -1)
    onPageChange(page)
  }

  const isPrevDisabled = currentPage === 1
  const isNextDisabled = currentPage === totalPages

  function arrowBtn(disabled, label, onClick) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          width: '36px', height: '36px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent',
          border: `1px solid ${disabled ? 'rgba(250,250,248,0.1)' : 'rgba(250,250,248,0.2)'}`,
          color: disabled ? 'rgba(250,250,248,0.2)' : '#C9A84C',
          cursor: disabled ? 'default' : 'pointer',
          fontFamily: "'Gotham', sans-serif",
          fontSize: '15px',
          transition: 'border-color 0.2s ease',
          flexShrink: 0,
        }}
        onMouseEnter={e => { if (!disabled) e.currentTarget.style.borderColor = '#C9A84C' }}
        onMouseLeave={e => { if (!disabled) e.currentTarget.style.borderColor = 'rgba(250,250,248,0.2)' }}
      >
        {label}
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', margin: '48px 0' }}>
      {arrowBtn(isPrevDisabled, '←', () => goTo(currentPage - 1))}

      <div style={{ display: 'flex', gap: '6px', overflow: 'hidden', height: '36px', alignItems: 'center' }}>
        <AnimatePresence mode="popLayout" initial={false}>
          {pages.map(page => {
            const isActive = page === currentPage
            return (
              <motion.button
                key={page}
                initial={{ opacity: 0, y: dir * 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: dir * -14 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => goTo(page)}
                style={{
                  width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive ? '#C9A84C' : 'transparent',
                  border: `1px solid ${isActive ? '#C9A84C' : 'rgba(250,250,248,0.2)'}`,
                  color: isActive ? '#0A0A0A' : '#FAFAF8',
                  cursor: isActive ? 'default' : 'pointer',
                  fontFamily: "'Gotham', sans-serif",
                  fontSize: '12px', letterSpacing: '0.05em',
                  fontWeight: isActive ? 500 : 300,
                  flexShrink: 0,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = '#C9A84C' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'rgba(250,250,248,0.2)' }}
              >
                {page}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {arrowBtn(isNextDisabled, '→', () => goTo(currentPage + 1))}
    </div>
  )
}
