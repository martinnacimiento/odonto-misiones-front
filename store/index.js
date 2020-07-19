import jwtDecode from 'jwt-decode'

export const state = {
  auth: null,
  books: [],
  is_dark_mode: false,
}
export const mutations = {
  setIsAuth(state, auth) {
    state.auth = auth
  },
  setBooks(state, books) {
    state.books = books
  },
  setIsDarkMode(state, status) {
    // localStorage.setItem('is_dark_mode', status)
    state.is_dark_mode = status
  },
}

export const actions = {
  async get_token({ commit }, credentials) {
    const { token } = await this.$axios.$post('/api-token-auth/', credentials)
    this.$axios.setToken(token, 'JWT')
    const auth = jwtDecode(token)
    const books = await this.$axios.$get('/apps/books/')
    commit('setBooks', books)
    commit('setIsAuth', auth)
  },

  delete_token() {
    this.$axios.setToken(false)
  },
}
