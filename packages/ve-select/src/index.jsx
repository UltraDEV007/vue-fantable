import VeDropdown from '../../ve-dropdown/index'
import { COMPS_NAME, EMIT_EVENTS } from './util/constant'
import { clsName } from './util/index'
import VeIcon from '../../ve-icon/index'
import { ICON_NAMES } from '../../src/utils/constant'

export default {
  name: COMPS_NAME.VE_SELECT,
  props: {
    width: {
      type: Number,
      default: 90,
    },

    // select的最大宽度(超出隐藏)
    maxWidth: {
      type: Number,
      default: 0,
    },

    // 如果为true 会包含 checkbox
    isMultiple: {
      type: Boolean,
      default: false,
    },

    // 用户传入v-model 的值 [{value/label/selected}]
    value: {
      type: Array,
      default: null,
    },

    // 占位符
    placeholder: {
      type: String,
      default: '请选择',
      validator: function (value) {
        return value.length > 0
      },
    },

    // 文本居中方式 left|center|right
    textAlign: {
      type: String,
      default: 'left',
    },

    // 是否支持输入input
    isInput: {
      type: Boolean,
      default: false,
    },
    // popper append to element
    popperAppendTo: {
      type: [String, HTMLElement],
      default: function () {
        return document.body
      },
    },
  },
  data() {
    return {
      visible: false,

      internalOptions: [],

      inputValue: '',
      // dorpdown visible
      dropdownVisible: false,
    }
  },
  computed: {
    // icon class
    iconClass() {
      const toggleIcon = clsName('toggle-icon')
      return {
        [clsName('show')]: this.dropdownVisible,
        [toggleIcon]: true,
      }
    },
  },
  watch: {
    value: function () {
      this.init()
    },
  },

  created() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.internalOptions = Object.assign([], this.value)
    },

    // 显示选中的信息
    showSelectInfo() {
      var result, labels

      labels = this.selectedLabels()
      if (Array.isArray(labels) && labels.length > 0) {
        result = labels.join()
      } else {
        result = this.placeholder
      }

      return result
    },

    // 当前选中项的label
    selectedLabels() {
      return this.internalOptions
        .filter((x) => x.selected)
        .map((x) => {
          if (x.selected) {
            return x.label
          }
        })
    },

    // dropdown change event
    dropdownChange() {
      // 使用户传入的v-model 生效
      this.$emit('input', this.internalOptions)
      this.$emit(EMIT_EVENTS.SELECT_CHANGE, this.internalOptions)
    },
  },
  render() {
    const { isInput } = this

    const props = {
      class: 've-select',
      props: {
        isSelect: true,
        width: this.width,
        maxWidth: this.maxWidth,
        isMultiple: this.isMultiple,
        textAlign: this.textAlign,
        isInput: this.isInput,
        // v-model
        value: this.internalOptions,
        hideByItemClick: true,
        popperAppendTo: this.popperAppendTo,
      },
      style: {
        width: this.width,
      },
      on: {
        //change: this.dropdownChange,
        // v-model
        input: (val) => {
          this.internalOptions = val
          this.dropdownChange()
        },
        // dropdown visible change
        'dropdown-visible-change': (visible) => {
          this.dropdownVisible = visible
        },
      },
    }

    let content = ''
    if (isInput) {
      content = (
        <input
          class={clsName('input')}
          placeholder={this.placeholder}
          type="text"
          v-model={this.inputValue}
        />
      )
    } else {
      content = (
        <span class={clsName('selected-span')}>
          {this.showSelectInfo()}
        </span>
      )
    }

    return (
      <VeDropdown {...props}>
        <span>
          {content}
          <VeIcon
            name={ICON_NAMES.BOTTOM_ARROW}
            class={this.iconClass}
          />
          {/* <i class={[this.iconClass]}></i> */}
        </span>
      </VeDropdown>
    )
  },
}
