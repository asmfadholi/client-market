const createTransaction = ({ axios, req }) => {
  return axios.$post('/transactions', req)
}

const getTransaction = ({ axios }) => {
  return axios.$get('/transactions')
}

const deleteProduct = ({ axios, req }) => {
  return axios.$delete(`/products/${req.id}`)
}

export { createTransaction, getTransaction, deleteProduct }
