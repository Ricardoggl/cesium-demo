/*
 * @Author: Ricardo
 * @Date: 2021-06-30 11:04:56
 * @LastEditTime: 2021-06-30 15:39:53
 * @LastEditors: Ricardo
 * @Description:
 * @FilePath: \cesium-in-use\src\main.js
 * 没有bug就没有伤害~
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
// Vue.prototype.$viewer = Viewer

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
