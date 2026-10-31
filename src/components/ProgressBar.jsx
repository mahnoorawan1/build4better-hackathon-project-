import React from 'react'

/**
 * Shows which step the learner is on, and lets them tap a finished step to go back.
 */
export default function ProgressBar({
  machineName,
  machineNameUrdu,
  steps,
  currentStepIndex,
  onStepClick,
  language,
}) {
  const showEnglish = language === 'en'
  const showUrdu = language === 'ur'
  const totalSteps = steps.length
  const percentage = Math.round(((currentStepIndex + 1) / totalSteps) * 100)
  const current = steps[currentStepIndex]

  return (
    <section className="progress-bar-container" aria-label="Practice progress">
      <p className="progress-now">
        {showEnglish && (
          <span>
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
        )}
        {showEnglish && current?.label && (
          <strong className="progress-now-name">{current.label}</strong>
        )}
        {showUrdu && (
          <span className="progress-now-urdu" lang="ur" dir="rtl">
            مرحلہ {currentStepIndex + 1} از {totalSteps}
            {current?.labelUrdu ? ` — ${current.labelUrdu}` : ''}
          </span>
        )}
      </p>

      <div className="progress-header-row">
        <div className="progress-machine-title">
          {showEnglish && <span>{machineName}</span>}
          {showUrdu && (
            <span className="urdu-inline" lang="ur" dir="rtl">
              {machineNameUrdu}
            </span>
          )}
        </div>
        <div className="progress-step-counter">{percentage}%</div>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={currentStepIndex + 1}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`${current?.label || 'Step'} , step ${currentStepIndex + 1} of ${totalSteps}`}
      >
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>

      <div className="progress-steps-scroller">
        <ol className="progress-steps-list">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex
            const isCurrent = idx === currentStepIndex
            const canJumpBack = isCompleted && typeof onStepClick === 'function'

            return (
              <li
                key={step.id || idx}
                className={`progress-step-item ${
                  isCurrent ? 'current' : isCompleted ? 'completed' : 'upcoming'
                }`}
              >
                {canJumpBack ? (
                  <button
                    type="button"
                    className="progress-step-btn"
                    onClick={() => onStepClick(idx)}
                  >
                    <span className="step-badge">{idx + 1}</span>
                    <span className="step-labels">
                      {showEnglish && <span className="step-en">{step.label}</span>}
                      {showUrdu && (
                        <span className="step-ur" lang="ur" dir="rtl">
                          {step.labelUrdu}
                        </span>
                      )}
                      <span className="step-hint">Tap to go back</span>
                    </span>
                  </button>
                ) : (
                  <div className="progress-step-static" aria-current={isCurrent ? 'step' : undefined}>
                    <span className="step-badge">{idx + 1}</span>
                    <span className="step-labels">
                      {showEnglish && <span className="step-en">{step.label}</span>}
                      {showUrdu && (
                        <span className="step-ur" lang="ur" dir="rtl">
                          {step.labelUrdu}
                        </span>
                      )}
                      {isCurrent && <span className="step-hint">You are here</span>}
                    </span>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
