import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
import './assets/css/global.css'
import jwt from 'jsonwebtoken'
import Axios from "axios"
import querystring from "querystring";
/**
 * Axios配置
 * @type {string}
 */
Axios.defaults.baseURL='http://localhost:8000/'
Axios.defaults.timeout=15000
Axios.defaults.transformRequest = [data => {
  return querystring.stringify(data);
}];
Axios.interceptors.request.use(config =>{
  config.headers['Authorization']=window.sessionStorage.getItem("token");
  return config;
});
Vue.prototype.$http = Axios;


Vue.prototype.$jwt = jwt;
Vue.config.productionTip = false



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
