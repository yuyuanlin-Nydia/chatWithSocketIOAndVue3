import { getToken } from '@/util/localStorage'
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
  }
}
// 创建axios实例
const instance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
})

// 拦截器
instance.interceptors.response.use(
  function (response) {
    const token = getToken()
    if (token) {
      response.headers.Authorization = `Bear ${token}`
    }
    return response
  }, function (error) {
    console.log(error)
  }
)

export default instance
