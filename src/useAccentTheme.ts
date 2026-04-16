import { useEffect, useLayoutEffect, useState } from 'react'
import {
  ACCENT_STORAGE_KEY,
  type AccentPresetId,
  accentPresets,
  isAccentPresetId,
} from './theme'

function prefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function readStoredId(): AccentPresetId {
  try {
    const raw = localStorage.getItem(ACCENT_STORAGE_KEY)
    if (raw && isAccentPresetId(raw)) return raw
  } catch {
    /* ignore */
  }
  return 'blue'
}

export function useAccentTheme() {
  const [presetId, setPresetId] = useState<AccentPresetId>(() =>
    typeof window !== 'undefined' ? readStoredId() : 'blue',
  )

  useLayoutEffect(() => {
    const apply = () => {
      const preset = accentPresets.find((p) => p.id === presetId) ?? accentPresets[0]
      const dark = prefersDark()
      document.documentElement.style.setProperty('--accent', dark ? preset.dark : preset.light)
      document.documentElement.dataset.accent = preset.id
    }
    apply()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [presetId])

  useEffect(() => {
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, presetId)
    } catch {
      /* ignore */
    }
  }, [presetId])

  return { presetId, setPresetId }
}
