import { set, unset } from 'sanity'
import { NotesAutocomplete } from './NotesAutocomplete'

export function NotesInput({ value, onChange, readOnly }) {
  function handleChange(newValue) {
    onChange(newValue.length > 0 ? set(newValue) : unset())
  }

  return (
    <NotesAutocomplete
      value={value ?? []}
      onChange={handleChange}
      readOnly={readOnly}
    />
  )
}
