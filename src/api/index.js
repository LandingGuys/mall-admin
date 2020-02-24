import http from './public'
const baseUrl = '/api'
// 登陆
export const userLogin = (params) => {
  return http.fetchPost(`${baseUrl}/user/login`, params)
}
// 退出登陆
export const loginOut = () => {
  return http.fetchPost(`${baseUrl}/user/logout`)
}
// 获取用户列表
export const getUserListByCondition = (params) => {
  return http.fetchPost(`${baseUrl}/user/list`, params)
}
// 添加用户
export const userAdd = (params) => {
  return http.fetchPost(`${baseUrl}/user/add`, params)
}
// 修改用户
export const userEdit = (params) => {
  return http.fetchPut(`${baseUrl}/user/`+params.id, params)
}
// 获取用户信息
export const userInfo = (params) => {
  return http.fetchGet(`${baseUrl}/user/`+params.id, params)
}
// 删除用户信息
export const userDelete = (params) => {
  return http.fetchDelete(`${baseUrl}/user/`+params.id, params)
}
// 注册账号
export const register = (params) => {
  return http.fetchPost('/user/register', params)
}
// 上传图片
export const upload = (params) => {
  return http.fetchPost('/user/imgaeUpload', params)
}
// 修改头像
export const updateheadimage = (params) => {
  return http.fetchPost('/user/updateheadimage', params)
}
// 捐赠列表
export const thanksList = (params) => {
  return http.fetchGet('/user/thanks', params)
}
// 首页接口
export const productHome = (params) => {
  return http.fetchGet('/products/home', params)
}
// 首页接口
export const navList = (params) => {
  return http.fetchGet('/products/navList', params)
}
// 推荐板块
export const recommend = (params) => {
  return http.fetchGet('/products/recommend', params)
}
// 捐赠板块
export const thank = (params) => {
  return http.fetchGet('/products/thank', params)
}
// 极验验证码
export const geetest = (params) => {
  return http.fetchGet('/user/geetestInit?t=' + (new Date()).getTime(), params)
}

