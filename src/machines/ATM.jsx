import React, { useState, useEffect } from 'react'
import ProgressBar from '../components/ProgressBar'
import HelpPanel from '../components/HelpPanel'
import Icon from '../components/Icons'

const ATM_STEPS = [
  { id: 'welcome', label: 'Welcome', labelUrdu: 'خوش آمدید' },
  { id: 'service', label: 'Choose Service', labelUrdu: 'سہولت منتخب کریں' },
  { id: 'amount', label: 'Select Amount', labelUrdu: 'رقم منتخب کریں' },
  { id: 'review', label: 'Review & Edit', labelUrdu: 'جائزہ اور تبدیلی' },
  { id: 'receipt', label: 'Success & Receipt', labelUrdu: 'کامیابی اور رسید' },
]

const FICTIONAL_BALANCE = 25000 // Rs. 25,000 ($500 fictional balance)

const PRESET_AMOUNTS = [
  { value: 1000, label: 'Rs. 1,000', usd: '$20', tag: 'Small Cash', tagUrdu: 'چھوٹی رقم' },
  { value: 3000, label: 'Rs. 3,000', usd: '$50', tag: 'Everyday Use', tagUrdu: 'روزمرہ استعمال' },
  { value: 5000, label: 'Rs. 5,000', usd: '$100', tag: 'Popular Choice', tagUrdu: 'عام انتخاب' },
  { value: 10000, label: 'Rs. 10,000', usd: '$200', tag: 'Weekly Cash', tagUrdu: 'ہفتہ وار رقم' },
  { value: 15000, label: 'Rs. 15,000', usd: '$300', tag: 'Larger Amount', tagUrdu: 'بڑی رقم' },
  {
    value: 50000,
    label: 'Rs. 50,000 (Over Limit Test)',
    usd: '$1,000',
    tag: '⚠️ Practice Mistake',
    tagUrdu: '⚠️ غلطی کی مشق (حد سے زیادہ)',
    isMistakeTest: true,
  },
]

