# Sonata

A local-first, minimal music archive built with Next.js and Tailwind CSS. 

Sonata allows users to search for music tracks via the Deezer API, save them to local storage, organize them into custom collections, and attach personal notes. The application is entirely client-side, requiring no backend or authentication.

## Features

- Search functionality powered by Deezer API
- Local-first architecture (all data stored in LocalStorage)
- Custom collections for organizing saved tracks
- Personal memory notes attached to individual tracks
- Import/Export functionality for data portability
- Keyboard shortcuts (e.g., Command Palette via `Ctrl+K`)
- Minimalist dark mode interface

## Technology Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS v4
- Zustand (State Management)
- Framer Motion
- Lucide React

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable UI components
- `/src/features` - Complex feature modules
- `/src/store` - Zustand state management
- `/src/lib` - API services and utilities
- `/src/types` - TypeScript interfaces

Contributions are welcome! Please ensure that your pull requests adhere to the premium, minimalist design philosophy of the project. Do not introduce unnecessary dependencies, bloated animations, or colorful gradients. Keep it silent, precise, and fast.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
