import { useEffect, useRef, useState } from 'react'
import type { workExperience } from './content'

type Job = (typeof workExperience)[number]

interface Props {
  job: Job | null
  onClose: () => void
}

const ANIM_DURATION = 280 // ms — must match CSS

export function WorkModal({ job, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [closing, setClosing] = useState(false)
  // Keep a copy of the job so content stays visible during exit animation
  const [displayedJob, setDisplayedJob] = useState<Job | null>(null)

  // When a new job is selected, open the dialog
  useEffect(() => {
    if (job) {
      setClosing(false)
      setDisplayedJob(job)
      dialogRef.current?.showModal()
    }
  }, [job])

  function beginClose() {
    setClosing(true)
    setTimeout(() => {
      dialogRef.current?.close()
      setClosing(false)
      setDisplayedJob(null)
      onClose()
    }, ANIM_DURATION)
  }

  // Sync Escape key with our animated close
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    function handleCancel(e: Event) {
      e.preventDefault() // prevent instant native close
      beginClose()
    }
    el.addEventListener('cancel', handleCancel)
    return () => el.removeEventListener('cancel', handleCancel)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close on backdrop click
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
      aria-labelledby="modal-role"
      onClick={handleDialogClick}
    >
      <div className="work-modal-inner">
        <button
          className="work-modal-close"
          aria-label="Close"
          onClick={beginClose}
        >
          ✕
        </button>

        {displayedJob && (
          <>
            <p className="work-modal-period">{displayedJob.period}</p>
            <h2 id="modal-role" className="work-modal-role">
              {displayedJob.role}
            </h2>
            <p className="work-modal-company">{displayedJob.company}</p>

            <ul className="work-modal-bullets">
              {displayedJob.bullets.map((b, i) => (
                <li key={i} style={{ '--i': i } as React.CSSProperties}>
                  {b}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </dialog>
  )
}