export default function ATM({
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
  const [serviceType, setServiceType] = useState('') // 'withdrawal' | 'balance'
  const [selectedAmount, setSelectedAmount] = useState(5000)
  const [customAmountInput, setCustomAmountInput] = useState('')
  const [showCustomKeypad, setShowCustomKeypad] = useState(false)
  const [feedbackBanner, setFeedbackBanner] = useState(null)
  const [correctedMistakeCount, setCorrectedMistakeCount] = useState(0)
  const [cardTakenBack, setCardTakenBack] = useState(false)
  const [isStuckHintVisible, setIsStuckHintVisible] = useState(false)

  const showEnglish = language === 'en'
  const showUrdu = language === 'ur'

  // Contextual screen explanations & hints per step
  const stepGuideData = [
    {
      title: 'Step 1: ATM Welcome Screen',
      titleUrdu: 'مرحلہ 1: اے ٹی ایم خوش آمدید اسکرین',
      learnExplanation:
        'A real ATM starts in standby mode waiting for you to insert your bank card. In this safe simulator, we NEVER ask for a real card number or PIN. You simply press the big green button to insert a pretend practice card.',
      learnExplanationUrdu:
        'حقیقی اے ٹی ایم کارڈ داخل کرنے سے شروع ہوتی ہے۔ اس محفوظ مشق میں کبھی بھی اصلی کارڈ نمبر یا پن نہیں مانگا جاتا۔ مشق شروع کرنے کے لیے سبز بٹن دبائیں۔',
      hintText:
        'Tap "Insert Practice Card (Begin)" to start. Want to see what happens if you insert a card the wrong way? Tap the yellow "Test Mistake: Insert Card Wrong Way" button!',
      hintTextUrdu:
        'مشق شروع کرنے کے لیے "پریکٹس کارڈ داخل کریں" بٹن دبائیں۔ اگر آپ دیکھنا چاہتے ہیں کہ کارڈ الٹا ڈالنے پر کیا ہوتا ہے تو پیلا بٹن دبائیں۔',
      mistakeTip:
        'Try tapping "Test Mistake: Insert Card Wrong Way" first so you never panic if a real ATM asks you to re-insert your card.',
      mistakeTipUrdu:
        'پہلے "کارڈ غلط طریقے سے ڈالنے کی مشق" والا بٹن دبا کر دیکھیں تاکہ حقیقی مشین پر گھبراہٹ نہ ہو۔',
      buttonGuide: [
        {
          buttonName: '💳 Insert Practice Card (Begin)',
          meaning: 'Starts the simulated ATM session using a pretend card.',
          meaningUrdu: 'فرضی کارڈ کے ساتھ اے ٹی ایم کی مشق شروع کرتا ہے۔',
        },
        {
          buttonName: '🔄 Test Mistake: Insert Card Wrong Way',
          meaning: 'Shows the friendly warning message an ATM gives if the card chip is facing the wrong direction.',
          meaningUrdu: 'دکھاتا ہے کہ اگر کارڈ الٹا ڈالا جائے تو مشین کیا پیغام دیتی ہے۔',
        },
      ],
    },
    {
      title: 'Step 2: Choose ATM Service',
      titleUrdu: 'مرحلہ 2: اے ٹی ایم سہولت منتخب کریں',
      learnExplanation:
        'Once your card is inside, the ATM asks what you want to do today. The two most common choices are "Cash Withdrawal" (taking money out) and "Balance Inquiry" (checking how much money is in your account without taking cash).',
      learnExplanationUrdu:
        'کارڈ داخل کرنے کے بعد مشین پوچھتی ہے کہ آپ کیا کرنا چاہتے ہیں: "رقم نکالنا" (Cash Withdrawal) یا صرف "بیلنس چیک کرنا" (Balance Inquiry)۔',
      hintText:
        'Choose either "💵 Cash Withdrawal" to practice taking out fictional money, or "📊 Balance Inquiry" to check your pretend balance.',
      hintTextUrdu:
        'فرضی رقم نکالنے کے لیے "رقم نکالیں" یا اکاؤنٹ کا بیلنس دیکھنے کے لیے "بیلنس چیک کریں" پر کلک کریں۔',
      mistakeTip:
        'Picked the wrong service? No problem! You can press "⬅ Go Back" on the next screen to switch anytime.',
      mistakeTipUrdu:
        'اگر غلط بٹن دب جائے تو فکر نہ کریں! آپ اگلی اسکرین پر "واپس جائیں" دبا کر اسے بدل سکتے ہیں۔',
      buttonGuide: [
        {
          buttonName: '💵 Cash Withdrawal',
          meaning: 'Lets you choose an amount of fictional cash to take out.',
          meaningUrdu: 'اکاؤنٹ سے فرضی نقد رقم نکالنے کے لیے۔',
        },
        {
          buttonName: '📊 Balance Inquiry',
          meaning: 'Shows how much money is available in your fictional account.',
          meaningUrdu: 'صرف یہ دیکھنے کے لیے کہ آپ کے فرضی اکاؤنٹ میں کتنی رقم موجود ہے۔',
        },
        {
          buttonName: '✖ Cancel & Eject Card',
          meaning: 'Stops the transaction immediately and returns to the welcome screen.',
          meaningUrdu: 'عمل کو فوراً روک کر کارڈ واپس لینے کے لیے۔',
        },
      ],
    },
    {
      title: 'Step 3: Select Fictional Withdrawal Amount',
      titleUrdu: 'مرحلہ 3: فرضی رقم کا انتخاب کریں',
      learnExplanation:
        'ATMs show preset "Fast Cash" amounts on both sides of the screen so you do not have to type numbers. You can also tap "Enter Different Amount" if you want a custom number. Your fictional available balance is Rs. 25,000 ($500).',
      learnExplanationUrdu:
        'اے ٹی ایم اسکرین پر تیار شدہ رقوم (Fast Cash) دکھائی جاتی ہیں تاکہ آپ کو نمبر ٹائپ نہ کرنے پڑیں۔ آپ کا فرضی بیلنس 25,000 روپے ہے۔',
      hintText:
        'Tap any amount button (such as Rs. 3,000 or Rs. 5,000) to continue. Or tap "Rs. 50,000 (Over Limit Test)" to practice fixing an error when an amount is too high!',
      hintTextUrdu:
        'کوئی بھی رقم منتخب کریں (جیسے 3,000 یا 5,000 روپے)۔ یا غلطی درست کرنے کی مشق کے لیے "50,000 روپے" والا بٹن دبا کر دیکھیں!',
      mistakeTip:
        'If you pick Rs. 50,000 or type an amount not divisible by Rs. 500, the ATM will gently explain the problem and let you pick again.',
      mistakeTipUrdu:
        'اگر آپ بیلنس سے زیادہ رقم منتخب کریں گے تو مشین پیار سے بتائے گی اور دوبارہ انتخاب کا موقع دے گی۔',
      buttonGuide: [
        {
          buttonName: 'Rs. 1,000 – Rs. 15,000 Buttons',
          meaning: 'Quickly selects that exact fictional amount and moves to the review screen.',
          meaningUrdu: 'منتخب کردہ رقم کے ساتھ جائزہ اسکرین پر لے جاتا ہے۔',
        },
        {
          buttonName: '🔢 Enter Custom Amount',
          meaning: 'Opens an on-screen number pad so you can type a different fictional amount.',
          meaningUrdu: 'اپنی مرضی کی رقم لکھنے کے لیے نمبر پیڈ کھولتا ہے۔',
        },
        {
          buttonName: '⬅ Go Back',
          meaning: 'Returns to the service selection screen.',
          meaningUrdu: 'پچھلی اسکرین پر واپس جانے کے لیے۔',
        },
      ],
    },
    {
      title: 'Step 4: Review & Correct Your Transaction',
      titleUrdu: 'مرحلہ 4: اپنی معلومات کا جائزہ لیں اور تصحیح کریں',
      learnExplanation:
        'Before any ATM gives out money, it shows a confirmation or review screen. This is your safety checkpoint! If you tapped the wrong amount or wrong service, you can change it right here before pressing Confirm.',
      learnExplanationUrdu:
        'رقم نکالنے سے پہلے مشین تصدیقی اسکرین دکھاتی ہے۔ اگر آپ سے غلط رقم منتخب ہو گئی ہے تو آپ یہاں "رقم تبدیل کریں" دبا کر اپنی غلطی درست کر سکتے ہیں۔',
      hintText:
        'Check the details below. Try tapping "✏️ Change Amount" or "🔄 Switch Service" to practice correcting a mistake, then tap "✅ Confirm & Complete" when ready!',
      hintTextUrdu:
        'تفصیلات چیک کریں۔ غلطی درست کرنے کی مشق کے لیے "رقم تبدیل کریں" دبائیں، اور پھر "تصدیق کریں" بٹن دبائیں۔',
      mistakeTip:
        'Real confidence comes from knowing you can always change your mind before pressing Confirm.',
      mistakeTipUrdu:
        'تصدیق کرنے سے پہلے آپ کسی بھی وقت اپنی منتخب کردہ رقم تبدیل کر سکتے ہیں۔',
      buttonGuide: [
        {
          buttonName: '✅ Confirm & Complete',
          meaning: 'Approves the simulated transaction and prints your pretend receipt.',
          meaningUrdu: 'فرضی لین دین مکمل کر کے رسید دکھاتا ہے۔',
        },
        {
          buttonName: '✏️ Change Amount (Fix Mistake)',
          meaning: 'Takes you back to pick a different cash amount.',
          meaningUrdu: 'غلط رقم کو بدلنے کے لیے واپس لے جاتا ہے۔',
        },
        {
          buttonName: '🔄 Switch Service',
          meaning: 'Lets you switch between Cash Withdrawal and Balance Inquiry.',
          meaningUrdu: 'رقم نکالنے یا بیلنس چیک کرنے کے درمیان تبدیلی کے لیے۔',
        },
        {
          buttonName: '✖ Cancel Transaction',
          meaning: 'Stops everything safely without taking out any money.',
          meaningUrdu: 'بغیر کسی لین دین کے عمل منسوخ کرتا ہے۔',
        },
      ],
    },
    {
      title: 'Step 5: Simulated Success & ATM Receipt',
      titleUrdu: 'مرحلہ 5: کامیابی اور فرضی رسید',
      learnExplanation:
        'Congratulations! On many modern ATMs, the machine beeps and pushes your bank card out FIRST before giving cash. Taking your card back right away ensures you never leave it behind.',
      learnExplanationUrdu:
        'مبارک ہو! حقیقی اے ٹی ایم اکثر نقد رقم دینے سے پہلے آپ کا کارڈ باہر نکالتی ہے تاکہ آپ اپنا کارڈ مشین میں نہ بھولیں۔',
      hintText:
        'Tap "💳 Take Practice Card Back" first, review your simulated receipt and learning summary, then practice again or return home!',
      hintTextUrdu:
        'پہلے "پریکٹس کارڈ واپس لیں" بٹن دبائیں، اپنی فرضی رسید دیکھیں، اور پھر دوبارہ مشق کریں یا ہوم پیج پر جائیں۔',
      mistakeTip: '',
      mistakeTipUrdu: '',
      buttonGuide: [
        {
          buttonName: '💳 Take Practice Card Back',
          meaning: 'Builds the habit of collecting your bank card before walking away.',
          meaningUrdu: 'مشین سے ہٹنے سے پہلے اپنا کارڈ واپس لینے کی عادت پختہ کرتا ہے۔',
        },
        {
          buttonName: '🔁 Practice ATM Again',
          meaning: 'Resets the simulator so you can try another transaction.',
          meaningUrdu: 'دوبارہ مشق شروع کرنے کے لیے۔',
        },
      ],
    },
  ]

  const currentGuide = stepGuideData[stepIndex] || stepGuideData[0]

  // Keep parent speech text updated whenever step changes
  useEffect(() => {
    if (onUpdateScreenSpeech) {
      onUpdateScreenSpeech({
        en: `ATM Simulator. ${currentGuide.title}. ${currentGuide.learnExplanation} Hint: ${currentGuide.hintText}`,
        ur: `اے ٹی ایم مشق۔ ${currentGuide.titleUrdu}. ${currentGuide.learnExplanationUrdu} اشارہ: ${currentGuide.hintTextUrdu}`,
        urAudio: `atm-step-${stepIndex}`,
      })
    }
    setIsStuckHintVisible(false)
    const timer = setTimeout(() => {
      setIsStuckHintVisible(true)
    }, 12000)
    return () => clearTimeout(timer)
  }, [stepIndex])

  const handleInsertCardRightWay = () => {
    setFeedbackBanner(null)
    setStepIndex(1)
  }

  const handleInsertCardWrongWay = () => {
    setCorrectedMistakeCount((c) => c + 1)
    setFeedbackBanner({
      type: 'warning',
      en: 'Practice Mistake Triggered: "Card Read Error — Please make sure the gold chip is facing UP and towards the machine." Now tap the green button to insert it the right way!',
      ur: 'مشق کی غلطی: "کارڈ پڑھنے میں دشواری — براہ کرم کارڈ سیدھا کر کے دوبارہ ڈالیں۔" اب سبز بٹن دبا کر کارڈ صحیح طریقے سے داخل کریں!',
    })
  }

  const handleSelectService = (type) => {
    setServiceType(type)
    setFeedbackBanner(null)
    if (type === 'balance') {
      // Balance inquiry jumps directly to Review step (index 3) so user can review & confirm or switch to withdrawal
      setStepIndex(3)
    } else {
      setStepIndex(2)
    }
  }

  const handleSelectPresetAmount = (item) => {
    if (item.isMistakeTest || item.value > FICTIONAL_BALANCE) {
      setCorrectedMistakeCount((c) => c + 1)
      setFeedbackBanner({
        type: 'warning',
        en: `Mistake Recovery Practice: You selected Rs. ${item.value.toLocaleString()}, which is more than your fictional balance of Rs. ${FICTIONAL_BALANCE.toLocaleString()} ($500). No harm done! Simply pick a smaller amount below (like Rs. 3,000 or Rs. 5,000).`,
        ur: `غلطی درست کرنے کی مشق: آپ نے ${item.value.toLocaleString()} روپے منتخب کیے جو آپ کے فرضی بیلنس (${FICTIONAL_BALANCE.toLocaleString()} روپے) سے زیادہ ہیں۔ کوئی بات نہیں! نیچے دی گئی چھوٹی رقوم میں سے کوئی ایک منتخب کریں۔`,
      })
      return
    }
    setSelectedAmount(item.value)
    setFeedbackBanner(null)
    setStepIndex(3)
  }

  const handleCustomKeypadDigit = (digit) => {
    if (customAmountInput.length < 5) {
      setCustomAmountInput((prev) => prev + digit)
    }
  }

  const handleCustomKeypadClear = () => {
    setCustomAmountInput('')
  }

  const handleCustomKeypadBackspace = () => {
    setCustomAmountInput((prev) => prev.slice(0, -1))
  }

  const handleCustomAmountSubmit = () => {
    const val = parseInt(customAmountInput, 10)
    if (!val || val <= 0) {
      setCorrectedMistakeCount((c) => c + 1)
      setFeedbackBanner({
        type: 'warning',
        en: 'Please enter an amount greater than 0 using the number buttons.',
        ur: 'براہ کرم صفر سے بڑی رقم درج کریں۔',
      })
      return
    }
    if (val > FICTIONAL_BALANCE) {
      setCorrectedMistakeCount((c) => c + 1)
      setFeedbackBanner({
        type: 'warning',
        en: `That amount (Rs. ${val.toLocaleString()}) is higher than your fictional balance of Rs. ${FICTIONAL_BALANCE.toLocaleString()}. Use "Backspace" or "Clear" to enter a smaller amount!`,
        ur: `یہ رقم (${val.toLocaleString()} روپے) آپ کے فرضی بیلنس سے زیادہ ہے۔ براہ کرم کم رقم درج کریں۔`,
      })
      return
    }
    if (val % 500 !== 0) {
      setCorrectedMistakeCount((c) => c + 1)
      setFeedbackBanner({
        type: 'warning',
        en: `ATMs only carry Rs. 500 and Rs. 1,000 notes. You entered Rs. ${val.toLocaleString()}. Try entering a multiple of 500 (like 1500, 2500, or 4000)!`,
        ur: `اے ٹی ایم صرف 500 اور 1000 کے نوٹ دیتی ہے۔ براہ کرم 500 کے حساب سے رقم لکھیں (مثلاً 1500، 2500 یا 4000)۔`,
      })
      return
    }
    setSelectedAmount(val)
    setShowCustomKeypad(false)
    setFeedbackBanner(null)
    setStepIndex(3)
  }

  const handleEditAmountFromReview = () => {
    setCorrectedMistakeCount((c) => c + 1)
    setServiceType('withdrawal')
    setFeedbackBanner({
      type: 'info',
      en: 'Great job practicing an edit! Choose your new withdrawal amount below.',
      ur: 'بہت خوب! اب نیچے سے اپنی نئی رقم منتخب کریں۔',
    })
    setStepIndex(2)
  }

  const handleSwitchServiceFromReview = () => {
    setCorrectedMistakeCount((c) => c + 1)
    setFeedbackBanner({
      type: 'info',
      en: 'You returned to the Service Screen safely. Pick whichever service you want now!',
      ur: 'آپ بحفاظت سہولت کے انتخاب والی اسکرین پر واپس آ گئے ہیں۔',
    })
    setStepIndex(1)
  }

  const handleCancelTransaction = () => {
    setStepIndex(0)
    setServiceType('')
    setCustomAmountInput('')
    setShowCustomKeypad(false)
    setCardTakenBack(false)
    setFeedbackBanner({
      type: 'info',
      en: 'Transaction Cancelled Safely: Your pretend card was returned and no money was taken.',
      ur: 'عمل بحفاظت منسوخ کر دیا گیا: آپ کا فرضی کارڈ واپس آ گیا ہے اور کوئی رقم نہیں نکالی گئی۔',
    })
  }

  const handleResetSimulator = () => {
    setStepIndex(0)
    setServiceType('')
    setSelectedAmount(5000)
    setCustomAmountInput('')
    setShowCustomKeypad(false)
    setFeedbackBanner(null)
    setCardTakenBack(false)
  }

  return (
    <div className="simulator-page">
      <ProgressBar
        machineName="ATM Practice Simulator"
        machineNameUrdu="اے ٹی ایم کی مشق"
        steps={ATM_STEPS}
        currentStepIndex={stepIndex}
        onStepClick={(idx) => {
          setFeedbackBanner(null)
          setStepIndex(idx)
        }}
        language={language}
      />

      <div className="simulator-workspace">
        {/* Left / Top: Interactive ATM Kiosk Frame */}
        <section className="kiosk-machine-frame atm-frame" aria-label="Simulated ATM Screen">
          <div className="kiosk-hardware-top">
            <div className="kiosk-bezel-title">
              <span>Practice ATM</span>
              <span className="kiosk-slot-indicator">
                {stepIndex === 0 ? (
                  <>
                    <span className="status-dot ready" aria-hidden="true" />
                    Card Slot Ready
                  </>
                ) : (
                  <>
                    <Icon name="card" size={16} />
                    Demo Card Inside
                  </>
                )}
              </span>
            </div>
            <div className="security-reassurance-strip">
              No real card. No real PIN.
            </div>
          </div>

          <div className="kiosk-screen">
            {/* Feedback / Mistake Recovery Alert Banner */}
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

            {/* STEP 0: WELCOME SCREEN */}
            {stepIndex === 0 && (
              <div className="kiosk-step-content">
                <div className="kiosk-welcome-hero">
                  <span className="hero-big-icon" aria-hidden="true">
                    <Icon name="atm" size={52} />
                  </span>
                  {showEnglish && <h2>Welcome to the Practice ATM</h2>}
                  {showUrdu && (
                    <h3 className="urdu-heading" lang="ur" dir="rtl">
                      پریکٹس اے ٹی ایم میں خوش آمدید
                    </h3>
                  )}
                  {showEnglish && (
                    <p className="kiosk-lead">
                      Practice checking your balance or taking out cash at your own pace. No real card or PIN is ever needed.
                    </p>
                  )}
                  {showUrdu && (
                    <p className="kiosk-lead-urdu" lang="ur" dir="rtl">
                      اپنی رفتار سے بیلنس چیک کرنے یا رقم نکالنے کی مشق کریں۔ کسی اصلی کارڈ یا پن کی ضرورت نہیں ہے۔
                    </p>
                  )}
                </div>

                <div className="kiosk-button-grid single-col">
                  <button
                    type="button"
                    className="kiosk-action-btn primary-green"
                    onClick={handleInsertCardRightWay}
                  >
                    <span className="btn-icon">
                      <Icon name="card" size={28} />
                    </span>
                    <div className="btn-text-block">
                      {showEnglish && <strong>Insert Practice Card (Begin)</strong>}
                      {showUrdu && (
                        <span className="urdu-btn-text" lang="ur" dir="rtl">
                          پریکٹس کارڈ داخل کریں (شروع کریں)
                        </span>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    className="kiosk-action-btn warning-outline"
                    onClick={handleInsertCardWrongWay}
                  >
                    <span className="btn-icon">
                      <Icon name="refresh" size={28} />
                    </span>
                    <div className="btn-text-block">
                      {showEnglish && (
                        <strong>Test Mistake: What if I insert my card the wrong way?</strong>
                      )}
                      {showUrdu && (
                        <span className="urdu-btn-text" lang="ur" dir="rtl">
                          غلطی کی مشق: اگر کارڈ الٹا ڈالا جائے تو کیا ہوگا؟
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1: CHOOSE SERVICE */}
            {stepIndex === 1 && (
              <div className="kiosk-step-content">
                {showEnglish && <h2>Please Select a Service</h2>}
                {showUrdu && (
                  <h3 className="urdu-heading" lang="ur" dir="rtl">
                    براہ کرم سہولت منتخب کریں
                  </h3>
                )}
                {showEnglish && (
                  <p className="kiosk-instruction">
                    Touch one of the large buttons below to tell the ATM what you would like to do:
                  </p>
                )}
                {showUrdu && (
                  <p className="kiosk-instruction-urdu" lang="ur" dir="rtl">
                    مشین کو بتانے کے لیے نیچے دیے گئے بڑے بٹنوں میں سے ایک کو چھوئیں:
                  </p>
                )}

                <div className="kiosk-button-grid two-col">
                  <button
                    type="button"
                    className="kiosk-action-btn primary-blue"
                    onClick={() => handleSelectService('withdrawal')}
                  >
                    <span className="btn-icon">
                      <Icon name="cash" size={28} />
                    </span>
                    <div className="btn-text-block">
                      {showEnglish && <strong>Cash Withdrawal</strong>}
                      {showEnglish && <small>Take out pretend cash</small>}
                      {showUrdu && (
                        <span className="urdu-btn-text" lang="ur" dir="rtl">
                          رقم نکالیں (Cash Withdrawal)
                        </span>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    className="kiosk-action-btn primary-teal"
                    onClick={() => handleSelectService('balance')}
                  >
                    <span className="btn-icon">
                      <Icon name="chart" size={28} />
                    </span>
                    <div className="btn-text-block">
                      {showEnglish && <strong>Balance Inquiry</strong>}
                      {showEnglish && <small>Check available pretend balance</small>}
                      {showUrdu && (
                        <span className="urdu-btn-text" lang="ur" dir="rtl">
                          بیلنس چیک کریں (Balance Inquiry)
                        </span>
                      )}
                    </div>
                  </button>
                </div>

                <div className="kiosk-bottom-nav">
                  <button
                    type="button"
                    className="kiosk-nav-btn back-btn"
                    onClick={() => setStepIndex(0)}
                  >
                    ⬅ Go Back {showUrdu && <span lang="ur">• واپس</span>}
                  </button>
                  <button
                    type="button"
                    className="kiosk-nav-btn cancel-btn"
                    onClick={handleCancelTransaction}
                  >
                    ✖ Cancel & Eject Card {showUrdu && <span lang="ur">• منسوخ کریں</span>}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SELECT AMOUNT */}
            {stepIndex === 2 && (
              <div className="kiosk-step-content">
                <div className="balance-pill-bar">
                  <span>
                    💰 Fictional Available Balance: <strong>Rs. {FICTIONAL_BALANCE.toLocaleString()} ($500)</strong>
                  </span>
                  {showUrdu && (
                    <span lang="ur" dir="rtl">
                      فرضی موجودہ بیلنس: <strong>25,000 روپے</strong>
                    </span>
                  )}
                </div>

                {showEnglish && <h2>Select Withdrawal Amount</h2>}
                {showUrdu && (
                  <h3 className="urdu-heading" lang="ur" dir="rtl">
                    نکالنے کے لیے رقم منتخب کریں
                  </h3>
                )}

                {!showCustomKeypad ? (
                  <>
                    <div className="kiosk-button-grid two-col">
                      {PRESET_AMOUNTS.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          className={`kiosk-action-btn ${
                            item.isMistakeTest ? 'warning-outline' : 'amount-choice-btn'
                          }`}
                          onClick={() => handleSelectPresetAmount(item)}
                        >
                          <div className="btn-text-block">
                            <strong>
                              {item.label} <span className="muted-usd">({item.usd})</span>
                            </strong>
                            {showEnglish && <small>{item.tag}</small>}
                            {showUrdu && (
                              <span className="urdu-btn-text" lang="ur" dir="rtl">
                                {item.tagUrdu}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="custom-amount-toggle-row">
                      <button
                        type="button"
                        className="kiosk-action-btn secondary-action"
                        onClick={() => {
                          setFeedbackBanner(null)
                          setShowCustomKeypad(true)
                        }}
                      >
                        🔢 Enter a Different Amount (Use Number Pad)
                        {showUrdu && (
                          <span className="urdu-btn-text" lang="ur" dir="rtl">
                            اپنی مرضی کی رقم لکھیں (نمبر پیڈ)
                          </span>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="custom-keypad-box">
                    {showEnglish && (
                      <p className="keypad-helper">
                        Enter a fictional amount in multiples of Rs. 500 (up to Rs. 25,000):
                      </p>
                    )}
                    {showUrdu && (
                      <p className="urdu-text" lang="ur" dir="rtl">
                        500 کے حساب سے رقم درج کریں (زیادہ سے زیادہ 25,000 روپے):
                      </p>
                    )}

                    <div className="keypad-display" aria-live="polite">
                      Rs. {customAmountInput || '0'}
                    </div>

                    <div className="keypad-grid">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '00'].map((digit) => (
                        <button
                          key={digit}
                          type="button"
                          className="keypad-btn"
                          onClick={() => handleCustomKeypadDigit(digit)}
                        >
                          {digit}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="keypad-btn clear-key"
                        onClick={handleCustomKeypadBackspace}
                      >
                        ⌫ Erase
                      </button>
                    </div>

                    <div className="keypad-actions-row">
                      <button
                        type="button"
                        className="kiosk-nav-btn back-btn"
                        onClick={handleCustomKeypadClear}
                      >
                        🗑️ Clear All {showUrdu && <span lang="ur">• صاف کریں</span>}
                      </button>
                      <button
                        type="button"
                        className="kiosk-nav-btn back-btn"
                        onClick={() => setShowCustomKeypad(false)}
                      >
                        ⬅ Preset Amounts {showUrdu && <span lang="ur">• تیار رقوم</span>}
                      </button>
                      <button
                        type="button"
                        className="kiosk-action-btn primary-green"
                        onClick={handleCustomAmountSubmit}
                      >
                        ✅ Enter Amount {showUrdu && <span lang="ur">• رقم درج کریں</span>}
                      </button>
                    </div>
                  </div>
                )}

                <div className="kiosk-bottom-nav">
                  <button
                    type="button"
                    className="kiosk-nav-btn back-btn"
                    onClick={() => setStepIndex(1)}
                  >
                    ⬅ Go Back to Services {showUrdu && <span lang="ur">• واپس جائیں</span>}
                  </button>
                  <button
                    type="button"
                    className="kiosk-nav-btn cancel-btn"
                    onClick={handleCancelTransaction}
                  >
                    ✖ Cancel {showUrdu && <span lang="ur">• منسوخ کریں</span>}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW & EDIT TRANSACTION */}
            {stepIndex === 3 && (
              <div className="kiosk-step-content">
                {showEnglish && <h2>Review Your Transaction Details</h2>}
                {showUrdu && (
                  <h3 className="urdu-heading" lang="ur" dir="rtl">
                    اپنی معلومات کا جائزہ لیں
                  </h3>
                )}

                <div className="review-summary-card">
                  <div className="review-row">
                    <span>Account (فرضی اکاؤنٹ):</span>
                    <strong>Practice Savings •••• 0000</strong>
                  </div>
                  <div className="review-row">
                    <span>Selected Service (منتخب سہولت):</span>
                    <strong>
                      {serviceType === 'balance'
                        ? '📊 Balance Inquiry (بیلنس چیک)'
                        : '💵 Cash Withdrawal (رقم نکالنا)'}
                    </strong>
                  </div>
                  <div className="review-row">
                    <span>Current Fictional Balance (موجودہ بیلنس):</span>
                    <strong>Rs. {FICTIONAL_BALANCE.toLocaleString()} ($500)</strong>
                  </div>

                  {serviceType === 'withdrawal' && (
                    <>
                      <div className="review-row highlight-row">
                        <span>Withdrawal Amount (نکالی جانے والی رقم):</span>
                        <strong className="big-amount">
                          Rs. {selectedAmount.toLocaleString()}
                        </strong>
                      </div>
                      <div className="review-row">
                        <span>Remaining Fictional Balance (باقی بیلنس):</span>
                        <strong>
                          Rs. {(FICTIONAL_BALANCE - selectedAmount).toLocaleString()}
                        </strong>
                      </div>
                    </>
                  )}
                </div>

                {/* Guided Mistake Correction Prompt */}
                <div className="mistake-correction-box">
                  <div>
                    {showEnglish && (
                      <p>
                        <strong>🛠️ Practice Correcting a Choice:</strong> Did you select the wrong amount or service? Use the Edit buttons below before confirming!
                      </p>
                    )}
                    {showUrdu && (
                      <p className="urdu-text" lang="ur" dir="rtl">
                        <strong>🛠️ تبدیلی کی مشق:</strong> کیا آپ سے غلط رقم یا سہولت منتخب ہو گئی ہے؟ تصدیق کرنے سے پہلے نیچے دیے گئے بٹن سے تبدیل کریں!
                      </p>
                    )}
                  </div>
                  <div className="edit-buttons-row">
                    {serviceType === 'withdrawal' ? (
                      <button
                        type="button"
                        className="kiosk-edit-btn"
                        onClick={handleEditAmountFromReview}
                      >
                        ✏️ Change Amount {showUrdu && <span lang="ur">• رقم تبدیل کریں</span>}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="kiosk-edit-btn"
                        onClick={handleEditAmountFromReview}
                      >
                        💵 Switch to Cash Withdrawal {showUrdu && <span lang="ur">• رقم نکالیں</span>}
                      </button>
                    )}

                    <button
                      type="button"
                      className="kiosk-edit-btn"
                      onClick={handleSwitchServiceFromReview}
                    >
                      🔄 Change Service {showUrdu && <span lang="ur">• سہولت تبدیل کریں</span>}
                    </button>
                  </div>
                </div>

                <div className="kiosk-confirm-row">
                  <button
                    type="button"
                    className="kiosk-action-btn primary-green confirm-large"
                    onClick={() => {
                      setFeedbackBanner(null)
                      setStepIndex(4)
                    }}
                  >
                    <span className="btn-icon">
                      <Icon name="check" size={28} />
                    </span>
                    <div className="btn-text-block">
                      {showEnglish && (
                        <strong>
                          {serviceType === 'balance'
                            ? 'Confirm & Print Balance Receipt'
                            : `Confirm & Withdraw Rs. ${selectedAmount.toLocaleString()}`}
                        </strong>
                      )}
                      {showUrdu && (
                        <span className="urdu-btn-text" lang="ur" dir="rtl">
                          تصدیق کریں اور رسید حاصل کریں
                        </span>
                      )}
                    </div>
                  </button>
                </div>

                <div className="kiosk-bottom-nav">
                  <button
                    type="button"
                    className="kiosk-nav-btn back-btn"
                    onClick={() => setStepIndex(serviceType === 'balance' ? 1 : 2)}
                  >
                    ⬅ Go Back {showUrdu && <span lang="ur">• واپس جائیں</span>}
                  </button>
                  <button
                    type="button"
                    className="kiosk-nav-btn cancel-btn"
                    onClick={handleCancelTransaction}
                  >
                    ✖ Cancel Transaction {showUrdu && <span lang="ur">• منسوخ کریں</span>}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: SIMULATED SUCCESS & RECEIPT */}
            {stepIndex === 4 && (
              <div className="kiosk-step-content">
                <div className="success-banner">
                  <span className="success-icon" aria-hidden="true">
                    <Icon name="success" size={42} />
                  </span>
                  <div>
                    {showEnglish && <h2>Simulated Transaction Complete!</h2>}
                    {showUrdu && (
                      <h3 className="urdu-heading" lang="ur" dir="rtl">
                        آپ کی فرضی مشق کامیابی سے مکمل ہو گئی!
                      </h3>
                    )}
                    <p className="sim-disclaimer">
                      SIMULATION ONLY — No real money or bank account was used.
                    </p>
                  </div>
                </div>

                {/* Take Card Back Reminder */}
                <div className={`card-pickup-box ${cardTakenBack ? 'done' : 'attention'}`}>
                  {!cardTakenBack ? (
                    <>
                      <div>
                        {showEnglish && (
                          <p>
                            <strong>🔔 Important Real-Life Habit:</strong> Many ATMs return your card FIRST before giving cash. Tap the button to take your practice card back!
                          </p>
                        )}
                        {showUrdu && (
                          <p className="urdu-text" lang="ur" dir="rtl">
                            <strong>🔔 اہم عادت:</strong> حقیقی مشین سے ہٹنے سے پہلے ہمیشہ اپنا کارڈ واپس لیں!
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        className="kiosk-action-btn primary-blue"
                        onClick={() => setCardTakenBack(true)}
                      >
                        💳 Take Practice Card Back {showUrdu && <span lang="ur">• کارڈ واپس لیں</span>}
                      </button>
                    </>
                  ) : (
                    <p className="card-taken-confirm">
                      ✅ Great habit! You took your practice card back safely. (آپ نے اپنا کارڈ بحفاظت واپس لے لیا ہے!)
                    </p>
                  )}
                </div>

                <div className="receipt-and-learning-grid">
                  {/* Simulated Paper Receipt */}
                  <div className="simulated-receipt" aria-label="Simulated ATM Receipt">
                    <div className="receipt-header">
                      <strong>CONFIDENCE BANK ATM</strong>
                      <span>SIMULATED PRACTICE RECEIPT</span>
                      <small>ATM ID: KOC-ATM-01 • DEMO ONLY</small>
                    </div>
                    <div className="receipt-body">
                      <div className="receipt-line">
                        <span>Card:</span>
                        <span>DEMO •••• 0000</span>
                      </div>
                      <div className="receipt-line">
                        <span>Transaction:</span>
                        <span>
                          {serviceType === 'balance' ? 'BALANCE INQUIRY' : 'CASH WITHDRAWAL'}
                        </span>
                      </div>
                      {serviceType === 'withdrawal' && (
                        <div className="receipt-line bold">
                          <span>Cash Dispensed:</span>
                          <span>Rs. {selectedAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="receipt-line">
                        <span>Available Balance:</span>
                        <span>
                          Rs.{' '}
                          {(
                            FICTIONAL_BALANCE -
                            (serviceType === 'withdrawal' ? selectedAmount : 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="receipt-footer">
                      *** NOT A REAL FINANCIAL RECEIPT ***
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
                        ✓ How to start an ATM session and choose between{' '}
                        <strong>Cash Withdrawal</strong> and <strong>Balance Inquiry</strong>.
                      </li>
                      <li>
                        ✓ How to select a Fast Cash amount or enter a custom amount safely.
                      </li>
                      <li>
                        ✓ How to check the <strong>Review Screen</strong> before pressing Confirm
                        {correctedMistakeCount > 0
                          ? ` (and you practiced correcting ${correctedMistakeCount} mistake/edit!).`
                          : '.'}
                      </li>
                      <li>
                        ✓ Remembering to collect your bank card before walking away from the ATM.
                      </li>
                    </ul>
                    {showUrdu && (
                      <p className="urdu-text" lang="ur" dir="rtl">
                        آپ نے اے ٹی ایم پر سہولت منتخب کرنا، رقم کا جائزہ لینا، غلطی درست کرنا اور کارڈ واپس لینا کامیابی سے سیکھ لیا ہے۔
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
                    🔁 Practice ATM Again {showUrdu && <span lang="ur">• دوبارہ مشق کریں</span>}
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
                      ⭐ Try Independent Mode (Fewer Hints){' '}
                      {showUrdu && <span lang="ur">• خودکار مشق آزمائیں</span>}
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

        {/* Right / Bottom: Contextual Learning & Help Panel */}
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
          urAudio={`atm-step-${stepIndex}`}
        />
      </div>
    </div>
  )
}

