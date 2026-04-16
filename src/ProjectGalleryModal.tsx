import { useEffect, useRef, useState, useCallback } from 'react'
import type { projects } from './content'

type Project = (typeof projects)[number]

interface Props {
  project: Project | null
  onClose: () => void
}

const ANIM_DURATION = 280

export function ProjectGalleryModal({ project, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [closing, setClosing] = useState(false)
  const [displayed, setDisplayed] = useState<Project | null>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (project) {
      setClosing(false)
      setDisplayed(project)
      setIndex(0)
      dialogRef.current?.showModal()
    }
  }, [project])

  const beginClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      dialogRef.current?.close()
      setClosing(false)
      setDisplayed(null)
      onClose()
    }, ANIM_DURATION)
  }, [onClose])

  const prev = useCallback(() => {
    if (!displayed) return
    setIndex((i) => (i - 1 + displayed.gallery.length) % displayed.gallery.length)
  }, [displayed])

  const next = useCallback(() => {
    if (!displayed) return
    setIndex((i) => (i + 1) % displayed.gallery.length)
  }, [displayed])

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!displayed) return
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [displayed, prev, next])

  // Escape sync
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    function handleCancel(e: Event) {
      e.preventDefault()
      beginClose()
    }
    el.addEventListener('cancel', handleCancel)
    return () => el.removeEventListener('cancel', handleCancel)
  }, [beginClose])

  // Backdrop click
  function handleDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect()
    if (!rect) return
    const outside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    if (outside) beginClose()
  }

  const slide = displayed?.gallery[index]

  return (
    <dialog
      ref={dialogRef}
      className={`gallery-modal${closing ? ' work-modal--closing' : ''}`}
      aria-labelledby="gallery-title"
      onClick={handleDialogClick}
    >
      <div className="gallery-modal-inner">
        {/* Header */}
        <div className="gallery-header">
          <div>
            <p className="gallery-type">{displayed?.type}</p>
            <h2 id="gallery-title" className="gallery-title">{displayed?.name}</h2>
            <p className="gallery-tech">{displayed?.tech}</p>
          </div>
          <button className="work-modal-close" aria-label="Close" onClick={beginClose}>
            ✕
          </button>
        </div>

        {/* Description */}
        {'description' in (displayed ?? {}) && (displayed as { description?: string }).description && (
          <p className="gallery-description">
            {(displayed as { description?: string }).description}
          </p>
        )}

        {/* Main image */}
        <div className="gallery-stage">
          <button
            className="gallery-arrow gallery-arrow--prev"
            onClick={prev}
            aria-label="Previous image"
            disabled={!displayed || displayed.gallery.length <= 1}
          >
            ‹
          </button>

          <div className="gallery-img-wrap">
            {slide && (
              <img
                key={slide.src}
                src={slide.src}
                alt={slide.caption}
                className="gallery-img"
                draggable={false}
              />
            )}
          </div>

          <button
            className="gallery-arrow gallery-arrow--next"
            onClick={next}
            aria-label="Next image"
            disabled={!displayed || displayed.gallery.length <= 1}
          >
            ›
          </button>
        </div>

        {/* Caption */}
        {slide && (
          <p className="gallery-caption">{slide.caption}</p>
        )}

        {/* Thumbnails + counter */}
        {displayed && displayed.gallery.length > 1 && (
          <div className="gallery-thumbs">
            {displayed.gallery.map((g, i) => (
              <button
                key={g.src}
                className={`gallery-thumb${i === index ? ' gallery-thumb--active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Image ${i + 1}`}
              >
                <img src={g.src} alt="" draggable={false} />
              </button>
            ))}
          </div>
        )}

        <div className="gallery-footer">
          {displayed && (
            <p className="gallery-counter">
              {index + 1} / {displayed.gallery.length}
            </p>
          )}
          {'href' in (displayed ?? {}) && (displayed as { href?: string }).href && (
            <a
              href={(displayed as { href?: string }).href}
              target="_blank"
              rel="noreferrer"
              className="gallery-live-btn"
            >
              ↗ View Live
            </a>
          )}
        </div>
      </div>
    </dialog>
  )
}
