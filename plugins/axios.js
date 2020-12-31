export default function ({ $axios, error: nuxtError, redirect }) {
  $axios.onError((error) => {
    if (error.response.status === 500) {
      redirect('/sorry')
    }
    nuxtError({
      statusCode: error.response.status,
      message: error.message
    })
    return Promise.resolve(false)
  })
}
