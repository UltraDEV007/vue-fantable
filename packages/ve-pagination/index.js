import VePagination from './src/index.jsx'

VePagination.install = function (Vue) {
  Vue.component(VePagination.name, VePagination)
}

export default VePagination
