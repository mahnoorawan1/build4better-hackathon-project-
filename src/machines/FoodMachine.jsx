import React, { useState, useEffect } from 'react'
import ProgressBar from '../components/ProgressBar'
import HelpPanel from '../components/HelpPanel'
import Icon from '../components/Icons'

const FOOD_STEPS = [
  { id: 'dining', label: 'Eat In or Takeaway', labelUrdu: 'یہاں کھائیں یا پارسل' },
  { id: 'menu', label: 'Choose Food & Edit Tray', labelUrdu: 'کھانا منتخب کریں' },
  { id: 'review', label: 'Review & Adjust Order', labelUrdu: 'آرڈر کا جائزہ اور تبدیلی' },
  { id: 'confirmed', label: 'Order Number & Receipt', labelUrdu: 'آرڈر نمبر اور رسید' },
]

const CATEGORIES = [
  { id: 'mains', name: 'Mains & Burgers', nameUrdu: 'برگر اور رول', icon: 'burger' },
  { id: 'sides', name: 'Sides & Snacks', nameUrdu: 'سنیکس اور سلاد', icon: 'fries' },
  { id: 'drinks', name: 'Drinks & Chai', nameUrdu: 'مشروبات اور چائے', icon: 'drink' },
  { id: 'sweets', name: 'Sweet Treats', nameUrdu: 'میٹھا', icon: 'dessert' },
]

const MENU_ITEMS = [
  {
    id: 'chicken-burger',
    category: 'mains',
    name: 'Crispy Chicken Burger',
    nameUrdu: 'کرسپی چکن برگر',
    price: 550,
    icon: 'burger',
    desc: 'Tender chicken fillet with lettuce & mild sauce',
  },
  {
    id: 'kebab-wrap',
    category: 'mains',
    name: 'Seekh Kebab Paratha Roll',
    nameUrdu: 'سیخ کباب پراٹھا رول',
    price: 450,
    icon: 'takeaway',
    desc: 'Freshly grilled kebab wrapped in warm paratha',
  },
  {
    id: 'paneer-sandwich',
    category: 'mains',
    name: 'Grilled Club Sandwich',
    nameUrdu: 'گرلڈ کلب سینڈوچ',
    price: 500,
    icon: 'food',
    desc: 'Toasted three-layer sandwich with veggies',
  },
  {
    id: 'french-fries',
    category: 'sides',
    name: 'Regular French Fries',
    nameUrdu: 'فرینچ فرائز (چپس)',
    price: 250,
    icon: 'fries',
    desc: 'Warm, lightly salted crispy potato fries',
  },
  {
    id: 'garden-salad',
    category: 'sides',
    name: 'Fresh Garden Salad Bowl',
    nameUrdu: 'تازہ سلاد باؤل',
    price: 300,
    icon: 'sparkle',
    desc: 'Cucumbers, tomatoes, lettuce & lemon dressing',
  },
  {
    id: 'corn-cup',
    category: 'sides',
    name: 'Sweet Buttered Corn Cup',
    nameUrdu: 'مکھن اور مکئی کا کپ',
    price: 200,
    icon: 'fries',
    desc: 'Steamed sweet corn with butter and mild spice',
  },
  {
    id: 'karak-chai',
    category: 'drinks',
    name: 'Cardamom Karak Chai',
    nameUrdu: 'الائچی والی کڑک چائے',
    price: 180,
    icon: 'drink',
    desc: 'Hot traditional milk tea with cardamom',
  },
  {
    id: 'mint-lemonade',
    category: 'drinks',
    name: 'Fresh Mint Lemonade',
    nameUrdu: 'پودینے اور لیموں کا شربت',
    price: 220,
    icon: 'drink',
    desc: 'Refreshing chilled mint and lemon drink',
  },
  {
    id: 'water-bottle',
    category: 'drinks',
    name: 'Mineral Water (500ml)',
    nameUrdu: 'منرل واٹر (پانی کی بوتل)',
    price: 100,
    icon: 'drink',
    desc: 'Chilled atau room-temperature bottled water',
  },
  {
    id: 'gulab-jamun',
    category: 'sweets',
    name: 'Warm Gulab Jamun (2 Pcs)',
    nameUrdu: 'گرم گلاب جامن (2 عدد)',
    price: 250,
    icon: 'dessert',
    desc: 'Traditional sweet dumplings in rose syrup',
  },
  {
    id: 'vanilla-cone',
    category: 'sweets',
    name: 'Vanilla Soft-Serve Ice Cream',
    nameUrdu: 'ونیلا آئس کریم',
    price: 200,
    icon: 'dessert',
    desc: 'Creamy vanilla swirl in a crispy waffle cone',
  },
]

