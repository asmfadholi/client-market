import qs from 'qs'

const updateModel = ({ axios, req }) => {
  return axios.$put(`/models/${req.id}`, req)
}

const detailModel = ({ axios, req }) => {
  const query = qs.stringify({ ...req })
  return axios.$get(`/models?${query}`)
}

export { updateModel, detailModel }
