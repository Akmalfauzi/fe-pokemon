# Pokédex

A modern Pokemon web application built with Vue 3, Vite, and Tailwind CSS. This application allows users to browse Pokemon, view their details, manage favorites, and enjoy a responsive gaming experience.

## Features

- **Pokemon Browser**: Browse through a comprehensive list of Pokemon
- **Detailed View**: View detailed information about each Pokemon including stats, abilities, and types
- **Search Functionality**: Find Pokemon quickly with the search feature
- **Favorites System**: Add and remove Pokemon from your favorites list
- **Responsive Design**: Fully responsive layout that works on all devices
- **Lazy Loading**: Optimized image loading for better performance
- **Sound Effects**: Interactive sound effects for enhanced user experience
- **Modern UI**: Clean and modern interface using Tailwind CSS v4

## Tech Stack

### Core Technologies
- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vite** - Next generation front-end build tool
- **Vue Router 4** - Official router for Vue.js
- **Pinia** - State management library for Vue

### UI & Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **PostCSS** - CSS transformation tool
- **Vue Lazyload** - Lazy loading plugin for images
- **vue-sonner** - Toast notification library

### API & Data
- **Axios** - HTTP client for API requests
- **Pokemon API** - External Pokemon data service

### Testing
- **Vitest** - Next generation testing framework
- **Vue Test Utils** - Official testing utilities for Vue.js
- **Happy DOM** - Lightweight DOM implementation for testing
- **JSDOM** - JavaScript DOM implementation

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── AppHeader.vue
│   ├── FavoriteButton.vue
│   ├── FavoriteList.vue
│   ├── LazyImage.vue
│   ├── PokemonCard.vue
│   ├── PokemonDetailModal.vue
│   ├── PokemonList.vue
│   ├── PokemonLoading.vue
│   ├── SearchBar.vue
│   └── TypeBadge.vue
├── composables/         # Reusable composition functions
│   ├── useFavorite.js
│   ├── usePokemon.js
│   └── useSound.js
├── router/              # Vue Router configuration
│   └── index.js
├── services/            # API service layer
│   ├── http.js
│   └── pokemonApi.js
├── stores/              # Pinia stores
│   ├── favoriteStore.js
│   └── pokemonStore.js
├── tests/               # Test files
│   ├── components/
│   ├── stores/
│   ├── utils/
│   └── setup.js
├── utils/               # Utility functions
│   └── pokemonHelpers.js
├── views/               # Page-level components
│   ├── FavoriteListView.vue
│   └── PokemonListView.vue
├── App.vue              # Root component
├── index.css            # Global styles (Tailwind imports)
└── main.js              # Application entry point
```

## Quick Start

### Prerequisites

- **Node.js** (22.19.0 or higher)
- **npm** (v10.9.3 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akmalfauzi/fe-pokemon.git
   cd fe-pokemon-js
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Then modify the `.env.local` file with your configuration.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

## Available Scripts

### Development
```bash
npm run dev          # Start development server with hot reload
```

### Building
```bash
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Testing
```bash
npm run test            # Run tests in watch mode
npm run test:run        # Run tests once
npm run test:ui         # Run tests with UI interface
npm run test:coverage   # Run tests with coverage report
```

## Testing

This project uses Vitest for testing. Tests are located in the `src/tests/` directory and follow the same structure as the source code.

### Running Tests

- **Watch mode**: `npm run test` - Runs tests in watch mode for development
- **Single run**: `npm run test:run` - Runs all tests once
- **UI Mode**: `npm run test:ui` - Opens Vitest UI for interactive testing
- **Coverage**: `npm run test:coverage` - Generates test coverage report

### Test Structure

```
src/tests/
├── components/         # Component tests
├── stores/            # Store tests
├── utils/             # Utility function tests
└── setup.js           # Test configuration
```

## Deployment

### Build for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the build** (optional)
   ```bash
   npm run preview
   ```

### Deployment Options

#### 1. Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

#### 2. Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

**Important for Vue Router**: Make sure to include the `_redirects` file in your deployment to handle client-side routing. The file should be placed in your `public` directory with the following content:

```
/*    /index.html   200
```

**Important for Sound Effects**: Place all audio files in the `public/sfx/` directory to ensure they are accessible in production builds.

#### 3. GitHub Pages

```bash
# Build for GitHub Pages
npm run build

# Deploy to GitHub Pages (using gh-pages)
npm install -g gh-pages
gh-pages -d dist
```

#### 4. Static Hosting

The `dist/` folder contains all the static files and can be deployed to any static hosting service like:
- AWS S3
- Firebase Hosting
- Surge.sh
- GitHub Pages
- Netlify
- Vercel

### Environment Variables

Copy the example environment file and modify as needed:

```bash
cp .env.example .env.local
```

**Development (`.env.local`)**
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_NODE_ENV=local
```

**Production (`.env.production`)**
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_NODE_ENV=production
```

## Configuration

### Vite Configuration

The project uses Vite with the following plugins:
- `@vitejs/plugin-vue` - Vue 3 support
- `@tailwindcss/vite` - Tailwind CSS v4 integration
- `vite-svg-loader` - SVG loading optimization

### Tailwind CSS

Uses Tailwind CSS v4 with modern utility-first approach. Configuration is handled through the Vite plugin.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Links

- **Live Demo**: [Link 1](https://pokedex.fauzy.my.id/) [Link 2](https://akmalfauzi-pokedex.netlify.app/)
- **Pokemon API**: [PokeAPI](https://pokeapi.co/docs/v2)
- **Vue 3 Documentation**: [vuejs.org](https://vuejs.org/)
- **Vite Documentation**: [vite.dev](https://vite.dev/)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com/)


---

**Built with ❤️ using Vue 3 and Vite**
