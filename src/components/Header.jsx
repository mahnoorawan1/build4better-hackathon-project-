import React from 'react'

/**
 * Header component with separated Primary Navigation, a grouped Accessibility Toolbar
 * (Language, Text Size, Audio Listen, Help), and a dedicated Learning Mode Selector.
 */
export default function Header({
  activeMachine,
  onGoHome,
  onSelectMachine,
  learningMode,
  onSelectLearningMode,
  language,
  onChangeLanguage,
  largeText,
  onToggleLargeText,
  onToggleHelp,
  isHelpOpen,
  onSpeakCurrentScreen,
  isSpeaking,
  ttsSupported,
}) {
  const showEnglish = language === 'both' || language === 'en'
  const showUrdu = language === 'both' || language === 'ur'

  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        {/* Left: Brand Identity & Primary Navigation */}
        <div className="header-primary-nav">
          <button
            type="button"
            className="brand-home-btn"
            onClick={onGoHome}
            aria-label="Kiosk of Confidence Home"
          >
            <span className="brand-logo-mark" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="3" y="3" width="22" height="22" rx="6" fill="currentColor" opacity="0.15" />
                <rect x="4" y="4" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2.2" />
                <path
                  d="M9.5 14.5L12.5 17.5L18.5 11"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className="brand-titles">
              <span className="brand-name">Kiosk of Confidence</span>
              {showUrdu ? (
                <span className="brand-urdu" lang="ur" dir="rtl">
                  اعتماد کا کیوسک
                </span>
              ) : (
                <span className="brand-subtitle">Touchscreen Practice Platform</span>
              )}
            </div>
          </button>

          <nav className="primary-nav-links" aria-label="Primary navigation">
            <button
              type="button"
              className={`nav-link-btn ${activeMachine === 'home' ? 'current' : ''}`}
              onClick={onGoHome}
            >
              <span aria-hidden="true">🏠</span>
              <span>Home</span>
              {showUrdu && (
                <span className="urdu-nav-label" lang="ur" dir="rtl">
                  ہوم
                </span>
              )}
            </button>

            {typeof onSelectMachine === 'function' && (
              <>
                <button
                  type="button"
                  className={`nav-link-btn ${activeMachine === 'atm' ? 'current' : ''}`}
                  onClick={() => onSelectMachine('atm')}
                >
                  <span aria-hidden="true">🏧</span>
                  <span>ATM</span>
                </button>
                <button
                  type="button"
                  className={`nav-link-btn ${activeMachine === 'ticket' ? 'current' : ''}`}
                  onClick={() => onSelectMachine('ticket')}
                >
                  <span aria-hidden="true">🎫</span>
                  <span>Tickets</span>
                </button>
                <button
                  type="button"
                  className={`nav-link-btn ${activeMachine === 'food' ? 'current' : ''}`}
                  onClick={() => onSelectMachine('food')}
                >
                  <span aria-hidden="true">🍔</span>
                  <span>Food</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Right: Consistently Grouped Accessibility & Support Controls */}
        <div
          className="accessibility-toolbar"
          role="region"
          aria-label="Accessibility and support controls"
        >
          {/* Language Switcher Pill Group */}
          <div className="a11y-control-group" role="group" aria-label="Language selection">
            <button
              type="button"
              className={`a11y-segment-btn ${language === 'both' ? 'active' : ''}`}
              onClick={() => onChangeLanguage('both')}
              title="Show both English and Urdu"
            >
              EN + اردو
            </button>
            <button
              type="button"
              className={`a11y-segment-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => onChangeLanguage('en')}
              title="English only"
            >
              EN
            </button>
            <button
              type="button"
              className={`a11y-segment-btn ${language === 'ur' ? 'active' : ''}`}
              onClick={() => onChangeLanguage('ur')}
              title="صرف اردو"
              lang="ur"
            >
              اردو
            </button>
          </div>

          <div className="a11y-actions-group">
            {/* Text Size Toggle */}
            <button
              type="button"
              className={`utility-btn text-size-btn ${largeText ? 'active' : ''}`}
              onClick={onToggleLargeText}
              aria-pressed={largeText}
              title="Toggle larger text size"
            >
              <span className="utility-icon" aria-hidden="true">Aa</span>
              <span>{largeText ? 'Text: Extra Large' : 'Text: Standard'}</span>
            </button>

            {/* Browser Text-to-Speech Listen Button */}
            <button
              type="button"
              className={`utility-btn listen-btn ${isSpeaking ? 'speaking' : ''}`}
              onClick={onSpeakCurrentScreen}
              title={
                ttsSupported
                  ? 'Listen to screen instructions read aloud'
                  : 'Audio speech is not supported in this browser'
              }
            >
              <span aria-hidden="true">{isSpeaking ? '⏹' : '🔊'}</span>
              <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
              {showUrdu && (
                <span className="urdu-inline" lang="ur" dir="rtl">
                  {isSpeaking ? 'روکیں' : 'سنیں'}
                </span>
              )}
            </button>

            {/* Contextual Help Toggle */}
            <button
              type="button"
              className={`utility-btn help-toggle-btn ${isHelpOpen ? 'active' : ''}`}
              onClick={onToggleHelp}
              aria-expanded={isHelpOpen}
            >
              <span aria-hidden="true">❓</span>
              <span>Help</span>
              {showUrdu && (
                <span className="urdu-inline" lang="ur" dir="rtl">
                  مدد
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated, Clearly Visible Learning Mode Selector Bar */}
      {activeMachine !== 'home' && (
        <div className="dedicated-mode-bar" role="navigation" aria-label="Learning mode selector">
          <div className="dedicated-mode-inner">
            <div className="mode-bar-header">
              <div className="mode-bar-title">
                {showEnglish && <span>Learning Mode:</span>}
                {showUrdu && (
                  <span className="urdu-inline" lang="ur" dir="rtl">
                    سیکھنے کا مرحلہ:
                  </span>
                )}
              </div>
              <button
                type="button"
                className="back-to-home-pill"
                onClick={onGoHome}
              >
                ← All Machines {showUrdu && <span lang="ur">• تمام مشینیں</span>}
              </button>
            </div>

            <div className="mode-selector-grid" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={learningMode === 'learn'}
                className={`mode-tab-btn ${learningMode === 'learn' ? 'active' : ''}`}
                onClick={() => onSelectLearningMode('learn')}
              >
                <span className="mode-step-num">1</span>
                <div className="mode-text">
                  <div className="mode-title-line">
                    <strong>Learn</strong>
                    {showUrdu && (
                      <span className="urdu-inline" lang="ur" dir="rtl">
                        سیکھیں
                      </span>
                    )}
                  </div>
                  <small>Understand every button on screen</small>
                </div>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={learningMode === 'practice'}
                className={`mode-tab-btn ${learningMode === 'practice' ? 'active' : ''}`}
                onClick={() => onSelectLearningMode('practice')}
              >
                <span className="mode-step-num">2</span>
                <div className="mode-text">
                  <div className="mode-title-line">
                    <strong>Guided Practice</strong>
                    {showUrdu && (
                      <span className="urdu-inline" lang="ur" dir="rtl">
                        رہنمائی کے ساتھ مشق
                      </span>
                    )}
                  </div>
                  <small>Step-by-step hints & mistake recovery</small>
                </div>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={learningMode === 'independent'}
                className={`mode-tab-btn ${learningMode === 'independent' ? 'active' : ''}`}
                onClick={() => onSelectLearningMode('independent')}
              >
                <span className="mode-step-num">3</span>
                <div className="mode-text">
                  <div className="mode-title-line">
                    <strong>Independent Practice</strong>
                    {showUrdu && (
                      <span className="urdu-inline" lang="ur" dir="rtl">
                        خودکار مشق
                      </span>
                    )}
                  </div>
                  <small>Fewer hints — just like a real machine</small>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
