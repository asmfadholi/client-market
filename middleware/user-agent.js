export default function (context) {
  const userAgent = process.server
    ? context.req.headers['user-agent']
    : navigator.userAgent
  context.$auth.$storage.setCookie('userAgent', userAgent)
}
