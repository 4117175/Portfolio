import { useEffect, useRef, useState } from 'react'
import type { projects } from './content'

type Project = (typeof projects)[number]

interface Props {
  project: Project | null
  onClose: () => void
}

const ANIM_DURATION = 280

export function ProjectModal({ project, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [closing, setClosing] = useState(false)
  const [displayed, setDisplayed] = useState<Project | null>(null)

  useEffect(() => {
    if (project) {
      setClosing(false)
      setDisplayed(project)
      dialogRef.current?.showModal()
    }
  }, [project])

  function beginClose() {
    setClosing(true)
    setTimeout(() => {
      dialogRef.current?.close()
      setClosing(false)
      setDisplayed(null)
      onClose()
    }, ANIM_DURATION)
  }

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    function handleCancel(e: Event) {
      e.preventDefault()
      beginClose()
    }
    el.addEventListener('cancel', handleCancel)
    return () => el.removeEventListener('cancel', handleCancel)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  return (
    <dialog
      ref={dialogRef}
      className={`work-modal${closing ? ' work-modal--closing' : ''}`}
      aria-labelledby="proj-modal-name"
      onClick={handleDialogClick}
    >
      <div className="work-modal-inner">
        <button className="work-modal-close" aria-label="Close" onClick={beginClose}>
          ✕
        </button>

        {displayed && (
          <>
            <p className="work-modal-period">{displayed.type}</p>
            <h2 id="proj-modal-name" className="work-modal-role">
              {displayed.name}
            </h2>
            <p className="work-modal-company proj-modal-tech">{displayed.tech}</p>

            <p className="proj-modal-desc">{displayed.description}</p>

            <p className="proj-modal-achievements-label">Key Achievements</p>
            <ul className="work-modal-bullets">
              {displayed.achievements.map((a, i) => (
                <li key={i} style={{ '--i': i } as React.CSSProperties}>
                  {a}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </dialog>
  )
}
