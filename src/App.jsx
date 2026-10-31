import React, { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import MachineCard from './components/MachineCard'
import ATM from './machines/ATM'
import TicketMachine from './machines/TicketMachine'
import FoodMachine from './machines/FoodMachine'
import { ensureVoicesLoaded, speakSpeechPayload, stopAllSpeech } from './speech'
import './App.css'

const PRACTICE_MACHINES = [
  {
    id: 'atm',
    icon: 'atm',
    image: '/images/atm.jpg',
    title: 'ATM Practice',
    titleUrdu: 'اے ٹی ایم کی مشق',
    description:
      'Check a pretend balance or take out pretend cash. No real card and no PIN.',
    descriptionUrdu:
      'فرضی بیلنس دیکھیں یا فرضی رقم نکالیں۔ اصلی کارڈ یا پن کی ضرورت نہیں۔',
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
    icon: 'ticket',
    image: '/images/ticket.jpg',
    title: 'Ticket Booking Practice',
    titleUrdu: 'ٹکٹ بکنگ کی مشق',
    description:
      'Choose cities, a ticket type, and how many people are travelling. You can change any answer before you finish.',
    descriptionUrdu:
      'شہر، ٹکٹ کی قسم اور مسافروں کی تعداد منتخب کریں۔ ختم کرنے سے پہلے کوئی بھی جواب بدل سکتے ہیں۔',
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
    icon: 'food',
    image: '/images/food.jpg',
    title: 'Food Ordering Practice',
    titleUrdu: 'کھانا آرڈر کرنے کی مشق',
    description:
      'Choose a meal, change how many you want, remove a mistake, and get a pickup number.',
    descriptionUrdu:
      'کھانا منتخب کریں، تعداد بدلیں، غلط چیز ہٹائیں، اور اپنا نمبر لیں۔',
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

const HOME_SPEECH = {
  en: 'Welcome to Kiosk of Confidence. Practice first. Use technology independently. This is a safe practice website with three touchscreen simulators: ATM Practice, Ticket Booking Practice, and Food Ordering Practice. Touch any Start button to begin.',
  ur: 'اعتماد کے کیوسک میں خوش آمدید۔ پہلے مشق کریں۔ پھر خود اعتمادی کے ساتھ ٹیکنالوجی استعمال کریں۔ یہاں تین محفوظ مشقیں ہیں: اے ٹی ایم، ٹکٹ بکنگ، اور کھانا آرڈر۔ شروع کرنے کے لیے سبز بٹن دبائیں۔',
  urAudio: 'home',
}

export default function App() {
  const [activeMachine, setActiveMachine] = useState('home') // 'home' | 'atm' | 'ticket' | 'food'
  const [learningMode, setLearningMode] = useState('practice') // 'learn' | 'practice' | 'independent'
  const [language, setLanguage] = useState('en') // 'en' | 'ur'
  const [largeText, setLargeText] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [currentScreenSpeech, setCurrentScreenSpeech] = useState(HOME_SPEECH)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [ttsNotice, setTtsNotice] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const ttsSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window

  const showEnglish = language === 'en'
  const showUrdu = language === 'ur'
  const inSimulation = activeMachine !== 'home'

  const stopSpeech = useCallback(() => {
    stopAllSpeech()
    setIsSpeaking(false)
  }, [])

  const speakText = useCallback(
    async (textToSpeak) => {
      const speakingNow =
        isSpeaking ||
        (ttsSupported &&
          (window.speechSynthesis.speaking || window.speechSynthesis.pending))

      if (speakingNow) {
        stopSpeech()
        return
      }

      if (!ttsSupported && language !== 'ur') {
        setTtsNotice(
          'Audio speech (Text-to-Speech) is not available in this browser, but all written guides are shown clearly on screen.'
        )
        return
      }

      setTtsNotice('')
      setIsSpeaking(true)
      const result = await speakSpeechPayload(textToSpeak || currentScreenSpeech, language, {
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      })

      if (!result.ok) {
        setIsSpeaking(false)
        if (result.reason === 'empty' || result.reason === 'missing-audio') {
          setTtsNotice(
            language === 'ur'
              ? 'Urdu audio for this screen is not ready yet. Written Urdu stays on screen.'
              : 'No spoken text is available for this screen yet.'
          )
        } else if (result.reason === 'error') {
          setTtsNotice(
            language === 'ur'
              ? 'Urdu audio could not play. Check your speaker, then try Listen again.'
              : 'Speech could not play on this device. Written instructions stay on screen.'
          )
        }
        return
      }
    },
    [ttsSupported, currentScreenSpeech, language, isSpeaking, stopSpeech]
  )

  useEffect(() => {
    if (ttsSupported) {
      ensureVoicesLoaded()
    }
    return () => {
      stopAllSpeech()
    }
  }, [ttsSupported])

  useEffect(() => {
    // Stop current audio when the listener switches language, so the next Listen uses the new choice.
    stopSpeech()
  }, [language, stopSpeech])

  useEffect(() => {
    document.documentElement.style.fontSize = largeText ? '22px' : '19px'
    return () => {
      document.documentElement.style.fontSize = ''
    }
  }, [largeText])

  const handleGoHome = () => {
    stopSpeech()
    setMenuOpen(false)
    setActiveMachine('home')
    setCurrentScreenSpeech(HOME_SPEECH)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStartMachine = (machineId, mode = 'practice') => {
    stopSpeech()
    setMenuOpen(false)
    setLearningMode(mode)
    setActiveMachine(machineId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (!menuOpen) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen])

  return (
    <div
      className={`app-shell ${largeText ? 'extra-large-text' : ''} ${
        inSimulation ? 'sim-layout' : 'home-layout'
      }`}
    >
      <Header
        activeMachine={activeMachine}
        onGoHome={handleGoHome}
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
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((prev) => !prev)}
        onCloseMenu={() => setMenuOpen(false)}
      />

      <div className="app-content">
      {ttsNotice && (
        <div className="tts-notice-banner" role="status">
          <span>Notice: {ttsNotice}</span>
          <button type="button" onClick={() => setTtsNotice('')}>
            Dismiss
          </button>
        </div>
      )}

      <main className={`main-container machine-theme-${activeMachine}`}>
        {/* HOME PAGE */}
        {activeMachine === 'home' && (
          <div className="home-view">
            <section className="hero-banner" aria-labelledby="hero-title">
              <div className="hero-photo-wrap">
                <img
                  src="/images/home-hero.jpg?v=3"
                  alt="Older adults practising an ATM, train ticket registration, and food ordering screens"
                  className="hero-photo"
                />
              </div>

              <div className="hero-copy">
                <p className="hero-kicker">Practice first. No real money.</p>
                <h1 id="hero-title" className="hero-title">
                  Choose a machine
                </h1>
                <p className="hero-short">Tap the green Start button.</p>
                {showUrdu && (
                  <p className="hero-short-urdu" lang="ur" dir="rtl">
                    سبز بٹن دبائیں۔
                  </p>
                )}
                {showEnglish && (
                  <p className="hero-explanation">
                    This is a safe place to learn an ATM, a ticket machine, and a food-order screen. Take your time. You can always go back.
                  </p>
                )}
                {showUrdu && (
                  <p className="hero-explanation-urdu" lang="ur" dir="rtl">
                    یہاں اے ٹی ایم، ٹکٹ مشین اور کھانے کے آرڈر کی محفوظ مشق کریں۔ جلدی نہیں۔ آپ ہمیشہ واپس جا سکتے ہیں۔
                  </p>
                )}

                <ol className="journey-strip" aria-label="How practice works">
                  <li className="journey-step">
                    <span className="journey-num">1</span>
                    <span>
                      Pick a machine
                      {showUrdu && <small lang="ur" dir="rtl">مشین چنیں</small>}
                    </span>
                  </li>
                  <li className="journey-step">
                    <span className="journey-num">2</span>
                    <span>
                      Press the big button
                      {showUrdu && <small lang="ur" dir="rtl">بڑا بٹن دبائیں</small>}
                    </span>
                  </li>
                  <li className="journey-step">
                    <span className="journey-num">3</span>
                    <span>
                      Finish, then try again
                      {showUrdu && <small lang="ur" dir="rtl">مکمل کریں، پھر دہرائیں</small>}
                    </span>
                  </li>
                </ol>
              </div>
            </section>

            {/* Optional Home Screen Help Drawer when "? Help" is clicked */}
            {isHelpOpen && (
              <section className="home-help-box" aria-label="How to use Kiosk of Confidence">
                <div className="home-help-header">
                  <h2>How to use this website</h2>
                  <button
                    type="button"
                    className="btn-secondary-small"
                    onClick={() => setIsHelpOpen(false)}
                  >
                    Close help
                  </button>
                </div>
                <div className="home-help-grid">
                  <div className="home-help-item">
                    <strong>Green Start button</strong>
                    <p>
                      Opens the machine simulator with helpful step-by-step hints.
                    </p>
                    {showUrdu && (
                      <p lang="ur" dir="rtl">
                        مشین کی مشق کو مرحلہ وار اشاروں کے ساتھ کھولتا ہے۔
                      </p>
                    )}
                  </div>
                  <div className="home-help-item">
                    <strong>Explain first</strong>
                    <p>
                      Explains what every single button on the screen means before you touch it.
                    </p>
                    {showUrdu && (
                      <p lang="ur" dir="rtl">
                        اسکرین کے ہر بٹن کا مطلب آسان الفاظ میں سمجھاتا ہے۔
                      </p>
                    )}
                  </div>
                  <div className="home-help-item">
                    <strong>Listen</strong>
                    <p>
                      Reads the instructions on the screen out loud using your device speaker.
                    </p>
                    {showUrdu && (
                      <p lang="ur" dir="rtl">
                        اسکرین پر لکھی ہدایات کو بلند آواز میں پڑھ کر سناتا ہے۔
                      </p>
                    )}
                  </div>
                  <div className="home-help-item">
                    <strong>Bigger text and language</strong>
                    <p>
                      Use the top bar anytime to make letters Extra Large (A+) or switch between English and Urdu.
                    </p>
                    {showUrdu && (
                      <p lang="ur" dir="rtl">
                        الفاظ کو بڑا کرنے یا اردو/انگریزی زبان بدلنے کے لیے اوپر والے بٹن استعمال کریں۔
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Three Practice Machine Cards */}
            <section
              id="practice-machines"
              className="machines-section"
              aria-label="Choose a practice machine"
            >
              <div className="section-heading-row">
                {showEnglish && <h2>Tap Start on one machine</h2>}
                {showUrdu && (
                  <p className="urdu-heading" lang="ur" dir="rtl">
                    ایک مشین پر شروع کریں دبائیں
                  </p>
                )}
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
              <div>
                {showEnglish && <h3>Nothing here is real</h3>}
                {showEnglish && (
                  <p>
                    This website never asks for your name, phone number, bank account, or real card PIN. You cannot lose money or break anything here. Feel free to press every button, test what happens when you make a mistake, and practice as many times as you like!
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
        <p>
          Kiosk of Confidence. Practice only. No real money, cards, or personal details.
        </p>
      </footer>
      </div>
    </div>
  )
}

