import Vue from 'vue'
import VeLoading from './src/index.js'

VeLoading.install = function (Vue) {
  Vue.prototype.$veLoading = VeLoading
}

export default VeLoading
