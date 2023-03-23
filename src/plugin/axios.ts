import { getToken } from '@/utilities/localStorage'
import axios from 'axios'
import { Notify } from 'quasar'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
  }
}
// 创建axios实例
const instance = axios.create({
  baseURL: 'http://localhost:3000'
})
instance.interceptors.request.use(
  function (request) {
    const token = getToken()
    if (token) {
      request.headers.Authorization = `Bearer ${token}`
    } return request
  }
)

// 拦截器
instance.interceptors.response.use(
  function (response) {
    return response
  }, function (error) {
    console.log(error)
  }
)

export default instance
