import jwtDecode from 'jwt-decode'

export const state = {
  auth: null,
  is_dark_mode: false,
}

export const getters = {
  isAuth: (state) => {
    return !!state.auth
  },
  can: (state) => (permission) => {
    return state.auth?.permissions.find((p) => p === permission)
  },
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
    try {
      const { token } = await this.$axios.$post('/api-token-auth/', credentials)
      this.$axios.setToken(token, 'JWT')
      const auth = jwtDecode(token)
      commit('setIsAuth', auth)
    } catch (error) {
      commit('setIsAuth', null)
    }
  },

  delete_token({ commit }) {
    this.$axios.setToken(false)
    commit('setIsAuth', null)
    this.$router.push('/')
  },
}
