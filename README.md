# Scisure Assessment

A Vue 3 application built with Vite, featuring GraphQL integration using Apollo Client.

## Prerequisites

- **Node.js**: Version 22.0.0 or higher
- **Package Manager**: pnpm (recommended) or npm

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/heinerbehrends/scisure-assessment
cd scisure-assessment
```

### 2. Install dependencies

```bash
pnpm install
```

Or if you prefer npm:

```bash
npm install
```

### 3. Start the development server

```bash
pnpm dev
```

Or with npm:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

## 4. Check out the deploy

The app is available at [scisure.netlify.app](https://scisure.netlify.app)

## Project Structure

```
src/
├── App.vue                 # Main application component
├── main.ts                 # Application entry point
├── router-config.ts        # Vue Router configuration
├── plugins/
│   └── apollo.ts          # Apollo Client configuration
├── views/
│   ├── PostList/          # Post listing and creation
│   └── PostDetail/        # Post detail view with comments
└── assets/                # Static assets
```
