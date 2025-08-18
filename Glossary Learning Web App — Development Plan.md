# 📚 Glossary Learning Web App — Ultra-Lightweight Development Plan

A minimal, static web app to help Sidekick team members quiz themselves and learn glossary terms related to hardware, firmware, and software—especially useful in overcoming language barriers when working with manufacturers.

**🎯 Ultra-Lightweight Approach**: Pure static site with JSON data files (no backend, no database, no API)

---

## ✅ 1. Key Features

| Feature | Description |
|--------|-------------|
| **Category Selection** | Simple dropdown/grid to select glossary category |
| **Flashcard Mode** | Click to flip between term and definition |
| **MCQ Mode** | Choose correct definition from 4 options |
| **Single Session** | Complete one category per session |
| **Zero Setup** | No login, no signup, no user accounts |
| **Instant Load** | All data pre-loaded, works offline after first visit |
| **Mobile-First** | Responsive design optimized for phones and tablets |
| **Auto-Generated MCQs** | Distractors pulled from other terms in same category |

---

## 🏗️ 2. Ultra-Lightweight Architecture

### Frontend Only
- **Framework**: Vite + React (minimal setup)
- **Styling**: TailwindCSS (utility-first, no custom CSS needed)
- **Routing**: Simple state management (no React Router needed)
- **State**: useState + useEffect only
- **Data**: Static JSON files imported as modules

### No Backend Required
- **Data Storage**: JSON files in `/src/data/`
- **Deployment**: Static hosting (Vercel/Netlify/GitHub Pages)
- **Updates**: Edit JSON files and redeploy
- **Performance**: Instant loading, works offline

### Data Structure

#### File: `categories.json`
```json
[
  {"id": "hardware", "name": "Hardware Terms", "icon": "🔧"},
  {"id": "bluetooth", "name": "Bluetooth Terms", "icon": "📡"}
]
```

#### File: `terms.json`
```json
[
  {
    "id": "term_001",
    "categoryId": "hardware", 
    "term": "PCB",
    "definition": "Printed Circuit Board - connects electronic components",
    "example": "The PCB layout affects signal integrity"
  }
]
```

---

## 📁 3. Minimal File Structure

```
/glossary-trainer
│
├── public/
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   ├── CategorySelector.tsx    # Grid/list of categories
│   │   ├── Flashcard.tsx          # Flip animation component  
│   │   ├── MCQ.tsx                # Multiple choice quiz
│   │   └── SessionComplete.tsx    # End of session message
│   │
│   ├── data/
│   │   ├── categories.json        # List of glossary categories
│   │   └── terms.json            # All terms with definitions
│   │
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   │
│   ├── utils/
│   │   └── quiz.ts               # MCQ generation logic
│   │
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Vite entry point
│   └── index.css                 # Tailwind imports only
│
├── tailwind.config.js
├── vite.config.ts
├── package.json
└── README.md
```

**Key Simplifications:**
- ❌ No pages/ folder (single-page app)
- ❌ No services/ folder (no API calls)
- ❌ No .env file (no secrets needed)
- ❌ No routing library
- ❌ No assets/ folder initially

---

## 🧱 4. Ultra-Fast Implementation Plan

### Phase 1: Foundation (30 minutes)
- [ ] `npm create vite@latest glossary-trainer -- --template react-ts`
- [ ] Install Tailwind CSS
- [ ] Create basic TypeScript interfaces
- [ ] Set up minimal folder structure

### Phase 2: Data Setup (✅ COMPLETED)  
- [x] Create sample `categories.json` and `terms.json`
- [x] Build data import utilities
- [x] Test data loading in App component

**✅ Phase 2 Results:**
- **167 real terms** from Sidekick/Ora EN-CN Tech Glossary
- **12 categories** with Chinese/English/Pinyin data
- **Rich data structure** with notes and proper encoding
- **Fixed TailwindCSS** and TypeScript issues

### Phase 3: Core Components (60 minutes)
- [ ] Build CategorySelector with grid layout
- [ ] Build Flashcard with CSS flip animation
- [ ] Build MCQ with auto-generated distractors
- [ ] Build SessionComplete celebration

### Phase 4: App Logic (30 minutes)
- [ ] Implement session flow state machine
- [ ] Add term shuffling and navigation
- [ ] Connect all components in App.tsx

### Phase 5: Polish (30 minutes)
- [ ] Mobile-responsive Tailwind styling
- [ ] Keyboard shortcuts (Space = flip, Enter = next)
- [ ] Loading states and transitions
- [ ] Deploy to Vercel/Netlify

**Total Development Time: ~2.5 hours**

## 🚀 Quick Start Commands

