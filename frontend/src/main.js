import Vue from 'vue'
import App from './App.vue'
import Wails from '@wailsapp/runtime'

Vue.config.productionTip = false
Vue.config.devtools = true

Wails.Init(() => {
  new Vue({
    render: h => h(App)
  }).$mount('#app')
})
