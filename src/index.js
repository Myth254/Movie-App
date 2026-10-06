import './style.css'
import API_KEY from './config.js'

const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
const PLACEHOLDER = 'https://via.placeholder.com/500x750?text=No+Poster'
const MAX_PAGES = 500 // TMDB caps results at 500 pages

// ---------- DOM ----------
const movieSearchInput = document.getElementById('searchMovie')
const searchMovieBtn = document.getElementById('searchMovieBtn')
const spinner = document.getElementById('loading-spinner');
const messageDiv = document.getElementById('error-message');
const movieContainer = document.getElementById('movieContainer')
const prevBtn = document.getElementById('prevBtn')
const pageNo = document.getElementById('pageNo')
const nextBtn = document.getElementById('nextBtn')

// ---------- State ----------
const state = { mode: 'popular', query: '', page: 1, totalPages: 1 }
let requestId = 0

async function fetchMovies({ mode, query, page }) {
    const params = new URLSearchParams({ api_key: API_KEY, page, language: 'en-US' })

    let endpoint = '/movie/popular'
    if (mode === 'search') {
        endpoint = '/search/movie'
        params.set('query', query)
        params.set('include_adult', 'false')
    }

    const response = await fetch(`${BASE_URL}${endpoint}?${params}`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    return response.json()
}

// ---------- UI helpers ----------
function showMessage(text, isError = false) {
    messageDiv.textContent = text
    messageDiv.style.color = isError ? 'red' : 'inherit'
    messageDiv.style.display = 'block'
}

function hideMessage() {
    messageDiv.style.display = 'none'
}

function createMovieCard(movie) {
    const box = document.createElement('div')
    const img = document.createElement('img')
    const title = document.createElement('h3')
    const score = document.createElement('div')
    const desc = document.createElement('div')

    box.classList.add('movieBox')
    img.src = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : PLACEHOLDER
    img.alt = movie.title
    title.textContent = movie.title
    score.textContent = `Score: ${movie.vote_average.toFixed(1)}`
    desc.textContent = `Overview: ${movie.overview || 'No overview available.'}`

    box.append(img, title, score, desc)
    return box
}

function updatePagination() {
    const hasResults = state.totalPages > 0
    pageNo.textContent = hasResults ? `Page ${state.page} of ${state.totalPages}` : ''
    prevBtn.style.display = state.page > 1 ? 'inline-block' : 'none'
    nextBtn.style.display = state.page < state.totalPages ? 'inline-block' : 'none'
}

// ---------- Render ----------
async function render() {
    const thisRequest = ++requestId

    spinner.style.display = 'block'
    hideMessage()
    movieContainer.innerHTML = ''

    try {
        const data = await fetchMovies(state)
        if (thisRequest !== requestId) return // a newer request superseded this one

        state.totalPages = Math.min(data.total_pages, MAX_PAGES)

        if (data.results.length === 0) {
            state.totalPages = 0
            showMessage(
                state.mode === 'search'
                    ? `No movies found for "${state.query}". Check the spelling or try a different title.`
                    : 'No movies to display.'
            )
        } else {
            if (state.mode === 'search') {
                showMessage(`${data.total_results} result(s) for "${state.query}"`)
            }
            data.results.forEach(movie => {
                movieContainer.appendChild(createMovieCard(movie))
            })
        }
    } catch (error) {
        if (thisRequest !== requestId) return
        state.totalPages = 0
        showMessage(`❌ Something went wrong: ${error.message}`, true)
    } finally {
         if (thisRequest === requestId) {
            spinner.style.display = 'none'
            updatePagination()
        }
    }
}

// ---------- Events ----------
function handleSearch() {
    const query = movieSearchInput.value.trim()
     if (!query) {
        // Empty search: go back to popular movies instead of calling the API
        Object.assign(state, { mode: 'popular', query: '', page: 1 })
    } else {
        Object.assign(state, { mode: 'search', query, page: 1 })
    }
    render()
}

searchMovieBtn.addEventListener('click', (e) => {
    e.preventDefault()
    handleSearch()
})

movieSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearch()
})

prevBtn.addEventListener('click', () => {
    if (state.page > 1) {
        state.page--
        render()
    }
})

nextBtn.addEventListener('click', () => {
    if (state.page < state.totalPages) {
        state.page++
        render()
    }
})

render()