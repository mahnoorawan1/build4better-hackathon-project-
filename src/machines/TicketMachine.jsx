import React, { useState, useEffect } from 'react'
import ProgressBar from '../components/ProgressBar'
import HelpPanel from '../components/HelpPanel'
import Icon from '../components/Icons'

const TICKET_STEPS = [
  { id: 'departure', label: 'Departure City', labelUrdu: 'روانگی کا شہر' },
  { id: 'destination', label: 'Destination', labelUrdu: 'منزل کا شہر' },
  { id: 'type', label: 'Ticket Type', labelUrdu: 'ٹکٹ کی قسم' },
  { id: 'passengers', label: 'Passengers', labelUrdu: 'مسافروں کی تعداد' },
  { id: 'review', label: 'Review & Edit', labelUrdu: 'جائزہ اور تبدیلی' },
  { id: 'confirmation', label: 'Ticket Confirmed', labelUrdu: 'ٹکٹ کی تصدیق' },
]

const CITIES = [
  { id: 'lahore', name: 'Lahore', nameUrdu: 'لاہور', platform: 'Platform 2' },
  { id: 'islamabad', name: 'Islamabad', nameUrdu: 'اسلام آباد', platform: 'Platform 1' },
  { id: 'karachi', name: 'Karachi', nameUrdu: 'کراچی', platform: 'Platform 4' },
  { id: 'multan', name: 'Multan', nameUrdu: 'ملتان', platform: 'Platform 3' },
  { id: 'peshawar', name: 'Peshawar', nameUrdu: 'پشاور', platform: 'Platform 5' },
  { id: 'faisalabad', name: 'Faisalabad', nameUrdu: 'فیصل آباد', platform: 'Platform 6' },
]

const TICKET_TYPES = [
  {
    id: 'economy',
    name: 'Economy Standard',
    nameUrdu: 'اکانومی اسٹینڈرڈ',
    price: 1200,
    usd: '$12',
    desc: 'Comfortable reserved seat',
    descUrdu: 'آرام دہ مخصوص نشست',
    icon: 'seat',
  },
  {
    id: 'business',
    name: 'AC Business Class',
    nameUrdu: 'اے سی بزنس کلاس',
    price: 2400,
    usd: '$24',
    desc: 'Extra legroom + complimentary refreshments',
    descUrdu: 'کشادہ نشست اور ریفریشمنٹ',
    icon: 'sparkle',
  },
  {
    id: 'senior',
    name: 'Senior Citizen (50% Discount)',
    nameUrdu: 'بزرگ شہری (50% رعایت)',
    price: 600,
    usd: '$6',
    desc: 'Special half-price fare for ages 60+',
    descUrdu: '60 سال سے زائد عمر کے افراد کے لیے خصوصی رعایت',
    icon: 'idCard',
  },
]

