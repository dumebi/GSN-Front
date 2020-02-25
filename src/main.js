import Vue from 'vue'
import App from './App.vue'
// Import component
import VueLoading from 'vue-loading-overlay'
import VueIziToast from 'vue-izitoast'
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
import 'izitoast/dist/css/iziToast.min.css'
require('dotenv').config()

Vue.use(VueLoading)
Vue.use(VueIziToast)
Vue.component('Loading', VueLoading)

Vue.config.productionTip = false

window.addEventListener('load', async function () {
  new Vue({
    render: h => h(App),
  }).$mount('#app')

})
