import VeTable from './src/index.jsx'

VeTable.install = function (Vue) {
  Vue.component(VeTable.name, VeTable)
}

export default VeTable