export default function TicketMachine({
  learningMode,
  language,
  isHelpOpen,
  onToggleHelp,
  onGoHome,
  onSelectLearningMode,
  onSpeakText,
  onUpdateScreenSpeech,
}) {
  const [stepIndex, setStepIndex] = useState(0)
  const [departureCity, setDepartureCity] = useState(CITIES[0])
  const [destinationCity, setDestinationCity] = useState(CITIES[1])
  const [ticketType, setTicketType] = useState(TICKET_TYPES[0])
  const [isRoundTrip, setIsRoundTrip] = useState(false)
  const [passengerCount, setPassengerCount] = useState(1)
  const [returnToReviewAfterEdit, setReturnToReviewAfterEdit] = useState(false)
  const [feedbackBanner, setFeedbackBanner] = useState(null)
  const [correctedMistakeCount, setCorrectedMistakeCount] = useState(0)
  const [isStuckHintVisible, setIsStuckHintVisible] = useState(false)

  const showEnglish = language === 'en'
  const showUrdu = language === 'ur'

  const singleTicketFare = ticketType.price * (isRoundTrip ? 2 : 1)
  const totalFare = singleTicketFare * passengerCount

  const stepGuideData = [
    {
      title: 'Step 1: Select Your Departure City (From Where?)',
      titleUrdu: 'مرحلہ 1: روانگی کا شہر منتخب کریں (کہاں سے جانا ہے؟)',
      learnExplanation:
        'Ticket kiosks at train and bus stations first ask where your journey begins ("Departure" or "From"). Touch the name of the city you are leaving from.',
      learnExplanationUrdu:
        'ٹکٹ مشین سب سے پہلے یہ پوچھتی ہے کہ آپ اپنا سفر کہاں سے شروع کر رہے ہیں (روانگی کا شہر)۔ اپنے شہر کے نام والا بٹن دبائیں۔',
      hintText:
        'Touch any city card below (for example, Lahore or Islamabad) to set your starting station.',
      hintTextUrdu:
        'اپنا روانگی کا اسٹیشن منتخب کرنے کے لیے نیچے کسی بھی شہر کے نام پر کلک کریں۔',
      mistakeTip:
        'If you tap the wrong starting city, you can easily press "⬅ Go Back" on the next screen or change it on the Review screen.',
      mistakeTipUrdu:
        'اگر غلط شہر دب جائے تو آپ اگلی اسکرین پر "واپس جائیں" دبا کر اسے تبدیل کر سکتے ہیں۔',
      buttonGuide: [
        {
          buttonName: '🚉 City Buttons (Lahore, Islamabad, etc.)',
          meaning: 'Sets the station where you will board the train or bus.',
          meaningUrdu: 'وہ اسٹیشن منتخب کرتا ہے جہاں سے آپ سوار ہوں گے۔',
        },
      ],
    },
    {
      title: 'Step 2: Select Your Destination City (To Where?)',
      titleUrdu: 'مرحلہ 2: منزل کا شہر منتخب کریں (کہاں جانا ہے؟)',
      learnExplanation:
        'Next, the machine asks where you are traveling to ("Destination"). Notice that your Departure City is shown at the top so you do not lose track.',
      learnExplanationUrdu:
        'اب مشین پوچھتی ہے کہ آپ کہاں جانا چاہتے ہیں (منزل کا شہر)۔ آپ کی روانگی کا شہر اوپر دکھایا جا رہا ہے۔',
      hintText:
        'Touch the city you want to travel to. Want to practice fixing a mistake? Try tapping the SAME city you started from to see how the machine helps you!',
      hintTextUrdu:
        'جس شہر جانا ہے اس پر کلک کریں۔ غلطی کی مشق کے لیے وہی شہر دوبارہ دبا کر دیکھیں جو آپ نے پہلے منتخب کیا تھا!',
      mistakeTip:
        'Tapping the same city for Departure and Destination is a very common touchscreen mistake. Try it safely here!',
      mistakeTipUrdu:
        'روانگی اور منزل کے لیے ایک ہی شہر دب جانا ایک عام غلطی ہے، یہاں بے خوف ہو کر آزمائیں۔',
      buttonGuide: [
        {
          buttonName: '🏁 Destination City Buttons',
          meaning: 'Selects the city where your journey ends.',
          meaningUrdu: 'وہ شہر منتخب کرتا ہے جہاں آپ کا سفر ختم ہوگا۔',
        },
        {
          buttonName: '⬅ Change Departure City',
          meaning: 'Takes you back to Step 1 if you picked the wrong starting city.',
          meaningUrdu: 'اگر روانگی کا شہر غلط منتخب ہو گیا ہو تو واپس لے جاتا ہے۔',
        },
      ],
    },
    {
      title: 'Step 3: Select Ticket Type & Class',
      titleUrdu: 'مرحلہ 3: ٹکٹ کی قسم منتخب کریں',
      learnExplanation:
        'Ticket machines let you choose your seating class (Economy, Business, or Senior Citizen Discount) and whether you need a One-Way ticket or a Return (Round-Trip) ticket.',
      learnExplanationUrdu:
        'یہاں آپ اپنی پسند کی کلاس (اکانومی، بزنس، یا بزرگ شہری رعایت) اور یک طرفہ یا دو طرفہ ٹکٹ منتخب کر سکتے ہیں۔',
      hintText:
        'Select a Ticket Class card, optionally toggle One-Way or Round-Trip, and press "Continue to Passengers ➡".',
      hintTextUrdu:
        'ٹکٹ کی قسم منتخب کریں اور پھر "اگلا مرحلہ (مسافروں کی تعداد)" بٹن دبائیں۔',
      mistakeTip:
        'Are you 60 or older? Look for the "Senior Citizen (50% Discount)" button on real kiosks to save money!',
      mistakeTipUrdu:
        'حقیقی مشینوں پر بزرگ شہریوں کے لیے خصوصی رعایت (Senior Citizen Discount) کا بٹن ضرور دیکھیں۔',
      buttonGuide: [
        {
          buttonName: '💺 Economy / ✨ Business / 🪪 Senior',
          meaning: 'Chooses the seat comfort level and ticket price per person.',
          meaningUrdu: 'نشست کی قسم اور فی کس کرایہ منتخب کرتا ہے۔',
        },
        {
          buttonName: '➡️ One-Way vs 🔄 Round-Trip',
          meaning: 'One-Way is a single journey; Round-Trip includes your return ticket back home.',
          meaningUrdu: 'یک طرفہ صرف جانے کا ٹکٹ ہے جبکہ دو طرفہ میں واپسی کا ٹکٹ بھی شامل ہوتا ہے۔',
        },
      ],
    },
    {
      title: 'Step 4: Select Number of Passengers',
      titleUrdu: 'مرحلہ 4: مسافروں کی تعداد منتخب کریں',
      learnExplanation:
        'Here you tell the machine how many people are traveling together. Use the "-" button to decrease or the "+" button to increase the number of tickets, or tap a number directly.',
      learnExplanationUrdu:
        'یہاں بتائیں کہ کتنے افراد سفر کر رہے ہیں۔ تعداد کم کرنے کے لیے "-" اور بڑھانے کے لیے "+" کا بٹن دبائیں۔',
      hintText:
        'Use the "+" or "-" buttons (or number buttons 1 to 5) to choose passenger quantity, then tap "Review Booking Details ➡".',
      hintTextUrdu:
        '"+" یا "-" بٹن سے مسافروں کی تعداد منتخب کریں اور پھر "بکنگ کا جائزہ لیں" پر کلک کریں۔',
      mistakeTip:
        'Added too many passengers? Just tap the "-" (Minus) button to reduce the number before continuing!',
      mistakeTipUrdu:
        'اگر مسافروں کی تعداد زیادہ ہو جائے تو "-" کا بٹن دبا کر کم کر لیں۔',
      buttonGuide: [
        {
          buttonName: '➖ Decrease / ➕ Increase',
          meaning: 'Removes or adds one passenger at a time and updates the total price automatically.',
          meaningUrdu: 'مسافروں کی تعداد کم یا زیادہ کرتا ہے اور کل کرایہ دکھاتا ہے۔',
        },
        {
          buttonName: 'Review Booking Details ➡',
          meaning: 'Moves to the final summary screen where you can double-check everything.',
          meaningUrdu: 'معلومات کی تصدیق والی اسکرین پر لے جاتا ہے۔',
        },
      ],
    },
    {
      title: 'Step 5: Review & Edit Your Booking',
      titleUrdu: 'مرحلہ 5: بکنگ کی تفصیلات کا جائزہ لیں اور تبدیلی کریں',
      learnExplanation:
        'Before printing your ticket, the kiosk shows every detail of your trip on one screen. Each line has an "✏️ Edit" button so you can fix a wrong city, ticket class, or passenger count without starting over!',
      learnExplanationUrdu:
        'ٹکٹ جاری کرنے سے پہلے مشین تمام تفصیلات ایک ساتھ دکھاتی ہے۔ آپ کسی بھی خانے کے سامنے "تبدیل کریں" دبا کر اپنی غلطی درست کر سکتے ہیں!',
      hintText:
        'Check your Route, Ticket Class, and Passengers. Try clicking any "✏️ Edit" button to practice fixing a detail, then tap "✅ Confirm & Print Simulated Ticket"!',
      hintTextUrdu:
        'اپنے سفر کی تفصیلات چیک کریں۔ مشق کے طور پر کسی بھی "تبدیل کریں" بٹن کو آزمائیں، پھر "تصدیق کریں اور ٹکٹ حاصل کریں" دبائیں۔',
      mistakeTip:
        'You never have to cancel the whole booking just to fix one detail — use the individual "✏️ Edit" buttons!',
      mistakeTipUrdu:
        'ایک غلطی ٹھیک کرنے کے لیے پورا عمل منسوخ کرنے کی ضرورت نہیں، صرف متعلقہ "تبدیل کریں" بٹن دبائیں۔',
      buttonGuide: [
        {
          buttonName: '✏️ Edit Departure / Destination / Class / Passengers',
          meaning: 'Jumps directly to that specific step so you can change your choice and return here.',
          meaningUrdu: 'مخصوص معلومات تبدیل کرنے کے لیے براہ راست اس مرحلے پر لے جاتا ہے۔',
        },
        {
          buttonName: '✅ Confirm & Print Simulated Ticket',
          meaning: 'Completes the simulated booking and displays your pretend boarding ticket.',
          meaningUrdu: 'فرضی بکنگ مکمل کر کے آپ کا پریکٹس ٹکٹ دکھاتا ہے۔',
        },
      ],
    },
    {
      title: 'Step 6: Simulated Ticket Confirmation',
      titleUrdu: 'مرحلہ 6: آپ کا فرضی ٹکٹ تیار ہے!',
      learnExplanation:
        'Your simulated ticket is ready! On a real station kiosk, the printed paper ticket drops into the collection tray below the screen, showing your Coach number, Seat number, and Platform.',
      learnExplanationUrdu:
        'آپ کا فرضی ٹکٹ تیار ہے! حقیقی اسٹیشن مشین پر ٹکٹ نیچے بنے خانے میں پرنٹ ہو کر آ جاتا ہے جس پر کوچ، سیٹ اور پلیٹ فارم نمبر لکھا ہوتا ہے۔',
      hintText:
        'Inspect your simulated ticket stub and what you learned today. Then practice again or return home!',
      hintTextUrdu:
        'اپنا فرضی ٹکٹ اور سیکھی گئی باتیں دیکھیں، پھر دوبارہ مشق کریں یا ہوم پیج پر واپس جائیں۔',
      mistakeTip: '',
      mistakeTipUrdu: '',
      buttonGuide: [
        {
          buttonName: '🔁 Book Another Practice Ticket',
          meaning: 'Starts a fresh ticket booking simulation.',
          meaningUrdu: 'نئے سرے سے ٹکٹ بکنگ کی مشق شروع کرتا ہے۔',
        },
      ],
    },
  ]

  const currentGuide = stepGuideData[stepIndex] || stepGuideData[0]

  useEffect(() => {
    if (onUpdateScreenSpeech) {
      onUpdateScreenSpeech({
        en: `Ticket Booking Simulator. ${currentGuide.title}. ${currentGuide.learnExplanation} Hint: ${currentGuide.hintText}`,
        ur: `ٹکٹ بکنگ مشق۔ ${currentGuide.titleUrdu}. ${currentGuide.learnExplanationUrdu} اشارہ: ${currentGuide.hintTextUrdu}`,
        urAudio: `ticket-step-${stepIndex}`,
      })
    }
    setIsStuckHintVisible(false)
    const timer = setTimeout(() => {
      setIsStuckHintVisible(true)
    }, 12000)
    return () => clearTimeout(timer)
  }, [stepIndex])

  const handleSelectDeparture = (city) => {
    setDepartureCity(city)
    setFeedbackBanner(null)
    // If destination happened to be the same city during an edit, clear or warn
    if (returnToReviewAfterEdit && destinationCity.id !== city.id) {
      setReturnToReviewAfterEdit(false)
      setStepIndex(4)
    } else {
      setStepIndex(1)
    }
  }

  const handleSelectDestination = (city) => {
    if (city.id === departureCity.id) {
      setCorrectedMistakeCount((c) => c + 1)
      setFeedbackBanner({
        type: 'warning',
        en: `Mistake Recovery Practice: You selected ${city.name} as both your Departure and Destination city! A train cannot travel from ${city.name} to ${city.name}. Please tap a different destination city below.`,
        ur: `غلطی درست کرنے کی مشق: آپ نے روانگی اور منزل دونوں کے لیے "${city.nameUrdu}" منتخب کر لیا ہے! براہ کرم منزل کے لیے کوئی دوسرا شہر منتخب کریں۔`,
      })
      return
    }
    setDestinationCity(city)
    setFeedbackBanner(null)
    if (returnToReviewAfterEdit) {
      setReturnToReviewAfterEdit(false)
      setStepIndex(4)
    } else {
      setStepIndex(2)
    }
  }

  const handleJumpToEditStep = (targetStep) => {
    setCorrectedMistakeCount((c) => c + 1)
    setReturnToReviewAfterEdit(true)
    setFeedbackBanner({
      type: 'info',
      en: 'Editing your booking: Make your new choice below and we will bring you right back to the Review screen!',
      ur: 'بکنگ میں تبدیلی: نیچے اپنا نیا انتخاب کریں، ہم آپ کو واپس جائزہ اسکرین پر لے آئیں گے!',
    })
    setStepIndex(targetStep)
  }

  const handleCancelBooking = () => {
    setStepIndex(0)
    setDepartureCity(CITIES[0])
    setDestinationCity(CITIES[1])
    setTicketType(TICKET_TYPES[0])
    setIsRoundTrip(false)
    setPassengerCount(1)
    setReturnToReviewAfterEdit(false)
    setFeedbackBanner({
      type: 'info',
      en: 'Booking Cancelled Safely: All choices were reset and no ticket was issued.',
      ur: 'بکنگ بحفاظت منسوخ کر دی گئی ہے اور تمام معلومات صاف کر دی گئی ہیں۔',
    })
  }

  const handleResetSimulator = () => {
    setStepIndex(0)
    setDepartureCity(CITIES[0])
    setDestinationCity(CITIES[1])
    setTicketType(TICKET_TYPES[0])
    setIsRoundTrip(false)
    setPassengerCount(1)
    setReturnToReviewAfterEdit(false)
    setFeedbackBanner(null)
  }

  return (
    <div className="simulator-page">
      <ProgressBar
        machineName="Ticket Booking Kiosk"
        machineNameUrdu="ٹکٹ بکنگ مشین کی مشق"
        steps={TICKET_STEPS}
        currentStepIndex={stepIndex}
        onStepClick={(idx) => {
          setFeedbackBanner(null)
          setStepIndex(idx)
        }}
        language={language}
      />

      <div className="simulator-workspace">
        <section className="kiosk-machine-frame ticket-frame" aria-label="Simulated Ticket Booking Machine">
          <div className="kiosk-hardware-top">
            <div className="kiosk-bezel-title">
              <span>Practice ticket machine</span>
              <span className="kiosk-slot-indicator">
                <Icon name="ticket" size={16} />
                Practice Mode — No Real Payment
              </span>
            </div>
            {stepIndex > 0 && stepIndex < 5 && (
              <div className="live-route-strip">
                <span>
                  📍 Route: <strong>{departureCity.name}</strong> ({departureCity.nameUrdu}) ➔{' '}
                  <strong>{stepIndex >= 2 ? `${destinationCity.name} (${destinationCity.nameUrdu})` : '?'}</strong>
                </span>
                {stepIndex >= 3 && (
                  <span>
                    • 🎟️ {ticketType.name} ({isRoundTrip ? 'Round-Trip' : 'One-Way'})
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="kiosk-screen">
            {feedbackBanner && (
              <div className={`kiosk-feedback-banner ${feedbackBanner.type}`} role="status">
                {showEnglish && <p>{feedbackBanner.en}</p>}
                {showUrdu && (
                  <p className="urdu-text" lang="ur" dir="rtl">
                    {feedbackBanner.ur}
                  </p>
                )}
              </div>
            )}

            {/* STEP 0: SELECT DEPARTURE CITY */}
            {stepIndex === 0 && (
              <div className="kiosk-step-content">
                {showEnglish && <h2>Step 1: Select Departure City (From Where?)</h2>}
                {showUrdu && (
                  <h3 className="urdu-heading" lang="ur" dir="rtl">
                    مرحلہ 1: روانگی کا شہر منتخب کریں (آپ کہاں سے سفر شروع کر رہے ہیں؟)
                  </h3>
                )}
                {showEnglish && (
                  <p className="kiosk-instruction">
                    Touch the station you are departing from:
                  </p>
                )}

                <div className="kiosk-button-grid three-col">
                  {CITIES.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      className={`kiosk-action-btn city-btn ${
                        departureCity.id === city.id ? 'selected-choice' : ''
                      }`}
                      onClick={() => handleSelectDeparture(city)}
                    >
                      <span className="btn-icon">
                        <Icon name="station" size={28} />
                      </span>
                      <div className="btn-text-block">
                        <strong>{city.name}</strong>
                        <span className="urdu-btn-text" lang="ur" dir="rtl">
                          {city.nameUrdu}
                        </span>
                        <small>{city.platform}</small>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 1: SELECT DESTINATION CITY */}
            {stepIndex === 1 && (
              <div className="kiosk-step-content">
                {showEnglish && (
                  <h2>
                    Step 2: Select Destination City (Traveling from {departureCity.name})
                  </h2>
                )}
                {showUrdu && (
                  <h3 className="urdu-heading" lang="ur" dir="rtl">
                    مرحلہ 2: منزل کا شہر منتخب کریں ({departureCity.nameUrdu} سے کہاں جانا ہے؟)
                  </h3>
                )}
                {showEnglish && (
                  <p className="kiosk-instruction">
                    Touch the city you want to travel to (or tap <strong>{departureCity.name}</strong> to see how the machine helps if you accidentally pick the same city!):
                  </p>
                )}

                <div className="kiosk-button-grid three-col">
                  {CITIES.map((city) => {
                    const isSameAsDeparture = city.id === departureCity.id
                    return (
                      <button
                        key={city.id}
                        type="button"
                        className={`kiosk-action-btn city-btn ${
                          isSameAsDeparture ? 'warning-outline' : ''
                        }`}
                        onClick={() => handleSelectDestination(city)}
                      >
                        <span className="btn-icon">
                          <Icon name={isSameAsDeparture ? 'warning' : 'destination'} size={28} />
                        </span>
                        <div className="btn-text-block">
                          <strong>{city.name}</strong>
                          <span className="urdu-btn-text" lang="ur" dir="rtl">
                            {city.nameUrdu}
                          </span>
                          <small>
                            {isSameAsDeparture
                              ? 'Same as Departure (Test Mistake)'
                              : `Travel to ${city.name}`}
                          </small>
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="kiosk-bottom-nav">
                  <button
                    type="button"
                    className="kiosk-nav-btn back-btn"
                    onClick={() => {
                      setFeedbackBanner(null)
                      setStepIndex(0)
                    }}
                  >
                    ⬅ Change Departure City {showUrdu && <span lang="ur">• روانگی کا شہر بدلیں</span>}
                  </button>
                  <button
                    type="button"
                    className="kiosk-nav-btn cancel-btn"
                    onClick={handleCancelBooking}
                  >
                    ✖ Cancel Booking {showUrdu && <span lang="ur">• منسوخ کریں</span>}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SELECT TICKET TYPE */}
            {stepIndex === 2 && (
              <div className="kiosk-step-content">
                {showEnglish && <h2>Step 3: Select Ticket Type & Class</h2>}
                {showUrdu && (
                  <h3 className="urdu-heading" lang="ur" dir="rtl">
                    مرحلہ 3: ٹکٹ کی قسم اور کلاس منتخب کریں
                  </h3>
                )}

                {/* One-Way vs Round-Trip Toggle */}
                <div className="trip-direction-toggle" role="group" aria-label="Journey type">
                  <button
                    type="button"
                    className={`direction-btn ${!isRoundTrip ? 'active' : ''}`}
                    onClick={() => setIsRoundTrip(false)}
                  >
                    ➡️ One-Way Ticket (Single Fare)
                    {showUrdu && (
                      <span className="urdu-inline" lang="ur" dir="rtl">
                        یک طرفہ ٹکٹ
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    className={`direction-btn ${isRoundTrip ? 'active' : ''}`}
                    onClick={() => setIsRoundTrip(true)}
                  >
                    🔄 Round-Trip / Return Ticket (2x Fare)
                    {showUrdu && (
                      <span className="urdu-inline" lang="ur" dir="rtl">
                        دو طرفہ ٹکٹ (آنے جانے کا)
                      </span>
                    )}
                  </button>
                </div>

                <div className="kiosk-button-grid single-col">
                  {TICKET_TYPES.map((type) => {
                    const isSelected = ticketType.id === type.id
                    const displayedPrice = type.price * (isRoundTrip ? 2 : 1)
                    return (
                      <button
                        key={type.id}
                        type="button"
                        className={`kiosk-action-btn ticket-class-btn ${
                          isSelected ? 'selected-choice' : ''
                        }`}
                        onClick={() => {
                          setTicketType(type)
                          setFeedbackBanner(null)
                          if (returnToReviewAfterEdit) {
                            setReturnToReviewAfterEdit(false)
                            setStepIndex(4)
                          } else {
                            setStepIndex(3)
                          }
                        }}
                      >
                        <span className="btn-icon">
                          <Icon name={type.icon} size={28} />
                        </span>
                        <div className="btn-text-block">
                          <div className="ticket-type-header-line">
                            <strong>{type.name}</strong>
                            <span className="price-badge">
                              Rs. {displayedPrice.toLocaleString()} / person
                            </span>
                          </div>
                          {showEnglish && <small>{type.desc}</small>}
                          {showUrdu && (
                            <span className="urdu-btn-text" lang="ur" dir="rtl">
                              {type.nameUrdu} — {type.descUrdu}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="kiosk-bottom-nav">
                  <button
                    type="button"
                    className="kiosk-nav-btn back-btn"
                    onClick={() => setStepIndex(1)}
                  >
                    ⬅ Go Back to Destination {showUrdu && <span lang="ur">• واپس جائیں</span>}
                  </button>
                  <button
                    type="button"
                    className="kiosk-nav-btn cancel-btn"
                    onClick={handleCancelBooking}
                  >
                    ✖ Cancel Booking {showUrdu && <span lang="ur">• منسوخ کریں</span>}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SELECT PASSENGER QUANTITY */}
            {stepIndex === 3 && (
              <div className="kiosk-step-content">
                {showEnglish && <h2>Step 4: Select Number of Passengers</h2>}
                {showUrdu && (
                  <h3 className="urdu-heading" lang="ur" dir="rtl">
                    مرحلہ 4: مسافروں کی تعداد منتخب کریں
                  </h3>
                )}

                <div className="passenger-counter-card">
                  <div className="counter-controls">
                    <button
                      type="button"
                      className="counter-stepper-btn"
                      onClick={() => setPassengerCount((c) => Math.max(1, c - 1))}
                      disabled={passengerCount <= 1}
                      aria-label="Decrease passenger count"
                    >
                      ➖ Remove 1
                    </button>

                    <div className="counter-readout" aria-live="polite">
                      <span className="counter-number">{passengerCount}</span>
                      <span className="counter-label">
                        {passengerCount === 1 ? 'Passenger (مسافر)' : 'Passengers (مسافر)'}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="counter-stepper-btn"
                      onClick={() => setPassengerCount((c) => Math.min(6, c + 1))}
                      disabled={passengerCount >= 6}
                      aria-label="Increase passenger count"
                    >
                      ➕ Add 1
                    </button>
                  </div>

                  {/* Quick number buttons */}
                  <div className="quick-number-row">
                    <span>Quick Select:</span>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        className={`quick-num-btn ${passengerCount === num ? 'active' : ''}`}
                        onClick={() => setPassengerCount(num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <div className="live-fare-estimate">
                    <span>
                      Simulated Total Fare ({passengerCount} × Rs. {singleTicketFare.toLocaleString()}):
                    </span>
                    <strong>Rs. {totalFare.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="kiosk-confirm-row">
                  <button
                    type="button"
                    className="kiosk-action-btn primary-green confirm-large"
                    onClick={() => {
                      setReturnToReviewAfterEdit(false)
                      setFeedbackBanner(null)
                      setStepIndex(4)
                    }}
                  >
                    <span className="btn-icon">
                      <Icon name="oneWay" size={28} />
                    </span>
                    <div className="btn-text-block">
                      {showEnglish && <strong>Review Booking Details</strong>}
                      {showUrdu && (
                        <span className="urdu-btn-text" lang="ur" dir="rtl">
                          بکنگ کی تفصیلات کا جائزہ لیں
                        </span>
                      )}
                    </div>
                  </button>
                </div>

                <div className="kiosk-bottom-nav">
                  <button
                    type="button"
                    className="kiosk-nav-btn back-btn"
                    onClick={() => setStepIndex(2)}
                  >
                    ⬅ Go Back to Ticket Class {showUrdu && <span lang="ur">• واپس جائیں</span>}
                  </button>
                  <button
                    type="button"
                    className="kiosk-nav-btn cancel-btn"
                    onClick={handleCancelBooking}
                  >
                    ✖ Cancel Booking {showUrdu && <span lang="ur">• منسوخ کریں</span>}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & EDIT BOOKING DETAILS */}
            {stepIndex === 4 && (
              <div className="kiosk-step-content">
                {showEnglish && <h2>Step 5: Review & Edit Your Ticket Details</h2>}
                {showUrdu && (
                  <h3 className="urdu-heading" lang="ur" dir="rtl">
                    مرحلہ 5: ٹکٹ کی تفصیلات چیک کریں (غلطی ہو تو تبدیل کریں)
                  </h3>
                )}

                <div className="review-summary-card">
                  <div className="review-row with-edit">
                    <div>
                      <span className="review-label">Departure City (روانگی کا شہر):</span>
                      <strong>
                        {departureCity.name} ({departureCity.nameUrdu}) — {departureCity.platform}
                      </strong>
                    </div>
                    <button
                      type="button"
                      className="kiosk-edit-btn"
                      onClick={() => handleJumpToEditStep(0)}
                    >
                      ✏️ Edit Departure {showUrdu && <span lang="ur">• تبدیل کریں</span>}
                    </button>
                  </div>

                  <div className="review-row with-edit">
                    <div>
                      <span className="review-label">Destination City (منزل کا شہر):</span>
                      <strong>
                        {destinationCity.name} ({destinationCity.nameUrdu})
                      </strong>
                    </div>
                    <button
                      type="button"
                      className="kiosk-edit-btn"
                      onClick={() => handleJumpToEditStep(1)}
                    >
                      ✏️ Edit Destination {showUrdu && <span lang="ur">• تبدیل کریں</span>}
                    </button>
                  </div>

                  <div className="review-row with-edit">
                    <div>
                      <span className="review-label">Ticket Type & Journey (ٹکٹ کی قسم):</span>
                      <strong>
                        {ticketType.name} ({ticketType.nameUrdu}) •{' '}
                        {isRoundTrip ? 'Round-Trip (دو طرفہ)' : 'One-Way (یک طرفہ)'}
                      </strong>
                    </div>
                    <button
                      type="button"
                      className="kiosk-edit-btn"
                      onClick={() => handleJumpToEditStep(2)}
                    >
                      ✏️ Edit Ticket Type {showUrdu && <span lang="ur">• تبدیل کریں</span>}
                    </button>
                  </div>

                  <div className="review-row with-edit">
                    <div>
                      <span className="review-label">Passengers (مسافروں کی تعداد):</span>
                      <strong>
                        {passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers'}
                      </strong>
                    </div>
                    <button
                      type="button"
                      className="kiosk-edit-btn"
                      onClick={() => handleJumpToEditStep(3)}
                    >
                      ✏️ Edit Passengers {showUrdu && <span lang="ur">• تبدیل کریں</span>}
                    </button>
                  </div>

                  <div className="review-row highlight-row">
                    <span>Simulated Total Fare (کل فرضی کرایہ):</span>
                    <strong className="big-amount">Rs. {totalFare.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="kiosk-confirm-row">
                  <button
                    type="button"
                    className="kiosk-action-btn primary-green confirm-large"
                    onClick={() => {
                      setFeedbackBanner(null)
                      setStepIndex(5)
                    }}
                  >
                    <span className="btn-icon">
                      <Icon name="ticket" size={28} />
                    </span>
                    <div className="btn-text-block">
                      {showEnglish && <strong>Confirm & Print Simulated Ticket</strong>}
                      {showUrdu && (
                        <span className="urdu-btn-text" lang="ur" dir="rtl">
                          تصدیق کریں اور فرضی ٹکٹ حاصل کریں
                        </span>
                      )}
                    </div>
                  </button>
                </div>

                <div className="kiosk-bottom-nav">
                  <button
                    type="button"
                    className="kiosk-nav-btn back-btn"
                    onClick={() => setStepIndex(3)}
                  >
                    ⬅ Go Back {showUrdu && <span lang="ur">• واپس جائیں</span>}
                  </button>
                  <button
                    type="button"
                    className="kiosk-nav-btn cancel-btn"
                    onClick={handleCancelBooking}
                  >
                    ✖ Cancel Booking {showUrdu && <span lang="ur">• منسوخ کریں</span>}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: SIMULATED BOOKING CONFIRMATION */}
            {stepIndex === 5 && (
              <div className="kiosk-step-content">
                <div className="success-banner">
                  <span className="success-icon" aria-hidden="true">
                    <Icon name="ticket" size={42} />
                  </span>
                  <div>
                    {showEnglish && <h2>Simulated Ticket Booking Confirmed!</h2>}
                    {showUrdu && (
                      <h3 className="urdu-heading" lang="ur" dir="rtl">
                        آپ کی فرضی ٹکٹ بکنگ مکمل ہو گئی!
                      </h3>
                    )}
                    <p className="sim-disclaimer">
                      SIMULATION ONLY — No real reservation or payment was processed.
                    </p>
                  </div>
                </div>

                <div className="receipt-and-learning-grid">
                  {/* Simulated Boarding Pass / Ticket */}
                  <div className="simulated-receipt ticket-stub" aria-label="Simulated Train Ticket">
                    <div className="receipt-header">
                      <strong>CONFIDENCE EXPRESS RAILWAYS</strong>
                      <span>SIMULATED BOARDING PASS</span>
                      <small>Booking Ref: KOC-8492 • DEMO ONLY</small>
                    </div>
                    <div className="receipt-body">
                      <div className="receipt-line bold">
                        <span>From:</span>
                        <span>
                          {departureCity.name} ({departureCity.platform})
                        </span>
                      </div>
                      <div className="receipt-line bold">
                        <span>To:</span>
                        <span>{destinationCity.name}</span>
                      </div>
                      <div className="receipt-line">
                        <span>Class:</span>
                        <span>{ticketType.name}</span>
                      </div>
                      <div className="receipt-line">
                        <span>Journey:</span>
                        <span>{isRoundTrip ? 'Round-Trip' : 'One-Way'}</span>
                      </div>
                      <div className="receipt-line">
                        <span>Passengers:</span>
                        <span>
                          {passengerCount} (Coach B • Seat{' '}
                          {passengerCount === 1 ? '14' : `14–${13 + passengerCount}`})
                        </span>
                      </div>
                      <div className="receipt-line bold">
                        <span>Simulated Total:</span>
                        <span>Rs. {totalFare.toLocaleString()} (DEMO)</span>
                      </div>
                    </div>
                    <div className="receipt-footer">
                      *** PRACTICE TICKET — NOT VALID FOR TRAVEL ***
                    </div>
                  </div>

                  {/* What You Learned Summary */}
                  <div className="learning-summary-card">
                    {showEnglish && <h3>🌟 What You Learned Today:</h3>}
                    {showUrdu && (
                      <h4 className="urdu-heading" lang="ur" dir="rtl">
                        🌟 آج آپ نے کیا سیکھا:
                      </h4>
                    )}
                    <ul className="learned-list">
                      <li>
                        ✓ Choosing your <strong>Departure</strong> and{' '}
                        <strong>Destination</strong> stations in the right order.
                      </li>
                      <li>
                        ✓ Selecting seating classes (including checking for Senior Citizen discounts!) and One-Way vs. Round-Trip options.
                      </li>
                      <li>
                        ✓ Using the <strong>+</strong> and <strong>-</strong> stepper buttons to adjust passenger quantities.
                      </li>
                      <li>
                        ✓ Using the <strong>Review & Edit</strong> screen to fix mistakes before printing your ticket
                        {correctedMistakeCount > 0
                          ? ` (you practiced ${correctedMistakeCount} mistake/edit correction!).`
                          : '.'}
                      </li>
                    </ul>
                    {showUrdu && (
                      <p className="urdu-text" lang="ur" dir="rtl">
                        آپ نے روانگی اور منزل کا شہر منتخب کرنا، ٹکٹ کی قسم اور مسافروں کی تعداد بدلنا، اور تصدیق سے پہلے اپنی غلطی درست کرنا سیکھ لیا ہے۔
                      </p>
                    )}
                  </div>
                </div>

                <div className="completion-actions-row">
                  <button
                    type="button"
                    className="kiosk-action-btn primary-blue"
                    onClick={handleResetSimulator}
                  >
                    🔁 Book Another Practice Ticket{' '}
                    {showUrdu && <span lang="ur">• دوبارہ مشق کریں</span>}
                  </button>

                  {learningMode !== 'independent' && (
                    <button
                      type="button"
                      className="kiosk-action-btn primary-teal"
                      onClick={() => {
                        onSelectLearningMode('independent')
                        handleResetSimulator()
                      }}
                    >
                      ⭐ Try Independent Mode {showUrdu && <span lang="ur">• خودکار مشق آزمائیں</span>}
                    </button>
                  )}

                  <button
                    type="button"
                    className="kiosk-action-btn secondary-action"
                    onClick={onGoHome}
                  >
                    🏠 Return to Home Screen {showUrdu && <span lang="ur">• ہوم پیج پر واپس جائیں</span>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <HelpPanel
          learningMode={learningMode}
          language={language}
          screenTitle={currentGuide.title}
          screenTitleUrdu={currentGuide.titleUrdu}
          learnExplanation={currentGuide.learnExplanation}
          learnExplanationUrdu={currentGuide.learnExplanationUrdu}
          hintText={currentGuide.hintText}
          hintTextUrdu={currentGuide.hintTextUrdu}
          mistakeTip={currentGuide.mistakeTip}
          mistakeTipUrdu={currentGuide.mistakeTipUrdu}
          buttonGuide={currentGuide.buttonGuide}
          isHelpOpen={isHelpOpen}
          onToggleHelp={onToggleHelp}
          isStuckHintVisible={isStuckHintVisible}
          onShowStuckHint={() => setIsStuckHintVisible(true)}
          onSpeakText={onSpeakText}
          urAudio={`ticket-step-${stepIndex}`}
        />
      </div>
    </div>
  )
}

