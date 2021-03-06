import http from './public'
const baseUrl = '/api'
// 登陆
export const userLogin = (params) => {
  return http.fetchPost(`${baseUrl}/admin/user/login`, params)
}
// 退出登陆
export const loginOut = () => {
  return http.fetchPost(`${baseUrl}/admin/user/logout`)
}
export const getUserInfo = (params) => {
  return http.fetchGet(`${baseUrl}/admin/user`, params)
}
// 获取用户列表
export const getUserListByCondition = (params) => {
  return http.fetchPost(`${baseUrl}/admin/user/list`, params)
}
// 添加用户
export const userAdd = (params) => {
  return http.fetchPost(`${baseUrl}/admin/user/add`, params)
}
// 修改用户
export const userEdit = (params) => {
  return http.fetchPut(`${baseUrl}/admin/user/`+params.id, params)
}
// 获取用户信息
export const userInfo = (params) => {
  return http.fetchGet(`${baseUrl}/admin/user/`+params.id, params)
}
// 删除用户信息
export const userDelete = (params) => {
  return http.fetchDelete(`${baseUrl}/admin/user/`+params.id, params)
}
// 获取商品列表
export const listGoods = (params) => {
  return http.fetchGet(`${baseUrl}/admin/products`, params)
}
// 删除商品
export const deleteGoods = (params) => {
  return http.fetchDelete(`${baseUrl}/admin/products/`+ params.id, params)
}
// 上传图片
export const upload = (params) => {
  return http.fetchUpload(`${baseUrl}/file/upload`, params)
}
// 新增商品
export const productAdd = (params) => {
  return http.fetchPost(`${baseUrl}/admin/products`, params)
}
// 获取商品具体信息
export const detailGoods = (params) => {
  return http.fetchGet(`${baseUrl}/admin/products/` + params.id, params)
}
// 更新商品
export const productUpdate = (params) => {
  return http.fetchPut(`${baseUrl}/admin/products/`, params)
}
// 获取类目列表 树型
export const getCategoryList = (params) => {
  return http.fetchGet(`${baseUrl}/admin/categories`, params)
}
// 获取类目列表 表格
export const getCategoryListTable = (params) => {
  return http.fetchGet(`${baseUrl}/admin/categoriesAll`, params)
}
// 更新类目
export const categoryUpdate = (params) => {
  return http.fetchPut(`${baseUrl}/admin/categories`, params)
}
// 新增类目
export const categoryAdd = (params) => {
  return http.fetchPost(`${baseUrl}/admin/categories`, params)
}
// 获取类目详情
export const categoryDetail = (params) => {
  return http.fetchGet(`${baseUrl}/admin/categories/`+ params.id, params)
}
// 删除类目
export const categoryDelete = (params) => {
  return http.fetchDelete(`${baseUrl}/admin/categories/`+ params.id, params)
}
// 获取订单列表
export const orderList = (params) => {
  return http.fetchGet(`${baseUrl}/admin/orders`, params)
}
// 获取订单详情
export const orderDetail = (params) => {
  return http.fetchGet(`${baseUrl}/admin/orders/`+ params.orderNo, params)
}
// 更新订单
export const orderUpdate = (params) => {
  return http.fetchPut(`${baseUrl}/admin/orders/update`, params)
}
// 取消订单
export const orderOut = (params) => {
  return http.fetchPut(`${baseUrl}/admin/orders/`+ params.orderNo, params)
}
// 删除订单
export const orderDelete = (params) => {
  return http.fetchDelete(`${baseUrl}/admin/orders/`+ params.orderNo, params)
}
// 发货
export const transpAdd = (params) => {
  return http.fetchPost(`${baseUrl}/admin/transportation`, params)
}
// 获取物流信息
export const transpGet = (params) => {
  return http.fetchGet(`${baseUrl}/admin/transportation`, params)
}
