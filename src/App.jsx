import React, { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import MachineCard from './components/MachineCard'
import ATM from './machines/ATM'
import TicketMachine from './machines/TicketMachine'
import FoodMachine from './machines/FoodMachine'
import './App.css'

const PRACTICE_MACHINES = [
  {
    id: 'atm',
    icon: '🏧',
    badge: 'Banking Kiosk • بینک اے ٹی ایم',
    title: 'ATM Practice',
    titleUrdu: 'اے ٹی ایم کی مشق',
    description:
      'Learn how to check your balance or withdraw fictional cash safely. Practice selecting amounts, reviewing your screen, and taking your card back — without ever entering a real card number or PIN.',
    descriptionUrdu:
      'بغیر کسی اصلی کارڈ یا پن کے، محفوظ طریقے سے بیلنس چیک کرنے اور فرضی رقم نکالنے کی مشق کریں۔',
    skills: [
      {
        en: 'Choose Cash Withdrawal or Balance Inquiry',
        ur: 'رقم نکالنے یا بیلنس چیک کرنے کا انتخاب',
      },
      {
        en: 'Select preset Fast Cash or enter a custom amount',
        ur: 'تیار شدہ رقم یا اپنی مرضی کی رقم کا انتخاب',
      },
      {
        en: 'Make a mistake & fix the amount before confirming',
        ur: 'تصدیق سے پہلے غلط رقم کو تبدیل کرنے کی مشق',
      },
    ],
  },
  {
    id: 'ticket',
    icon: '🎫',
    badge: 'Travel Kiosk • سفری ٹکٹ مشین',
    title: 'Ticket Booking Practice',
    titleUrdu: 'ٹکٹ بکنگ کی مشق',
    description:
      'Practice buying train or bus tickets on a station touchscreen. Choose your departure and destination cities, select Senior or Economy fares, adjust passenger counts, and edit any detail before printing.',
    descriptionUrdu:
      'ریلوے یا بس اسٹیشن کی ٹچ اسکرین پر روانگی اور منزل کا شہر، ٹکٹ کی قسم اور مسافروں کی تعداد منتخب کرنے کی مشق کریں۔',
    skills: [
      {
        en: 'Pick Departure and Destination cities in order',
        ur: 'روانگی اور منزل کے شہروں کا انتخاب',
      },
      {
        en: 'Choose Economy, Business, or Senior Citizen discount',
        ur: 'اکانومی، بزنس یا بزرگ شہری رعایت کا انتخاب',
      },
      {
        en: 'Edit any city, ticket class, or passenger count on Review',
        ur: 'جائزہ اسکرین پر کسی بھی غلطی کی فوری درستگی',
      },
    ],
  },
  {
    id: 'food',
    icon: '🍔',
    badge: 'Restaurant Kiosk • ریستوران آرڈر مشین',
    title: 'Food Ordering Practice',
    titleUrdu: 'کھانا آرڈر کرنے کی مشق',
    description:
      'Practice ordering meals and drinks on a self-service restaurant screen. Browse menu categories, add items to your tray, change quantities, remove accidental items, and get your pickup number.',
    descriptionUrdu:
      'ریستوران کی سیلف سروس اسکرین پر مینو دیکھنا، کھانا شامل کرنا، تعداد بدلنا اور غلط آئٹم ہٹانا سیکھیں۔',
    skills: [
      {
        en: 'Choose Eat In (Dine Here) or Takeaway (Parcel)',
        ur: 'یہاں کھانے یا پارسل لے جانے کا انتخاب',
      },
      {
        en: 'Browse categories & adjust quantities with + and -',
        ur: 'مختلف کھانوں کی تعداد کم یا زیادہ کرنا',
      },
      {
        en: 'Remove an accidental item & review your order total',
        ur: 'غلطی سے شامل چیز کو ہٹانا اور کل بل چیک کرنا',
      },
    ],
  },
]

const LEARNING_STEPS = [
  {
    mode: 'learn',
    number: '1',
    icon: '📖',
    title: 'Learn',
    titleUrdu: 'سیکھیں اور سمجھیں',
    description:
      'Read simple, calm explanations of what each screen is asking and what every button does before you touch anything.',
    descriptionUrdu:
      'کوئی بھی بٹن دبانے سے پہلے آسان الفاظ میں سمجھیں کہ اسکرین پر ہر بٹن کا کیا مطلب ہے۔',
  },
  {
    mode: 'practice',
    number: '2',
    icon: '🎯',
    title: 'Guided Practice',
    titleUrdu: 'رہنمائی کے ساتھ مشق',
    description:
      'Follow step-by-step coaching, try making a mistake in a safe environment, and practice using Back or Edit to fix it.',
    descriptionUrdu:
      'مرحلہ وار اشاروں کے ساتھ مشق کریں اور بے خوف ہو کر اپنی غلطی درست کرنے کا طریقہ سیکھیں۔',
  },
  {
    mode: 'independent',
    number: '3',
    icon: '⭐',
    title: 'Independent Practice',
    titleUrdu: 'خودکار مشق',
    description:
      'Complete the whole task with fewer hints — just like using a real machine in public, with Help still one tap away.',
    descriptionUrdu:
      'حقیقی مشین کی طرح کم اشاروں کے ساتھ خود مشق کریں تاکہ آپ کا اعتماد مکمل طور پر مضبوط ہو۔',
  },
]

const HOME_SPEECH_TEXT =
  'Welcome to Kiosk of Confidence. Practice first. Use technology independently. This is a safe practice website with three touchscreen simulators: ATM Practice, Ticket Booking Practice, and Food Ordering Practice. Touch Start Learning or any Start Practice button to begin.'

export default function App() {
  const [activeMachine, setActiveMachine] = useState('home') // 'home' | 'atm' | 'ticket' | 'food'
  const [learningMode, setLearningMode] = useState('practice') // 'learn' | 'practice' | 'independent'
  const [language, setLanguage] = useState('both') // 'both' | 'en' | 'ur'
  const [largeText, setLargeText] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [currentScreenSpeech, setCurrentScreenSpeech] = useState(HOME_SPEECH_TEXT)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [ttsNotice, setTtsNotice] = useState('')

  const ttsSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window

  const showEnglish = language === 'both' || language === 'en'
  const showUrdu = language === 'both' || language === 'ur'

  const stopSpeech = useCallback(() => {
    if (ttsSupported) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [ttsSupported])

  const speakText = useCallback(
    (textToSpeak) => {
      if (!ttsSupported) {
        setTtsNotice(
          'Audio speech (Text-to-Speech) is not available in this browser, but all written guides are shown clearly on screen.'
        )
        return
      }
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        return
      }
      setTtsNotice('')
      const utterance = new SpeechSynthesisUtterance(textToSpeak || currentScreenSpeech)
      utterance.rate = 0.92 // Slightly slower, clearer pace for older adults
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      setIsSpeaking(true)
      window.speechSynthesis.speak(utterance)
    },
    [ttsSupported, currentScreenSpeech]
  )

  useEffect(() => {
    return () => {
      if (ttsSupported) {
        window.speechSynthesis.cancel()
      }
    }
  }, [ttsSupported])

  const handleGoHome = () => {
    stopSpeech()
    setActiveMachine('home')
    setCurrentScreenSpeech(HOME_SPEECH_TEXT)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStartMachine = (machineId, mode = learningMode) => {
    stopSpeech()
    setLearningMode(mode)
    setActiveMachine(machineId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleScrollToMachines = () => {
    const el = document.getElementById('practice-machines')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div
      className={`app-shell ${largeText ? 'extra-large-text' : ''} ${
        language === 'ur' ? 'rtl-mode' : ''
      }`}
    >
      <Header
        activeMachine={activeMachine}
        onGoHome={handleGoHome}
        onSelectMachine={(id) => handleStartMachine(id, learningMode)}
        learningMode={learningMode}
        onSelectLearningMode={(mode) => setLearningMode(mode)}
        language={language}
        onChangeLanguage={(lang) => setLanguage(lang)}
        largeText={largeText}
        onToggleLargeText={() => setLargeText((prev) => !prev)}
        onToggleHelp={() => setIsHelpOpen((prev) => !prev)}
        isHelpOpen={isHelpOpen}
        onSpeakCurrentScreen={() => speakText(currentScreenSpeech)}
        isSpeaking={isSpeaking}
        ttsSupported={ttsSupported}
      />

      {ttsNotice && (
        <div className="tts-notice-banner" role="status">
          <span>ℹ️ {ttsNotice}</span>
          <button type="button" onClick={() => setTtsNotice('')}>
            Dismiss
          </button>
        </div>
      )}

      <main className="main-container">
        {/* HOME PAGE */}
        {activeMachine === 'home' && (
          <div className="home-view">
            {/* Consumer Hero Section */}
            <section className="hero-banner" aria-labelledby="hero-title">
              <div className="hero-content-col">
                <div className="hero-badge-row">
                  <span className="hero-pill">
                    🛡️ 100% Safe Touchscreen Practice
                  </span>
                  {showUrdu && (
                    <span className="hero-pill" lang="ur" dir="rtl">
                      بزرگوں اور نئے سیکھنے والوں کے لیے محفوظ مشق
                    </span>
                  )}
                </div>

                <h1 id="hero-title" className="hero-title">
                  Kiosk of Confidence
                </h1>

                {showEnglish && (
                  <p className="hero-tagline">
                    Practice first. Use technology independently.
                  </p>
                )}
                {showUrdu && (
                  <p className="hero-tagline-urdu" lang="ur" dir="rtl">
                    پہلے مشق کریں۔ پھر خود اعتمادی کے ساتھ ٹیکنالوجی استعمال کریں۔
                  </p>
                )}

                {showEnglish && (
                  <p className="hero-explanation">
                    Feeling nervous at an ATM, ticket machine, or restaurant kiosk is completely natural. Build real-world confidence at your own pace through calm, guided simulations — with zero real money, zero personal data, and complete freedom to make and fix mistakes.
                  </p>
                )}
                {showUrdu && (
                  <p className="hero-explanation-urdu" lang="ur" dir="rtl">
                    اے ٹی ایم، ٹکٹ مشین یا ریستوران کی ٹچ اسکرین استعمال کرتے وقت جھجھک محسوس کرنا ایک عام بات ہے۔ یہاں آپ بغیر کسی خوف کے اپنی رفتار سے مشق کر سکتے ہیں۔ کوئی اصلی پیسہ یا ذاتی معلومات استعمال نہیں ہوتیں!
                  </p>
                )}

                <div className="hero-cta-row">
                  <button
                    type="button"
                    className="btn-hero-primary"
                    onClick={handleScrollToMachines}
                  >
                    <div className="btn-hero-text">
                      <span>Start Learning</span>
                      {showUrdu && (
                        <small lang="ur" dir="rtl">
                          سیکھنا شروع کریں
                        </small>
                      )}
                    </div>
                    <span className="btn-hero-arrow" aria-hidden="true">
                      ↓
                    </span>
                  </button>

                  <button
                    type="button"
                    className="btn-hero-secondary"
                    onClick={() => speakText(HOME_SPEECH_TEXT)}
                  >
                    <span aria-hidden="true">{isSpeaking ? '⏹' : '🔊'}</span>
                    <span>
                      {isSpeaking ? 'Stop Audio' : 'Listen to Introduction'}
                    </span>
                    {showUrdu && (
                      <span className="urdu-inline" lang="ur" dir="rtl">
                        • تعارف سنیں
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Visual Interactive Preview Card */}
              <div className="hero-visual-col" aria-hidden="true">
                <div className="hero-showcase-card">
                  <div className="showcase-top-bar">
                    <span className="showcase-dot" />
                    <span className="showcase-dot" />
                    <span className="showcase-dot" />
                    <span className="showcase-label">Safe Practice Environment</span>
                  </div>
                  <div className="showcase-body">
                    <div className="showcase-item">
                      <span className="showcase-icon">🏧</span>
                      <div>
                        <strong>ATM Banking</strong>
                        <small>Cash withdrawal & balance checks</small>
                      </div>
                      <span className="showcase-status">Simulated</span>
                    </div>
                    <div className="showcase-item">
                      <span className="showcase-icon">🎫</span>
                      <div>
                        <strong>Station Tickets</strong>
                        <small>Routes, classes & passenger counts</small>
                      </div>
                      <span className="showcase-status">Simulated</span>
                    </div>
                    <div className="showcase-item">
                      <span className="showcase-icon">🍔</span>
                      <div>
                        <strong>Food Ordering</strong>
                        <small>Menus, trays & pickup tokens</small>
                      </div>
                      <span className="showcase-status">Simulated</span>
                    </div>
                    <div className="showcase-reassurance">
                      ✓ Make mistakes safely & learn how to fix them
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Optional Home Screen Help Drawer when "? Help" is clicked */}
            {isHelpOpen && (
              <section className="home-help-box" aria-label="How to use Kiosk of Confidence">
                <div className="home-help-header">
                  <div>
                    <h2>❓ Quick Guide to Using This Platform</h2>
                    {showUrdu && (
                      <p className="urdu-text" lang="ur" dir="rtl">
                        اس پلیٹ فارم کو استعمال کرنے کا آسان طریقہ
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn-secondary-small"
                    onClick={() => setIsHelpOpen(false)}
                  >
                    ✖ Close Help
                  </button>
                </div>
                <div className="home-help-grid">
                  <div className="home-help-item">
                    <strong>1. Choose Any Machine</strong>
                    <p>
                      Tap <em>Start Practice</em> on the ATM, Ticket Booking, or Food Ordering card below.
                    </p>
                    {showUrdu && (
                      <p lang="ur" dir="rtl">
                        نیچے دی گئی کسی بھی مشین کے کارڈ پر ’’مشق شروع کریں‘‘ دبائیں۔
                      </p>
                    )}
                  </div>
                  <div className="home-help-item">
                    <strong>2. Switch Learning Modes Anytime</strong>
                    <p>
                      Use <em>Learn</em> for detailed explanations, <em>Guided Practice</em> for hints, or <em>Independent</em> to test yourself.
                    </p>
                    {showUrdu && (
                      <p lang="ur" dir="rtl">
                        سیکھنے، رہنمائی حاصل کرنے، یا خودکار مشق کے درمیان کسی بھی وقت تبدیلی کریں۔
                      </p>
                    )}
                  </div>
                  <div className="home-help-item">
                    <strong>3. Listen Out Loud</strong>
                    <p>
                      Press <em>🔊 Listen</em> in the top bar to have any screen read aloud clearly.
                    </p>
                    {showUrdu && (
                      <p lang="ur" dir="rtl">
                        ہدایات کو بلند آواز میں سننے کے لیے اوپر ’’🔊 سنیں‘‘ بٹن دبائیں۔
                      </p>
                    )}
                  </div>
                  <div className="home-help-item">
                    <strong>4. Adjust Text & Language</strong>
                    <p>
                      Toggle <em>Aa Text: Extra Large</em> or switch between English and Urdu whenever you like.
                    </p>
                    {showUrdu && (
                      <p lang="ur" dir="rtl">
                        الفاظ کو بڑا کرنے یا اردو اور انگریزی زبان کے انتخاب کے لیے اوپر والے بٹن استعمال کریں۔
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Simple Three-Step Explanation: Learn, Guided Practice, Independent Practice */}
            <section className="three-steps-section" aria-labelledby="how-it-works-heading">
              <div className="section-header-block">
                <span className="section-eyebrow">HOW IT WORKS • طریقۂ کار</span>
                <div className="section-heading-row">
                  {showEnglish && (
                    <h2 id="how-it-works-heading">
                      Build Confidence in Three Simple Steps
                    </h2>
                  )}
                  {showUrdu && (
                    <p className="urdu-section-subtitle" lang="ur" dir="rtl">
                      تین آسان مراحل میں ٹچ اسکرین مشین استعمال کرنے کا اعتماد حاصل کریں
                    </p>
                  )}
                </div>
              </div>

              <div className="three-steps-grid">
                {LEARNING_STEPS.map((step) => (
                  <div key={step.mode} className="learning-step-card">
                    <div className="learning-step-top">
                      <span className="learning-step-badge">Step {step.number}</span>
                      <span className="learning-step-icon" aria-hidden="true">
                        {step.icon}
                      </span>
                    </div>
                    {showEnglish && <h3>{step.title}</h3>}
                    {showUrdu && (
                      <p className="learning-step-urdu-title" lang="ur" dir="rtl">
                        {step.titleUrdu}
                      </p>
                    )}
                    {showEnglish && <p className="learning-step-desc">{step.description}</p>}
                    {showUrdu && (
                      <p className="learning-step-desc-urdu" lang="ur" dir="rtl">
                        {step.descriptionUrdu}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Three Practice Machine Cards */}
            <section
              id="practice-machines"
              className="machines-section"
              aria-labelledby="machines-heading"
            >
              <div className="section-header-block">
                <span className="section-eyebrow">INTERACTIVE SIMULATORS • مشق کی مشینیں</span>
                <div className="section-heading-row">
                  {showEnglish && (
                    <h2 id="machines-heading">Choose a Machine to Start Practicing</h2>
                  )}
                  {showUrdu && (
                    <p className="urdu-section-subtitle" lang="ur" dir="rtl">
                      مشق شروع کرنے کے لیے نیچے دی گئی کسی ایک مشین کا انتخاب کریں
                    </p>
                  )}
                </div>
              </div>

              <div className="machines-grid">
                {PRACTICE_MACHINES.map((machine) => (
                  <MachineCard
                    key={machine.id}
                    machine={machine}
                    language={language}
                    onStartMachine={handleStartMachine}
                  />
                ))}
              </div>
            </section>

            {/* Reassurance Footer Section */}
            <section className="safety-promise-card" aria-label="Safety promise">
              <div className="safety-icon" aria-hidden="true">
                🛡️
              </div>
              <div className="safety-promise-content">
                {showEnglish && <h3>Our Safety Promise to Every Learner</h3>}
                {showEnglish && (
                  <p>
                    This platform never asks for your name, phone number, bank account, or real card PIN. You cannot lose money or break anything here. Feel free to press every button, test what happens when you make a mistake, and practice as many times as you like.
                  </p>
                )}
                {showUrdu && (
                  <p className="urdu-text" lang="ur" dir="rtl">
                    <strong>حفاظتی وعدہ:</strong> یہ ویب سائٹ کبھی بھی آپ کا نام، فون نمبر، بینک اکاؤنٹ یا اصلی پن کوڈ نہیں مانگتی۔ یہاں آپ سے کوئی نقصان نہیں ہو سکتا۔ بے فکر ہو کر ہر بٹن دبائیں اور جتنی بار چاہیں مشق کریں!
                  </p>
                )}
              </div>
            </section>
          </div>
        )}

        {/* SIMULATOR 1: ATM */}
        {activeMachine === 'atm' && (
          <ATM
            learningMode={learningMode}
            language={language}
            isHelpOpen={isHelpOpen}
            onToggleHelp={() => setIsHelpOpen((prev) => !prev)}
            onGoHome={handleGoHome}
            onSelectLearningMode={(mode) => setLearningMode(mode)}
            onSpeakText={speakText}
            onUpdateScreenSpeech={setCurrentScreenSpeech}
          />
        )}

        {/* SIMULATOR 2: TICKET MACHINE */}
        {activeMachine === 'ticket' && (
          <TicketMachine
            learningMode={learningMode}
            language={language}
            isHelpOpen={isHelpOpen}
            onToggleHelp={() => setIsHelpOpen((prev) => !prev)}
            onGoHome={handleGoHome}
            onSelectLearningMode={(mode) => setLearningMode(mode)}
            onSpeakText={speakText}
            onUpdateScreenSpeech={setCurrentScreenSpeech}
          />
        )}

        {/* SIMULATOR 3: FOOD ORDERING MACHINE */}
        {activeMachine === 'food' && (
          <FoodMachine
            learningMode={learningMode}
            language={language}
            isHelpOpen={isHelpOpen}
            onToggleHelp={() => setIsHelpOpen((prev) => !prev)}
            onGoHome={handleGoHome}
            onSelectLearningMode={(mode) => setLearningMode(mode)}
            onSpeakText={speakText}
            onUpdateScreenSpeech={setCurrentScreenSpeech}
          />
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <p className="footer-brand">
            <strong>Kiosk of Confidence</strong> — Practice first. Use technology independently.
          </p>
          <p className="footer-note">
            100% Safe Educational Simulation • No Real Transactions or Personal Data
          </p>
        </div>
      </footer>
    </div>
  )
}
