import { clsName } from './util/index'
import { COMPS_NAME } from './util/constant'
import { getValByUnit } from '../../src/utils/index.js'

export default {
  name: COMPS_NAME.VE_LOADING_GRID,
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
      const { width, height } = this

      const result = {
        width: getValByUnit(width),
        height: getValByUnit(height),
      }

      return result
    },
    itemStyle() {
      const { color } = this

      return {
        'background-color': color,
      }
    },
  },
  render() {
    const { spinStyle, itemStyle } = this
    return (
      <div style={spinStyle} class={clsName('grid')}>
        <div style={itemStyle} class={clsName('grid-cube')}></div>
        <div style={itemStyle} class={clsName('grid-cube')}></div>
        <div style={itemStyle} class={clsName('grid-cube')}></div>
        <div style={itemStyle} class={clsName('grid-cube')}></div>
        <div style={itemStyle} class={clsName('grid-cube')}></div>
        <div style={itemStyle} class={clsName('grid-cube')}></div>
        <div style={itemStyle} class={clsName('grid-cube')}></div>
        <div style={itemStyle} class={clsName('grid-cube')}></div>
        <div style={itemStyle} class={clsName('grid-cube')}></div>
      </div>
    )
  },
}
