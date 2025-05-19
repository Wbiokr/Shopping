import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getServerToken } from '@/utils/auth'

console.log(process.env.VUE_APP_BASE_API, process.env)

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    config.headers['x-csrf-token'] = getServerToken('csrfToken')
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => // response,
    /**
     * 下面的註釋為通過response自定義code來標示請求狀態，當code返回如下情況為權限有問題，登出並返回到登錄頁
     * 如通過xmlhttprequest 狀態碼標識 邏輯可寫在下面error中
     */
    {
    const res = response.data;
    if (!res) {
      return Promise.reject('error');
    } else if (response.config.headers.responseType ==="blob") {
      return response
    } else if (!res.success && res.state !== 'SUCCESS') {
      Message({
        message: res.msg||'error',
        type: 'error',
        duration: 5 * 1000
      })
      //return Promise.reject('error');
      return response;
    } else {
      if (response.data=='AccessDenied') {
        MessageBox.confirm('你已被登出，可以取消繼續留在該頁面，或者重新登錄', '確定登出', {
          confirmButtonText: '重新登錄',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload();// 為了重新實例化vue-router對象 避免bug
          });
        })
      }else
        return response.data;
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
