import React from 'react'
import Icon from './Icons'

/**
 * Large home-screen choice for one practice machine.
 * Photo background + professional icon, with one green Start button.
 */
export default function MachineCard({ machine, language, onStartMachine }) {
  const showEnglish = language === 'en'
  const showUrdu = language === 'ur'

  return (
    <article
      className={`machine-card machine-card-${machine.id}`}
      style={{ '--machine-photo': `url(${machine.image})` }}
    >
      <div className="machine-card-media" aria-hidden="true">
        <div className="machine-icon-badge">
          <Icon name={machine.icon} size={34} />
        </div>
      </div>

      <div className="machine-card-body">
        <div className="machine-card-top">
          <div>
            {showEnglish && <h2 className="machine-card-title">{machine.title}</h2>}
            {showUrdu && (
              <p className="machine-card-title-urdu" lang="ur" dir="rtl">
                {machine.titleUrdu}
              </p>
            )}
          </div>
        </div>

        {showEnglish && <p className="machine-card-description">{machine.description}</p>}
        {showUrdu && (
          <p className="machine-card-description-urdu" lang="ur" dir="rtl">
            {machine.descriptionUrdu}
          </p>
        )}

        <div className="machine-card-actions">
          <button
            type="button"
            className="start-practice-btn"
            onClick={() => onStartMachine(machine.id, 'practice')}
          >
            <span>Start</span>
            {showUrdu && (
              <span className="btn-urdu-sub" lang="ur" dir="rtl">
                شروع کریں
              </span>
            )}
          </button>
          <div className="secondary-mode-links">
            <button
              type="button"
              className="btn-secondary-small"
              onClick={() => onStartMachine(machine.id, 'learn')}
            >
              Explain first
            </button>
            <button
              type="button"
              className="btn-secondary-small"
              onClick={() => onStartMachine(machine.id, 'independent')}
            >
              Fewer hints
            </button>
          </div>
        </div>

        <ul className="machine-skills-list">
          {machine.skills.map((skill, index) => (
            <li key={index} className="machine-skill-item">
              <span className="skill-check" aria-hidden="true">
                {index + 1}
              </span>
              <div>
                {showEnglish && <span>{skill.en}</span>}
                {showUrdu && (
                  <span className="urdu-skill-line" lang="ur" dir="rtl">
                    {skill.ur}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
