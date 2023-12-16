import { getParentCompByName } from '../../src/utils/index'
import { clsName } from './util/index'
import { COMPS_NAME, EMIT_EVENTS } from './util/constant'

export default {
  name: COMPS_NAME.VE_CHECKBOX,
  props: {
    // 当前 checkbox 选中状态,实现 v-model
    value: {
      type: [String, Number, Boolean],
      default: null,
    },
    label: {
      type: [String],
      default: null,
    },
    // is disabled checked
    disabled: Boolean,
    // partial selection effect
    indeterminate: Boolean,
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
  emits:['input'],
  data() {
    return {
      // 当前checkbox 选中状态
      model: this.value,
      checkboxGroup: {},
    }
  },
  computed: {
    checkboxClass() {
      const checked = clsName('checked')
      const disabled = clsName('disabled')
      const indeterminate = clsName('indeterminate')
      const result = [
        clsName('content'),
        {
          [checked]: this.internalIsSelected,
          [disabled]: this.disabled,
          [indeterminate]: this.indeterminate,
        },
      ]
      return result
    },

    // 是否横向显示还是纵向显示
    checkboxStyle() {
      return {
        display:
          this.checkboxGroup && this.checkboxGroup.isVerticalShow
            ? 'block'
            : 'inline-block',
      }
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
    // checkbox change
    checkboxChange(event) {
      if (this.disabled) {
        return false
      }
      const isChecked = event.target.checked

      if (!this.isControlled) {
        this.$emit('input', isChecked)
      }
      this.$emit(EMIT_EVENTS.ON_CHECKED_CHANGE, isChecked)

      if (this.isCheckBoxGroup()) {
        //update parent comp:checkbox-group
        this.checkboxGroup.updateModel(this.label, isChecked)
      }
    },

    // is checkbox group
    isCheckBoxGroup() {
      this.checkboxGroup = getParentCompByName(
        this,
        COMPS_NAME.VE_CHECKBOX_GROUP,
      )
      return this.checkboxGroup ? true : false
    },

    // get label content
    getLabelContent() {
      const { label, $slots } = this

      return label ? label : $slots.default
    },

    initModel() {
      if (this.isCheckBoxGroup()) {
        let checkboxGroup = this.checkboxGroup
        if (
          Array.isArray(checkboxGroup.value) &&
          checkboxGroup.value.length > 0
        ) {
          if (checkboxGroup.value.indexOf(this.label) > -1) {
            this.model = true
          }
        }
      } else {
        this.model = this.value
      }
    },

    // 通过单选更新 model
    updateModelBySingle() {
      if (!this.disabled) {
        this.model = this.value
      }
    },

    // 父组件调用更新 model
    updateModelByGroup(checkBoxGroup) {
      if (checkBoxGroup.indexOf(this.label) > -1) {
        if (!this.disabled) {
          this.model = true
        }
      } else {
        if (!this.disabled) {
          this.model = false
        }
      }
    },
  },
  render() {
    const {
      checkboxStyle,
      label,
      checkboxClass,
      checkboxChange,
      getLabelContent,
      internalIsSelected,
    } = this

    return (
      <label class={'ve-checkbox'} style={checkboxStyle}>
        <span class={checkboxClass}>
          <input
            checked={internalIsSelected}
            class={clsName('input')}
            type="checkbox"
            value={label}
            on-change={checkboxChange}
          />

          <span class={clsName('inner')}></span>
        </span>
        <span class={clsName('label')}>{getLabelContent()}</span>
      </label>
    )
  },
}
