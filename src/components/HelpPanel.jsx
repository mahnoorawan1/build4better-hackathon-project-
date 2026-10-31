import React from 'react'

/**
 * HelpPanel provides:
 * 1. Learn Mode explanation of the current screen
 * 2. Contextual Hints when the user gets stuck (or requests a hint)
 * 3. Dictionary of unfamiliar buttons on the current screen (when Help is open or in Learn Mode)
 * 4. Quick audio readout trigger for the current hint/explanation
 */
export default function HelpPanel({
  learningMode,
  language,
  screenTitle,
  screenTitleUrdu,
  learnExplanation,
  learnExplanationUrdu,
  hintText,
  hintTextUrdu,
  mistakeTip,
  mistakeTipUrdu,
  buttonGuide = [],
  isHelpOpen,
  onToggleHelp,
  isStuckHintVisible,
  onShowStuckHint,
  onSpeakText,
  urAudio,
}) {
  const showEnglish = language === 'en'
  const showUrdu = language === 'ur'

  // In Learn Mode, everything is expanded automatically so the user learns what the screen does.
  // In Practice Mode, the step hint and mistake tip are visible, and the full button guide opens when Help is clicked.
  // In Independent Mode, hints stay tucked away unless the user gets stuck or clicks "Need a Hint" or "Help".
  const showLearnBox = learningMode === 'learn'
  const showGuidedHint =
    learningMode === 'practice' ||
    learningMode === 'learn' ||
    isStuckHintVisible ||
    isHelpOpen
  const showButtonDictionary = learningMode === 'learn' || isHelpOpen

  const handleListenToHelp = () => {
    if (onSpeakText) {
      onSpeakText({
        en: `${screenTitle || ''}. ${learnExplanation || ''}. Next step hint: ${hintText || ''}`,
        ur: `${screenTitleUrdu || ''}. ${learnExplanationUrdu || ''}. اشارہ: ${hintTextUrdu || ''}`,
        urAudio: urAudio || null,
      })
    }
  }

  return (
    <aside className="help-panel" aria-label="Learning guidance and button help">
      {/* Top Status Header of the Help Panel */}
      <div className="help-panel-header">
        <div className="help-mode-badge">
          {learningMode === 'learn' && <span>Explain first</span>}
          {learningMode === 'practice' && <span>Practice with help</span>}
          {learningMode === 'independent' && <span>Try on my own</span>}
        </div>

        <div className="help-panel-header-actions">
          <button
            type="button"
            className="btn-help-audio"
            onClick={handleListenToHelp}
            title="Read this guidance aloud"
          >
            Read this help
            {showUrdu && (
              <span className="btn-sub" lang="ur" dir="rtl">
                سنیں
              </span>
            )}
          </button>

          <button
            type="button"
            className="btn-help-dictionary-toggle"
            onClick={onToggleHelp}
            aria-expanded={showButtonDictionary}
          >
            <span>
              {showButtonDictionary ? 'Hide button meanings' : 'What do these buttons mean?'}
              {showUrdu && (
                <span className="btn-sub" lang="ur" dir="rtl">
                  {showButtonDictionary ? 'چھپائیں' : 'بٹن کا مطلب'}
                </span>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Independent Mode Minimal Prompt when hints are hidden */}
      {learningMode === 'independent' && !showGuidedHint && (
        <div className="independent-encourage-banner">
          <div>
            {showEnglish && (
              <p>
                <strong>You are practicing independently!</strong> Try completing this screen on your own, just like at a real kiosk.
              </p>
            )}
            {showUrdu && (
              <p className="urdu-text" lang="ur" dir="rtl">
                <strong>آپ خودکار مشق کر رہے ہیں!</strong> حقیقی مشین کی طرح خود آگے بڑھنے کی کوشش کریں۔
              </p>
            )}
          </div>
          <button
            type="button"
            className="btn-stuck-hint"
            onClick={onShowStuckHint}
          >
            I&apos;m stuck. Show a hint.
            {showUrdu && (
              <span className="btn-sub" lang="ur" dir="rtl">
                اشارہ دکھائیں
              </span>
            )}
          </button>
        </div>
      )}

      {/* Learn Mode Detailed Explanation of the Current Screen */}
      {showLearnBox && (
        <div className="help-card learn-explanation-card">
          <div className="help-card-title">
            <span aria-hidden="true">🏫</span>
            {showEnglish && <strong>What is this screen for? ({screenTitle})</strong>}
            {showUrdu && (
              <strong className="urdu-inline" lang="ur" dir="rtl">
                یہ اسکرین کس لیے ہے؟ ({screenTitleUrdu})
              </strong>
            )}
          </div>
          {showEnglish && <p className="help-card-body">{learnExplanation}</p>}
          {showUrdu && (
            <p className="help-card-body-urdu" lang="ur" dir="rtl">
              {learnExplanationUrdu}
            </p>
          )}
        </div>
      )}

      {/* Contextual Next-Step Hint */}
      {showGuidedHint && (
        <div className={`help-card hint-card ${isStuckHintVisible ? 'pulse-highlight' : ''}`}>
          <div className="help-card-title">
            <span aria-hidden="true">💡</span>
            {showEnglish && (
              <strong>
                {isStuckHintVisible ? 'Gentle Hint (If You Feel Stuck):' : 'What to Do on This Screen:'}
              </strong>
            )}
            {showUrdu && (
              <strong className="urdu-inline" lang="ur" dir="rtl">
                {isStuckHintVisible ? 'مددگار اشارہ:' : 'اس اسکرین پر کیا کرنا ہے:'}
              </strong>
            )}
          </div>
          {showEnglish && <p className="help-card-body">{hintText}</p>}
          {showUrdu && (
            <p className="help-card-body-urdu" lang="ur" dir="rtl">
              {hintTextUrdu}
            </p>
          )}

          {/* Safe Mistake Practice Tip */}
          {mistakeTip && (
            <div className="mistake-practice-tip">
              {showEnglish && (
                <p>
                  <strong>🔄 Safe to Make Mistakes:</strong> {mistakeTip}
                </p>
              )}
              {showUrdu && mistakeTipUrdu && (
                <p className="urdu-text" lang="ur" dir="rtl">
                  <strong>🔄 غلطی درست کرنا سیکھیں:</strong> {mistakeTipUrdu}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Unfamiliar Button Dictionary */}
      {showButtonDictionary && buttonGuide.length > 0 && (
        <div className="help-card button-dictionary-card">
          <div className="help-card-title">
            <span aria-hidden="true">🔘</span>
            {showEnglish && <strong>What Unfamiliar Buttons on This Screen Mean:</strong>}
            {showUrdu && (
              <strong className="urdu-inline" lang="ur" dir="rtl">
                اس اسکرین کے بٹنوں کا مطلب:
              </strong>
            )}
          </div>
          <div className="button-guide-grid">
            {buttonGuide.map((item, idx) => (
              <div key={idx} className="button-guide-item">
                <span className="button-guide-name">{item.buttonName}</span>
                {showEnglish && <p className="button-guide-desc">{item.meaning}</p>}
                {showUrdu && (
                  <p className="button-guide-desc-urdu" lang="ur" dir="rtl">
                    {item.meaningUrdu}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}

