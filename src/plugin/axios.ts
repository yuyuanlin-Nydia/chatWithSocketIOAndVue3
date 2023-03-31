import router from '@/router'
import { getToken } from '@/utilities/localStorage'
import axios, { AxiosError, AxiosInstance } from 'axios'
import { Notify } from 'quasar'
import { ErrorCode } from '@/enum/apiEnum'
import { PageName } from '@/enum/pageNameEnum'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
  }
}
// 创建axios实例
const axiosURL = process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : 'https://chatwithsocketioandvue3.herokuapp.com'
const instance: AxiosInstance = axios.create({
  baseURL: axiosURL
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
export function postApi (url: string, postData = {}): Promise<any> {
  return instance.post(url, postData)
    .then(res => {
      const { success, error } = res.data
      if (success) return res.data
      throw new AxiosError(error || 'fail')
    })
    .catch((err) => {
      console.log(err)
      const { code, message } = err.message
      if (code === ErrorCode.Unauthorized) {
        router.push({ name: PageName.Login })
      }
      Notify.create({
        message: code + ' - ' + message,
        type: 'negative'
      })
    })
}
export default instance
