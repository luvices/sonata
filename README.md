# 🎵 Music Capsule (Sonata)

A premium, open-source personal music archive. Search songs, collect them, organize memories, and revisit them later. Everything runs directly in your browser with zero backend or authentication required.

## 🌟 Philosophy

Music Capsule is designed as a **digital music journal**. It's not a streaming service clone. It is a quiet, monochrome, meticulously crafted space to store the songs that matter to you, along with the memories they evoke. 

### Key Features
- **Instant Search:** Powered by the Deezer API, find any track instantly without logging in.
- **Local First:** All data (songs, collections, memories, history) is saved securely to your browser's LocalStorage.
- **Memories:** Attach personal notes to songs. ("This reminds me of my first internship...")
- **Collections:** Organize your library exactly how you want.
- **Command Palette:** Keyboard-first design (`Ctrl+K`).
- **Premium Aesthetics:** Monochrome design, smooth Framer Motion micro-animations, perfect typography.

## 🚀 Technology Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand (with persist middleware)
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 📦 Getting Started

First, clone the repository and install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Architecture

- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable UI components (Buttons, Inputs, Cards)
- `/src/features` - Complex feature modules (SearchPanel, CommandPalette)
- `/src/store` - Zustand state management
- `/src/lib` - API services and utilities
- `/src/types` - TypeScript interfaces

## 🤝 Contributing

Contributions are welcome! Please ensure that your pull requests adhere to the premium, minimalist design philosophy of the project. Do not introduce unnecessary dependencies, bloated animations, or colorful gradients. Keep it silent, precise, and fast.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
