// require('dotenv').config()

export default (context, inject) => {
  const generateUrl = (path) => {
    if (path) {
      if (path[0] === '/') {
        const { axios = {} } = context.$config
        return `${axios.baseURL || ''}${path}`
      }
    }
    return path
  }
  // Inject $hello(msg) in Vue, context and store.
  inject('generateUrl', generateUrl)
  // For Nuxt <= 2.12, also add 👇
  context.$generateUrl = generateUrl
}
