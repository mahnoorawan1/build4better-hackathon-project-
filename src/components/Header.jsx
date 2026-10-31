import React, { useEffect } from 'react'
import Icon from './Icons'

/**
 * Top bar on the home page.
 * Left sidebar once a simulation starts.
 * On phones, the sidebar opens from a large hamburger button.
 */
export default function Header({
  activeMachine,
  onGoHome,
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
  menuOpen,
  onToggleMenu,
  onCloseMenu,
}) {
  const showUrdu = language === 'ur'
  const inSimulation = activeMachine !== 'home'

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onCloseMenu()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen, onCloseMenu])

  const handleHome = () => {
    onCloseMenu()
    onGoHome()
  }

  const handleMode = (mode) => {
    onSelectLearningMode(mode)
    onCloseMenu()
  }

  return (
    <div className={`nav-shell ${inSimulation ? 'nav-shell-sim' : 'nav-shell-home'}`}>
      {inSimulation && (
        <div className="sim-topbar">
          <button
            type="button"
            className="hamburger-btn"
            onClick={onToggleMenu}
            aria-expanded={menuOpen}
            aria-controls="app-side-nav"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={26} />
            <span>{menuOpen ? 'Close menu' : 'Menu'}</span>
          </button>
          <div className="sim-topbar-brand">
            <span className="brand-mark" aria-hidden="true">
              K
            </span>
            <span className="brand-name">Kiosk of Confidence</span>
          </div>
          <span className="safe-simulation-pill">Safe practice</span>
        </div>
      )}

      {inSimulation && menuOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={onCloseMenu}
        />
      )}

      <header
        id="app-side-nav"
        className={`site-header ${inSimulation ? 'is-sidebar' : 'is-topbar'} ${
          menuOpen ? 'is-open' : ''
        }`}
        role="banner"
      >
        <div className="header-top-row">
          <button
            type="button"
            className="brand-home-btn"
            onClick={handleHome}
            aria-label="Go to the home screen"
          >
            <span className="brand-mark" aria-hidden="true">
              K
            </span>
            <span className="brand-titles">
              <span className="brand-name">Kiosk of Confidence</span>
              {showUrdu && (
                <span className="brand-urdu" lang="ur" dir="rtl">
                  اعتماد کا کیوسک
                </span>
              )}
            </span>
          </button>
          <span className="safe-simulation-pill">Safe practice</span>
          {inSimulation && (
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={onCloseMenu}
              aria-label="Close menu"
            >
              <Icon name="close" size={24} />
            </button>
          )}
        </div>

        <div className="header-tools" aria-label="Settings and help">
          {inSimulation && (
            <button type="button" className="utility-btn home-nav-btn tool-home" onClick={handleHome}>
              <Icon name="home" size={20} />
              <span>
                Home
                {showUrdu && (
                  <span className="btn-sub" lang="ur" dir="rtl">
                    ہوم
                  </span>
                )}
              </span>
            </button>
          )}

          <div className="control-pill-group" role="group" aria-label="Language">
            <button
              type="button"
              className={`utility-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => onChangeLanguage('en')}
            >
              English
            </button>
            <button
              type="button"
              className={`utility-btn ${language === 'ur' ? 'active' : ''}`}
              onClick={() => onChangeLanguage('ur')}
              lang="ur"
            >
              اردو
            </button>
          </div>

          <button
            type="button"
            className={`utility-btn text-size-btn ${largeText ? 'active' : ''}`}
            onClick={onToggleLargeText}
            aria-pressed={largeText}
          >
            <Icon name="textSize" size={20} />
            <span>{largeText ? 'Normal text' : 'Bigger text'}</span>
          </button>

          <button
            type="button"
            className={`utility-btn listen-btn ${isSpeaking ? 'speaking' : ''}`}
            onClick={onSpeakCurrentScreen}
            title={
              ttsSupported
                ? 'Read this screen out loud'
                : 'Spoken instructions are not available in this browser'
            }
          >
            <Icon name="listen" size={20} />
            <span>
              {isSpeaking ? 'Stop' : 'Listen'}
              {showUrdu && (
                <span className="btn-sub" lang="ur" dir="rtl">
                  {isSpeaking ? 'روکیں' : 'سنیں'}
                </span>
              )}
            </span>
          </button>

          <button
            type="button"
            className={`utility-btn help-toggle-btn ${isHelpOpen ? 'active' : ''}`}
            onClick={() => {
              onToggleHelp()
              onCloseMenu()
            }}
            aria-expanded={isHelpOpen}
          >
            <Icon name="help" size={20} />
            <span>
              {isHelpOpen ? 'Close help' : 'Help'}
              {showUrdu && (
                <span className="btn-sub" lang="ur" dir="rtl">
                  {isHelpOpen ? 'بند کریں' : 'مدد'}
                </span>
              )}
            </span>
          </button>
        </div>

        {inSimulation && (
          <div className="mode-switcher-bar" role="navigation" aria-label="How you want to practice">
            <p className="mode-switcher-label">How do you want to practice?</p>
            <div className="mode-buttons">
              <button
                type="button"
                className={`mode-tab-btn ${learningMode === 'learn' ? 'active' : ''}`}
                onClick={() => handleMode('learn')}
              >
                <span className="mode-num" aria-hidden="true">
                  <Icon name="book" size={18} />
                </span>
                <span className="mode-text">
                  <strong>Learn</strong>
                  {showUrdu && (
                    <small lang="ur" dir="rtl">
                      سیکھیں
                    </small>
                  )}
                </span>
              </button>
              <button
                type="button"
                className={`mode-tab-btn ${learningMode === 'practice' ? 'active' : ''}`}
                onClick={() => handleMode('practice')}
              >
                <span className="mode-num" aria-hidden="true">
                  <Icon name="target" size={18} />
                </span>
                <span className="mode-text">
                  <strong>With help</strong>
                  {showUrdu && (
                    <small lang="ur" dir="rtl">
                      مدد کے ساتھ
                    </small>
                  )}
                </span>
              </button>
              <button
                type="button"
                className={`mode-tab-btn ${learningMode === 'independent' ? 'active' : ''}`}
                onClick={() => handleMode('independent')}
              >
                <span className="mode-num" aria-hidden="true">
                  <Icon name="star" size={18} />
                </span>
                <span className="mode-text">
                  <strong>By myself</strong>
                  {showUrdu && (
                    <small lang="ur" dir="rtl">
                      خود
                    </small>
                  )}
                </span>
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
