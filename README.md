# Hearthstone-Style Card Game

A fully playable turn-based deckbuilding card game built with React and TailwindCSS, featuring a complete game system similar to Hearthstone.

## Features

### 🎮 Complete Turn-Based Gameplay
- **Two-Player System**: Player vs AI opponent with alternating turns
- **Turn Management**: Automatic turn progression with mana refresh
- **Game State**: Full game state management with React hooks
- **Win Conditions**: Health tracking and game end states

### 🃏 Advanced Card System
- **Card Component**: Displays card name, mana cost, type, description, and optional attack/health stats
- **Scalable Cards**: Cards resize based on context (hand, board, etc.)
- **Fantasy Styling**: Beautiful card frames with borders, gradients, and hover effects
- **Interactive Elements**: Click handlers and hover animations with visual feedback

### ⚔️ Combat & Game Mechanics
- **Mana System**: Starts at 1, increases by 1 each turn (max 10)
- **Hand Management**: Draw cards from deck, max 10 in hand
- **Board Control**: Up to 7 minions per player on battlefield
- **Card Playing**: Click to play cards if you have enough mana
- **Spell Casting**: Immediate spell effects (expandable system)
- **Minion Combat**: Click-to-select attack system with visual feedback
- **Health Tracking**: Minions take damage and die when health reaches 0
- **Summoning Sickness**: New minions can't attack until next turn
- **Hero Attacks**: Target enemy heroes directly to reduce their health

### 🎯 Player Management
- **Health System**: 30 health per player (clickable targets during combat)
- **Deck System**: Shuffled deck with card drawing
- **Resource Display**: Mana, health, deck count, and board state
- **Turn Indicators**: Clear visual feedback for active player

### 🎨 Combat Visual Feedback
- **Attackable Minions**: Green border and ⚔️ icon when ready to attack
- **Selected Attackers**: Green glow and scaling effect
- **Valid Targets**: Red border and targeting crosshairs
- **Summoning Sickness**: Gray overlay with 💤 sleep icon
- **Damaged Minions**: Orange health display when below max health
- **Combat Status**: Real-time display of selected attacker and instructions

### Card Types
- **Minions**: Have attack and health stats, go to board when played
- **Spells**: Instant effects, consumed when cast

### Card Schema
Cards follow this JSON structure:
```json
{
  "id": "flame_imp",
  "name": "Flame Imp", 
  "type": "Minion",
  "mana": 1,
  "attack": 3,
  "health": 2,
  "description": "Deal 3 damage to your hero."
}
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open your browser to `http://localhost:5173` to view the card collection.

### Build
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Card.jsx          # Scalable card component
│   ├── PlayerArea.jsx    # Player hand and info display
│   ├── BoardArea.jsx     # Battlefield minion display
│   └── GameControls.jsx  # Turn controls and game stats
├── hooks/
│   └── useGameManager.js # Complete game state management
├── data/
│   └── sampleCards.js    # Card definitions and sample deck
├── App.jsx               # Main game layout and orchestration
├── main.jsx              # React entry point
└── index.css             # TailwindCSS styles and theme
```

## Card Component Features

- **Mana Cost**: Blue circle in top-left corner
- **Attack/Health**: Orange/red circles in bottom corners (minions only)
- **Card Art Placeholder**: Space for future artwork integration
- **Type Badge**: Displays Minion or Spell type
- **Description Box**: Scrollable text area for card abilities
- **Hover Effects**: Scale and shadow animations
- **Click Handling**: Optional click callbacks for game interaction

## Customization

### Adding New Cards
Add cards to `src/data/sampleCards.js`:
```javascript
{
  "id": "new_card",
  "name": "New Card Name",
  "type": "Minion", // or "Spell"
  "mana": 3,
  "attack": 2,      // only for minions
  "health": 4,      // only for minions
  "description": "Card effect description"
}
```

### Styling
Customize colors and effects in `tailwind.config.js`:
- Card backgrounds and borders
- Mana, attack, and health colors
- Shadow effects and animations

## Next Steps

This foundation can be extended with:
- Game board and player areas
- Deck management system
- Turn-based gameplay mechanics
- Card interactions and effects
- Multiplayer functionality
- Sound effects and animations

## Technologies Used

- **React 18**: Component framework
- **TailwindCSS**: Utility-first styling
- **Vite**: Build tool and dev server
- **Cinzel Font**: Fantasy-themed typography 