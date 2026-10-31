import React from 'react'

/**
 * MachineCard displays a visually distinct, consistent consumer card on the Home page
 * for each practice simulator (ATM, Ticket Booking, Food Ordering).
 */
export default function MachineCard({
  machine,
  language,
  onStartMachine,
}) {
  const showEnglish = language === 'both' || language === 'en'
  const showUrdu = language === 'both' || language === 'ur'

  return (
    <article className={`machine-card machine-card-${machine.id}`}>
      <div>
        <div className="machine-card-top">
          <div className="machine-icon-badge" aria-hidden="true">
            <span className="machine-emoji">{machine.icon}</span>
          </div>
          <span className="machine-tag">{machine.badge}</span>
        </div>

        <div className="machine-card-body">
          <div className="machine-card-titles">
            {showEnglish && <h3 className="machine-card-title">{machine.title}</h3>}
            {showUrdu && (
              <p className="machine-card-title-urdu" lang="ur" dir="rtl">
                {machine.titleUrdu}
              </p>
            )}
          </div>

          {showEnglish && (
            <p className="machine-card-description">{machine.description}</p>
          )}
          {showUrdu && (
            <p className="machine-card-description-urdu" lang="ur" dir="rtl">
              {machine.descriptionUrdu}
            </p>
          )}

          <div className="machine-skills-box">
            <div className="skills-heading-row">
              {showEnglish && (
                <span className="skills-heading">What you will practice:</span>
              )}
              {showUrdu && (
                <span className="skills-heading-urdu" lang="ur" dir="rtl">
                  آپ کیا سیکھیں گے:
                </span>
              )}
            </div>

            <ul className="machine-skills-list">
              {machine.skills.map((skill, index) => (
                <li key={index} className="machine-skill-item">
                  <span className="skill-check" aria-hidden="true">
                    ✓
                  </span>
                  <div className="skill-item-text">
                    {showEnglish && <span className="skill-en">{skill.en}</span>}
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
        </div>
      </div>

      <div className="machine-card-actions">
        <button
          type="button"
          className="btn-primary start-practice-btn"
          onClick={() => onStartMachine(machine.id, 'practice')}
        >
          <span className="start-btn-main">
            <span>Start Practice</span>
            <span aria-hidden="true">→</span>
          </span>
          {showUrdu && (
            <span className="btn-urdu-sub" lang="ur" dir="rtl">
              مشق شروع کریں
            </span>
          )}
        </button>

        <div className="secondary-mode-links">
          <button
            type="button"
            className="btn-secondary-small"
            onClick={() => onStartMachine(machine.id, 'learn')}
          >
            <span>📖 Learn First</span>
            {showUrdu && (
              <span lang="ur" dir="rtl">
                پہلے سیکھیں
              </span>
            )}
          </button>
          <button
            type="button"
            className="btn-secondary-small"
            onClick={() => onStartMachine(machine.id, 'independent')}
          >
            <span>⭐ Independent</span>
            {showUrdu && (
              <span lang="ur" dir="rtl">
                خودکار مشق
              </span>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
