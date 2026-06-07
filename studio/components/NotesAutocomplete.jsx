import { useState, useRef, useEffect } from 'react'
import notesList from '../schemas/notes-list.json'

export function NotesAutocomplete({ value = [], onChange, readOnly }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const suggestions = query.length > 0
    ? notesList.filter(n =>
        n.toLowerCase().includes(query.toLowerCase()) &&
        !value.includes(n)
      ).slice(0, 12)
    : []

  function addNote(nota) {
    if (!value.includes(nota)) {
      onChange([...value, nota])
    }
    setQuery('')
    setOpen(false)
    inputRef.current?.focus()
  }

  function removeNote(nota) {
    onChange(value.filter(n => n !== nota))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault()
      const exact = notesList.find(n => n.toLowerCase() === query.toLowerCase())
      addNote(exact ?? query.trim())
    }
    if (e.key === 'Escape') setOpen(false)
    if (e.key === 'Backspace' && !query && value.length > 0) {
      removeNote(value[value.length - 1])
    }
  }

  useEffect(() => {
    setOpen(suggestions.length > 0)
  }, [query])

  useEffect(() => {
    function handleClick(e) {
      if (!listRef.current?.contains(e.target) && e.target !== inputRef.current) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '6px',
        padding: '8px', border: '1px solid #ccc', borderRadius: '4px',
        background: '#fff', minHeight: '42px', alignItems: 'center',
      }}>
        {value.map(nota => (
          <span key={nota} style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            background: '#e8f0fe', borderRadius: '3px',
            padding: '2px 8px', fontSize: '13px', color: '#1a1a2e',
          }}>
            {nota}
            {!readOnly && (
              <button
                onClick={() => removeNote(nota)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', lineHeight: 1, color: '#666', fontSize: '15px' }}
              >×</button>
            )}
          </span>
        ))}
        {!readOnly && (
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setOpen(suggestions.length > 0)}
            placeholder={value.length === 0 ? 'Escribe para buscar notas...' : ''}
            style={{
              border: 'none', outline: 'none', fontSize: '13px',
              minWidth: '160px', flex: 1, padding: '2px 4px',
            }}
          />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul ref={listRef} style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          background: '#fff', border: '1px solid #ccc', borderRadius: '4px',
          marginTop: '2px', padding: '4px 0', listStyle: 'none',
          maxHeight: '220px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          {suggestions.map(nota => (
            <li
              key={nota}
              onMouseDown={() => addNote(nota)}
              style={{
                padding: '7px 12px', cursor: 'pointer', fontSize: '13px',
                ':hover': { background: '#f0f4ff' },
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {nota}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
