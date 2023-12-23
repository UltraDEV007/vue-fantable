import { clsName } from './util/index'
import { COMPS_NAME } from './util/constant'
import { getValByUnit } from '../../src/utils/index.js'

export default {
  name: COMPS_NAME.VE_LOADING_PULSE,
  props: {
    color: {
      type: String,
      required: true,
    },
    width: {
      type: [Number, String],
      required: true,
    },
    height: {
      type: [Number, String],
      required: true,
    },
  },
  computed: {
    // spin style
    spinStyle() {
      const { color, width, height } = this

      const result = {
        width: getValByUnit(width),
        height: getValByUnit(height),
        'background-color': color,
      }

      return result
    },
  },
  render() {
    return <div style={this.spinStyle} class={clsName('pulse')} />
  },
}