```bash
# 1. Create project
npm create vite@latest glossary-trainer -- --template react-ts
cd glossary-trainer

# 2. Install dependencies  
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Start development
npm run dev
```

---

## 💡 Technical Decisions for Lightweight Approach

### Why Static JSON Over Database?
- ✅ Zero latency (no API calls)
- ✅ Works offline after first load  
- ✅ No backend maintenance
- ✅ Easy content updates (edit files)
- ✅ Free hosting on any static platform

### Why No React Router?
- ✅ Single-page app with state-based navigation
- ✅ Faster initial load
- ✅ Simpler state management
- ✅ Mobile app-like experience

### Auto-Generated MCQ Distractors
```typescript
// Smart distractor selection
function generateDistractors(correctTerm: Term, allTerms: Term[]) {
  return allTerms
    .filter(t => t.categoryId === correctTerm.categoryId)
    .filter(t => t.id !== correctTerm.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(t => t.definition);
}
```

---

## 📝 Core Requirements Summary

- ✅ **Zero Setup**: No accounts, no onboarding
- ✅ **Category-Based**: One topic per session  
- ✅ **Two Modes**: Flashcards + MCQ
- ✅ **Mobile-First**: Thumb-friendly design
- ✅ **Ultra-Fast**: < 3 hours total development
- ✅ **Zero Maintenance**: Static files only

---

## 🔊 6. Audio Pronunciation Feature (NEW)

### Feature Overview
Add Chinese pronunciation audio to help learners understand how technical terms sound when spoken. Uses Web Speech API to keep the app lightweight without requiring audio files.

### Implementation Plan

#### Phase 6: Audio Pronunciation (✅ COMPLETED)
- [x] **Feature Detection**: Check for Web Speech API and Chinese voice support
- [x] **Pronunciation Component**: Create play button with fallback handling
- [x] **Integration**: Add to Flashcard component (Chinese side)
- [x] **User Feedback**: Inform users about missing language packs
- [x] **Graceful Degradation**: Hide feature when not supported

### Technical Approach

#### Web Speech API Prerequisites & Challenges
- **Browser Support**: Chrome ✅, Firefox ⚠️, Safari ⚠️, Mobile 📱 variable
- **Chinese Voice Availability**: Not all devices have Chinese TTS voices pre-installed
- **Network Dependencies**: Many browsers require internet for cloud-based TTS
- **Pronunciation Accuracy**: Tonal language challenges, technical terms may not be in vocabulary
- **Performance**: Potential latency, queue management needed

#### Implementation Strategy
```typescript
// Feature detection
const hasChineseVoice = () => {
  if (!('speechSynthesis' in window)) return false;
  const voices = speechSynthesis.getVoices();
  return voices.some(voice => voice.lang.startsWith('zh'));
};

// Progressive enhancement
const PronunciationButton = ({ text, onError }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Only show if Chinese voices available
  if (!isSupported) return null;
  
  return (
    <button onClick={handleSpeak} disabled={isPlaying}>
      🔊 Play
    </button>
  );
};
```

#### Fallback Strategy
1. **Primary**: Web Speech API with Chinese voices
2. **Fallback**: Hide feature gracefully if not supported
3. **User Guidance**: Inform users how to install language packs if needed
4. **Future**: Consider pre-recorded audio files for critical terms

#### User Experience Considerations
- **Progressive Enhancement**: Feature appears only when supported
- **Visual Feedback**: Loading state while speech synthesizes
- **Error Handling**: Clear messaging when pronunciation fails
- **Accessibility**: Proper ARIA labels and keyboard support

### Updated File Structure
```
src/
├── components/
│   ├── PronunciationButton.tsx    # NEW: Audio playback component
│   ├── Flashcard.tsx             # UPDATED: Include pronunciation
│   └── ...
├── utils/
│   ├── speechSynthesis.ts        # NEW: TTS utilities and detection
│   └── ...
```

### Browser Compatibility Matrix
| Browser | TTS Support | Chinese Voices | Notes |
|---------|-------------|----------------|-------|
| Chrome | ✅ | ✅ | Best support, cloud-based |
| Firefox | ⚠️ | ⚠️ | Limited voices, offline only |
| Safari | ⚠️ | ⚠️ | Inconsistent across versions |
| Mobile Chrome | ✅ | 📱 | Depends on OS language packs |
| Mobile Safari | ⚠️ | 📱 | Limited iOS support |

### Success Metrics
- [ ] Feature detection works across all major browsers
- [ ] Graceful degradation when Chinese voices unavailable
- [ ] No app crashes from unsupported browsers
- [ ] Clear user feedback for missing language packs
- [ ] Pronunciation quality acceptable for learning purposes
