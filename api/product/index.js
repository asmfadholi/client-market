import qs from 'dot-qs'

const createProduct = ({ axios, req }) => {
  return axios.$post('/products', req)
}

const editProduct = ({ axios, req, id }) => {
  return axios.$put(`/products/${id}`, req)
}

const getProduct = ({ axios }) => {
  return axios.$get('/products')
}

const getProductDetail = ({ axios, req }) => {
  const query = qs.stringify({ ...req })
  return axios.$get(`/products?${query}`)
}

const getProductByFilter = ({ axios, req }) => {
  const query = qs.stringify({ ...req })
  return axios.$get(`/products?${query}`)
}

const deleteProduct = ({ axios, req }) => {
  return axios.$delete(`/products/${req.id}`)
}

export { createProduct, getProduct, deleteProduct, getProductDetail, getProductByFilter, editProduct }
