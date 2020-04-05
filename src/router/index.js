import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Error from '../components/Errror.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'

import goodList from '../components/goods/list.vue'
import addGood from '../components/goods/create.vue'
import editGood from '../components/goods/edit.vue'

import orderList from '../components/order/list.vue'
import orderSet from '../components/order/set.vue'
import orderDetail from '../components/order/detail.vue'

import categoryEdit from '../components/category/edit.vue'
import categoryAdd from '../components/category/create.vue'
import categoryList from '../components/category/list.vue'

import ApiManage from '../components/api/manage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children:[{
      path: '/welcome',
      name: 'Welcome',
      component: Welcome
    },

    {
      path: '/user/list',
      name: 'Users',
      component: Users
    },
    // {
    //   path: '/user/add',
    //   name: 'AddUser',
    //   component: AddUser
    // },
    {
      path: '/product/list',
      name: 'goodList',
      component: goodList
    },
    {
      path: '/product/add',
      name: 'addGood',
      component: addGood
    },
    {
      path: '/product/edit',
      name: 'editGood',
      component: editGood
    },
    {
      path: '/order/list',
      name: 'orderList',
      component: orderList
    },
    {
      path: '/order/detail',
      name: 'orderDetail',
      component: orderDetail
    },
    {
      path: '/order/set',
      name: 'orderSet',
      component: orderSet
    },
    {
      path: '/category/list',
      name: 'categoryList',
      component: categoryList
    },
    {
      path: '/category/add',
      name: 'categoryAdd',
      component: categoryAdd
    },
    {
      path: '/category/edit',
      name: 'categoryEdit',
      component: categoryEdit
    },
    {
      path: '/api/manage',
      name: 'ApiManage',
      component: ApiManage
    },
  ]
  },
  {
    path: '/error',
    name: 'Error',
    component: Error
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
