import axios from 'axios'

import { Message } from 'element-ui'
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.interceptors.request.use(config => {
  //  console.log(config)
  if(window.sessionStorage.getItem('token')){
    // console.log(window.sessionStorage.getItem('token'))
    config.headers.Authorization = window.sessionStorage.getItem('token')
  }
  
  // 在最后必须 return config
  return config
})

axios.interceptors.response.use(null ,err =>{
  const {config,code,messages} =err
  if(code === 'ECONNABORTED'|| messages === 'Network Error'){
    //console.warn(`请求超时，将在1秒后重试`)
    Message.error("请求超时，将在1秒后重试")
    // ErrorMe("请求超时，将在3秒后重试")
    return new Promise(resolve =>{
      setTimeout(async _ =>{
        resolve(await axios.request(config))
      },3)
    })
  }
  Message({
    message: err,
    type: 'error',
    duration: 3 * 1000
  })
  // Message.error(err)
  return Promise.reject(err)
})
// if(window.sessionStorage.getItem('token')){
//   axios.defaults.headers.Authorization = window.sessionStorage.getItem('token')
// }
export default {
  fetchGet (url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.get(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
       
        reject(error)
        
      })
    })
  },
  fetchPost (url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.post(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchPut (url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.put(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchDelete (url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.delete(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
}
