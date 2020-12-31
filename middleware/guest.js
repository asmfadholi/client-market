export default function (context) {
  if (process.server) {
    if (context.$auth.$state.loggedIn) {
      context.redirect('/')
    }
  }
}
