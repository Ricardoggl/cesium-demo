/*
 * @Author: Ricardo
 * @Date: 2021-06-30 11:04:56
 * @LastEditTime: 2021-06-30 11:20:32
 * @LastEditors: Ricardo
 * @Description:
 * @FilePath: \cesium-in-use\src\router\index.js
 * 没有bug就没有伤害~
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import ThreeMap from '../components/ThreeMap.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ThreeMap',
    component: ThreeMap,
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
]

const router = new VueRouter({
  routes,
})

export default router
