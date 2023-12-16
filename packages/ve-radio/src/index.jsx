import { clsName } from './util/index'
import { COMPS_NAME, EMIT_EVENTS } from './util/constant'

export default {
  name: COMPS_NAME.VE_RADIO,
  props: {
    // 当前checkbox 选中状态,实现 v-model
    value: {
      type: [String, Number, Boolean],
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    // is disabled checked
    disabled: Boolean,
    // 是否是可控组件
    isControlled: {
      type: Boolean,
      default: false,
    },
    // isControlled 为true 时生效
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 当前checkbox 选中状态
      model: this.value,
    }
  },

  computed: {
    radioClass() {
      const disableState = this.disabled
      const disabled = clsName('disabled')
      return [
        clsName('container'),
        {
          [clsName('checked')]: this.internalIsSelected,
          [disabled]: disableState
        },
      ]
    },

    // 是否选中
    internalIsSelected() {
      return this.isControlled ? this.isSelected : this.model
    },
  },

  watch: {
    value() {
      this.updateModelBySingle()
    },
  },

  created() {
    this.initModel()
  },

  methods: {
    // checked change
    checkedChange(event) {
      if (this.disabled) {
        return false
      }
      const isChecked = event.target.checked

      if (!this.isControlled) {
        this.$emit('input', isChecked)
      }
      this.$emit(EMIT_EVENTS.ON_RADIO_CHANGE, isChecked)
    },

    // get label content
    getLabelContent() {
      const { label, $slots } = this

      return label ? label : $slots.default
    },

    initModel() {
      this.model = this.value
    },

    // 通过单选更新 model
    updateModelBySingle() {
      if (!this.disabled) {
        this.model = this.value
      }
    },
  },
  render() {
    const {
      label,
      radioClass,
      checkedChange,
      getLabelContent,
      internalIsSelected,
    } = this

    return (
      <label class={'ve-radio'}>
        <span class={radioClass}>
          <input
            checked={internalIsSelected}
            class={clsName('input')}
            type="radio"
            value={label}
            on-change={checkedChange}
          />

          <span class={clsName('inner')}></span>
        </span>
        <span class={clsName('label')}>{getLabelContent()}</span>
      </label>
    )
  },
}
