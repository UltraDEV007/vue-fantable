import { ICON_NAMES } from '../../src/utils/constant'
import { COMPS_NAME } from './util/constant'
import { getValByUnit } from '../../src/utils/index.js'

export default {
  name: COMPS_NAME.VE_ICON,

  props: {
    // icon name
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: null,
    },
    size: {
      type: [Number, String],
      default: '',
    },
  },

  computed: {
    // icon style
    iconStyle() {
      const { color, size } = this

      let result = {
        color,
        'font-size': getValByUnit(size),
      }

      return result
    },

    // icon name
    iconClass() {
      const { name } = this

      if (!Object.values(ICON_NAMES).includes(name)) {
        console.error(`${name} is not found in ${COMPS_NAME.VE_ICON}.`)
      }
      return `iconfont-vet icon-vet-${name}`
    },
  },

  render() {
    const { iconStyle, iconClass } = this
    return <i style={iconStyle} class={['ve-icon', iconClass]} />
  },
}
