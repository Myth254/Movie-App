# MOVIES.net

MOVIES.net is a simple movie browser built with JavaScript and webpack. It uses [The Movie Database API](https://www.themoviedb.org/documentation/api) to show popular movies by default and lets users search for movie titles, browse paginated results, and view posters, scores, and overviews.

## Features

- Popular movies loaded on page load
- Movie search by title
- Previous and next pagination controls
- Loading and error states
- Poster fallback for movies without artwork
- Responsive movie card grid

## Built With

- JavaScript
- HTML
- CSS
- webpack
- TMDB API

## Getting Started

### Prerequisites

- Node.js
- npm
- A TMDB API key

### Installation

1. Clone the repository.

```bash
git clone <repo-url>
cd Movie-App
```

2. Install dependencies.

```bash
npm install
```

3. Create a local API config file at `src/config.js`.

```js
const API_KEY = 'your_tmdb_api_key_here'

export default API_KEY
```

`config.js` is ignored by Git so your API key stays out of the repository.

4. Start the development server.

```bash
npm run dev
```

5. Build for production.

```bash
npm run build
```

The production output is generated in the `dist/` directory.

## Scripts

```bash
npm run dev
```

Starts the webpack development server.

```bash
npm run build
```

Creates a production build in `dist/`.

```bash
npm run deploy
```

Deploys the `dist/` folder to the `gh-pages` branch using `git subtree`.

## Project Structure

```text
Movie-App/
├── src/
│   ├── index.js
│   ├── style.css
│   ├── template.html
│   └── config.js
├── package.json
├── webpack.config.js
└── README.md
```

## Notes

- TMDB limits API result navigation to 500 pages, so the app caps pagination at that limit.
- Empty searches return the app to the popular movies view.
- If a newer search finishes before an older request, the app ignores the outdated response.
