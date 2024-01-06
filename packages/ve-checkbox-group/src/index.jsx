import { getChildCompsByName } from '../../src/utils/index'
import { COMPS_NAME, EMIT_EVENTS } from './util/constant'
import { h } from 'vue'
export default {
  name: COMPS_NAME.VE_CHECKBOX_GROUP,
  props: {
    value: {
      type: Array,
      default() {
        return []
      },
    },
    // 是否垂直排列显示（当时checkbox组时生效）
    isVerticalShow: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['input', 'checkedChange'],
  watch: {
    // 更新子组件选中状态
    value(newVal) {
      const children = getChildCompsByName(this, COMPS_NAME.VE_CHECKBOX)

      if (children.length > 0) {
        children.forEach((child) => {
          child.updateModelByGroup(newVal)
        })
      }
    },
  },

  methods: {
    updateModel(label, checkedVal) {
      const index = this.value.indexOf(label)
      if (index > -1) {
        if (!checkedVal) {
          // eslint-disable-next-line vue/no-mutating-props
          this.value.splice(index, 1)
        }
      } else {
        if (checkedVal) {
          // eslint-disable-next-line vue/no-mutating-props
          this.value.push(label)
        }
      }

      this.$emit('input', this.value)
      // this.$emit(EMIT_EVENTS.ON_CHECKED_CHANGE, this.value)
      this.$emit('checkedChange', this.value)
    },
  },
  render() {
    return <div class="ve-checkbox-group">{h(this.$slots.default)}</div>
  },
}
