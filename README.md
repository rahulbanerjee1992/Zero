# Zero PathFinder Prototype

A professional career assessment web application built with Next.js and React.

## Overview

PathFinder helps users choose ONE long-term career focus before starting training. This is a functional prototype demonstrating product thinking with a calm, serious, and trustworthy design.

## Features

### Pages
1. **Homepage (/)** - Animated carousel with 3 placards and video teaser
2. **Signup (/signup)** - Email collection with social proof
3. **PathFinder Intro (/pathfinder/intro)** - Introduction to the assessment
4. **Questions (/pathfinder/questions)** - 7 psychometric questions with horizontal options
5. **Recommendation (/pathfinder/recommendation)** - Career grid with recommendation logic
6. **Commit (/pathfinder/commit)** - Career deep dive with animations
7. **Complete (/pathfinder/complete)** - Completion and transition to training

### Key Features
- ✅ Auto-rotating carousel with manual controls
- ✅ Client-side state management using React Context
- ✅ Psychometric question flow with auto-advance
- ✅ Career recommendation based on answer patterns
- ✅ Interactive career avatars with selection states
- ✅ Smooth page transitions and animations
- ✅ Professional, minimal design aesthetic

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **State Management**: React Context
- **Font**: Inter (Google Fonts)

## Design Principles

- Neutral sans-serif typography (Inter)
- White/light gray backgrounds
- Minimal gradients
- No gamification or emojis
- Professional and trustworthy tone

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Navigate to project directory
cd zero-pathfinder

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
zero-pathfinder/
├── app/
│   ├── page.tsx                          # Homepage
│   ├── signup/page.tsx                   # Signup page
│   ├── pathfinder/
│   │   ├── intro/page.tsx               # PathFinder intro
│   │   ├── questions/page.tsx           # Questions flow
│   │   ├── recommendation/page.tsx      # Career recommendations
│   │   ├── commit/page.tsx              # Career commitment
│   │   └── complete/page.tsx            # Completion
│   ├── layout.tsx                        # Root layout
│   └── globals.css                       # Global styles
├── components/
│   ├── Carousel.tsx                      # Auto-rotating carousel
│   ├── VideoModal.tsx                    # Video modal component
│   └── CareerAvatar.tsx                  # Career avatar component
├── context/
│   └── PathFinderContext.tsx            # State management
└── package.json
```

## User Flow

1. User lands on homepage with carousel
2. Clicks "Start PathFinder" → navigates to signup
3. Enters email → navigates to intro
4. Reads introduction → begins questions
5. Answers 7 questions (auto-advances)
6. Views recommended career + 8 alternatives
7. Selects career (can choose non-recommended with warning)
8. Views career deep dive with video
9. Commits to career path
10. Completes PathFinder → ready for training

## Recommendation Logic

The prototype uses a simple pattern-matching algorithm:
- Tracks which option type is selected most frequently
- Maps dominant pattern to career archetype
- Default recommendation: Software Engineering

## Notes

- All data is stored client-side (no backend)
- Video placeholders are used throughout
- Career avatars use color-coded initials
- State persists across page navigation within session

## License

This is a prototype for demonstration purposes.
