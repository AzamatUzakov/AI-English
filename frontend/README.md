# React FSD Template

This project follows the **Feature-Sliced Design (FSD)** architectural methodology.

## 🏗 Structure

- **src/app**: Application-wide initialization (providers, global styles, routing).
- **src/pages**: Full pages composed from widgets and features.
- **src/widgets**: Compositional layer to combine features and entities into complex UI blocks.
- **src/features**: User interactions that bring business value (e.g., "Add Task", "Toggle Status").
- **src/entities**: Domain entities (e.g., "Task", "User") including their models and simple UI components.
- **src/shared**: Reusable generic components, hooks, utils, and assets.

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

## 🛠 Features Included

- **Vite + React + TypeScript**
- **Path Aliases** (e.g., `@app`, `@pages`, `@shared`)
- **React Router** for navigation
- **Lucide React** for icons
- **Local Storage Persistence** for tasks
- **FSD Public API** pattern (index.ts in each slice)
