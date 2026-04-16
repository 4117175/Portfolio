export const ACCENT_STORAGE_KEY = 'portfolio-accent'

export const accentPresets = [
  { id: 'blue',    label: 'Blue',    light: '#2563eb', dark: '#60a5fa' },
  { id: 'indigo',  label: 'Indigo',  light: '#4338ca', dark: '#818cf8' },
  { id: 'violet',  label: 'Violet',  light: '#7c3aed', dark: '#a78bfa' },
  { id: 'teal',    label: 'Teal',    light: '#0d9488', dark: '#2dd4bf' },
  { id: 'cyan',    label: 'Cyan',    light: '#0891b2', dark: '#22d3ee' },
  { id: 'emerald', label: 'Emerald', light: '#059669', dark: '#34d399' },
  { id: 'rose',    label: 'Rose',    light: '#e11d48', dark: '#fb7185' },
  { id: 'amber',   label: 'Amber',   light: '#d97706', dark: '#fbbf24' },
  { id: 'orange',  label: 'Orange',  light: '#ea580c', dark: '#fb923c' },
] as const

export type AccentPresetId = (typeof accentPresets)[number]['id']

export function isAccentPresetId(id: string): id is AccentPresetId {
  return accentPresets.some((p) => p.id === id)
}
