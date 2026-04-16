import type { CSSProperties } from 'react'
import { accentPresets, type AccentPresetId } from './theme'

type Props = {
  value: AccentPresetId
  onChange: (id: AccentPresetId) => void
}

export function ThemePicker({ value, onChange }: Props) {
  return (
    <div className="theme-picker" role="group" aria-label="Theme color">
      {accentPresets.map((p) => (
        <button
          key={p.id}
          type="button"
          className="theme-swatch"
          aria-pressed={value === p.id}
          title={p.label}
          onClick={() => onChange(p.id)}
          style={{ '--swatch': p.light } as CSSProperties}
        />
      ))}
    </div>
  )
}
