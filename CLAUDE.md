# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wizard Tracker is a React-based web application for tracking scores in the Wizard card game. It supports 3-6 players with dynamic round counts based on player count (3 players = 20 rounds, 4 players = 15 rounds, 5 players = 10 rounds, 6 players = 5 rounds).

## Development Commands

**Install dependencies:**
```bash
npm install
```

**Run development server:**
```bash
npm run dev
```
Runs on http://localhost:5173/ with hot module replacement (HMR)

**Build for production:**
```bash
npm run build
```

## Tech Stack

- **React 18.3** - UI library with modern hooks
- **Vite 6** - Fast build tool and dev server
- **JavaScript/JSX** - ES6+ with JSX syntax

## Architecture

### Folder Structure

```
src/
├── components/       # React components
│   ├── Settings.jsx
│   ├── NumberOfPlayers.jsx
│   ├── InitPlayersList.jsx
│   └── InitPlayer.jsx
├── hooks/           # Custom React hooks (future)
├── context/         # React Context for global state (future)
├── utils/           # Helper functions (future)
├── styles/          # CSS files
│   └── index.css
├── App.jsx          # Root component
└── main.jsx         # Entry point with ReactDOM
```

### Component Structure

The application uses **functional components** with React hooks:

- **main.jsx** - Entry point using `ReactDOM.createRoot()` (React 18+)
- **App.jsx** - Root component wrapper
- **Settings.jsx** - Main settings component managing state with `useState` hook
- **NumberOfPlayers.jsx** - Button group for selecting 3-6 players
- **InitPlayersList.jsx** - Renders list of player inputs using `.map()`
- **InitPlayer.jsx** - Controlled input component for individual players

### State Management

State is managed using React's `useState` hook in the Settings component:

- `numOfPlayers` - Current number of players (default: 3)
- `players` - Array of player names (string[])

State flows down via props, and changes flow up via callback functions:
```jsx
Settings (state)
  ↓ props
NumberOfPlayers → onPlayerCountChange callback → Updates Settings state
InitPlayersList → onPlayerNameChange callback → Updates Settings state
```

### Key React Concepts Used

1. **Functional Components** - Modern component syntax
2. **useState Hook** - State management without classes
3. **Props** - Data passed from parent to child
4. **Controlled Components** - Form inputs controlled by React state
5. **Lifting State Up** - Shared state lives in common parent
6. **Lists & Keys** - Rendering arrays with unique keys
7. **Event Handling** - onClick, onChange callbacks
