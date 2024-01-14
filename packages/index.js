// This file is auto gererated by build/build-entry.js

// next line only for test
// import { createApp } from 'vue'
import VeCheckbox from './ve-checkbox/ve-checkbox.js'
import VeCheckboxGroup from './ve-checkbox-group/ve-checkbox-group.js'
import VeContextmenu from './ve-contextmenu/ve-contextmenu.js'
import VeDropdown from './ve-dropdown/ve-dropdown.js'
import VeIcon from './ve-icon/ve-icon.js'
import VeLoading from './ve-loading/ve-loading.js'
import VeLocale from './ve-locale/ve-locale.js'
import VePagination from './ve-pagination/ve-pagination.js'
import VeRadio from './ve-radio/ve-radio.js'
import VeSelect from './ve-select/ve-select.js'
import FanTable from './fan-table/fan-table.js'
import { version } from '../package.json'
// const app = createApp({})
const components = [
  VeCheckbox,
  VeCheckboxGroup,
  VeContextmenu,
  VeDropdown,
  VeIcon,
  VeLoading,
  VeLocale,
  VePagination,
  VeRadio,
  VeSelect,
  FanTable
]

function install (app) {
  components.forEach(Component => {
    app.use(Component)
  })

  app.config.globalProperties.$veLoading = VeLoading
  app.config.globalProperties.$veLocale = VeLocale
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  install,
  version,
  VeCheckbox,
  VeCheckboxGroup,
  VeContextmenu,
  VeDropdown,
  VeIcon,
  VeLoading,
  VeLocale,
  VePagination,
  VeRadio,
  VeSelect,
  FanTable
}

export default {
  install,
  version,
  VeCheckbox,
  VeCheckboxGroup,
  VeContextmenu,
  VeDropdown,
  VeIcon,
  VeLoading,
  VeLocale,
  VePagination,
  VeRadio,
  VeSelect,
  FanTable
}
