# Kiosk of Confidence 🖥️🌱

**Practice first. Use technology independently.**  
*(پہلے مشق کریں۔ پھر خود اعتمادی کے ساتھ ٹیکنالوجی استعمال کریں۔)*

**Kiosk of Confidence** is a beginner-friendly, accessible React + Vite web application designed for older adults and anyone who feels nervous using unfamiliar touchscreen self-service kiosks. Users can safely learn, practice, make mistakes, correct them, and complete everyday self-service tasks without any real money, cards, or personal data.

---

## ✨ Key Features

- **Three Complete End-to-End Touchscreen Simulators**:
  1. **🏧 ATM Practice**: Welcome screen, pretend card insertion (plus "card inserted wrong way" mistake practice), Cash Withdrawal or Balance Inquiry, preset Fast Cash & custom keypad amounts, over-limit mistake recovery, Review & Edit screen, card-return reminder, and simulated receipt.
  2. **🎫 Ticket Booking Practice**: Select Departure City, Destination City (with same-city mistake recovery), Ticket Class (Economy, AC Business, or Senior Citizen 50% Discount), One-Way vs. Round-Trip, Passenger Quantity stepper, full Review & Edit screen, and simulated boarding ticket.
  3. **🍔 Food Ordering Practice**: Choose Eat In or Takeaway, browse 4 food categories (Mains, Sides, Drinks, Sweets), add items, change quantities (`+` / `-`), remove accidental items, review order total, and receive a simulated pickup token (`#42`).
- **Three Learning Modes**:
  - **📖 Learn Mode**: Explains what the current screen is for and what every button means before clicking.
  - **🎯 Guided Practice**: Step-by-step hints and safe mistake-recovery exercises.
  - **⭐ Independent Practice**: Fewer hints so learners can test their confidence like at a real machine (with an *"I'm Stuck — Show Hint"* button always available).
- **Accessibility & Bilingual Support**:
  - **English + اردو (Urdu)** instructions side-by-side or individually selectable.
  - **🔊 Listen Button**: Reads screen instructions and hints aloud using browser Text-to-Speech (`window.speechSynthesis`).
  - **🔍 Extra Large Text Toggle (`A+`)**: Increases font sizes across the entire app.
  - **❓ Help Button**: Explains unfamiliar buttons on any screen.

---

## 📁 Project File Structure

```text
kiosk-of-confidence/
│
├── public/
│   └── kiosk-icon.svg
│
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Navigation, Mode Switcher, Language, Text Size, Listen & Help
│   │   ├── MachineCard.jsx   # Large start cards on the Home Page
│   │   ├── ProgressBar.jsx   # Step tracker with clickable completed steps
│   │   └── HelpPanel.jsx     # Learn Mode guide, hints & unfamiliar button dictionary
│   │
│   ├── machines/
│   │   ├── ATM.jsx           # Simulator 1: ATM Cash Withdrawal & Balance Inquiry
│   │   ├── TicketMachine.jsx # Simulator 2: Train/Bus Ticket Booking Kiosk
│   │   └── FoodMachine.jsx   # Simulator 3: Restaurant Self-Ordering Kiosk
│   │
│   ├── App.jsx               # Main application state, Home screen & machine router
│   ├── App.css               # Accessible, high-contrast, responsive styling
│   └── main.jsx              # React entry point
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the development server**:
   ```bash
   npm run dev
   ```
3. **Build for production**:
   ```bash
   npm run build
   ```
4. Open the local URL shown in the terminal (usually `http://localhost:5173`).