export default function FoodMachine({
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
  const [diningType, setDiningType] = useState('eat-in') // 'eat-in' | 'takeaway'
  const [activeCategory, setActiveCategory] = useState('mains')
  const [cart, setCart] = useState([]) // [{ item, quantity }]
  const [feedbackBanner, setFeedbackBanner] = useState(null)
  const [correctedMistakeCount, setCorrectedMistakeCount] = useState(0)
  const [isStuckHintVisible, setIsStuckHintVisible] = useState(false)

  const showEnglish = language === 'en'
  const showUrdu = language === 'ur'

  const totalItemsCount = cart.reduce((sum, entry) => sum + entry.quantity, 0)
  const totalPrice = cart.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0)

  const stepGuideData = [
    {
      title: 'Step 1: Choose Where You Will Eat (Eat In or Takeaway)',
      titleUrdu: 'مرحلہ 1: یہاں کھائیں گے یا ساتھ لے جائیں گے؟',
      learnExplanation:
        'Restaurant self-ordering kiosks almost always start by asking if you want to eat inside the restaurant ("Eat In / Dine In" on a tray) or take the food home ("Takeaway / Parcel" in a bag).',
      learnExplanationUrdu:
        'ریستوران کی ٹچ اسکرین مشین سب سے پہلے یہ پوچھتی ہے کہ آپ کھانا وہیں بیٹھ کر کھائیں گے (Eat In) یا پیک کروا کر ساتھ لے جائیں گے (Takeaway)۔',
      hintText:
        'Touch either "🍽️ Eat In (Dine Here)" or "🛍️ Takeaway (Parcel)" to open the food menu.',
      hintTextUrdu:
        'مینو کھولنے کے لیے "یہاں کھائیں" یا "پارسل لے جائیں" میں سے کسی ایک بٹن کو چھوئیں۔',
      mistakeTip:
        'Changed your mind later? You can switch between Eat In and Takeaway right on the Review screen!',
      mistakeTipUrdu:
        'آپ بعد میں جائزہ اسکرین پر بھی اپنا انتخاب (یہاں کھائیں یا پارسل) تبدیل کر سکتے ہیں۔',
      buttonGuide: [
        {
          buttonName: '🍽️ Eat In (Dine Here)',
          meaning: 'Your food is served on a tray to eat at a table inside.',
          meaningUrdu: 'کھانا ٹرے میں پیش کیا جائے گا تاکہ آپ اندر بیٹھ کر کھا سکیں۔',
        },
        {
          buttonName: '🛍️ Takeaway (Parcel)',
          meaning: 'Your food is packed in a paper bag to take with you.',
          meaningUrdu: 'کھانا تھیلے میں پیک کر کے دیا جائے گا تاکہ آپ ساتھ لے جا سکیں۔',
        },
      ],
    },
    {
      title: 'Step 2: Browse Categories & Add Food Items',
      titleUrdu: 'مرحلہ 2: کھانے کی اقسام دیکھیں اور آرڈر میں شامل کریں',
      learnExplanation:
        'Food kiosks organize items into category tabs (Mains, Sides, Drinks, Sweets). Tap a category tab to see its dishes. Tap "+ Add to Order" to put an item on your tray. Your live Order Tray is always visible below so you can change quantities or remove anything you added by mistake.',
      learnExplanationUrdu:
        'کھانے کی مشین میں اشیاء کو مختلف حصوں (برگر، سنیکس، مشروبات، میٹھا) میں تقسیم کیا جاتا ہے۔ کوئی بھی چیز شامل کرنے کے لیے "آرڈر میں شامل کریں" دبائیں اور غلطی سے شامل ہونے والی چیز کو "ہٹائیں" بٹن سے نکال دیں۔',
      hintText:
        'Add 1 or 2 items to your order, practice changing a quantity with "+" or "-" or removing an accidental item, then tap "🛒 Review Order & Checkout ➡".',
      hintTextUrdu:
        'اپنے آرڈر میں ایک یا دو اشیاء شامل کریں، "+" یا "-" یا "ہٹائیں" بٹن سے تبدیلی کی مشق کریں، اور پھر "آرڈر کا جائزہ لیں" دبائیں۔',
      mistakeTip:
        'Try tapping "🎯 Practice Mistake: Add Wrong Item" to see how easy it is to remove an item you did not mean to tap!',
      mistakeTipUrdu:
        'اگر کوئی چیز غلطی سے شامل ہو جائے تو گھبرائیں نہیں — ٹرے میں "🗑️ ہٹائیں" کا بٹن دبا کر اسے نکال دیں۔',
      buttonGuide: [
        {
          buttonName: '🍔 Mains / 🍟 Sides / ☕ Drinks / 🍨 Sweets',
          meaning: 'Switches between different sections of the restaurant menu.',
          meaningUrdu: 'مینو کے مختلف حصوں کو دیکھنے کے لیے۔',
        },
        {
          buttonName: '➕ Add to Order',
          meaning: 'Places 1 of that dish into your Order Tray.',
          meaningUrdu: 'منتخب کھانا آپ کے آرڈر میں شامل کرتا ہے۔',
        },
        {
          buttonName: '➖ / ➕ / 🗑️ Remove (In Your Tray)',
          meaning: 'Lets you decrease quantity, add more, or completely remove an accidental item.',
          meaningUrdu: 'آرڈر میں کسی چیز کی تعداد کم/زیادہ کرنے یا اسے مکمل ہٹانے کے لیے۔',
        },
      ],
    },
    {
      title: 'Step 3: Review Your Order & Total Before Confirming',
      titleUrdu: 'مرحلہ 3: آرڈر اور کل رقم کا جائزہ لیں',
      learnExplanation:
        'Before sending your order to the kitchen, the kiosk displays everything in your tray along with the total price. This is where you check if you accidentally ordered 2 burgers instead of 1, or forgot a drink!',
      learnExplanationUrdu:
        'آرڈر مکمل کرنے سے پہلے مشین تمام اشیاء اور کل بل دکھاتی ہے۔ یہاں آپ کسی بھی چیز کی تعداد کم یا زیادہ کر سکتے ہیں یا مزید اشیاء شامل کرنے کے لیے واپس جا سکتے ہیں۔',
      hintText:
        'Review your items and total price. You can still use "+", "-", or "🗑️ Remove", or tap "⬅ Add More Food". When happy, tap "✅ Confirm Simulated Order"!',
      hintTextUrdu:
        'اپنے آرڈر کی تفصیلات چیک کریں۔ مطمئن ہونے پر "فرضی آرڈر کی تصدیق کریں" بٹن دبائیں!',
      mistakeTip:
        'Even on the final review screen, nothing is locked in until you press the green Confirm button.',
      mistakeTipUrdu:
        'سبز تصدیقی بٹن دبانے سے پہلے آپ اپنے آرڈر میں کوئی بھی تبدیلی کر سکتے ہیں۔',
      buttonGuide: [
        {
          buttonName: '⬅ Add More Food Items',
          meaning: 'Returns to the food menu while keeping everything already in your tray.',
          meaningUrdu: 'پہلے سے شامل اشیاء کو محفوظ رکھتے ہوئے مینو میں واپس لے جاتا ہے۔',
        },
        {
          buttonName: '🔄 Switch Eat In / Takeaway',
          meaning: 'Changes whether your order is served on a tray or packed in a bag.',
          meaningUrdu: 'یہاں کھانے یا پارسل لے جانے کا انتخاب تبدیل کرتا ہے۔',
        },
        {
          buttonName: '✅ Confirm Simulated Order',
          meaning: 'Completes the practice order and gives you a simulated pickup number.',
          meaningUrdu: 'فرضی آرڈر مکمل کر کے آپ کو ٹوکن نمبر دیتا ہے۔',
        },
      ],
    },
    {
      title: 'Step 4: Simulated Order Confirmation & Pickup Number',
      titleUrdu: 'مرحلہ 4: آرڈر کی تصدیق اور ٹوکن نمبر',
      learnExplanation:
        'When you finish ordering at a real restaurant kiosk, it prints a slip with a large Order Number (like #42). You simply wait near the pickup counter until #42 appears on the overhead screen or is called out!',
      learnExplanationUrdu:
        'جب آپ حقیقی فوڈ کیوسک پر آرڈر مکمل کرتے ہیں تو مشین ایک پرچی نکالتی ہے جس پر بڑا ٹوکن نمبر (جیسے 42#) لکھا ہوتا ہے۔ کاؤنٹر پر اپنا نمبر پکارے جانے پر کھانا وصول کریں۔',
      hintText:
        'Check your simulated Order Number (#42) and what you learned today. Then practice again or return home!',
      hintTextUrdu:
        'اپنا فرضی آرڈر نمبر (42#) اور رسید دیکھیں، پھر دوبارہ مشق کریں یا ہوم پیج پر جائیں۔',
      mistakeTip: '',
      mistakeTipUrdu: '',
      buttonGuide: [
        {
          buttonName: '🔁 Place Another Practice Order',
          meaning: 'Clears the tray and starts a fresh food ordering simulation.',
          meaningUrdu: 'نئے سرے سے کھانا آرڈر کرنے کی مشق شروع کرتا ہے۔',
        },
      ],
    },
  ]

  const currentGuide = stepGuideData[stepIndex] || stepGuideData[0]

  useEffect(() => {
    if (onUpdateScreenSpeech) {
      onUpdateScreenSpeech({
        en: `Food Ordering Kiosk. ${currentGuide.title}. ${currentGuide.learnExplanation} Hint: ${currentGuide.hintText}`,
        ur: `کھانا آرڈر مشق۔ ${currentGuide.titleUrdu}. ${currentGuide.learnExplanationUrdu} اشارہ: ${currentGuide.hintTextUrdu}`,
        urAudio: `food-step-${stepIndex}`,
      })
    }
    setIsStuckHintVisible(false)
    const timer = setTimeout(() => {
      setIsStuckHintVisible(true)
    }, 12000)
    return () => clearTimeout(timer)
  }, [stepIndex])

  const handleAddItem = (menuItem, isMistakeSimulation = false) => {
    setCart((prevCart) => {
      const existing = prevCart.find((entry) => entry.item.id === menuItem.id)
      if (existing) {
        return prevCart.map((entry) =>
          entry.item.id === menuItem.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        )
      }
      return [...prevCart, { item: menuItem, quantity: 1 }]
    })

    if (isMistakeSimulation) {
      setFeedbackBanner({
        type: 'warning',
        en: `Practice Mistake: Oops! Suppose you tapped "${menuItem.name}" by accident. Look at "Your Order Tray" below and tap "🗑️ Remove" next to it to fix the mistake!`,
        ur: `غلطی درست کرنے کی مشق: فرض کریں آپ سے غلطی سے "${menuItem.nameUrdu}" دب گیا ہے۔ اب نیچے اپنی ٹرے میں اس کے سامنے "🗑️ ہٹائیں" کا بٹن دبا کر غلطی درست کریں!`,
      })
    } else {
      setFeedbackBanner({
        type: 'info',
        en: `Added 1 × ${menuItem.name} to your tray.`,
        ur: `"${menuItem.nameUrdu}" آپ کے آرڈر میں شامل کر دیا گیا ہے۔`,
      })
    }
  }

  const handleUpdateQuantity = (itemId, delta) => {
    if (delta < 0) {
      setCorrectedMistakeCount((c) => c + 1)
    }
    setCart((prevCart) =>
      prevCart
        .map((entry) =>
          entry.item.id === itemId
            ? { ...entry, quantity: entry.quantity + delta }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    )
  }

  const handleRemoveItem = (menuItem) => {
    setCorrectedMistakeCount((c) => c + 1)
    setCart((prevCart) => prevCart.filter((entry) => entry.item.id !== menuItem.id))
    setFeedbackBanner({
      type: 'info',
      en: `Mistake Corrected! You removed "${menuItem.name}" from your order.`,
      ur: `بہت خوب! آپ نے "${menuItem.nameUrdu}" کو اپنے آرڈر سے ہٹا دیا ہے۔`,
    })
  }

  const handleProceedToReview = () => {
    if (cart.length === 0) {
      setCorrectedMistakeCount((c) => c + 1)
      setFeedbackBanner({
        type: 'warning',
        en: 'Your order tray is currently empty! Please tap "➕ Add to Order" on at least one food or drink item before reviewing your order.',
        ur: 'آپ کی ٹرے ابھی خالی ہے! جائزہ لینے سے پہلے کم از کم ایک کھانے یا پینے کی چیز شامل کریں۔',
      })
      return
    }
    setFeedbackBanner(null)
    setStepIndex(2)
  }

  const handleCancelOrder = () => {
    setCart([])
    setStepIndex(0)
    setFeedbackBanner({
      type: 'info',
      en: 'Order Cancelled Safely: Your tray was emptied and you returned to the start.',
      ur: 'آرڈر بحفاظت منسوخ کر دیا گیا ہے اور ٹرے خالی کر دی گئی ہے۔',
    })
  }

  const handleResetSimulator = () => {
    setCart([])
    setDiningType('eat-in')
    setActiveCategory('mains')
    setStepIndex(0)
    setFeedbackBanner(null)
  }

  const visibleMenuItems = MENU_ITEMS.filter((item) => item.category === activeCategory)

  return (
    <div className="simulator-page">
      <ProgressBar
        machineName="Food Ordering Kiosk"
        machineNameUrdu="کھانا آرڈر کرنے کی مشین"
        steps={FOOD_STEPS}
        currentStepIndex={stepIndex}
        onStepClick={(idx) => {
          if (idx >= 2 && cart.length === 0) return
          setFeedbackBanner(null)
          setStepIndex(idx)
        }}
        language={language}
      />

      <div className="simulator-workspace">
        <section className="kiosk-machine-frame food-frame" aria-label="Simulated Food Ordering Kiosk">
          <div className="kiosk-hardware-top">
            <div className="kiosk-bezel-title">
              <span>Practice food order</span>
              <span className="kiosk-slot-indicator">
                <Icon name="cart" size={16} />
                Tray: {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'} (Rs.{' '}
                {totalPrice.toLocaleString()})
              </span>
            </div>
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

            {/* STEP 0: EAT IN OR TAKEAWAY */}
            {stepIndex === 0 && (
              <div className="kiosk-step-content">
                <div className="kiosk-welcome-hero">
                  <span className="hero-big-icon" aria-hidden="true">
                    <Icon name="dine" size={52} />
                  </span>
                  {showEnglish && <h2>Welcome! Where Will You Be Eating Today?</h2>}
                  {showUrdu && (
                    <h3 className="urdu-heading" lang="ur" dir="rtl">
                      خوش آمدید! آپ کھانا کہاں کھانا پسند کریں گے؟
                    </h3>
                  )}
                  {showEnglish && (
                    <p className="kiosk-lead">
                      Touch one of the large cards below to start browsing the menu:
                    </p>
                  )}
                </div>

                <div className="kiosk-button-grid two-col">
                  <button
                    type="button"
                    className="kiosk-action-btn primary-green"
                    onClick={() => {
                      setDiningType('eat-in')
                      setFeedbackBanner(null)
                      setStepIndex(1)
                    }}
                  >
                    <span className="btn-icon">
                      <Icon name="dine" size={28} />
                    </span>
                    <div className="btn-text-block">
                      {showEnglish && <strong>Eat In (Dine Here)</strong>}
                      {showEnglish && <small>Served on a tray for our tables</small>}
                      {showUrdu && (
                        <span className="urdu-btn-text" lang="ur" dir="rtl">
                          یہاں کھائیں (Eat In)
                        </span>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    className="kiosk-action-btn primary-blue"
                    onClick={() => {
                      setDiningType('takeaway')
                      setFeedbackBanner(null)
                      setStepIndex(1)
                    }}
                  >
                    <span className="btn-icon">
                      <Icon name="takeaway" size={28} />
                    </span>
                    <div className="btn-text-block">
                      {showEnglish && <strong>Takeaway (Parcel)</strong>}
                      {showEnglish && <small>Packed in a bag to take home</small>}
                      {showUrdu && (
                        <span className="urdu-btn-text" lang="ur" dir="rtl">
                          ساتھ لے جائیں / پارسل (Takeaway)
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1: MENU CATEGORIES, ITEMS & LIVE ORDER TRAY */}
            {stepIndex === 1 && (
              <div className="kiosk-step-content">
                <div className="food-top-bar">
                  <div>
                    {showEnglish && <h2>Choose Your Food & Drinks</h2>}
                    {showUrdu && (
                      <h3 className="urdu-heading" lang="ur" dir="rtl">
                        اپنی پسند کا کھانا اور مشروبات منتخب کریں
                      </h3>
                    )}
                  </div>
                  <button
                    type="button"
                    className="kiosk-edit-btn"
                    onClick={() =>
                      setDiningType((prev) => (prev === 'eat-in' ? 'takeaway' : 'eat-in'))
                    }
                  >
                    {diningType === 'eat-in' ? '🍽️ Eating In' : '🛍️ Takeaway'} • Click to Switch
                  </button>
                </div>

                {/* Category Tabs */}
                <div className="category-tabs-bar" role="tablist" aria-label="Food Categories">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={activeCategory === cat.id}
                      className={`category-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      <span className="cat-icon">
                        <Icon name={cat.icon} size={22} />
                      </span>
                      <div>
                        {showEnglish && <strong>{cat.name}</strong>}
                        {showUrdu && (
                          <span className="urdu-block" lang="ur" dir="rtl">
                            {cat.nameUrdu}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Menu Items Grid */}
                <div className="food-items-grid">
                  {visibleMenuItems.map((item) => {
                    const inCart = cart.find((c) => c.item.id === item.id)
                    return (
                      <div key={item.id} className="food-item-card">
                        <div className="food-item-header">
                          <span className="food-emoji" aria-hidden="true">
                            <Icon name={item.icon} size={28} />
                          </span>
                          <span className="food-price-tag">Rs. {item.price}</span>
                        </div>
                        <div className="food-item-body">
                          {showEnglish && <h4>{item.name}</h4>}
                          {showUrdu && (
                            <p className="urdu-food-title" lang="ur" dir="rtl">
                              {item.nameUrdu}
                            </p>
                          )}
                          {showEnglish && <p className="food-desc">{item.desc}</p>}
                        </div>
                        <div className="food-item-footer">
                          {inCart ? (
                            <div className="inline-qty-controls">
                              <button
                                type="button"
                                className="qty-btn minus"
                                onClick={() => handleUpdateQuantity(item.id, -1)}
                                aria-label={`Decrease quantity of ${item.name}`}
                              >
                                ➖
                              </button>
                              <span className="qty-badge">{inCart.quantity} in tray</span>
                              <button
                                type="button"
                                className="qty-btn plus"
                                onClick={() => handleUpdateQuantity(item.id, 1)}
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                ➕
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="add-food-btn"
                              onClick={() => handleAddItem(item, false)}
                            >
                              ➕ Add to Order {showUrdu && <span lang="ur">• شامل کریں</span>}
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Practice Mistake Helper Button */}
                <div className="practice-mistake-strip">
                  <div>
                    {showEnglish && (
                      <span>
                        <strong>🔄 Want to practice fixing a mistake?</strong> Tap this button to simulate adding an accidental item, then practice removing it from your tray below:
                      </span>
                    )}
                    {showUrdu && (
                      <span className="urdu-block" lang="ur" dir="rtl">
                        غلطی سے شامل ہونے والی چیز کو ہٹانے کی مشق کرنے کے لیے یہ بٹن دبائیں:
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="kiosk-edit-btn warning-btn"
                    onClick={() => handleAddItem(MENU_ITEMS[9], true)}
                  >
                    🎯 Test Mistake: Add Accidental Item
                  </button>
                </div>

                {/* Live Order Tray Summary */}
                <div className="order-tray-panel" aria-label="Your current order tray">
                  <div className="tray-header">
                    <strong>
                      🛒 Your Order Tray ({totalItemsCount}{' '}
                      {totalItemsCount === 1 ? 'item' : 'items'})
                    </strong>
                    <span className="tray-total">Total: Rs. {totalPrice.toLocaleString()}</span>
                  </div>

                  {cart.length === 0 ? (
                    <p className="empty-tray-msg">
                      Your tray is empty. Tap &ldquo;➕ Add to Order&rdquo; on any food item above! (آپ کی ٹرے خالی ہے، اوپر سے کوئی کھانا منتخب کریں۔)
                    </p>
                  ) : (
                    <ul className="tray-items-list">
                      {cart.map(({ item, quantity }) => (
                        <li key={item.id} className="tray-item-row">
                          <div className="tray-item-info">
                            <span className="tray-item-icon">
                              <Icon name={item.icon} size={24} />
                            </span>
                            <div>
                              <strong>{item.name}</strong>{' '}
                              {showUrdu && (
                                <span lang="ur" dir="rtl">
                                  ({item.nameUrdu})
                                </span>
                              )}
                              <div className="tray-item-sub">
                                Rs. {item.price} × {quantity} ={' '}
                                <strong>Rs. {(item.price * quantity).toLocaleString()}</strong>
                              </div>
                            </div>
                          </div>

                          <div className="tray-item-actions">
                            <button
                              type="button"
                              className="qty-btn minus"
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              title="Decrease quantity"
                            >
                              ➖
                            </button>
                            <span className="tray-qty-num">{quantity}</span>
                            <button
                              type="button"
                              className="qty-btn plus"
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                              title="Increase quantity"
                            >
                              ➕
                            </button>
                            <button
                              type="button"
                              className="remove-item-btn"
                              onClick={() => handleRemoveItem(item)}
                            >
                              🗑️ Remove {showUrdu && <span lang="ur">• ہٹائیں</span>}
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="tray-checkout-row">
                    <button
                      type="button"
                      className="kiosk-action-btn primary-green confirm-large"
                      onClick={handleProceedToReview}
                    >
                      <span className="btn-icon">
                        <Icon name="cart" size={28} />
                      </span>
                      <div className="btn-text-block">
                        {showEnglish && (
                          <strong>
                            Review Order & Total (Rs. {totalPrice.toLocaleString()}) ➡
                          </strong>
                        )}
                        {showUrdu && (
                          <span className="urdu-btn-text" lang="ur" dir="rtl">
                            آرڈر اور کل بل کا جائزہ لیں
                          </span>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                <div className="kiosk-bottom-nav">
                  <button
                    type="button"
                    className="kiosk-nav-btn back-btn"
                    onClick={() => setStepIndex(0)}
                  >
                    ⬅ Go Back {showUrdu && <span lang="ur">• واپس جائیں</span>}
                  </button>
                  <button
                    type="button"
                    className="kiosk-nav-btn cancel-btn"
                    onClick={handleCancelOrder}
                  >
                    ✖ Cancel & Empty Tray {showUrdu && <span lang="ur">• آرڈر منسوخ کریں</span>}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: REVIEW ORDER & TOTAL */}
            {stepIndex === 2 && (
              <div className="kiosk-step-content">
                {showEnglish && <h2>Step 3: Review Your Order & Total</h2>}
                {showUrdu && (
                  <h3 className="urdu-heading" lang="ur" dir="rtl">
                    مرحلہ 3: اپنے آرڈر اور کل رقم کا جائزہ لیں
                  </h3>
                )}

                <div className="review-summary-card">
                  <div className="review-row with-edit">
                    <div>
                      <span className="review-label">Dining Choice (کھانے کا طریقہ):</span>
                      <strong>
                        {diningType === 'eat-in'
                          ? '🍽️ Eat In / Dine Here (یہاں کھائیں)'
                          : '🛍️ Takeaway / Parcel (پارسل لے جائیں)'}
                      </strong>
                    </div>
                    <button
                      type="button"
                      className="kiosk-edit-btn"
                      onClick={() => {
                        setCorrectedMistakeCount((c) => c + 1)
                        setDiningType((prev) => (prev === 'eat-in' ? 'takeaway' : 'eat-in'))
                      }}
                    >
                      🔄 Switch to {diningType === 'eat-in' ? 'Takeaway' : 'Eat In'}
                    </button>
                  </div>

                  {cart.length === 0 ? (
                    <div className="empty-review-notice">
                      <p>You removed all items from your order! Tap below to return to the menu.</p>
                      <button
                        type="button"
                        className="kiosk-action-btn primary-blue"
                        onClick={() => setStepIndex(1)}
                      >
                        ⬅ Return to Food Menu
                      </button>
                    </div>
                  ) : (
                    <ul className="tray-items-list review-mode">
                      {cart.map(({ item, quantity }) => (
                        <li key={item.id} className="tray-item-row">
                          <div className="tray-item-info">
                            <span className="tray-item-icon">
                              <Icon name={item.icon} size={24} />
                            </span>
                            <div>
                              <strong>{item.name}</strong>{' '}
                              {showUrdu && (
                                <span lang="ur" dir="rtl">
                                  ({item.nameUrdu})
                                </span>
                              )}
                              <div className="tray-item-sub">
                                Rs. {item.price} each × {quantity} ={' '}
                                <strong>Rs. {(item.price * quantity).toLocaleString()}</strong>
                              </div>
                            </div>
                          </div>

                          <div className="tray-item-actions">
                            <button
                              type="button"
                              className="qty-btn minus"
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                            >
                              ➖
                            </button>
                            <span className="tray-qty-num">{quantity}</span>
                            <button
                              type="button"
                              className="qty-btn plus"
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                            >
                              ➕
                            </button>
                            <button
                              type="button"
                              className="remove-item-btn"
                              onClick={() => handleRemoveItem(item)}
                            >
                              🗑️ Remove {showUrdu && <span lang="ur">• ہٹائیں</span>}
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="review-row highlight-row">
                    <span>Simulated Order Total (کل فرضی بل):</span>
                    <strong className="big-amount">Rs. {totalPrice.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="edit-buttons-row">
                  <button
                    type="button"
                    className="kiosk-edit-btn"
                    onClick={() => setStepIndex(1)}
                  >
                    ➕ Add More Food or Drinks {showUrdu && <span lang="ur">• مزید اشیاء شامل کریں</span>}
                  </button>
                </div>

                {cart.length > 0 && (
                  <div className="kiosk-confirm-row">
                    <button
                      type="button"
                      className="kiosk-action-btn primary-green confirm-large"
                      onClick={() => {
                        setFeedbackBanner(null)
                        setStepIndex(3)
                      }}
                    >
                      <span className="btn-icon">
                        <Icon name="check" size={28} />
                      </span>
                      <div className="btn-text-block">
                        {showEnglish && (
                          <strong>
                            Confirm Simulated Order (Rs. {totalPrice.toLocaleString()})
                          </strong>
                        )}
                        {showUrdu && (
                          <span className="urdu-btn-text" lang="ur" dir="rtl">
                            فرضی آرڈر کی تصدیق کریں اور ٹوکن حاصل کریں
                          </span>
                        )}
                      </div>
                    </button>
                  </div>
                )}

                <div className="kiosk-bottom-nav">
                  <button
                    type="button"
                    className="kiosk-nav-btn back-btn"
                    onClick={() => setStepIndex(1)}
                  >
                    ⬅ Go Back to Menu {showUrdu && <span lang="ur">• مینو پر واپس جائیں</span>}
                  </button>
                  <button
                    type="button"
                    className="kiosk-nav-btn cancel-btn"
                    onClick={handleCancelOrder}
                  >
                    ✖ Cancel Order {showUrdu && <span lang="ur">• آرڈر منسوخ کریں</span>}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SIMULATED ORDER CONFIRMATION */}
            {stepIndex === 3 && (
              <div className="kiosk-step-content">
                <div className="success-banner">
                  <span className="success-icon" aria-hidden="true">
                    <Icon name="food" size={42} />
                  </span>
                  <div>
                    {showEnglish && <h2>Simulated Order Sent to Kitchen!</h2>}
                    {showUrdu && (
                      <h3 className="urdu-heading" lang="ur" dir="rtl">
                        آپ کا فرضی آرڈر کامیابی سے مکمل ہو گیا!
                      </h3>
                    )}
                    <p className="sim-disclaimer">
                      SIMULATION ONLY — No real food order or payment was processed.
                    </p>
                  </div>
                </div>

                <div className="receipt-and-learning-grid">
                  {/* Simulated Restaurant Order Token & Receipt */}
                  <div className="simulated-receipt food-receipt" aria-label="Simulated Food Order Receipt">
                    <div className="receipt-header">
                      <strong>SUNSHINE CAFE KIOSK</strong>
                      <span>YOUR ORDER PICKUP NUMBER</span>
                      <div className="order-number-badge">#42</div>
                      <small>
                        {diningType === 'eat-in' ? 'EAT IN (DINE HERE)' : 'TAKEAWAY (PARCEL)'}
                      </small>
                    </div>
                    <div className="receipt-body">
                      {cart.map(({ item, quantity }) => (
                        <div key={item.id} className="receipt-line">
                          <span>
                            {quantity} × {item.name}
                          </span>
                          <span>Rs. {(item.price * quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="receipt-line bold">
                        <span>Simulated Total:</span>
                        <span>Rs. {totalPrice.toLocaleString()} (DEMO)</span>
                      </div>
                    </div>
                    <div className="receipt-footer">
                      *** PRACTICE RECEIPT — NO REAL PAYMENT ***
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
                        ✓ Choosing between <strong>Eat In</strong> and{' '}
                        <strong>Takeaway</strong> at the start of a restaurant kiosk.
                      </li>
                      <li>
                        ✓ Navigating menu category tabs (Mains, Sides, Drinks, Sweets) to find items.
                      </li>
                      <li>
                        ✓ Changing item quantities with <strong>+</strong> and{' '}
                        <strong>-</strong>, or using <strong>Remove</strong> when an item is tapped by accident
                        {correctedMistakeCount > 0
                          ? ` (you practiced ${correctedMistakeCount} order adjustment/mistake fix!).`
                          : '.'}
                      </li>
                      <li>
                        ✓ Reading your <strong>Order Pickup Number (#42)</strong> on the final slip.
                      </li>
                    </ul>
                    {showUrdu && (
                      <p className="urdu-text" lang="ur" dir="rtl">
                        آپ نے ریستوران کی مشین پر کھانا منتخب کرنا، تعداد کم یا زیادہ کرنا، غلط چیز کو ہٹانا اور اپنا ٹوکن نمبر حاصل کرنا سیکھ لیا ہے۔
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
                    🔁 Place Another Practice Order{' '}
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
          urAudio={`food-step-${stepIndex}`}
        />
      </div>
    </div>
  )
}

